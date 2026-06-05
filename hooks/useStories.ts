"use client";

import { useEffect, useState, useCallback } from "react";
import type { Story } from "@/types/story";
import {
  getAllStories,
  saveStory,
  deleteStory,
  duplicateStory,
  toggleFavorite,
  searchStories,
  createEmptyStory,
} from "@/lib/storage/stories";

export interface UseStoriesReturn {
  stories: Story[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  createStory: (name?: string) => Promise<Story>;
  updateStory: (story: Story) => Promise<void>;
  removeStory: (id: string) => Promise<void>;
  duplicate: (id: string) => Promise<void>;
  toggleFav: (id: string) => Promise<void>;
  search: (query: string) => Promise<Story[]>;
}

export function useStories(): UseStoriesReturn {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await getAllStories();
      setStories(all);
    } catch {
      setStories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createStory = useCallback(async (name?: string): Promise<Story> => {
    const story = await createEmptyStory(name);
    await refresh();
    return story;
  }, [refresh]);

  const updateStory = useCallback(async (story: Story) => {
    await saveStory(story);
    await refresh();
  }, [refresh]);

  const removeStory = useCallback(async (id: string) => {
    await deleteStory(id);
    await refresh();
  }, [refresh]);

  const duplicate = useCallback(async (id: string) => {
    await duplicateStory(id);
    await refresh();
  }, [refresh]);

  const toggleFav = useCallback(async (id: string) => {
    await toggleFavorite(id);
    await refresh();
  }, [refresh]);

  const search = useCallback(async (query: string): Promise<Story[]> => {
    return searchStories(query, stories);
  }, [stories]);

  return {
    stories,
    isLoading,
    refresh,
    createStory,
    updateStory,
    removeStory,
    duplicate,
    toggleFav,
    search,
  };
}
