"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Layout, Layers, Type, Settings, Plus } from "lucide-react";

const sidebarItems = [
  { href: "/", label: "Dashboard", icon: Layout },
  { href: "/templates", label: "Templates", icon: Layers },
  { href: "/fonts", label: "Fonts", icon: Type },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-border bg-surface hidden lg:flex flex-col">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 text-accent font-bold text-lg tracking-tight">
          <Plus size={20} />
          <span>StoryForge</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-standard text-sm font-medium transition-colors",
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
