import { BriefDashboard } from "@/components/brief-dashboard";
import { loadBriefContent } from "@/lib/load-brief";

export default async function Home() {
  const brief = await loadBriefContent();
  return (
    <BriefDashboard
      generatedAt={brief.updates.generated_at}
      windowLabel={brief.copy.meta.window_label}
      updates={brief.updates.items}
      categories={brief.copy.categories}
      copy={brief.copy}
      memoSections={brief.memoSections}
    />
  );
}
