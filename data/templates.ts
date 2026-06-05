import type { Template } from "@/types/template";
import { nanoid } from "nanoid";

function baseTemplate(
  name: string,
  category: string,
  ratio: "9:16" | "1:1" | "4:5" = "9:16",
  tags: string[] = []
): Template {
  const width = ratio === "9:16" ? 1080 : ratio === "1:1" ? 1080 : 1080;
  const height = ratio === "9:16" ? 1920 : ratio === "1:1" ? 1080 : 1350;
  return {
    id: nanoid(),
    name,
    category,
    preview: "",
    ratio,
    width,
    height,
    canvasJSON: JSON.stringify({ version: "6.0.0", objects: [], background: "#0a0a0a" }),
    isPro: false,
    tags,
  };
}

export const defaultTemplates: Template[] = [
  // Minimal
  baseTemplate("Clean White Single", "minimal", "9:16", ["clean", "white", "simple"]),
  baseTemplate("White Border Polaroid", "minimal", "9:16", ["polaroid", "border", "white"]),
  baseTemplate("Top Text Bottom Image", "minimal", "9:16", ["text", "image", "split"]),
  baseTemplate("Split White Layout", "minimal", "9:16", ["split", "white", "two"]),
  baseTemplate("Centered Quote White", "minimal", "9:16", ["quote", "centered", "minimal"]),
  baseTemplate("Thin Border Frame", "minimal", "9:16", ["frame", "border", "thin"]),
  baseTemplate("Top Bottom White Bars", "minimal", "9:16", ["bars", "white", "modern"]),
  baseTemplate("White Grid 2x2", "minimal", "1:1", ["grid", "collage", "white"]),
  baseTemplate("Minimal Film Strip", "minimal", "9:16", ["film", "strip", "minimal"]),
  baseTemplate("White Magazine Header", "minimal", "9:16", ["magazine", "header", "editorial"]),

  // Dark
  baseTemplate("Full Black Editorial", "dark", "9:16", ["black", "editorial", "moody"]),
  baseTemplate("Dark Moody Single", "dark", "9:16", ["dark", "moody", "single"]),
  baseTemplate("Black Polaroid", "dark", "9:16", ["polaroid", "black", "frame"]),
  baseTemplate("Dark Split Horizontal", "dark", "9:16", ["split", "dark", "horizontal"]),
  baseTemplate("White Quote on Black", "dark", "9:16", ["quote", "black", "typography"]),
  baseTemplate("Dark Border Frame", "dark", "9:16", ["frame", "dark", "border"]),
  baseTemplate("Black Magazine Cover", "dark", "9:16", ["magazine", "cover", "black"]),
  baseTemplate("Dark Grid Collage", "dark", "1:1", ["grid", "collage", "dark"]),
  baseTemplate("Film Strip Dark", "dark", "9:16", ["film", "dark", "strip"]),
  baseTemplate("Dark Cinematic", "dark", "16:9", ["cinematic", "dark", "widescreen"]),

  // Vintage
  baseTemplate("Aged Paper Texture", "vintage", "9:16", ["paper", "aged", "texture"]),
  baseTemplate("Vintage Film Border", "vintage", "9:16", ["film", "border", "retro"]),
  baseTemplate("Retro Polaroid Pack", "vintage", "9:16", ["polaroid", "retro", "pack"]),
  baseTemplate("Old Newspaper Style", "vintage", "9:16", ["newspaper", "old", "text"]),
  baseTemplate("Vintage Postcard", "vintage", "4:5", ["postcard", "vintage", "travel"]),
  baseTemplate("Sepia Travel Card", "vintage", "9:16", ["sepia", "travel", "card"]),
  baseTemplate("Retro Badge Layout", "vintage", "1:1", ["badge", "retro", "logo"]),
  baseTemplate("Worn Edges Frame", "vintage", "9:16", ["frame", "worn", "edges"]),

  // Travel
  baseTemplate("Full Bleed Landscape", "travel", "9:16", ["landscape", "full", "bleed"]),
  baseTemplate("Travel Journal Entry", "travel", "9:16", ["journal", "entry", "notes"]),
  baseTemplate("Location Tag Layout", "travel", "9:16", ["location", "tag", "map"]),
  baseTemplate("Adventure Collage", "travel", "1:1", ["adventure", "collage", "photos"]),
  baseTemplate("Map Pin Style", "travel", "9:16", ["map", "pin", "location"]),
  baseTemplate("Passport Stamp Style", "travel", "9:16", ["passport", "stamp", "travel"]),

  // Food
  baseTemplate("Full Bleed Food Photo", "food", "9:16", ["food", "full", "photo"]),
  baseTemplate("Recipe Card Style", "food", "9:16", ["recipe", "card", "ingredients"]),
  baseTemplate("Food Blog Header", "food", "9:16", ["blog", "header", "food"]),
  baseTemplate("Restaurant Menu Style", "food", "9:16", ["menu", "restaurant", "elegant"]),
  baseTemplate("Flat Lay Frame", "food", "1:1", ["flatlay", "frame", "top"]),
  baseTemplate("Food Collage 3-up", "food", "9:16", ["collage", "three", "food"]),

  // Fashion
  baseTemplate("Editorial Full Bleed", "fashion", "9:16", ["editorial", "full", "fashion"]),
  baseTemplate("Fashion Magazine Cover", "fashion", "9:16", ["magazine", "cover", "fashion"]),
  baseTemplate("Lookbook Layout", "fashion", "9:16", ["lookbook", "outfit", "style"]),
  baseTemplate("Style Collage", "fashion", "1:1", ["style", "collage", "grid"]),
  baseTemplate("Brand Mood Board", "fashion", "1:1", ["mood", "board", "brand"]),
  baseTemplate("Fashion Quote Card", "fashion", "9:16", ["quote", "fashion", "card"]),

  // Modern
  baseTemplate("Gradient Overlay Single", "modern", "9:16", ["gradient", "overlay", "color"]),
  baseTemplate("Geometric Split", "modern", "9:16", ["geometric", "split", "angles"]),
  baseTemplate("Bold Typography Card", "modern", "9:16", ["typography", "bold", "text"]),
  baseTemplate("Modern Collage Asymmetric", "modern", "1:1", ["collage", "asymmetric", "modern"]),
  baseTemplate("Neon Accent Layout", "modern", "9:16", ["neon", "accent", "glow"]),
  baseTemplate("Contemporary Grid", "modern", "1:1", ["grid", "contemporary", "clean"]),

  // Film
  baseTemplate("Cinematic Widescreen", "film", "16:9", ["cinematic", "wide", "movie"]),
  baseTemplate("Film Frame 35mm", "film", "9:16", ["35mm", "frame", "film"]),
  baseTemplate("Sprocket Holes", "film", "9:16", ["sprocket", "holes", "retro"]),
  baseTemplate("Film Grain Overlay", "film", "9:16", ["grain", "overlay", "texture"]),
  baseTemplate("Light Leak Frame", "film", "9:16", ["light", "leak", "color"]),

  // Light
  baseTemplate("Soft Pastel Layout", "light", "9:16", ["pastel", "soft", "color"]),
  baseTemplate("Clean Bright Single", "light", "9:16", ["bright", "clean", "white"]),
  baseTemplate("Air White Space", "light", "9:16", ["white", "space", "air"]),
  baseTemplate("Minimal Light Grid", "light", "1:1", ["light", "grid", "minimal"]),
  baseTemplate("Soft Glow Frame", "light", "9:16", ["glow", "soft", "frame"]),

  // Quote
  baseTemplate("Centered Quote Block", "quote", "9:16", ["quote", "centered", "block"]),
  baseTemplate("Typography Poster", "quote", "9:16", ["poster", "typography", "bold"]),
  baseTemplate("Quote with Divider", "quote", "9:16", ["divider", "line", "elegant"]),
  baseTemplate("Minimal Quote Card", "quote", "9:16", ["minimal", "quote", "card"]),
  baseTemplate("Quote Over Image", "quote", "9:16", ["overlay", "image", "quote"]),
];
