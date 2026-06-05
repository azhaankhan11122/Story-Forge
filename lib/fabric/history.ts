import * as fabric from "fabric";

interface HistoryState {
  json: string;
  timestamp: number;
}

export class CanvasHistory {
  private stack: HistoryState[] = [];
  private index = -1;
  private maxSize = 50;
  private canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  save(): void {
    const json = JSON.stringify(this.canvas.toJSON());

    if (this.index < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.index + 1);
    }

    this.stack.push({ json, timestamp: Date.now() });

    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    } else {
      this.index++;
    }
  }

  undo(): void {
    if (this.index <= 0) return;
    this.index--;
    this.restore();
  }

  redo(): void {
    if (this.index >= this.stack.length - 1) return;
    this.index++;
    this.restore();
  }

  canUndo(): boolean {
    return this.index > 0;
  }

  canRedo(): boolean {
    return this.index < this.stack.length - 1;
  }

  private restore(): void {
    const state = this.stack[this.index];
    if (!state) return;
    this.canvas.loadFromJSON(state.json, () => {
      this.canvas.requestRenderAll();
    });
  }

  clear(): void {
    this.stack = [];
    this.index = -1;
  }
}
