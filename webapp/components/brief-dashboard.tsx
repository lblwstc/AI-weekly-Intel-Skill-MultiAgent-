"use client";

import { startTransition, useDeferredValue, useState } from "react";

import type { MemoBlock, MemoSection, UpdateItem } from "@/lib/load-brief";

type DashboardProps = {
  generatedAt: string;
  windowLabel: string;
  updates: UpdateItem[];
  categories: string[];
  copy: {
    meta: {
      title: string;
      subtitle: string;
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
  memoSections: MemoSection[];
};

const sectionTabs = [
  { id: "overview", label: "Overview" },
  { id: "updates", label: "Weekly Updates" },
  { id: "implications", label: "Business Implications" },
  { id: "use-cases", label: "Use Cases" },
  { id: "about", label: "About" },
] as const;

function formatCategory(value: string) {
  return value
    .split("-")
    .join(" ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function renderBlock(block: MemoBlock, key: string) {
  if (block.type === "subheading") {
    return (
      <h4 key={key} className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
        {block.content}
      </h4>
    );
  }

  if (block.type === "list") {
    return (
      <ul key={key} className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={key} className="text-sm leading-7 text-[var(--ink-soft)]">
      {block.content}
    </p>
  );
}

function MemoSectionCard({ section }: { section: MemoSection }) {
  return (
    <article className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(7,21,39,0.1)] backdrop-blur">
      <h3 className="font-serif text-[1.7rem] leading-tight text-[var(--ink)]">
        {section.title}
      </h3>
      <div className="mt-5 space-y-4">
        {section.blocks.map((block, index) =>
          renderBlock(block, `${section.slug}-${index}`),
        )}
      </div>
    </article>
  );
}

export function BriefDashboard({
  generatedAt,
  windowLabel,
  updates,
  categories,
  copy,
  memoSections,
}: DashboardProps) {
  const [activeSection, setActiveSection] =
    useState<(typeof sectionTabs)[number]["id"]>("overview");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string>(updates[0]?.id ?? "");
  const deferredQuery = useDeferredValue(query);

  const filteredUpdates = updates.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const haystack = [
      item.title,
      item.factual_summary,
      item.key_technical_capability,
      item.business_value_for_office_workers,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = haystack.includes(deferredQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const officeWorkerItems = updates.slice(0, 3);
  const implicationSections = memoSections.filter((section) =>
    [
      "why-it-matters-for-ordinary-office-workers",
      "practical-workflows-unlocked",
      "recommended-actions-for-a-company-ai-champion",
      "strategic-outlook",
    ].includes(section.slug),
  );
  const aboutSections = memoSections.filter((section) =>
    [
      "what-changed-this-week",
      "risks-caveats-limits",
    ].includes(section.slug),
  );

  const activeUpdate =
    filteredUpdates.find((item) => item.id === expandedId) ?? filteredUpdates[0];

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-4 sm:px-6 lg:px-8">
        <header className="fade-up sticky top-4 z-30 rounded-[28px] border border-white/70 bg-[rgba(251,247,239,0.94)] px-5 py-4 shadow-[0_20px_60px_rgba(7,21,39,0.1)] backdrop-blur sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-[var(--muted-strong)]">
                {copy.hero.kicker}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl leading-none sm:text-[2.9rem]">
                  {copy.meta.title}
                </h1>
                <span className="rounded-full border border-[var(--line)] bg-white/88 px-3 py-1 text-[0.74rem] uppercase tracking-[0.24em] text-[var(--ink-soft)]">
                  {windowLabel}
                </span>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-[var(--ink-soft)] sm:text-base">
                {copy.meta.subtitle}
              </p>
            </div>
            <div className="grid gap-2 text-[0.78rem] text-[var(--muted-strong)] sm:grid-cols-2">
              <div className="rounded-[20px] border border-[var(--line)] bg-white/88 px-4 py-3">
                <div className="uppercase tracking-[0.24em]">Generated</div>
                <div className="mt-1 font-medium text-[var(--ink)]">
                  {copy.meta.generated_label}
                </div>
              </div>
              <div className="rounded-[20px] border border-[var(--line)] bg-white/88 px-4 py-3">
                <div className="uppercase tracking-[0.24em]">Runtime Stamp</div>
                <div className="mt-1 font-medium text-[var(--ink)]">
                  {generatedAt}
                </div>
              </div>
            </div>
          </div>
          <nav className="mt-4 flex flex-wrap gap-2">
            {sectionTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  startTransition(() => {
                    setActiveSection(tab.id);
                  })
                }
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeSection === tab.id
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "border border-[var(--line)] bg-white/88 text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="grid gap-8">
          {activeSection === "overview" ? (
            <>
              <section className="fade-up grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
                <article className="overflow-hidden rounded-[38px] border border-white/50 bg-[linear-gradient(135deg,rgba(7,21,39,1),rgba(14,49,82,0.98)_56%,rgba(200,154,61,0.92))] p-6 text-[var(--paper-soft)] shadow-[0_30px_90px_rgba(7,21,39,0.18)] sm:p-8">
                  <div className="max-w-3xl">
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[rgba(250,246,238,0.74)]">
                      Weekly signal
                    </div>
                    <h2 className="mt-4 font-serif text-[2.5rem] leading-[0.96] sm:text-[4rem]">
                      {copy.hero.headline}
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(250,246,238,0.9)] sm:text-lg">
                      {copy.hero.subhead}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      {copy.highlight_cards.map((card) => (
                        <div
                          key={card.title}
                          className="rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm text-[rgba(250,246,238,0.92)]"
                        >
                          {card.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                <div className="grid gap-4">
                  {copy.summary_cards.map((card) => (
                    <article
                      key={card.label}
                      className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_20px_60px_rgba(7,21,39,0.1)] backdrop-blur"
                    >
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                        {card.label}
                      </div>
                      <div className="mt-3 font-serif text-4xl leading-none text-[var(--ink)]">
                        {card.value}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                        {card.detail}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="fade-up grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <article className="rounded-[32px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(7,21,39,0.1)] backdrop-blur">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                    What office workers should care about
                  </div>
                  <div className="mt-6 space-y-5">
                    {officeWorkerItems.map((item) => (
                      <div key={item.id} className="border-b border-[var(--line)] pb-5 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-serif text-[1.45rem] leading-tight text-[var(--ink)]">
                            {item.title}
                          </h3>
                          <span className="rounded-full bg-[var(--paper-strong)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                            {item.published_at}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                          {item.business_value_for_office_workers}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[32px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(7,21,39,0.1)] backdrop-blur">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                    Signal board
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {copy.highlight_cards.map((card) => (
                      <div
                        key={card.title}
                        className="rounded-[24px] border border-[var(--line)] bg-[var(--paper-soft)] p-5"
                      >
                        <h3 className="font-serif text-[1.35rem] leading-tight">
                          {card.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                          {card.blurb}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </>
          ) : null}

          {activeSection === "updates" ? (
            <section className="fade-up grid gap-6 xl:grid-cols-[0.74fr_1.26fr]">
              <aside className="rounded-[32px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(7,21,39,0.1)] backdrop-blur">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted-strong)]">
                  Search and filter
                </div>
                <div className="mt-4">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search model, workflow, or business value"
                    className="w-full rounded-[20px] border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3 text-sm outline-none transition focus:border-[var(--ink)]"
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startTransition(() => {
                        setActiveCategory("all");
                      })
                    }
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      activeCategory === "all"
                        ? "bg-[var(--ink)] text-[var(--paper)]"
                        : "border border-[var(--line)] bg-white text-[var(--ink-soft)]"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        startTransition(() => {
                          setActiveCategory(category);
                        })
                      }
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        activeCategory === category
                          ? "bg-[var(--ink)] text-[var(--paper)]"
                          : "border border-[var(--line)] bg-white text-[var(--ink-soft)]"
                      }`}
                    >
                      {formatCategory(category)}
                    </button>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  {filteredUpdates.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExpandedId(item.id)}
                      className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                        activeUpdate?.id === item.id
                          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                          : "border-[var(--line)] bg-[var(--paper-soft)] text-[var(--ink)] hover:border-[var(--ink)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[0.72rem] uppercase tracking-[0.24em] opacity-70">
                          {item.published_at}
                        </span>
                        <span className="rounded-full border border-current/15 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.24em]">
                          {formatCategory(item.category)}
                        </span>
                      </div>
                      <div className="mt-3 font-serif text-[1.25rem] leading-tight">
                        {item.title}
                      </div>
                    </button>
                  ))}
                  {filteredUpdates.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-[var(--line)] px-4 py-5 text-sm text-[var(--muted-strong)]">
                      No updates matched this query.
                    </div>
                  ) : null}
                </div>
              </aside>

              <article className="rounded-[32px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(7,21,39,0.1)] backdrop-blur">
                {activeUpdate ? (
                  <>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[var(--line)] bg-[var(--paper-soft)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                        {activeUpdate.published_at}
                      </span>
                      <span className="rounded-full border border-[var(--line)] bg-[var(--paper-soft)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                        {activeUpdate.source_name}
                      </span>
                      <span className="rounded-full border border-[var(--line)] bg-[var(--paper-soft)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                        Confidence {activeUpdate.confidence}
                      </span>
                    </div>
                    <h2 className="mt-5 font-serif text-[2.2rem] leading-[1.02] text-[var(--ink)] sm:text-[3rem]">
                      {activeUpdate.title}
                    </h2>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--ink-soft)]">
                      {activeUpdate.factual_summary}
                    </p>

                    <div className="mt-8 grid gap-4 lg:grid-cols-3">
                      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                          Technical capability
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                          {activeUpdate.key_technical_capability}
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                          Practical example
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                          {activeUpdate.practical_example}
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                          Office-worker value
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                          {activeUpdate.business_value_for_office_workers}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(244,239,229,0.85),rgba(255,255,255,0.95))] p-6">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                        Why it matters right now
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                        {activeUpdate.why_this_matters}
                      </p>
                      <a
                        href={activeUpdate.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-[var(--paper)] transition hover:opacity-90"
                      >
                        Open source
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[var(--line)] px-4 py-5 text-sm text-[var(--muted-strong)]">
                    No active update selected.
                  </div>
                )}
              </article>
            </section>
          ) : null}

          {activeSection === "implications" ? (
            <section className="fade-up grid gap-6 xl:grid-cols-2">
              {implicationSections.map((section) => (
                <MemoSectionCard key={section.slug} section={section} />
              ))}
              <article className="rounded-[28px] border border-white/50 bg-[var(--ink)] p-6 text-[var(--paper-soft)] shadow-[0_24px_70px_rgba(7,21,39,0.16)]">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[rgba(247,243,235,0.68)]">
                  Recommended next move
                </div>
                <h3 className="mt-5 font-serif text-[2rem] leading-tight">
                  {copy.cta.headline}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[rgba(247,243,235,0.82)]">
                  {copy.cta.body}
                </p>
              </article>
            </section>
          ) : null}

          {activeSection === "use-cases" ? (
            <section className="fade-up grid gap-6 md:grid-cols-2">
              {copy.use_cases.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(7,21,39,0.1)] backdrop-blur"
                >
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                    {item.source}
                  </div>
                  <h3 className="mt-4 font-serif text-[1.8rem] leading-tight text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                    {item.detail}
                  </p>
                </article>
              ))}
            </section>
          ) : null}

          {activeSection === "about" ? (
            <section className="fade-up grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[28px] border border-white/60 bg-white/88 p-6 shadow-[0_24px_70px_rgba(7,21,39,0.1)] backdrop-blur">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted-strong)]">
                  Methodology
                </div>
                <h3 className="mt-4 font-serif text-[1.9rem] leading-tight">
                  {copy.methodology.headline}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                  {copy.methodology.body}
                </p>
                <div className="mt-6 rounded-[22px] border border-[var(--line)] bg-[var(--paper-soft)] p-4 text-sm text-[var(--ink-soft)]">
                  <div className="font-medium text-[var(--ink)]">
                    Portfolio snapshot
                  </div>
                  <div className="mt-3 space-y-2">
                    <div>{updates.length} validated updates</div>
                    <div>{categories.length} distinct categories</div>
                    <div>Official OpenAI sources only</div>
                  </div>
                </div>
              </article>
              <div className="grid gap-6">
                {aboutSections.map((section) => (
                  <MemoSectionCard key={section.slug} section={section} />
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
