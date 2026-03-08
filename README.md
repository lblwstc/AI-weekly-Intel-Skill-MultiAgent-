# AI Weekly Intel

This project is a demo-ready multi-agent Codex workflow that turns recent official OpenAI updates into a business-facing intelligence brief, a polished internal-style web app, and a recorded walkthrough video.

## Objective

The goal is to show an end-to-end agentic workflow that can:

1. research official OpenAI updates inside a strict trailing 7-day window
2. synthesize those updates into a business-oriented weekly brief
3. present the result as an internal intelligence portal
4. record a realistic product walkthrough of the final app

For this run, the active coverage window is **March 2, 2026 through March 8, 2026 JST**.

## Deliverables

- `data/ai_updates.json`
- `data/source_log.md`
- `content/weekly_ai_brief.md`
- `content/newsletter_copy.json`
- `webapp/`
- `automation/run-walkthrough.mjs`
- `demo/ai_weekly_brief_demo.mp4`
- `demo/ai_weekly_brief_demo_with_voiceover.mp4`
- `output/speech/`
- `.codex/skills/build-weekly-ai-intel/`

## Multi-Agent Workflow

The project-scoped Codex setup lives in `.codex/`.

This repo also includes a project-local skill at `.codex/skills/build-weekly-ai-intel/` so the weekly intelligence workflow can be invoked without relying on a global skill install.

### Main orchestrator

The main agent is responsible for:

- sequencing the work
- keeping source discipline high
- integrating outputs across stages
- running final QA

### Researcher role

Configured in `.codex/agents/researcher.toml`.

Responsibilities:

- search official OpenAI sources
- verify exact dates
- exclude out-of-window or low-signal items
- write `data/ai_updates.json`
- write `data/source_log.md`

### Analyst role

Configured in `.codex/agents/analyst.toml`.

Responsibilities:

- turn the validated dataset into a business memo
- separate facts, inference, and recommendations
- produce UI-ready copy for the app

### Builder role

Configured in `.codex/agents/builder.toml`.

Responsibilities:

- build the Next.js app
- wire it to the generated local data
- validate the final product presentation

### Demo producer role

Configured in `.codex/agents/demo_producer.toml`.

Responsibilities:

- automate the browser walkthrough
- capture the live app
- convert the final recording into MP4

## How Data Was Collected

The research pass used only official OpenAI sources inside the defined date window.

Primary sources retained:

- OpenAI product announcements
- OpenAI Help Center release notes
- OpenAI model release notes

Selection rules:

- include only items published or materially updated between March 2 and March 8, 2026
- include only product or capability updates with clear business relevance
- exclude policy-only items, supporting documents, and duplicates unless they materially changed product availability

The detailed inclusion and exclusion reasoning is documented in `data/source_log.md`.

## How Analysis Was Produced

The validated update set was translated into:

- `content/weekly_ai_brief.md` for leadership-style reading
- `content/newsletter_copy.json` for UI surfaces, labels, and highlight blocks

The memo explicitly separates:

- facts
- analytical inference
- recommendations

## How the App Was Built

The app lives in `webapp/` and uses:

- Next.js
- TypeScript
- Tailwind CSS
- Playwright for browser automation

The UI is intentionally styled like an internal intelligence portal rather than a generic landing page. It reads from the generated project files rather than hardcoded placeholder data.

Core views inside the app:

- Overview
- Weekly Updates
- Business Implications
- Use Cases
- About

## How the Demo Video Was Recorded

The supported walkthrough script is `automation/run-walkthrough.mjs`.

Recording flow:

1. start the built Next.js app locally
2. open Chromium through Playwright
3. navigate through the live app
4. pause intentionally on the key views
5. record the browser session to WebM
6. convert the result to `demo/ai_weekly_brief_demo.mp4` using `ffmpeg`

Current demo output:

- `demo/ai_weekly_brief_demo.mp4`
- `demo/ai_weekly_brief_demo_with_voiceover.mp4`
- duration: about 61 seconds
- formats: silent MP4 and AI-narrated MP4

## How to Rerun the Pipeline

### 1. Rebuild the intelligence artifacts

Reuse the project prompt in:

- `prompts/weekly_ai_intel_multi_agent.md`

Then let Codex rerun the research, synthesis, build, and recording flow.

### 2. Rebuild the app manually

From `webapp/`:

```bash
npm install
npm run build
```

### 3. Run the production app

From `webapp/`:

```bash
npm run start -- --port 3000
```

### 4. Re-record the demo

From the project root, with the app already running:

```bash
node automation/run-walkthrough.mjs
```

The script overwrites:

- `demo/ai_weekly_brief_demo.mp4`

The AI voiceover artifacts are stored in:

- `output/speech/ai_weekly_brief_voiceover.txt`
- `output/speech/ai_weekly_brief_voiceover_instructions.txt`
- `output/speech/ai_weekly_brief_voiceover.wav`

## Notes

- The original silent video remains in place, and a separate AI-narrated version is available at `demo/ai_weekly_brief_demo_with_voiceover.mp4`.
- The repo still includes the project-scoped multi-agent Codex configuration so the same workflow can be rerun or adapted for a future weekly cycle.
