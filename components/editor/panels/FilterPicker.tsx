"use client";

import React from "react";
import { filterOptions } from "@/data/filters";
import { cn } from "@/lib/utils/cn";

interface FilterPickerProps {
  selected: string;
  onSelect: (filterId: string) => void;
}

export const FilterPicker: React.FC<FilterPickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {filterOptions.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onSelect(filter.id)}
          className={cn(
            "flex flex-col items-center gap-1.5 p-2 rounded-card border transition-colors",
            selected === filter.id
              ? "border-accent bg-accent/10"
              : "border-border bg-surface-2 hover:border-text-secondary"
          )}
        >
          <div
            className="w-8 h-8 rounded-full border border-border"
            style={{ backgroundColor: filter.color }}
          />
          <span className="text-xs text-text-secondary">{filter.name}</span>
        </button>
      ))}
    </div>
  );
};
