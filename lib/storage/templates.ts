import type { Template } from "@/types/template";
import { defaultTemplates } from "@/data/templates";

let templateStore: ReturnType<typeof import("localforage").default["createInstance"]> | null = null;

async function getTemplateStore() {
  if (!templateStore) {
    const { default: localforage } = await import("localforage");
    templateStore = localforage.createInstance({
      name: "storyforge",
      storeName: "templates",
    });
  }
  return templateStore;
}

export async function getAllTemplates(): Promise<Template[]> {
  const store = await getTemplateStore();
  const templates: Template[] = [];
  await store.iterate<Template, void>((value) => {
    templates.push(value);
  });
  if (templates.length === 0) {
    await seedTemplates();
    return [...defaultTemplates];
  }
  return templates;
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const store = await getTemplateStore();
  return (await store.getItem<Template>(id)) ?? null;
}

export async function getTemplatesByCategory(category: string): Promise<Template[]> {
  const all = await getAllTemplates();
  if (category === "all") return all;
  return all.filter((t) => t.category.toLowerCase() === category.toLowerCase());
}

export async function searchTemplates(query: string): Promise<Template[]> {
  const all = await getAllTemplates();
  const q = query.toLowerCase().trim();
  if (!q) return all;
  return all.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export async function seedTemplates(): Promise<void> {
  const store = await getTemplateStore();
  for (const template of defaultTemplates) {
    await store.setItem(template.id, template);
  }
}
