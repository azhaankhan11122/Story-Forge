"use client";

import React, { useEffect, useState } from "react";
import * as fabric from "fabric";
import { TextProperties } from "./panels/TextProperties";
import { ImageProperties } from "./panels/ImageProperties";
import { BackgroundPanel } from "./panels/BackgroundPanel";
import { useEditorStore } from "@/store/editorStore";
import { Wand2 } from "lucide-react";

interface PropertiesPanelProps {
  canvas: fabric.Canvas | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ canvas }) => {
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const bgColor = useEditorStore((s) => s.backgroundColor);
  const setBgColor = useEditorStore((s) => s.setBackgroundColor);

  useEffect(() => {
    if (!canvas) return;
    const update = () => {
      const obj = canvas.getActiveObject();
      setActiveObject(obj ?? null);
    };
    canvas.on("selection:created", update);
    canvas.on("selection:updated", update);
    canvas.on("selection:cleared", () => setActiveObject(null));
    return () => {
      canvas.off("selection:created", update);
      canvas.off("selection:updated", update);
      canvas.off("selection:cleared", () => setActiveObject(null));
    };
  }, [canvas]);

  const renderPanel = () => {
    if (!activeObject) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <Wand2 size={16} /> Canvas
          </div>
          <BackgroundPanel color={bgColor} onChangeColor={(c) => { setBgColor(c); canvas?.setBackgroundColor(c, () => canvas?.requestRenderAll()); }} />
        </div>
      );
    }

    if (activeObject instanceof fabric.IText || activeObject instanceof fabric.Text) {
      return <TextProperties object={activeObject as fabric.IText} canvas={canvas} />;
    }

    if (activeObject instanceof fabric.Image) {
      return <ImageProperties object={activeObject as fabric.Image} canvas={canvas} />;
    }

    return (
      <div className="space-y-4">
        <div className="text-xs text-text-secondary">Select a text or image element to edit properties.</div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-medium text-text-primary">Properties</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3">{renderPanel()}</div>
    </div>
  );
};
