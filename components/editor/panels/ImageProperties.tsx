"use client";

import React, { useEffect, useState } from "react";
import * as fabric from "fabric";
import { Slider } from "@/components/ui/Slider";
import { FilterPicker } from "./FilterPicker";
import { applyFilterPreset } from "@/lib/fabric/filters";
import { cn } from "@/lib/utils/cn";

interface ImagePropertiesProps {
  object: fabric.Image;
  canvas: fabric.Canvas;
}

export const ImageProperties: React.FC<ImagePropertiesProps> = ({ object, canvas }) => {
  const [opacity, setOpacity] = useState(object.opacity ?? 1);
  const [filter, setFilter] = useState("none");
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    setOpacity(object.opacity ?? 1);
  }, [object]);

  const applyFilter = (id: string) => {
    setFilter(id);
    applyFilterPreset(canvas, object, id);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Filters</label>
        <FilterPicker selected={filter} onSelect={applyFilter} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Opacity</label>
        <Slider value={Math.round(opacity * 100)} min={0} max={100} onChange={(v) => { setOpacity(v / 100); object.set("opacity", v / 100); canvas.requestRenderAll(); }} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Brightness</label>
        <Slider value={brightness} min={-100} max={100} onChange={(v) => { setBrightness(v); }} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Contrast</label>
        <Slider value={contrast} min={-100} max={100} onChange={(v) => { setContrast(v); }} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Saturation</label>
        <Slider value={saturation} min={-100} max={100} onChange={(v) => { setSaturation(v); }} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Blur</label>
        <Slider value={blur} min={0} max={20} onChange={(v) => { setBlur(v); }} />
      </div>
    </div>
  );
};
