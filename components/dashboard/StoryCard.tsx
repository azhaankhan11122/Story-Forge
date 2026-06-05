"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { formatRelativeDate } from "@/lib/utils/format";
import { Heart, Trash2, Copy, Download, Edit } from "lucide-react";
import { ContextMenu } from "@/components/ui/ContextMenu";
import type { Story } from "@/types/story";

interface StoryCardProps {
  story: Story;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (id: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onDownload,
}) => {
  const contextMenuItems = [
    {
      id: "edit",
      label: "Edit",
      icon: <Edit size={14} />,
      shortcut: "Enter",
      onClick: () => window.location.assign(`/editor/${story.id}`),
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: <Copy size={14} />,
      onClick: () => onDuplicate(story.id),
    },
    {
      id: "download",
      label: "Download",
      icon: <Download size={14} />,
      onClick: () => onDownload(story.id),
    },
    {
      id: "favorite",
      label: story.isFavorite ? "Remove Favorite" : "Add Favorite",
      icon: <Heart size={14} />,
      onClick: () => onToggleFavorite(story.id),
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: () => onDelete(story.id),
    },
  ];

  return (
    <ContextMenu items={contextMenuItems}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="group relative"
      >
        <Link href={`/editor/${story.id}`} className="block">
          <div className="relative aspect-[9/16] rounded-card overflow-hidden bg-surface-2 border border-border group-hover:border-accent/50 transition-colors">
            {story.thumbnail ? (
              <img
                src={story.thumbnail}
                alt={story.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-2">
                <span className="text-4xl text-text-secondary">📝</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-sm font-medium text-white truncate">{story.name}</div>
              <div className="text-xs text-white/70">{formatRelativeDate(story.updatedAt)}</div>
            </div>
            {story.isFavorite && (
              <div className="absolute top-2 right-2">
                <Heart size={16} className="text-accent fill-accent" />
              </div>
            )}
          </div>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-medium text-text-primary truncate">{story.name}</div>
          <div className="text-xs text-text-secondary">{formatRelativeDate(story.updatedAt)}</div>
        </div>
      </motion.div>
    </ContextMenu>
  );
};
