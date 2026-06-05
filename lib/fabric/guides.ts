import * as fabric from "fabric";

interface GuideLine {
  line: fabric.Line;
  axis: "x" | "y";
  value: number;
}

let guides: GuideLine[] = [];
let snapThreshold = 10;

export function createSnapGuides(canvas: fabric.Canvas): void {
  const w = canvas.width!;
  const h = canvas.height!;
  const centerX = w / 2;
  const centerY = h / 2;

  const guideStyle = {
    stroke: "#c9a96e",
    strokeWidth: 1,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false,
    opacity: 0,
  };

  const vCenter = new fabric.Line([centerX, 0, centerX, h], guideStyle);
  const hCenter = new fabric.Line([0, centerY, w, centerY], guideStyle);
  const vThird1 = new fabric.Line([w / 3, 0, w / 3, h], guideStyle);
  const vThird2 = new fabric.Line([(2 * w) / 3, 0, (2 * w) / 3, h], guideStyle);
  const hThird1 = new fabric.Line([0, h / 3, w, h / 3], guideStyle);
  const hThird2 = new fabric.Line([0, (2 * h) / 3, w, (2 * h) / 3], guideStyle);

  guides = [
    { line: vCenter, axis: "x", value: centerX },
    { line: hCenter, axis: "y", value: centerY },
    { line: vThird1, axis: "x", value: w / 3 },
    { line: vThird2, axis: "x", value: (2 * w) / 3 },
    { line: hThird1, axis: "y", value: h / 3 },
    { line: hThird2, axis: "y", value: (2 * h) / 3 },
  ];

  for (const g of guides) {
    canvas.add(g.line);
    canvas.sendObjectToBack(g.line);
  }
}

export function setupSnapToGuides(canvas: fabric.Canvas): () => void {
  const onMoving = (e: fabric.TEvent) => {
    const obj = e.target as fabric.Object;
    if (!obj) return;

    const center = obj.getCenterPoint();
    let snappedX = false;
    let snappedY = false;

    for (const guide of guides) {
      if (guide.axis === "x" && Math.abs(center.x - guide.value) < snapThreshold) {
        obj.set({ left: guide.value - (obj.width! * obj.scaleX!) / 2 });
        guide.line.set("opacity", 0.6);
        snappedX = true;
      } else if (guide.axis === "y" && Math.abs(center.y - guide.value) < snapThreshold) {
        obj.set({ top: guide.value - (obj.height! * obj.scaleY!) / 2 });
        guide.line.set("opacity", 0.6);
        snappedY = true;
      }
    }

    if (!snappedX) {
      for (const g of guides.filter((g) => g.axis === "x")) g.line.set("opacity", 0);
    }
    if (!snappedY) {
      for (const g of guides.filter((g) => g.axis === "y")) g.line.set("opacity", 0);
    }

    canvas.requestRenderAll();
  };

  const onModified = () => {
    for (const g of guides) {
      g.line.set("opacity", 0);
    }
    canvas.requestRenderAll();
  };

  canvas.on("object:moving", onMoving);
  canvas.on("object:modified", onModified);

  return () => {
    canvas.off("object:moving", onMoving);
    canvas.off("object:modified", onModified);
  };
}

export function setSnapThreshold(threshold: number): void {
  snapThreshold = threshold;
}

export function clearGuides(canvas: fabric.Canvas): void {
  for (const g of guides) {
    canvas.remove(g.line);
  }
  guides = [];
}
