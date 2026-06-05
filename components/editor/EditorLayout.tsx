"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCanvas } from "@/hooks/useCanvas";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useExport } from "@/hooks/useExport";
import { Canvas } from "./Canvas";
import { TopBar } from "./TopBar";
import { LayerPanel } from "./LayerPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { PageStrip } from "./PageStrip";
import { CanvasToolbar } from "./CanvasToolbar";
import { ExportPanel } from "./ExportPanel";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ImageTool } from "./tools/ImageTool";
import { TextTool } from "./tools/TextTool";
import { StickerTool } from "./tools/StickerTool";
import { FilterTool } from "./tools/FilterTool";
import { AdjustTool } from "./tools/AdjustTool";
import { getStoryById, saveStory, createEmptyStory } from "@/lib/storage/stories";
import { toast } from "sonner";
import { useEditorStore } from "@/store/editorStore";
import { debounce } from "@/lib/utils/format";
import type { Story, Page } from "@/types/story";
import type { CanvasRatio } from "@/types/editor";
import { nanoid } from "nanoid";

const ratioDimensions: Record<CanvasRatio, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
  "16:9": { width: 1920, height: 1080 },
  "4:3": { width: 1080, height: 810 },
};

export const EditorLayout: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;
  const isNew = storyId === "new";

  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [savedStatus, setSavedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const showGrid = useEditorStore((s) => s.showGrid);
  const showRulers = useEditorStore((s) => s.showRulers);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const toggleRulers = useEditorStore((s) => s.toggleRulers);
  const snapToGuides = useEditorStore((s) => s.snapToGuides);

  const ratio = (story?.pages[currentPage]?.ratio ?? "9:16") as CanvasRatio;
  const canvasJSON = story?.pages[currentPage]?.canvasJSON;
  const bgColor = story?.pages[currentPage]?.backgroundColor ?? "#0a0a0a";

  const {
    canvasRef,
    containerRef,
    canvas: fabricCanvas,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    undo,
    redo,
    canUndo,
    canRedo,
    addText,
    addImage,
    addRect,
    addCircle,
    addTriangle,
    deleteSelected,
    duplicateSelected,
    selectAll,
    deselectAll,
    clearCanvas,
    exportImage,
    getJSON,
    getThumbnail,
    setBackgroundColor: setCanvasBg,
    onObjectChange,
  } = useCanvas(ratio, snapToGuides);

  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>();
  const canvasInitRef = useRef(false);

  // Load story
  useEffect(() => {
    async function load() {
      if (isNew) {
        const s = await createEmptyStory("Untitled Story");
        router.replace(`/editor/${s.id}`);
        return;
      }
      const s = await getStoryById(storyId);
      if (s) {
        setStory(s);
        setCurrentPage(0);
      } else {
        toast.error("Story not found");
        router.push("/");
      }
      setIsLoading(false);
    }
    load();
  }, [storyId, isNew, router]);

  // Reset canvas init flag when page changes
  useEffect(() => {
    canvasInitRef.current = false;
  }, [currentPage]);

  // Load canvas JSON when page changes
  useEffect(() => {
    if (!fabricCanvas || !story || canvasInitRef.current) return;
    const json = story.pages[currentPage]?.canvasJSON;
    if (json) {
      fabricCanvas.loadFromJSON(json, () => {
        fabricCanvas.requestRenderAll();
      });
    }
    canvasInitRef.current = true;
  }, [fabricCanvas, story, currentPage]);

  const saveCurrentPage = useCallback(() => {
    if (!fabricCanvas || !story) return;
    const json = getJSON();
    const thumb = getThumbnail();
    const updatedPages = [...story.pages];
    updatedPages[currentPage] = {
      ...updatedPages[currentPage],
      canvasJSON: json,
      backgroundColor: fabricCanvas.backgroundColor as string,
    };
    const updated: Story = {
      ...story,
      pages: updatedPages,
      thumbnail: thumb || story.thumbnail,
      updatedAt: new Date().toISOString(),
    };
    saveStory(updated);
    setStory(updated);
    setSavedStatus("Saved");
    setTimeout(() => setSavedStatus(""), 2000);
  }, [fabricCanvas, story, currentPage, getJSON, getThumbnail]);

  const debouncedSave = useRef(debounce(() => saveCurrentPage(), 2000)).current;

  useEffect(() => {
    const cleanup = onObjectChange(() => {
      setSavedStatus("Saving...");
      debouncedSave();
    });
    return cleanup;
  }, [onObjectChange, debouncedSave]);

  // Autosave every 30s
  useEffect(() => {
    const interval = setInterval(() => saveCurrentPage(), 30000);
    return () => clearInterval(interval);
  }, [saveCurrentPage]);

  const handleNameChange = (name: string) => {
    if (!story) return;
    const updated = { ...story, name, updatedAt: new Date().toISOString() };
    setStory(updated);
    saveStory(updated);
  };

  const handlePageSelect = (index: number) => {
    saveCurrentPage();
    setCurrentPage(index);
  };

  const handleAddPage = () => {
    if (!story) return;
    if (story.pages.length >= 10) {
      toast.error("Maximum 10 pages allowed");
      return;
    }
    const newPage: Page = {
      id: nanoid(),
      canvasJSON: JSON.stringify({ version: "6.0.0", objects: [], background: "#0a0a0a" }),
      backgroundColor: "#0a0a0a",
      backgroundGradient: null,
      ratio: story.pages[0].ratio,
      width: story.pages[0].width,
      height: story.pages[0].height,
    };
    const updated = { ...story, pages: [...story.pages, newPage], updatedAt: new Date().toISOString() };
    setStory(updated);
    saveStory(updated);
    setCurrentPage(updated.pages.length - 1);
  };

  const handleDuplicatePage = (index: number) => {
    if (!story) return;
    if (story.pages.length >= 10) {
      toast.error("Maximum 10 pages allowed");
      return;
    }
    const page = story.pages[index];
    const newPage: Page = { ...page, id: nanoid() };
    const updated = {
      ...story,
      pages: [...story.pages.slice(0, index + 1), newPage, ...story.pages.slice(index + 1)],
      updatedAt: new Date().toISOString(),
    };
    setStory(updated);
    saveStory(updated);
  };

  const handleDeletePage = (index: number) => {
    if (!story) return;
    if (story.pages.length <= 1) {
      toast.error("Cannot delete the only page");
      return;
    }
    const updated = {
      ...story,
      pages: story.pages.filter((_, i) => i !== index),
      updatedAt: new Date().toISOString(),
    };
    setStory(updated);
    saveStory(updated);
    if (currentPage >= updated.pages.length) {
      setCurrentPage(updated.pages.length - 1);
    }
  };

  const handleToolClick = (tool: string) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
    if (!fabricCanvas) return;
    switch (tool) {
      case "text":
        addText("New Text");
        break;
      case "image":
        break;
      case "sticker":
        break;
      case "filter":
        break;
      case "adjust":
        break;
    }
  };

  const handleExport = () => {
    saveCurrentPage();
    setShowExport(true);
  };

  const exportPages = story?.pages.map((p, i) => ({
    id: p.id,
    image: exportImage("png", 2),
    width: p.width,
    height: p.height,
  })) ?? [];

  const handleAddImage = (src: string) => {
    addImage(src);
    setActiveTool(null);
  };

  const handleAddEmoji = (content: string) => {
    addText(content);
    setActiveTool(null);
  };

  const handleAddShape = (shape: string) => {
    if (shape === "rect") addRect();
    else if (shape === "circle") addCircle();
    else if (shape === "triangle") addTriangle();
    setActiveTool(null);
  };

  useKeyboardShortcuts(
    [
      { key: "z", ctrl: true, handler: () => undo() },
      { key: "z", ctrl: true, shift: true, handler: () => redo() },
      { key: "c", ctrl: true, handler: () => fabricCanvas?.getActiveObject()?.clone().then((clone) => { clone.set({ left: (clone.left ?? 0) + 20, top: (clone.top ?? 0) + 20 }); fabricCanvas?.add(clone); fabricCanvas?.requestRenderAll(); }) },
      { key: "v", ctrl: true, handler: () => {} },
      { key: "d", ctrl: true, handler: () => duplicateSelected() },
      { key: "Delete", handler: () => deleteSelected() },
      { key: "Backspace", handler: () => deleteSelected() },
      { key: "a", ctrl: true, handler: () => selectAll() },
      { key: "g", ctrl: true, handler: () => { const a = fabricCanvas?.getActiveObjects(); if (a && a.length > 1) { const g = new fabric.Group(a); fabricCanvas?.add(g); a.forEach((o) => fabricCanvas?.remove(o)); fabricCanvas?.setActiveObject(g); fabricCanvas?.requestRenderAll(); } } },
      { key: "Escape", handler: () => deselectAll() },
      { key: "t", handler: () => addText() },
      { key: "i", handler: () => setActiveTool("image") },
      { key: "s", ctrl: true, handler: () => { saveCurrentPage(); toast.success("Saved"); } },
      { key: "e", ctrl: true, handler: () => handleExport() },
      { key: "ArrowUp", handler: () => { const o = fabricCanvas?.getActiveObject(); if (o) { o.set("top", (o.top ?? 0) - 1); o.setCoords(); fabricCanvas?.requestRenderAll(); } } },
      { key: "ArrowDown", handler: () => { const o = fabricCanvas?.getActiveObject(); if (o) { o.set("top", (o.top ?? 0) + 1); o.setCoords(); fabricCanvas?.requestRenderAll(); } } },
      { key: "ArrowLeft", handler: () => { const o = fabricCanvas?.getActiveObject(); if (o) { o.set("left", (o.left ?? 0) - 1); o.setCoords(); fabricCanvas?.requestRenderAll(); } } },
      { key: "ArrowRight", handler: () => { const o = fabricCanvas?.getActiveObject(); if (o) { o.set("left", (o.left ?? 0) + 1); o.setCoords(); fabricCanvas?.requestRenderAll(); } } },
    ],
    !!fabricCanvas
  );

  if (isLoading || !story) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <TopBar
        storyName={story.name}
        onNameChange={handleNameChange}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onExport={handleExport}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        showGrid={showGrid}
        onToggleGrid={toggleGrid}
        showRulers={showRulers}
        onToggleRulers={toggleRulers}
        savedStatus={savedStatus}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border bg-surface hidden lg:block">
          <LayerPanel canvas={fabricCanvas} />
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative overflow-hidden">
            <Canvas
              canvasRef={canvasRef}
              containerRef={containerRef}
              isReady={isReady}
              zoom={zoom}
              showGrid={showGrid}
              showRulers={showRulers}
              ratio={ratio}
            />
          </div>

          <PageStrip
            pages={story.pages}
            currentIndex={currentPage}
            onSelect={handlePageSelect}
            onAdd={handleAddPage}
            onDuplicate={handleDuplicatePage}
            onDelete={handleDeletePage}
          />
        </main>

        <aside className="w-72 border-l border-border bg-surface hidden lg:block">
          <PropertiesPanel canvas={fabricCanvas} />
        </aside>
      </div>

      <CanvasToolbar activeTool={activeTool} onToolClick={handleToolClick} />

      <BottomSheet isOpen={!!activeTool} onClose={() => setActiveTool(null)} title={activeTool?.toUpperCase()}>
        {activeTool === "image" && <ImageTool onAddImage={handleAddImage} />}
        {activeTool === "text" && <TextTool onAddText={(t) => { addText(t); setActiveTool(null); }} />}
        {activeTool === "sticker" && <StickerTool onAddEmoji={handleAddEmoji} onAddShape={handleAddShape} />}
        {activeTool === "filter" && <FilterTool selectedFilter={"none"} onSelectFilter={() => {}} />}
        {activeTool === "adjust" && <AdjustTool values={{}} onChange={() => {}} />}
      </BottomSheet>

      <ExportPanel isOpen={showExport} onClose={() => setShowExport(false)} pages={exportPages} />
    </div>
  );
};
