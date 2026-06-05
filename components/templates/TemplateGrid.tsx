"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TemplateCard } from "./TemplateCard";
import { CategoryFilter } from "./CategoryFilter";
import { Input } from "@/components/ui/Input";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { getAllTemplates, getTemplatesByCategory, searchTemplates } from "@/lib/storage/templates";
import { createEmptyStory } from "@/lib/storage/stories";
import { toast } from "sonner";
import type { Template, TemplateCategory } from "@/types/template";
import { Search } from "lucide-react";

export const TemplateGrid: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<TemplateCategory>("all");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        let all: Template[];
        if (search.trim()) {
          all = await searchTemplates(search);
        } else if (category !== "all") {
          all = await getTemplatesByCategory(category);
        } else {
          all = await getAllTemplates();
        }
        setTemplates(all);
      } catch {
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [category, search]);

  const handleUse = async (template: Template) => {
    try {
      const story = await createEmptyStory(template.name, template.ratio);
      toast.success("Story created from template");
      router.push(`/editor/${story.id}`);
    } catch {
      toast.error("Failed to create story");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CategoryFilter active={category} onChange={setCategory} />
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-surface border border-border rounded-standard text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[9/16] rounded-card bg-surface-2 animate-pulse" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20 text-text-secondary">No templates found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} onUse={handleUse} />
          ))}
        </div>
      )}
    </div>
  );
};
