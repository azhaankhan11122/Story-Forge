"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus, FileText } from "lucide-react";

export const EmptyState: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-6">
        <FileText size={32} className="text-text-secondary" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">No stories yet</h3>
      <p className="text-text-secondary max-w-sm mb-6">
        Create your first story to get started. Choose from templates or start from scratch.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => router.push("/templates")} variant="secondary">
          Browse Templates
        </Button>
        <Button onClick={() => router.push("/editor/new")}>
          <Plus size={16} className="mr-2" />
          New Story
        </Button>
      </div>
    </div>
  );
};
