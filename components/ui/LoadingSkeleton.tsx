"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className, count = 1 }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-surface-2 rounded-standard"
          style={{ height: className?.includes("h-") ? undefined : "1rem" }}
        />
      ))}
    </div>
  );
};
