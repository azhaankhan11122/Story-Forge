"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StoryCard } from "./StoryCard";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStories } from "@/hooks/useStories";
import { toast } from "sonner";
import { Search, Plus, ArrowUpDown, Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StorySort } from "@/types/story";

export const StoryGrid: React.FC = () => {
  const router = useRouter();
  const { stories, isLoading, refresh, createStory, removeStory, duplicate, toggleFav } = useStories();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<StorySort>("date");

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = stories
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "favorites") {
        if (a.isFavorite === b.isFavorite) return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        return a.isFavorite ? -1 : 1;
      }
      return 0;
    });

  const handleNewStory = useCallback(async () => {
    const story = await createStory("New Story");
    router.push(`/editor/${story.id}`);
  }, [createStory, router]);

  const handleDelete = useCallback(async (id: string) => {
    await removeStory(id);
    toast.success("Story deleted");
  }, [removeStory]);

  const handleDuplicate = useCallback(async (id: string) => {
    await duplicate(id);
    toast.success("Story duplicated");
  }, [duplicate]);

  const handleToggleFav = useCallback(async (id: string) => {
    await toggleFav(id);
  }, [toggleFav]);

  const handleDownload = useCallback((id: string) => {
    toast.info("Download started from editor");
    router.push(`/editor/${id}`);
  }, [router]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-[9/16] rounded-card bg-surface-2 animate-pulse" />
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-surface border border-border rounded-standard text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface border border-border rounded-standard overflow-hidden">
            {(["date", "name", "favorites"] as StorySort[]).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={cn(
                  "px-3 py-2 text-xs font-medium capitalize transition-colors",
                  sortBy === sort ? "bg-accent text-background" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {sort === "favorites" ? <Heart size={14} className="inline mr-1" /> : <ArrowUpDown size={14} className="inline mr-1" />}
                {sort}
              </button>
            ))}
          </div>
          <Button onClick={handleNewStory} size="sm">
            <Plus size={16} className="mr-1" />
            New Story
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">No stories match your search.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleFavorite={handleToggleFav}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
};
