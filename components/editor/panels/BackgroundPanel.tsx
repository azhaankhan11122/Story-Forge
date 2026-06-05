"use client";

import React from "react";
import { ColorPicker } from "./ColorPicker";
import { Slider } from "@/components/ui/Slider";

interface BackgroundPanelProps {
  color: string;
  onChangeColor: (color: string) => void;
}

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({ color, onChangeColor }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Background Color</label>
        <ColorPicker color={color} onChange={onChangeColor} />
      </div>
    </div>
  );
};
