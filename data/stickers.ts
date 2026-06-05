import type { StickerItem, StickerCategory } from "@/types/template";
import { shapeItems } from "./categories";

const emojiItems: StickerItem[] = [
  { id: "e1", name: "Heart", type: "emoji", content: "❤️", category: "emoji" },
  { id: "e2", name: "Fire", type: "emoji", content: "🔥", category: "emoji" },
  { id: "e3", name: "Star", type: "emoji", content: "⭐", category: "emoji" },
  { id: "e4", name: "Sparkles", type: "emoji", content: "✨", category: "emoji" },
  { id: "e5", name: "Camera", type: "emoji", content: "📷", category: "emoji" },
  { id: "e6", name: "Location", type: "emoji", content: "📍", category: "emoji" },
  { id: "e7", name: "Music", type: "emoji", content: "🎵", category: "emoji" },
  { id: "e8", name: "Sun", type: "emoji", content: "☀️", category: "emoji" },
  { id: "e9", name: "Moon", type: "emoji", content: "🌙", category: "emoji" },
  { id: "e10", name: "Cloud", type: "emoji", content: "☁️", category: "emoji" },
  { id: "e11", name: "Rainbow", type: "emoji", content: "🌈", category: "emoji" },
  { id: "e12", name: "Flower", type: "emoji", content: "🌸", category: "emoji" },
  { id: "e13", name: "Palm", type: "emoji", content: "🌴", category: "emoji" },
  { id: "e14", name: "Wave", type: "emoji", content: "🌊", category: "emoji" },
  { id: "e15", name: "Coffee", type: "emoji", content: "☕", category: "emoji" },
  { id: "e16", name: "Plane", type: "emoji", content: "✈️", category: "emoji" },
  { id: "e17", name: "Map", type: "emoji", content: "🗺️", category: "emoji" },
  { id: "e18", name: "Compass", type: "emoji", content: "🧭", category: "emoji" },
  { id: "e19", name: "Bag", type: "emoji", content: "🎒", category: "emoji" },
  { id: "e20", name: "Sunglasses", type: "emoji", content: "🕶️", category: "emoji" },
];

const svgItems: StickerItem[] = [
  { id: "s1", name: "Leaf Branch", type: "svg", content: "<svg viewBox='0 0 100 100'><path d='M50 10 Q30 40 50 90 Q70 40 50 10' fill='currentColor'/></svg>", category: "botanical" },
  { id: "s2", name: "Round Frame", type: "svg", content: "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='none' stroke='currentColor' stroke-width='2'/></svg>", category: "frames" },
  { id: "s3", name: "Corner Frame", type: "svg", content: "<svg viewBox='0 0 100 100'><path d='M10 10 L10 30 M10 10 L30 10' fill='none' stroke='currentColor' stroke-width='2'/></svg>", category: "frames" },
  { id: "s4", name: "Blob", type: "svg", content: "<svg viewBox='0 0 100 100'><path d='M50 10 C80 10 90 40 90 50 C90 70 70 90 50 90 C20 90 10 70 10 50 C10 30 30 10 50 10' fill='currentColor'/></svg>", category: "abstract" },
  { id: "s5", name: "Wavy Line", type: "svg", content: "<svg viewBox='0 0 100 20'><path d='M0 10 Q25 0 50 10 T100 10' fill='none' stroke='currentColor' stroke-width='2'/></svg>", category: "minimal" },
];

export const stickers: StickerCategory[] = [
  { id: "emoji", name: "Emoji", items: emojiItems },
  { id: "shapes", name: "Shapes", items: shapeItems },
  { id: "botanical", name: "Botanical", items: svgItems.filter((i) => i.category === "botanical") },
  { id: "abstract", name: "Abstract", items: svgItems.filter((i) => i.category === "abstract") },
  { id: "frames", name: "Frames", items: svgItems.filter((i) => i.category === "frames") },
  { id: "minimal", name: "Minimal", items: svgItems.filter((i) => i.category === "minimal") },
];

export function getAllStickers(): StickerItem[] {
  return stickers.flatMap((cat) => cat.items);
}
