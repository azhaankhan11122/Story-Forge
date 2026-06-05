"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { ExportFormat, ExportQuality } from "@/types/editor";
import { useExport } from "@/hooks/useExport";
import { X, Copy, FileDown, Image } from "lucide-react";

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pages: { id: string; image: string; width: number; height: number }[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ isOpen, onClose, pages }) => {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState<ExportQuality>(2);
  const [scope, setScope] = useState<"current" | "all">("all");
  const { isExporting, progress, exportPages, exportSingle, copyImage } = useExport();

  const selectedPages = scope === "current" && pages.length > 0 ? [pages[0]] : pages;

  const handleExport = async () => {
    await exportPages(selectedPages, format, quality);
  };

  const handleCopy = async () => {
    if (selectedPages.length > 0) {
      await copyImage(selectedPages[0].image);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 z-50 bg-surface border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Export</h2>
              <button onClick={onClose} className="p-1 rounded hover:bg-surface-2 text-text-secondary">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <label className="text-xs text-text-secondary mb-2 block">Format</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["png", "jpg", "pdf", "svg"] as ExportFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={cn(
                        "px-3 py-2 rounded border text-sm font-medium uppercase transition-colors",
                        format === f ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-text-secondary mb-2 block">Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 2, 3] as ExportQuality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={cn(
                        "px-3 py-2 rounded border text-sm font-medium transition-colors",
                        quality === q ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {q === 1 ? "Standard" : q === 2 ? "High" : "Ultra HD"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-text-secondary mb-2 block">Pages</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setScope("current")}
                    className={cn(
                      "px-3 py-2 rounded border text-sm font-medium transition-colors",
                      scope === "current" ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary"
                    )}
                  >
                    Current Page
                  </button>
                  <button
                    onClick={() => setScope("all")}
                    className={cn(
                      "px-3 py-2 rounded border text-sm font-medium transition-colors",
                      scope === "all" ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary"
                    )}
                  >
                    All Pages ({pages.length})
                  </button>
                </div>
              </div>

              {progress && (
                <div className="space-y-2">
                  <div className="text-xs text-text-secondary">{progress.status}</div>
                  <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border space-y-2">
              <Button className="w-full" isLoading={isExporting} onClick={handleExport}>
                <FileDown size={16} className="mr-1" /> Export
              </Button>
              <Button variant="secondary" className="w-full" onClick={handleCopy}>
                <Copy size={16} className="mr-1" /> Copy to Clipboard
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
