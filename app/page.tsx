import { StoryGrid } from "@/components/dashboard/StoryGrid";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function HomePage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-text-secondary">Manage and create your stories</p>
        </div>

        <Suspense fallback={<LoadingSkeleton className="h-24 mb-8" />}>
          <StatsBar />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton className="h-96" />}>
          <StoryGrid />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
