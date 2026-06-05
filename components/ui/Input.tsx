"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 px-3 bg-surface border border-border rounded-standard text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
