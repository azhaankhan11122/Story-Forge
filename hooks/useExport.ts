"use client";

import { useCallback, useState } from "react";
import type { ExportFormat, ExportQuality } from "@/types/editor";
import { downloadImage, generatePDF, downloadZip, copyToClipboard } from "@/lib/fabric/export";
import { jsPDF } from "jspdf";

export interface ExportProgress {
  current: number;
  total: number;
  status: string;
}

export interface UseExportReturn {
  isExporting: boolean;
  progress: ExportProgress | null;
  exportPages: (
    pages: { id: string; image: string; width: number; height: number }[],
    format: ExportFormat,
    quality: ExportQuality
  ) => Promise<void>;
  exportSingle: (dataUrl: string, filename: string) => void;
  copyImage: (dataUrl: string) => Promise<void>;
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);

  const exportPages = useCallback(
    async (
      pages: { id: string; image: string; width: number; height: number }[],
      format: ExportFormat,
      quality: ExportQuality
    ): Promise<void> => {
      setIsExporting(true);
      setProgress({ current: 0, total: pages.length, status: "Starting export..." });

      try {
        if (format === "pdf") {
          const images = pages.map((p) => p.image);
          const width = pages[0]?.width ?? 1080;
          const height = pages[0]?.height ?? 1920;
          const blob = await generatePDF(images, width, height, quality);
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `storyforge-export.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setProgress({ current: pages.length, total: pages.length, status: "Done" });
        } else if (pages.length === 1) {
          const ext = format === "jpg" ? "jpg" : "png";
          const filename = `storyforge-page.${ext}`;
          downloadImage(pages[0].image, filename);
          setProgress({ current: 1, total: 1, status: "Done" });
        } else {
          const files = pages.map((p, i) => ({
            name: `page-${i + 1}.${format === "jpg" ? "jpg" : "png"}`,
            dataUrl: p.image,
          }));
          await downloadZip(files);
          setProgress({ current: pages.length, total: pages.length, status: "Done" });
        }
      } catch (err) {
        console.error("Export failed:", err);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const exportSingle = useCallback((dataUrl: string, filename: string) => {
    downloadImage(dataUrl, filename);
  }, []);

  const copyImage = useCallback(async (dataUrl: string) => {
    await copyToClipboard(dataUrl);
  }, []);

  return { isExporting, progress, exportPages, exportSingle, copyImage };
}
