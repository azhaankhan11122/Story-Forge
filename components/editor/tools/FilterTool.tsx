"use client";

import React from "react";
import { FilterPicker } from "@/components/editor/panels/FilterPicker";

interface FilterToolProps {
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
}

export const FilterTool: React.FC<FilterToolProps> = ({ selectedFilter, onSelectFilter }) => {
  return (
    <div className="space-y-3">
      <p className="text-xs text-text-secondary">Select an image on the canvas to apply filters.</p>
      <FilterPicker selected={selectedFilter} onSelect={onSelectFilter} />
    </div>
  );
};
