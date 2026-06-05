"use client";

import React, { useEffect, useState } from "react";
import * as fabric from "fabric";
import { Slider } from "@/components/ui/Slider";
import { FontPicker } from "./FontPicker";
import { ColorPicker } from "./ColorPicker";
import { cn } from "@/lib/utils/cn";
import { loadFontCSS } from "@/data/fonts";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";

interface TextPropertiesProps {
  object: fabric.IText;
  canvas: fabric.Canvas;
}

export const TextProperties: React.FC<TextPropertiesProps> = ({ object, canvas }) => {
  const [fontSize, setFontSize] = useState(object.fontSize ?? 48);
  const [fontFamily, setFontFamily] = useState(object.fontFamily ?? "Inter");
  const [fill, setFill] = useState((object.fill as string) ?? "#ffffff");
  const [opacity, setOpacity] = useState(object.opacity ?? 1);
  const [fontWeight, setFontWeight] = useState(object.fontWeight ?? "normal");
  const [fontStyle, setFontStyle] = useState(object.fontStyle ?? "normal");
  const [textAlign, setTextAlign] = useState(object.textAlign ?? "left");
  const [underline, setUnderline] = useState(object.underline ?? false);
  const [letterSpacing, setLetterSpacing] = useState(object.charSpacing ?? 0);
  const [lineHeight, setLineHeight] = useState(object.lineHeight ?? 1.2);

  const update = (key: string, value: unknown) => {
    object.set(key as keyof fabric.IText, value);
    canvas.requestRenderAll();
  };

  useEffect(() => {
    setFontSize(object.fontSize ?? 48);
    setFontFamily(object.fontFamily ?? "Inter");
    setFill((object.fill as string) ?? "#ffffff");
    setOpacity(object.opacity ?? 1);
    setFontWeight(object.fontWeight ?? "normal");
    setFontStyle(object.fontStyle ?? "normal");
    setTextAlign(object.textAlign ?? "left");
    setUnderline(object.underline ?? false);
    setLetterSpacing(object.charSpacing ?? 0);
    setLineHeight(object.lineHeight ?? 1.2);
  }, [object]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Font</label>
        <FontPicker selectedFont={fontFamily} onSelect={(f) => { loadFontCSS(f); setFontFamily(f); update("fontFamily", f); }} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Size</label>
        <Slider value={fontSize} min={8} max={200} step={1} onChange={(v) => { setFontSize(v); update("fontSize", v); }} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Color</label>
        <ColorPicker color={fill} onChange={(c) => { setFill(c); update("fill", c); }} />
      </div>

      <div>
        <label className="text-xs text-text-secondary mb-1 block">Opacity</label>
        <Slider value={Math.round(opacity * 100)} min={0} max={100} onChange={(v) => { setOpacity(v / 100); update("opacity", v / 100); }} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-text-secondary mb-1 block">Letter Spacing</label>
          <Slider value={letterSpacing} min={-50} max={100} onChange={(v) => { setLetterSpacing(v); update("charSpacing", v); }} />
        </div>
        <div>
          <label className="text-xs text-text-secondary mb-1 block">Line Height</label>
          <Slider value={Math.round(lineHeight * 100)} min={50} max={300} step={10} onChange={(v) => { setLineHeight(v / 100); update("lineHeight", v / 100); }} />
        </div>
      </div>

      <div className="flex gap-1">
        <button onClick={() => { const w = fontWeight === "bold" ? "normal" : "bold"; setFontWeight(w); update("fontWeight", w); }} className={cn("p-1.5 rounded", fontWeight === "bold" && "bg-accent text-background")}><Bold size={14} /></button>
        <button onClick={() => { const s = fontStyle === "italic" ? "normal" : "italic"; setFontStyle(s); update("fontStyle", s); }} className={cn("p-1.5 rounded", fontStyle === "italic" && "bg-accent text-background")}><Italic size={14} /></button>
        <button onClick={() => { setUnderline(!underline); update("underline", !underline); }} className={cn("p-1.5 rounded", underline && "bg-accent text-background")}><Underline size={14} /></button>
      </div>

      <div className="flex gap-1">
        <button onClick={() => { setTextAlign("left"); update("textAlign", "left"); }} className={cn("p-1.5 rounded", textAlign === "left" && "bg-accent text-background")}><AlignLeft size={14} /></button>
        <button onClick={() => { setTextAlign("center"); update("textAlign", "center"); }} className={cn("p-1.5 rounded", textAlign === "center" && "bg-accent text-background")}><AlignCenter size={14} /></button>
        <button onClick={() => { setTextAlign("right"); update("textAlign", "right"); }} className={cn("p-1.5 rounded", textAlign === "right" && "bg-accent text-background")}><AlignRight size={14} /></button>
      </div>

      <button
        onClick={() => { object.enterEditing(); canvas.requestRenderAll(); }}
        className="w-full py-2 bg-surface-2 text-text-primary rounded-standard text-sm hover:bg-border transition-colors flex items-center justify-center gap-2"
      >
        <Type size={14} /> Edit Text
      </button>
    </div>
  );
};
