"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as fabric from "fabric";
import type { CanvasRatio } from "@/types/editor";
import {
  createCanvas,
  loadCanvasFromJSON,
  getCanvasJSON,
  resizeCanvas,
  exportCanvasToImage,
  resetViewport,
} from "@/lib/fabric/canvas";
import { setupPanning, setupZoom, setupDragDrop } from "@/lib/fabric/gestures";
import { createSnapGuides, setupSnapToGuides, clearGuides } from "@/lib/fabric/guides";
import { CanvasHistory } from "@/lib/fabric/history";
import { loadFontCSS } from "@/data/fonts";

export interface UseCanvasReturn {
  canvas: fabric.Canvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  history: CanvasHistory | null;
  isReady: boolean;
  zoom: number;
  setZoom: (z: number) => void;
  resetZoom: () => void;
  exportImage: (format?: "png" | "jpg", multiplier?: number) => string;
  loadJSON: (json: string) => Promise<void>;
  getJSON: () => string;
  getThumbnail: () => string;
  resizeToRatio: (ratio: CanvasRatio) => void;
  addText: (text?: string) => fabric.IText | null;
  addImage: (src: string) => Promise<fabric.Image | null>;
  addRect: () => fabric.Rect | null;
  addCircle: () => fabric.Circle | null;
  addTriangle: () => fabric.Triangle | null;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setBackgroundColor: (color: string) => void;
  getBackgroundColor: () => string;
  activeObject: fabric.Object | null;
  selectedObjects: fabric.Object[];
  onObjectChange: (callback: () => void) => () => void;
}

export function useCanvas(
  ratio: CanvasRatio = "9:16",
  snapToGuides = true
): UseCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const historyRef = useRef<CanvasHistory | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoomState] = useState(1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const changeCallbackRef = useRef<(() => void) | null>(null);

  const updateHistoryState = useCallback(() => {
    const h = historyRef.current;
    if (h) {
      setCanUndo(h.canUndo());
      setCanRedo(h.canRedo());
    }
    if (changeCallbackRef.current) changeCallbackRef.current();
  }, []);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    if (canvasInstanceRef.current) return;

    const canvas = createCanvas(canvasEl, ratio);
    canvasInstanceRef.current = canvas;

    const history = new CanvasHistory(canvas);
    historyRef.current = history;

    createSnapGuides(canvas);
    let cleanupSnap: (() => void) | null = null;
    if (snapToGuides) cleanupSnap = setupSnapToGuides(canvas);

    const cleanupPan = setupPanning(canvas);
    const cleanupZoom = setupZoom(canvas);
    const cleanupDrop = setupDragDrop(canvas, (file, x, y) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        if (!src) return;
        fabric.Image.fromURL(src).then((img) => {
          const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
          const pointer = canvas.getPointer(new MouseEvent("mousedown", { clientX: x, clientY: y }));
          img.set({
            left: (pointer.x - vpt[4]) / vpt[0],
            top: (pointer.y - vpt[5]) / vpt[3],
            originX: "center",
            originY: "center",
          });
          const scale = Math.min(
            (canvas.width! * 0.5) / img.width!,
            (canvas.height! * 0.5) / img.height!
          );
          img.scale(scale);
          canvas.add(img);
          canvas.setActiveObject(img);
          history.save();
          updateHistoryState();
          canvas.requestRenderAll();
        });
      };
      reader.readAsDataURL(file);
    });

    canvas.on("selection:created", (e) => {
      setActiveObject(e.selected?.[0] ?? null);
      setSelectedObjects(e.selected ?? []);
    });
    canvas.on("selection:updated", (e) => {
      setActiveObject(e.selected?.[0] ?? null);
      setSelectedObjects(e.selected ?? []);
    });
    canvas.on("selection:cleared", () => {
      setActiveObject(null);
      setSelectedObjects([]);
    });
    canvas.on("object:modified", () => {
      history.save();
      updateHistoryState();
    });
    canvas.on("object:added", () => {
      history.save();
      updateHistoryState();
    });
    canvas.on("object:removed", () => {
      history.save();
      updateHistoryState();
    });

    canvas.on("mouse:wheel", (opt) => {
      setZoomState(canvas.getZoom());
    });

    history.save();
    setIsReady(true);

    return () => {
      cleanupPan();
      cleanupZoom();
      cleanupDrop();
      cleanupSnap?.();
      clearGuides(canvas);
      canvas.dispose();
      canvasInstanceRef.current = null;
      historyRef.current = null;
      setIsReady(false);
    };
  }, [ratio, snapToGuides, updateHistoryState]);

  const setZoom = useCallback((z: number) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    c.setZoom(z);
    setZoomState(z);
    c.requestRenderAll();
  }, []);

  const resetZoom = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    resetViewport(c);
    setZoomState(1);
  }, []);

  const exportImage = useCallback(
    (format: "png" | "jpg" = "png", multiplier = 1) => {
      const c = canvasInstanceRef.current;
      if (!c) return "";
      return exportCanvasToImage(c, format, multiplier);
    },
    []
  );

  const loadJSON = useCallback(
    async (json: string) => {
      const c = canvasInstanceRef.current;
      if (!c) return;
      await loadCanvasFromJSON(c, json);
      historyRef.current?.save();
      updateHistoryState();
    },
    [updateHistoryState]
  );

  const getJSON = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return "{}";
    return getCanvasJSON(c);
  }, []);

  const getThumbnail = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return "";
    return c.toDataURL({ format: "png", quality: 0.8, multiplier: 0.2 });
  }, []);

  const resizeToRatio = useCallback((r: CanvasRatio) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    resizeCanvas(c, r);
  }, []);

  const addText = useCallback((text = "Double click to edit"): fabric.IText | null => {
    const c = canvasInstanceRef.current;
    if (!c) return null;
    loadFontCSS("Inter");
    const t = new fabric.IText(text, {
      left: c.width! / 2,
      top: c.height! / 2,
      fontFamily: "Inter",
      fontSize: 48,
      fill: "#ffffff",
      originX: "center",
      originY: "center",
    });
    c.add(t);
    c.setActiveObject(t);
    c.requestRenderAll();
    historyRef.current?.save();
    updateHistoryState();
    return t;
  }, [updateHistoryState]);

  const addImage = useCallback(
    async (src: string): Promise<fabric.Image | null> => {
      const c = canvasInstanceRef.current;
      if (!c) return null;
      try {
        const img = await fabric.Image.fromURL(src);
        img.set({
          left: c.width! / 2,
          top: c.height! / 2,
          originX: "center",
          originY: "center",
        });
        const scale = Math.min(
          (c.width! * 0.8) / img.width!,
          (c.height! * 0.8) / img.height!
        );
        img.scale(scale);
        c.add(img);
        c.setActiveObject(img);
        c.requestRenderAll();
        historyRef.current?.save();
        updateHistoryState();
        return img;
      } catch {
        return null;
      }
    },
    [updateHistoryState]
  );

  const addRect = useCallback((): fabric.Rect | null => {
    const c = canvasInstanceRef.current;
    if (!c) return null;
    const r = new fabric.Rect({
      width: 200,
      height: 200,
      fill: "#c9a96e",
      left: c.width! / 2,
      top: c.height! / 2,
      originX: "center",
      originY: "center",
    });
    c.add(r);
    c.setActiveObject(r);
    c.requestRenderAll();
    historyRef.current?.save();
    updateHistoryState();
    return r;
  }, [updateHistoryState]);

  const addCircle = useCallback((): fabric.Circle | null => {
    const c = canvasInstanceRef.current;
    if (!c) return null;
    const circle = new fabric.Circle({
      radius: 100,
      fill: "#c9a96e",
      left: c.width! / 2,
      top: c.height! / 2,
      originX: "center",
      originY: "center",
    });
    c.add(circle);
    c.setActiveObject(circle);
    c.requestRenderAll();
    historyRef.current?.save();
    updateHistoryState();
    return circle;
  }, [updateHistoryState]);

  const addTriangle = useCallback((): fabric.Triangle | null => {
    const c = canvasInstanceRef.current;
    if (!c) return null;
    const t = new fabric.Triangle({
      width: 200,
      height: 200,
      fill: "#c9a96e",
      left: c.width! / 2,
      top: c.height! / 2,
      originX: "center",
      originY: "center",
    });
    c.add(t);
    c.setActiveObject(t);
    c.requestRenderAll();
    historyRef.current?.save();
    updateHistoryState();
    return t;
  }, [updateHistoryState]);

  const deleteSelected = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const active = c.getActiveObjects();
    active.forEach((o) => c.remove(o));
    c.discardActiveObject();
    c.requestRenderAll();
    historyRef.current?.save();
    updateHistoryState();
  }, [updateHistoryState]);

  const duplicateSelected = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const active = c.getActiveObjects();
    if (active.length === 0) return;
    active.forEach((o) => {
      o.clone().then((clone) => {
        clone.set({
          left: (o.left ?? 0) + 20,
          top: (o.top ?? 0) + 20,
        });
        c.add(clone);
      });
    });
    c.requestRenderAll();
    historyRef.current?.save();
    updateHistoryState();
  }, [updateHistoryState]);

  const selectAll = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    const all = c.getObjects().filter((o) => o.selectable);
    if (all.length > 0) {
      const sel = new fabric.ActiveSelection(all, { canvas: c });
      c.setActiveObject(sel);
      c.requestRenderAll();
    }
  }, []);

  const deselectAll = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    c.discardActiveObject();
    c.requestRenderAll();
  }, []);

  const clearCanvas = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    c.remove(...c.getObjects());
    c.requestRenderAll();
    historyRef.current?.save();
    updateHistoryState();
  }, [updateHistoryState]);

  const undo = useCallback(() => {
    historyRef.current?.undo();
    updateHistoryState();
  }, [updateHistoryState]);

  const redo = useCallback(() => {
    historyRef.current?.redo();
    updateHistoryState();
  }, [updateHistoryState]);

  const setBackgroundColor = useCallback((color: string) => {
    const c = canvasInstanceRef.current;
    if (!c) return;
    c.setBackgroundColor(color, () => c.requestRenderAll());
  }, []);

  const getBackgroundColor = useCallback(() => {
    const c = canvasInstanceRef.current;
    if (!c) return "#0a0a0a";
    return (c.backgroundColor as string) || "#0a0a0a";
  }, []);

  const onObjectChange = useCallback((callback: () => void) => {
    changeCallbackRef.current = callback;
    return () => {
      changeCallbackRef.current = null;
    };
  }, []);

  return {
    canvas: canvasInstanceRef.current,
    canvasRef,
    containerRef,
    history: historyRef.current,
    isReady,
    zoom,
    setZoom,
    resetZoom,
    exportImage,
    loadJSON,
    getJSON,
    getThumbnail,
    resizeToRatio,
    addText,
    addImage,
    addRect,
    addCircle,
    addTriangle,
    deleteSelected,
    duplicateSelected,
    selectAll,
    deselectAll,
    clearCanvas,
    undo,
    redo,
    canUndo,
    canRedo,
    setBackgroundColor,
    getBackgroundColor,
    activeObject,
    selectedObjects,
    onObjectChange,
  };
}
