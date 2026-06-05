"use client";

import React from "react";
import { Slider } from "@/components/ui/Slider";
import { adjustmentOptions } from "@/data/filters";

interface AdjustToolProps {
  values: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

export const AdjustTool: React.FC<AdjustToolProps> = ({ values, onChange }) => {
  return (
    <div className="space-y-4">
      <p className="text-xs text-text-secondary">Select an image on the canvas to adjust.</p>
      {adjustmentOptions.map((opt) => (
        <Slider
          key={opt.id}
          label={opt.name}
          value={values[opt.id] ?? opt.default}
          min={opt.min}
          max={opt.max}
          onChange={(v) => onChange(opt.id, v)}
        />
      ))}
    </div>
  );
};
