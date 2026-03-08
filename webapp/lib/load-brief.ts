import fs from "node:fs/promises";
import path from "node:path";

export type UpdateItem = {
  id: string;
  title: string;
  published_at: string;
  source_name: string;
  source_type: string;
  source_url: string;
  supporting_urls: string[];
  category: string;
  factual_summary: string;
  key_technical_capability: string;
  practical_example: string;
  why_this_matters: string;
  business_value_for_office_workers: string;
  confidence: string;
};

type UpdateBundle = {
  generated_at: string;
  window: {
    timezone: string;
    start_date: string;
    end_date: string;
    selection_rule: string;
  };
  items: UpdateItem[];
};

type NewsletterCopy = {
  meta: {
    title: string;
    subtitle: string;
    window_label: string;
    generated_label: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subhead: string;
  };
  summary_cards: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  highlight_cards: Array<{
    title: string;
    blurb: string;
  }>;
  categories: string[];
  use_cases: Array<{
    title: string;
    source: string;
    detail: string;
  }>;
  methodology: {
    headline: string;
    body: string;
  };
  cta: {
    headline: string;
    body: string;
  };
};

type RawNewsletterCopy = Partial<NewsletterCopy> & {
  hero?: {
    kicker?: string;
    eyebrow?: string;
    headline?: string;
    title?: string;
    subhead?: string;
    summary?: string;
  };
  highlights?: Array<{
    title: string;
    blurb: string;
  }>;
  methodology?: {
    headline?: string;
    body?: string;
    summary?: string;
  };
  section_intros?: {
    updates?: string;
    implications?: string;
    use_cases?: string;
  };
  what_office_workers_should_care_about?: string[];
};

export type MemoBlock =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "subheading"; content: string };

export type MemoSection = {
  slug: string;
  title: string;
  blocks: MemoBlock[];
};

export type BriefContent = {
  updates: UpdateBundle;
  copy: NewsletterCopy;
  memoSections: MemoSection[];
};

function normalizeCopy(
  rawCopy: RawNewsletterCopy,
  updateCount: number,
  categories: string[],
): NewsletterCopy {
  if (rawCopy.meta && rawCopy.hero && rawCopy.summary_cards) {
    return {
      ...rawCopy,
      categories: rawCopy.categories ?? categories,
    } as NewsletterCopy;
  }

  return {
    meta: {
      title: "AI Weekly Intel",
      subtitle:
        rawCopy.section_intros?.implications ??
        rawCopy.hero?.summary ??
        "OpenAI updates with immediate business impact.",
      window_label: "March 2-8, 2026",
      generated_label: "Generated March 8, 2026",
    },
    hero: {
      kicker: rawCopy.hero?.eyebrow ?? rawCopy.hero?.kicker ?? "Internal intelligence portal",
      headline:
        rawCopy.hero?.title ??
        rawCopy.hero?.headline ??
        "OpenAI spent this week making AI more useful inside ordinary office work.",
      subhead:
        rawCopy.hero?.summary ??
        rawCopy.section_intros?.updates ??
        "A compact weekly view of the official updates that matter for business teams.",
    },
    summary_cards: [
      {
        label: "Validated updates",
        value: String(updateCount),
        detail: "Official OpenAI items retained after applying the trailing 7-day window.",
      },
      {
        label: "Active categories",
        value: String(categories.length),
        detail: "Model, productivity, and developer-platform changes were all in scope this week.",
      },
      {
        label: "Core theme",
        value: "Workflow adoption",
        detail:
          rawCopy.section_intros?.implications ??
          "The strongest signal is AI moving into the software and device surfaces people already use.",
      },
    ],
    highlight_cards:
      rawCopy.highlights?.slice(0, 4) ?? [
        {
          title: "Workflow adoption",
          blurb: "OpenAI is shortening the path from model capability to daily business use.",
        },
      ],
    categories,
    use_cases: [
      {
        title: "Executive memo drafting",
        source: "GPT-5.4",
        detail:
          "Use the premium model tier for board notes, strategic options, and customer-facing summaries where narrative quality matters more than latency.",
      },
      {
        title: "Workbook review and financial analysis",
        source: "ChatGPT for Excel + financial data",
        detail:
          "Shorten the loop between spreadsheet review and decision support by moving from copy-paste prompts toward source-adjacent analysis.",
      },
      {
        title: "Windows-based Codex pilot",
        source: "Codex app on Windows",
        detail:
          "Run an internal AI coding or automation pilot on the device footprint most enterprise teams already have.",
      },
      {
        title: "Long-form internal drafting at speed",
        source: "GPT-5.3 Instant update",
        detail:
          "Use the larger output ceiling for policy summaries, operating notes, and structured internal documents.",
      },
    ],
    methodology: {
      headline:
        rawCopy.methodology?.headline ?? "Official-source, trailing-7-day filter",
      body:
        rawCopy.methodology?.body ??
        rawCopy.methodology?.summary ??
        "Only official OpenAI sources published or materially updated inside the current March 2-8, 2026 window were retained.",
    },
    cta: {
      headline: "What company AI champions should do next",
      body:
        rawCopy.what_office_workers_should_care_about?.join(" ") ??
        rawCopy.section_intros?.use_cases ??
        "Pilot one spreadsheet workflow, one longer-form drafting workflow, and one Codex workflow on Windows to turn this week's releases into operational learning.",
    },
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseMemoSections(markdown: string): MemoSection[] {
  const chunks = markdown
    .split(/^## /m)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return chunks
    .filter((chunk) => !chunk.startsWith("Weekly AI Brief"))
    .map((chunk) => {
      const lines = chunk.split("\n");
      const title = lines.shift() ?? "";
      const blocks: MemoBlock[] = [];
      let paragraphBuffer: string[] = [];
      let listBuffer: string[] = [];

      const flushParagraph = () => {
        if (paragraphBuffer.length > 0) {
          blocks.push({
            type: "paragraph",
            content: cleanInlineMarkdown(paragraphBuffer.join(" ")),
          });
          paragraphBuffer = [];
        }
      };

      const flushList = () => {
        if (listBuffer.length > 0) {
          blocks.push({
            type: "list",
            items: [...listBuffer],
          });
          listBuffer = [];
        }
      };

      for (const rawLine of lines) {
        const line = rawLine.trim();

        if (!line) {
          flushParagraph();
          flushList();
          continue;
        }

        if (line.startsWith("### ")) {
          flushParagraph();
          flushList();
          blocks.push({
            type: "subheading",
            content: cleanInlineMarkdown(line.slice(4)),
          });
          continue;
        }

        if (line.startsWith("- ")) {
          flushParagraph();
          listBuffer.push(cleanInlineMarkdown(line.slice(2)));
          continue;
        }

        if (/^\d+\.\s/.test(line)) {
          flushParagraph();
          listBuffer.push(cleanInlineMarkdown(line.replace(/^\d+\.\s/, "")));
          continue;
        }

        paragraphBuffer.push(line);
      }

      flushParagraph();
      flushList();

      return {
        slug: slugify(title),
        title: cleanInlineMarkdown(title),
        blocks,
      };
    });
}

export async function loadBriefContent(): Promise<BriefContent> {
  const projectRoot = path.resolve(process.cwd(), "..");
  const [updatesText, copyText, memoText] = await Promise.all([
    fs.readFile(path.join(projectRoot, "data", "ai_updates.json"), "utf8"),
    fs.readFile(
      path.join(projectRoot, "content", "newsletter_copy.json"),
      "utf8",
    ),
    fs.readFile(
      path.join(projectRoot, "content", "weekly_ai_brief.md"),
      "utf8",
    ),
  ]);

  const updates = JSON.parse(updatesText) as UpdateBundle;
  const rawCopy = JSON.parse(copyText) as RawNewsletterCopy;
  const categories = Array.from(new Set(updates.items.map((item) => item.category)));
  const copy = normalizeCopy(rawCopy, updates.items.length, categories);

  return {
    updates,
    copy,
    memoSections: parseMemoSections(memoText),
  };
}
