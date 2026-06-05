import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ExportFormat, ExportQuality } from "@/types/editor";

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: "image/png" | "image/jpeg" = "image/png",
  quality = 1
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      format,
      quality
    );
  });
}

export async function downloadImage(
  dataUrl: string,
  filename: string
): Promise<void> {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function generatePDF(
  pages: string[],
  width: number,
  height: number,
  quality: ExportQuality
): Promise<Blob> {
  const unit = "px";
  const pdf = new jsPDF({
    unit,
    format: [width * quality, height * quality],
    orientation: width > height ? "landscape" : "portrait",
  });

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage([width * quality, height * quality], width > height ? "landscape" : "portrait");
    const img = pages[i];
    pdf.addImage(img, "PNG", 0, 0, width * quality, height * quality);
  }

  return pdf.output("blob");
}

export async function downloadZip(
  files: { name: string; dataUrl: string }[]
): Promise<void> {
  const zip = new JSZip();
  for (const file of files) {
    const base64 = file.dataUrl.split(",")[1];
    zip.file(file.name, base64, { base64: true });
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "storyforge-export.zip");
}

export function copyToClipboard(dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}
