import { promises as fs } from "fs";
import { join } from "path";
import type { Story } from "@/types/story";

const DATA_DIR = join(process.cwd(), "data");
const STORIES_FILE = join(DATA_DIR, "stories.json");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

async function readStories(): Promise<Story[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(STORIES_FILE, "utf-8");
    return JSON.parse(data) as Story[];
  } catch {
    return [];
  }
}

async function writeStories(stories: Story[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(STORIES_FILE, JSON.stringify(stories, null, 2), "utf-8");
}

export async function serverGetAllStories(): Promise<Story[]> {
  return readStories();
}

export async function serverGetStoryById(id: string): Promise<Story | null> {
  const stories = await readStories();
  return stories.find((s) => s.id === id) ?? null;
}

export async function serverSaveStory(story: Story): Promise<void> {
  const stories = await readStories();
  const index = stories.findIndex((s) => s.id === story.id);
  if (index >= 0) {
    stories[index] = story;
  } else {
    stories.push(story);
  }
  await writeStories(stories);
}

export async function serverDeleteStory(id: string): Promise<void> {
  const stories = await readStories();
  await writeStories(stories.filter((s) => s.id !== id));
}
