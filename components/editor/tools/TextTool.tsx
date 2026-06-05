"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Type } from "lucide-react";

interface TextToolProps {
  onAddText: (text: string) => void;
}

export const TextTool: React.FC<TextToolProps> = ({ onAddText }) => {
  const [text, setText] = useState("");

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Text Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          rows={3}
          className="w-full px-3 py-2 bg-surface border border-border rounded text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent resize-none"
        />
      </div>
      <Button className="w-full" onClick={() => { onAddText(text || "Double click to edit"); setText(""); }}>
        <Type size={14} className="mr-1" /> Add Text
      </Button>
    </div>
  );
};
