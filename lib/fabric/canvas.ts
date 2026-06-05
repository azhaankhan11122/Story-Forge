import * as fabric from "fabric";
import type { CanvasRatio, CanvasDimensions } from "@/types/editor";

export const RATIO_DIMENSIONS: Record<CanvasRatio, CanvasDimensions> = {
  "9:16": { width: 1080, height: 1920, ratio: "9:16" },
  "1:1": { width: 1080, height: 1080, ratio: "1:1" },
  "4:5": { width: 1080, height: 1350, ratio: "4:5" },
  "16:9": { width: 1920, height: 1080, ratio: "16:9" },
  "4:3": { width: 1080, height: 810, ratio: "4:3" },
};

export function createCanvas(
  canvasElement: HTMLCanvasElement,
  ratio: CanvasRatio = "9:16"
): fabric.Canvas {
  const dims = RATIO_DIMENSIONS[ratio];
  const canvas = new fabric.Canvas(canvasElement, {
    width: dims.width,
    height: dims.height,
    backgroundColor: "#0a0a0a",
    preserveObjectStacking: true,
    selection: true,
    fireRightClick: true,
    stopContextMenu: true,
  });

  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  return canvas;
}

export function resizeCanvas(
  canvas: fabric.Canvas,
  ratio: CanvasRatio,
  scale = 1
): void {
  const dims = RATIO_DIMENSIONS[ratio];
  canvas.setWidth(dims.width * scale);
  canvas.setHeight(dims.height * scale);
  canvas.setZoom(scale);
  canvas.requestRenderAll();
}

export function loadCanvasFromJSON(
  canvas: fabric.Canvas,
  json: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      canvas.loadFromJSON(json, () => {
        canvas.requestRenderAll();
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

export function getCanvasJSON(canvas: fabric.Canvas): string {
  return JSON.stringify(canvas.toJSON());
}

export function getCanvasThumbnail(
  canvas: fabric.Canvas,
  quality = 0.8
): string {
  return canvas.toDataURL({
    format: "png",
    quality,
    multiplier: 0.25,
  });
}

export function exportCanvasToImage(
  canvas: fabric.Canvas,
  format: "png" | "jpg" = "png",
  multiplier = 1
): string {
  return canvas.toDataURL({
    format,
    quality: 1,
    multiplier,
  });
}

export function centerObject(canvas: fabric.Canvas, obj: fabric.Object): void {
  canvas.centerObject(obj);
  obj.setCoords();
  canvas.requestRenderAll();
}

export function addText(
  canvas: fabric.Canvas,
  text = "Double click to edit",
  options: Partial<fabric.ITextOptions> = {}
): fabric.IText {
  const textObj = new fabric.IText(text, {
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    fontFamily: "Inter",
    fontSize: 48,
    fill: "#ffffff",
    originX: "center",
    originY: "center",
    ...options,
  });
  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  canvas.requestRenderAll();
  return textObj;
}

export function addImage(
  canvas: fabric.Canvas,
  src: string,
  options: Partial<fabric.Image> = {}
): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(src).then((img) => {
      img.set({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: "center",
        originY: "center",
        ...options,
      });
      const scale = Math.min(
        (canvas.width! * 0.8) / img.width!,
        (canvas.height! * 0.8) / img.height!
      );
      img.scale(scale);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      resolve(img);
    }).catch(reject);
  });
}

export function addRect(
  canvas: fabric.Canvas,
  options: Partial<fabric.Rect> = {}
): fabric.Rect {
  const rect = new fabric.Rect({
    width: 200,
    height: 200,
    fill: "#c9a96e",
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    originX: "center",
    originY: "center",
    ...options,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
  return rect;
}

export function addCircle(
  canvas: fabric.Canvas,
  options: Partial<fabric.Circle> = {}
): fabric.Circle {
  const circle = new fabric.Circle({
    radius: 100,
    fill: "#c9a96e",
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    originX: "center",
    originY: "center",
    ...options,
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
  return circle;
}

export function addTriangle(
  canvas: fabric.Canvas,
  options: Partial<fabric.Triangle> = {}
): fabric.Triangle {
  const triangle = new fabric.Triangle({
    width: 200,
    height: 200,
    fill: "#c9a96e",
    left: canvas.width! / 2,
    top: canvas.height! / 2,
    originX: "center",
    originY: "center",
    ...options,
  });
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  canvas.requestRenderAll();
  return triangle;
}
