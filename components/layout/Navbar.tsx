"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Layers, Settings, Type, Layout, Pen } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Layout },
  { href: "/templates", label: "Templates", icon: Layers },
  { href: "/fonts", label: "Fonts", icon: Type },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-accent font-bold text-lg tracking-tight">
            <Pen size={20} />
            <span>StoryForge</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-standard text-sm font-medium transition-colors",
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
