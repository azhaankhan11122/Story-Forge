"use client";

import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, children, className }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const closeMenu = useCallback(() => {
    setPosition(null);
  }, []);

  useEffect(() => {
    if (!position) return;
    const handleClick = () => closeMenu();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [position, closeMenu]);

  return (
    <div className={cn("relative", className)} onContextMenu={handleContextMenu}>
      {children}
      {position && (
        <div
          className="fixed z-50 min-w-[160px] rounded-card bg-surface-2 border border-border shadow-xl py-1"
          style={{ top: position.y, left: position.x }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-surface transition-colors",
                item.disabled && "opacity-50 cursor-not-allowed",
                item.danger && "text-danger hover:bg-danger/10"
              )}
            >
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && <span className="text-xs text-text-secondary">{item.shortcut}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
