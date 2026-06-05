import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function TemplatesPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Templates</h1>
          <p className="text-text-secondary">Browse 50+ curated templates to start your story</p>
        </div>
        <TemplateGrid />
      </div>
    </PageWrapper>
  );
}
