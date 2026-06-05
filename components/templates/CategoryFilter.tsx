"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { templateCategories } from "@/data/categories";
import type { TemplateCategory } from "@/types/template";

interface CategoryFilterProps {
  active: TemplateCategory;
  onChange: (category: TemplateCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ active, onChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {templateCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id as TemplateCategory)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
            active === cat.id
              ? "bg-accent text-background border-accent"
              : "bg-surface text-text-secondary border-border hover:text-text-primary hover:border-text-secondary"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
