# Multi-Agent AI Weekly Intel Demo

Use the current workspace as the project root. Do not create an extra nested repository folder. Use the actual system date at runtime and write absolute dates everywhere.

## Objective

Create an enterprise-credible demo that shows Codex acting as a coordinated multi-agent system:

1. Collect the most important OpenAI updates published or updated within the exact trailing 7-day window.
2. Turn those validated updates into a business-facing weekly brief for non-technical office workers and AI adoption stakeholders.
3. Build a polished internal-intelligence web app that presents the brief as a product, not a static page.
4. Record a silent walkthrough video of the real app.

## Role Usage

Keep the main agent focused on orchestration, integration, and final QA.

Use the configured roles with clear ownership:

- `researcher`: source discovery, validation, date checking, deduplication, structured data extraction, and source logging.
- `analyst`: executive summary, business implications, office-worker value, recommendations, and UI-ready copy.
- `builder`: application implementation, data wiring, visual polish, and local verification.
- `demo_producer`: browser automation, walkthrough design, recording scripts, and final video capture.

Use built-in `monitor` only for long-running polling tasks such as waiting on a dev server or recording workflow.

## Execution Rules

- Prefer parallel work only when tasks are truly independent.
- Do not let two agents edit the same files at the same time.
- Ask each sub-agent to return a concise summary and the files it changed.
- Use real current information only.
- Do not fabricate updates, quotes, dates, screenshots, or outcomes.
- If an item cannot be verified to fall within the exact trailing 7-day window, exclude it.
- Prefer official OpenAI sources first, then other primary sources only when they add necessary evidence.
- Treat the main thread as the final integrator of all outputs.

## Delivery Plan

### Step 1: Research and structure the update dataset

Create:

- `data/ai_updates.json`
- `data/source_log.md`

The dataset should include, for each retained item:

- title
- exact publish/update date
- source name
- source URL
- category
- concise factual summary
- key technical capability
- practical example
- why it matters
- likely business value for ordinary office workers

The source log must explain:

- which sources were used
- why each included item made the cut
- which candidate items were excluded as duplicates, outside-window items, or low-signal

### Step 2: Synthesize the weekly brief

Create:

- `content/weekly_ai_brief.md`
- `content/newsletter_copy.json`

The memo must include:

- Executive summary
- What changed this week
- Why it matters for ordinary office workers
- Practical workflows unlocked
- Risks, caveats, and limits
- Recommended actions for a company AI champion
- Strategic outlook

Keep the tone professional, crisp, insightful, and not hypey. Clearly distinguish:

- factual statements
- analytical inference
- recommendations

`content/newsletter_copy.json` should contain shorter UI-ready copy blocks for headers, cards, highlights, blurbs, and section intros.

### Step 3: Build the web app

Build the app under `webapp/`.

Preferred stack:

- Next.js
- TypeScript
- Tailwind CSS

Required product qualities:

- feels like an internal enterprise intelligence product, not a static landing page
- consumes the generated local data/content files instead of hardcoded placeholder content wherever practical
- supports clickable update cards
- supports expandable details
- supports category filtering
- supports search
- supports a timeline or recency view
- highlights what office workers should care about
- works well on desktop and mobile
- uses subtle, intentional motion
- looks polished enough for a customer demo

Core views:

- Home or overview
- Weekly updates
- Business implications
- Use cases
- About or methodology

### Step 4: Record the walkthrough video

Create:

- `automation/` scripts used for the demo
- `demo/ai_weekly_brief_demo.mp4`

The video should:

- launch the real local app
- show the app loading
- navigate between the major sections
- open a few update cards
- show the implications and use-case views
- end on a polished summary view

Video target:

- MP4
- roughly 60 to 90 seconds
- 1080p if practical
- silent in v1
- smooth, intentional pacing

## Quality Gates

Before finishing, verify all of the following:

- every included update is inside the exact trailing 7-day window
- duplicates are removed
- the memo matches the dataset
- the app matches the memo and dataset
- the recorded video matches the final app
- no placeholder text remains
- the root `README.md` explains the project objective, the multi-agent workflow, the role of each sub-agent, how data was collected, how analysis was produced, how the app was built, how the demo video was recorded, and how to rerun the pipeline

## Staging Guidance

Use this execution order unless a better dependency-aware variation is clearly justified:

1. Scaffold the repo structure.
2. Run research first and stabilize `data/`.
3. Start analysis only after the dataset is stable.
4. Start the app build only after data and content are stable.
5. Start recording only after the app has been verified locally.
6. Finish with integration, cleanup, and README updates in the main thread.
