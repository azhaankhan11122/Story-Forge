export interface Gradient {
  type: "linear" | "radial";
  angle: number;
  stops: { offset: number; color: string }[];
}

export interface Page {
  id: string;
  canvasJSON: string;
  backgroundColor: string;
  backgroundGradient: Gradient | null;
  ratio: "9:16" | "1:1" | "4:5" | "16:9" | "4:3";
  width: number;
  height: number;
}

export interface Story {
  id: string;
  name: string;
  thumbnail: string;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  defaultRatio: string;
  defaultExportQuality: number;
  showGrid: boolean;
  showRulers: boolean;
  autosaveInterval: number;
  snapToGuides: boolean;
}

export type StorySort = "date" | "name" | "favorites";
