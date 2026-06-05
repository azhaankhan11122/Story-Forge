import * as fabric from "fabric";

export const filterPresets = [
  { id: "none", name: "None", filters: [] },
  { id: "chrome", name: "Chrome", filters: [{ type: "Saturation", saturation: 0.2 }, { type: "Contrast", contrast: 0.15 }] },
  { id: "fade", name: "Fade", filters: [{ type: "Brightness", brightness: 0.1 }, { type: "Contrast", contrast: -0.1 }] },
  { id: "cool", name: "Cool", filters: [{ type: "HueRotation", rotation: -0.1 }] },
  { id: "warm", name: "Warm", filters: [{ type: "HueRotation", rotation: 0.1 }] },
  { id: "noir", name: "Noir", filters: [{ type: "Grayscale" }, { type: "Contrast", contrast: 0.2 }] },
  { id: "vivid", name: "Vivid", filters: [{ type: "Saturation", saturation: 0.4 }, { type: "Contrast", contrast: 0.1 }] },
  { id: "matte", name: "Matte", filters: [{ type: "Brightness", brightness: 0.05 }, { type: "Contrast", contrast: -0.15 }] },
  { id: "crossprocess", name: "Cross Process", filters: [{ type: "HueRotation", rotation: 0.15 }, { type: "Saturation", saturation: -0.1 }] },
  { id: "lomo", name: "Lomo", filters: [{ type: "Saturation", saturation: 0.3 }, { type: "Contrast", contrast: 0.2 }] },
  { id: "polaroid", name: "Polaroid", filters: [{ type: "Brightness", brightness: 0.15 }, { type: "Contrast", contrast: -0.1 }] },
  { id: "vintage", name: "Vintage", filters: [{ type: "Sepia" }, { type: "Contrast", contrast: -0.1 }] },
];

export function applyFilterPreset(
  canvas: fabric.Canvas,
  obj: fabric.Image,
  presetId: string
): void {
  const preset = filterPresets.find((p) => p.id === presetId);
  if (!preset) return;

  obj.filters = [];
  for (const f of preset.filters) {
    switch (f.type) {
      case "Saturation":
        obj.filters.push(new fabric.filters.Saturation({ saturation: f.saturation }));
        break;
      case "Contrast":
        obj.filters.push(new fabric.filters.Contrast({ contrast: f.contrast }));
        break;
      case "Brightness":
        obj.filters.push(new fabric.filters.Brightness({ brightness: f.brightness }));
        break;
      case "HueRotation":
        obj.filters.push(new fabric.filters.HueRotation({ rotation: f.rotation }));
        break;
      case "Grayscale":
        obj.filters.push(new fabric.filters.Grayscale());
        break;
      case "Sepia":
        obj.filters.push(new fabric.filters.Sepia());
        break;
      default:
        break;
    }
  }

  obj.applyFilters();
  canvas.requestRenderAll();
}

export function clearFilters(canvas: fabric.Canvas, obj: fabric.Image): void {
  obj.filters = [];
  obj.applyFilters();
  canvas.requestRenderAll();
}

export function applyBrightness(obj: fabric.Image, value: number): void {
  obj.filters = obj.filters.filter((f) => !(f instanceof fabric.filters.Brightness));
  if (value !== 0) {
    obj.filters.push(new fabric.filters.Brightness({ brightness: value / 100 }));
  }
  obj.applyFilters();
}

export function applyContrast(obj: fabric.Image, value: number): void {
  obj.filters = obj.filters.filter((f) => !(f instanceof fabric.filters.Contrast));
  if (value !== 0) {
    obj.filters.push(new fabric.filters.Contrast({ contrast: value / 100 }));
  }
  obj.applyFilters();
}

export function applySaturation(obj: fabric.Image, value: number): void {
  obj.filters = obj.filters.filter((f) => !(f instanceof fabric.filters.Saturation));
  if (value !== 0) {
    obj.filters.push(new fabric.filters.Saturation({ saturation: value / 100 }));
  }
  obj.applyFilters();
}

export function applyBlur(obj: fabric.Image, value: number): void {
  obj.filters = obj.filters.filter((f) => !(f instanceof fabric.filters.Blur));
  if (value > 0) {
    obj.filters.push(new fabric.filters.Blur({ blur: value / 10 }));
  }
  obj.applyFilters();
}
