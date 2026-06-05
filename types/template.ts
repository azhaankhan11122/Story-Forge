import type { CanvasRatio } from "./editor";

export interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  canvasJSON: string;
  ratio: CanvasRatio;
  width: number;
  height: number;
  isPro: boolean;
  tags: string[];
}

export type TemplateCategory =
  | "all"
  | "minimal"
  | "film"
  | "vintage"
  | "modern"
  | "travel"
  | "food"
  | "fashion"
  | "dark"
  | "light"
  | "quote";

export interface FontDefinition {
  id: string;
  name: string;
  family: string;
  category: "serif" | "sans-serif" | "display" | "handwriting" | "monospace";
  weights: number[];
  variable: boolean;
  url?: string;
  favorite: boolean;
}

export interface StickerCategory {
  id: string;
  name: string;
  items: StickerItem[];
}

export interface StickerItem {
  id: string;
  name: string;
  type: "emoji" | "shape" | "svg";
  content: string;
  category: string;
}
