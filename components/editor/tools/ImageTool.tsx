"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ImagePlus, Upload } from "lucide-react";

interface ImageToolProps {
  onAddImage: (src: string) => void;
}

export const ImageTool: React.FC<ImageToolProps> = ({ onAddImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (src) onAddImage(src);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-border rounded-card p-6 text-center">
        <ImagePlus size={32} className="mx-auto text-text-secondary mb-2" />
        <p className="text-sm text-text-secondary mb-2">Drag & drop images onto the canvas</p>
        <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload size={14} className="mr-1" /> Choose File
        </Button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Image URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste image URL..."
            className="flex-1 h-9 px-3 bg-surface border border-border rounded text-sm text-text-primary focus:outline-none focus:border-accent"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                if (val) onAddImage(val);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
