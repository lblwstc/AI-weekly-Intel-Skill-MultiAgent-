---
name: build-weekly-ai-intel
description: "Use when you need to create or rerun this repo's weekly OpenAI intelligence workflow: validate official OpenAI updates from the exact trailing 7-day window, write the business brief, build the portal, record the walkthrough, and optionally add AI-generated narration."
---

# Build Weekly AI Intel

This skill packages the repo's multi-agent workflow for turning recent official OpenAI updates into a business-facing weekly intelligence product. Use it when the user wants to rerun the full pipeline, refresh the past 7 days of OpenAI updates, rebuild the portal, record a new demo, or regenerate the optional narrated version.

## Workflow

1. Use the current system date and define the exact trailing 7-day window with absolute dates.
2. Keep the main thread in orchestrator mode. Use the project-scoped multi-agent setup in `.codex/config.toml` and the role configs in `.codex/agents/`.
3. Stabilize the research outputs first: `data/ai_updates.json` and `data/source_log.md`. Prefer official OpenAI sources, remove duplicates, and exclude policy-only or out-of-window items.
4. Only after `data/` is stable, update `content/weekly_ai_brief.md` and `content/newsletter_copy.json`. Keep facts, analytical inference, and recommendations clearly separated.
5. Build or refresh the app in `webapp/` so it reads the generated local files instead of placeholder content.
6. Record the demo from the real app with `automation/run-walkthrough.mjs`, exporting `demo/ai_weekly_brief_demo.mp4`.
7. If the user asks for narration, preserve the silent original, generate voice assets under `output/speech/`, and mux a separate `demo/ai_weekly_brief_demo_with_voiceover.mp4`.
8. Finish with QA: the dataset, memo, app, video, and README must agree.

## Guardrails

- Do not let multiple agents edit the same files at the same time.
- Do not fabricate updates, dates, quotes, screenshots, or product outcomes.
- Use official OpenAI sources first, then only add other primary sources when necessary.
- Treat `.codex/config.toml` and `prompts/weekly_ai_intel_multi_agent.md` as the baseline orchestration contract.
- Prefer `automation/run-walkthrough.mjs` over older recording variants.
- If the user wants to version the whole workspace, remove `webapp/.git` before initializing a root repository.

## References

- Load `references/workspace-map.md` for the file map, output contract, and rerun commands.
