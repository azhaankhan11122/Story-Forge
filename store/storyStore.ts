"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Story, StorySort } from "@/types/story";
import {
  getAllStories,
  saveStory,
  deleteStory,
  getStoryById,
  duplicateStory,
  toggleFavorite,
  searchStories,
} from "@/lib/storage/stories";

interface StoryState {
  stories: Story[];
  isLoading: boolean;
  searchQuery: string;
  sortBy: StorySort;
  selectedStoryId: string | null;
  lastSaved: number;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: StorySort) => void;
  loadStories: () => Promise<void>;
  addStory: (story: Story) => Promise<void>;
  updateStory: (story: Story) => Promise<void>;
  removeStory: (id: string) => Promise<void>;
  duplicateStory: (id: string) => Promise<void>;
  toggleStoryFavorite: (id: string) => Promise<void>;
  selectStory: (id: string | null) => void;
  setLastSaved: (timestamp: number) => void;
  getFilteredStories: () => Story[];
}

export const useStoryStore = create<StoryState>()(
  immer((set, get) => ({
    stories: [],
    isLoading: false,
    searchQuery: "",
    sortBy: "date",
    selectedStoryId: null,
    lastSaved: 0,

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),

    setSortBy: (sort) =>
      set((state) => {
        state.sortBy = sort;
      }),

    loadStories: async () => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        const stories = await getAllStories();
        set((state) => {
          state.stories = stories;
          state.isLoading = false;
        });
      } catch {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    addStory: async (story) => {
      await saveStory(story);
      const stories = await getAllStories();
      set((state) => {
        state.stories = stories;
      });
    },

    updateStory: async (story) => {
      await saveStory(story);
      const stories = await getAllStories();
      set((state) => {
        state.stories = stories;
        state.lastSaved = Date.now();
      });
    },

    removeStory: async (id) => {
      await deleteStory(id);
      const stories = await getAllStories();
      set((state) => {
        state.stories = stories;
      });
    },

    duplicateStory: async (id) => {
      await duplicateStory(id);
      const stories = await getAllStories();
      set((state) => {
        state.stories = stories;
      });
    },

    toggleStoryFavorite: async (id) => {
      await toggleFavorite(id);
      const stories = await getAllStories();
      set((state) => {
        state.stories = stories;
      });
    },

    selectStory: (id) =>
      set((state) => {
        state.selectedStoryId = id;
      }),

    setLastSaved: (timestamp) =>
      set((state) => {
        state.lastSaved = timestamp;
      }),

    getFilteredStories: () => {
      const { stories, searchQuery, sortBy } = get();
      let filtered = stories;

      if (searchQuery) {
        filtered = searchStories(searchQuery, stories);
      }

      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "date") {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "favorites") {
          if (a.isFavorite === b.isFavorite) {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          return a.isFavorite ? -1 : 1;
        }
        return 0;
      });

      return filtered;
    },
  }))
);
