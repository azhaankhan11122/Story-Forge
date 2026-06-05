"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { Template } from "@/types/template";

interface TemplateCardProps {
  template: Template;
  onUse: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <div className="relative aspect-[9/16] rounded-card overflow-hidden bg-surface-2 border border-border group-hover:border-accent/50 transition-colors cursor-pointer" onClick={() => onUse(template)}>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="w-full h-full bg-surface-2 rounded border border-dashed border-border flex items-center justify-center">
            <span className="text-text-secondary text-sm text-center">{template.name}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-4 py-2 bg-accent text-background rounded-full text-sm font-medium hover:bg-accent-hover transition-colors">
            Use Template
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm font-medium text-text-primary truncate">{template.name}</div>
        <Badge variant="outline" className="capitalize">{template.category}</Badge>
      </div>
    </motion.div>
  );
};
