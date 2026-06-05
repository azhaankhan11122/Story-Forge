"use client";

import React, { useEffect, useState } from "react";
import * as fabric from "fabric";
import { Eye, EyeOff, Lock, Trash2, Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";

interface LayerPanelProps {
  canvas: fabric.Canvas | null;
}

interface LayerInfo {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  index: number;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({ canvas }) => {
  const [layers, setLayers] = useState<LayerInfo[]>([]);

  useEffect(() => {
    if (!canvas) return;
    const update = () => {
      const objs = canvas.getObjects().reverse();
      const mapped = objs.map((obj, index) => ({
        id: obj.id || `obj-${index}`,
        type: obj.type || "unknown",
        name: (obj as unknown as { name?: string }).name || `${obj.type || "Object"} ${index + 1}`,
        visible: obj.visible ?? true,
        locked: !obj.selectable,
        index,
      }));
      setLayers(mapped);
    };

    update();
    canvas.on("object:added", update);
    canvas.on("object:removed", update);
    canvas.on("object:modified", update);
    return () => {
      canvas.off("object:added", update);
      canvas.off("object:removed", update);
      canvas.off("object:modified", update);
    };
  }, [canvas]);

  const toggleVisibility = (index: number) => {
    if (!canvas) return;
    const objs = canvas.getObjects().reverse();
    const obj = objs[index];
    if (!obj) return;
    obj.visible = !obj.visible;
    canvas.requestRenderAll();
    setLayers((prev) =>
      prev.map((l, i) => (i === index ? { ...l, visible: !l.visible } : l))
    );
  };

  const toggleLock = (index: number) => {
    if (!canvas) return;
    const objs = canvas.getObjects().reverse();
    const obj = objs[index];
    if (!obj) return;
    obj.selectable = !obj.selectable;
    obj.evented = obj.selectable;
    canvas.requestRenderAll();
    setLayers((prev) =>
      prev.map((l, i) => (i === index ? { ...l, locked: !l.locked } : l))
    );
  };

  const deleteLayer = (index: number) => {
    if (!canvas) return;
    const objs = canvas.getObjects().reverse();
    const obj = objs[index];
    if (!obj) return;
    canvas.remove(obj);
    canvas.requestRenderAll();
  };

  const selectLayer = (index: number) => {
    if (!canvas) return;
    const objs = canvas.getObjects().reverse();
    const obj = objs[index];
    if (!obj || !obj.selectable) return;
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
          <Layers size={16} /> Layers
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {layers.length === 0 ? (
          <div className="text-xs text-text-secondary text-center py-8">No layers</div>
        ) : (
          layers.map((layer, index) => (
            <div
              key={layer.id}
              onClick={() => selectLayer(index)}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer hover:bg-surface-2 transition-colors",
                !layer.visible && "opacity-50"
              )}
            >
              <button onClick={(e) => { e.stopPropagation(); toggleVisibility(index); }} className="text-text-secondary hover:text-text-primary">
                {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <span className="flex-1 truncate capitalize">{layer.name}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleLock(index); }} className={cn("text-text-secondary hover:text-text-primary", layer.locked && "text-accent")}>
                <Lock size={14} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); deleteLayer(index); }} className="text-text-secondary hover:text-danger">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
