"use client";

import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils/cn";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const presetColors = [
  "#ffffff", "#0a0a0a", "#c9a96e", "#ff4444", "#44ff88",
  "#4488ff", "#ff8844", "#ff44ff", "#44ffff", "#888888",
  "#1a1a1a", "#2a2a2a", "#f5f5f5", "#d4b882", "#8b4513",
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-8 h-8 rounded border border-border overflow-hidden"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 px-2 bg-surface border border-border rounded text-sm text-text-primary font-mono w-24 focus:outline-none focus:border-accent"
        />
      </div>
      {showPicker && (
        <div className="absolute z-50 p-2 bg-surface-2 rounded-card border border-border shadow-xl">
          <HexColorPicker color={color} onChange={onChange} style={{ width: 200, height: 200 }} />
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {presetColors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={cn("w-5 h-5 rounded-sm border border-border", color === c && "ring-1 ring-accent")}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
};
