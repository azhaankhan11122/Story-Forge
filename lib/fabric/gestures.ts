import * as fabric from "fabric";

export function setupPanning(canvas: fabric.Canvas): () => void {
  let isPanning = false;
  let lastX = 0;
  let lastY = 0;

  const onMouseDown = (e: fabric.TEvent) => {
    if (e.e instanceof MouseEvent && e.e.button === 1) {
      isPanning = true;
      lastX = e.e.clientX;
      lastY = e.e.clientY;
      canvas.setCursor("grab");
    }
  };

  const onMouseMove = (e: fabric.TEvent) => {
    if (!isPanning) return;
    const evt = e.e as MouseEvent;
    const vpt = canvas.viewportTransform!;
    vpt[4] += evt.clientX - lastX;
    vpt[5] += evt.clientY - lastY;
    canvas.setViewportTransform(vpt);
    lastX = evt.clientX;
    lastY = evt.clientY;
    canvas.setCursor("grabbing");
  };

  const onMouseUp = () => {
    isPanning = false;
    canvas.setCursor("default");
  };

  canvas.on("mouse:down", onMouseDown);
  canvas.on("mouse:move", onMouseMove);
  canvas.on("mouse:up", onMouseUp);

  return () => {
    canvas.off("mouse:down", onMouseDown);
    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:up", onMouseUp);
  };
}

export function setupZoom(canvas: fabric.Canvas): () => void {
  const onMouseWheel = (opt: fabric.TEvent) => {
    const e = opt.e as WheelEvent;
    e.preventDefault();
    e.stopPropagation();

    const zoom = canvas.getZoom();
    const delta = e.deltaY;
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta * -0.001));

    const point = new fabric.Point(e.offsetX, e.offsetY);
    canvas.zoomToPoint(point, newZoom);
  };

  canvas.on("mouse:wheel", onMouseWheel);
  return () => canvas.off("mouse:wheel", onMouseWheel);
}

export function setupDragDrop(
  canvas: fabric.Canvas,
  onDropImage: (file: File, x: number, y: number) => void
): () => void {
  const canvasEl = canvas.getElement().closest("canvas");
  if (!canvasEl) return () => {};

  const container = canvasEl.parentElement;
  if (!container) return () => {};

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        onDropImage(file, x, y);
      }
    }
  };

  container.addEventListener("dragover", onDragOver);
  container.addEventListener("drop", onDrop);

  return () => {
    container.removeEventListener("dragover", onDragOver);
    container.removeEventListener("drop", onDrop);
  };
}

export function resetViewport(canvas: fabric.Canvas): void {
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.setZoom(1);
  canvas.requestRenderAll();
}
