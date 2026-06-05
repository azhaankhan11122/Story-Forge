import type { Story } from "@/types/story";
import { nanoid } from "nanoid";

let storiesStore: ReturnType<typeof import("localforage").default["createInstance"]> | null = null;

async function getStoriesStore() {
  if (!storiesStore) {
    const { default: localforage } = await import("localforage");
    storiesStore = localforage.createInstance({
      name: "storyforge",
      storeName: "stories",
    });
  }
  return storiesStore;
}

export async function getAllStories(): Promise<Story[]> {
  const store = await getStoriesStore();
  const stories: Story[] = [];
  await store.iterate<Story, void>((value) => {
    stories.push(value);
  });
  return stories.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getStoryById(id: string): Promise<Story | null> {
  const store = await getStoriesStore();
  return (await store.getItem<Story>(id)) ?? null;
}

export async function saveStory(story: Story): Promise<void> {
  const store = await getStoriesStore();
  await store.setItem(story.id, story);
}

export async function deleteStory(id: string): Promise<void> {
  const store = await getStoriesStore();
  await store.removeItem(id);
}

export async function duplicateStory(id: string): Promise<Story | null> {
  const original = await getStoryById(id);
  if (!original) return null;
  const copy: Story = {
    ...original,
    id: nanoid(),
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: original.pages.map((page) => ({
      ...page,
      id: nanoid(),
    })),
  };
  await saveStory(copy);
  return copy;
}

export async function toggleFavorite(id: string): Promise<void> {
  const story = await getStoryById(id);
  if (!story) return;
  story.isFavorite = !story.isFavorite;
  story.updatedAt = new Date().toISOString();
  await saveStory(story);
}

export async function searchStories(query: string, stories?: Story[]): Promise<Story[]> {
  const target = stories ?? (await getAllStories());
  const q = query.toLowerCase().trim();
  if (!q) return target;
  return target.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function createEmptyStory(
  name = "Untitled Story",
  ratio: "9:16" | "1:1" | "4:5" | "16:9" | "4:3" = "9:16"
): Promise<Story> {
  const width = ratio === "9:16" ? 1080 : ratio === "1:1" ? 1080 : ratio === "4:5" ? 1080 : ratio === "16:9" ? 1920 : 1080;
  const height = ratio === "9:16" ? 1920 : ratio === "1:1" ? 1080 : ratio === "4:5" ? 1350 : ratio === "16:9" ? 1080 : 810;

  const story: Story = {
    id: nanoid(),
    name,
    thumbnail: "",
    pages: [
      {
        id: nanoid(),
        canvasJSON: JSON.stringify({ version: "6.0.0", objects: [], background: "#0a0a0a" }),
        backgroundColor: "#0a0a0a",
        backgroundGradient: null,
        ratio,
        width,
        height,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: false,
    tags: [],
  };
  await saveStory(story);
  return story;
}

export async function exportStoriesBackup(): Promise<string> {
  const stories = await getAllStories();
  return JSON.stringify(stories, null, 2);
}

export async function importStoriesBackup(json: string): Promise<number> {
  const stories: Story[] = JSON.parse(json);
  let count = 0;
  for (const story of stories) {
    await saveStory(story);
    count++;
  }
  return count;
}

export async function clearAllStories(): Promise<void> {
  const store = await getStoriesStore();
  await store.clear();
}
