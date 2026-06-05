"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  EditorState,
  CanvasRatio,
  ExportOptions,
  Gradient,
} from "@/types/editor";

interface EditorActions {
  setStoryId: (id: string | null) => void;
  setPageIndex: (index: number) => void;
  setSelectedIds: (ids: string[]) => void;
  setZoom: (zoom: number) => void;
  setIsDragging: (dragging: boolean) => void;
  setIsPanning: (panning: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setShowRulers: (show: boolean) => void;
  setSnapToGuides: (snap: boolean) => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundGradient: (gradient: Gradient | null) => void;
  toggleGrid: () => void;
  toggleRulers: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setExportOptions: (options: ExportOptions) => void;
  reset: () => void;
}

const initialState: EditorState = {
  currentStoryId: null,
  currentPageIndex: 0,
  selectedIds: [],
  zoom: 1,
  isDragging: false,
  isPanning: false,
  showGrid: false,
  showRulers: true,
  snapToGuides: true,
  backgroundColor: "#0a0a0a",
  backgroundGradient: null,
};

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set) => ({
    ...initialState,

    setStoryId: (id) =>
      set((state) => {
        state.currentStoryId = id;
      }),

    setPageIndex: (index) =>
      set((state) => {
        state.currentPageIndex = index;
      }),

    setSelectedIds: (ids) =>
      set((state) => {
        state.selectedIds = ids;
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.zoom = Math.max(0.1, Math.min(5, zoom));
      }),

    setIsDragging: (dragging) =>
      set((state) => {
        state.isDragging = dragging;
      }),

    setIsPanning: (panning) =>
      set((state) => {
        state.isPanning = panning;
      }),

    setShowGrid: (show) =>
      set((state) => {
        state.showGrid = show;
      }),

    setShowRulers: (show) =>
      set((state) => {
        state.showRulers = show;
      }),

    setSnapToGuides: (snap) =>
      set((state) => {
        state.snapToGuides = snap;
      }),

    setBackgroundColor: (color) =>
      set((state) => {
        state.backgroundColor = color;
      }),

    setBackgroundGradient: (gradient) =>
      set((state) => {
        state.backgroundGradient = gradient;
      }),

    toggleGrid: () =>
      set((state) => {
        state.showGrid = !state.showGrid;
      }),

    toggleRulers: () =>
      set((state) => {
        state.showRulers = !state.showRulers;
      }),

    zoomIn: () =>
      set((state) => {
        state.zoom = Math.min(5, state.zoom + 0.1);
      }),

    zoomOut: () =>
      set((state) => {
        state.zoom = Math.max(0.1, state.zoom - 0.1);
      }),

    resetZoom: () =>
      set((state) => {
        state.zoom = 1;
      }),

    setExportOptions: () => set(() => {}),

    reset: () => set(initialState),
  }))
);
