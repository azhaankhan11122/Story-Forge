"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, min, max, step = 1, onChange, label, className }, ref) => {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <div className="flex justify-between mb-1">
            <span className="text-xs text-text-secondary">{label}</span>
            <span className="text-xs text-text-primary">{value}</span>
          </div>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-surface-2 rounded-full appearance-none cursor-pointer accent-accent"
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";
