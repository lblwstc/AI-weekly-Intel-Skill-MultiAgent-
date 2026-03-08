# Workspace Map

## Core orchestration files

- `.codex/config.toml`
- `.codex/agents/researcher.toml`
- `.codex/agents/analyst.toml`
- `.codex/agents/builder.toml`
- `.codex/agents/demo_producer.toml`
- `prompts/weekly_ai_intel_multi_agent.md`

## Generated outputs

- `data/ai_updates.json`
- `data/source_log.md`
- `content/weekly_ai_brief.md`
- `content/newsletter_copy.json`
- `demo/ai_weekly_brief_demo.mp4`
- `demo/ai_weekly_brief_demo_with_voiceover.mp4`

## App and automation files

- `webapp/app/page.tsx`
- `webapp/components/brief-dashboard.tsx`
- `webapp/lib/load-brief.ts`
- `automation/run-walkthrough.mjs`

## Voiceover files

- `output/speech/ai_weekly_brief_voiceover.txt`
- `output/speech/ai_weekly_brief_voiceover_instructions.txt`
- `output/speech/ai_weekly_brief_voiceover.wav`

## Rerun commands

Build and start the app:

```bash
cd webapp
npm install
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Record the silent walkthrough:

```bash
cd automation
node run-walkthrough.mjs
```

If narration is requested and `OPENAI_API_KEY` is available locally, generate the voice track with the bundled speech CLI:

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
python3 "$CODEX_HOME/skills/speech/scripts/text_to_speech.py" speak \
  --input-file output/speech/ai_weekly_brief_voiceover.txt \
  --instructions-file output/speech/ai_weekly_brief_voiceover_instructions.txt \
  --voice cedar \
  --response-format wav \
  --out output/speech/ai_weekly_brief_voiceover.wav \
  --force
```

Mux the narration onto the silent demo while preserving the original:

```bash
ffmpeg -y \
  -i demo/ai_weekly_brief_demo.mp4 \
  -i output/speech/ai_weekly_brief_voiceover.wav \
  -filter:a "apad=pad_dur=1" \
  -map 0:v:0 \
  -map 1:a:0 \
  -c:v copy \
  -c:a aac \
  -b:a 192k \
  -t 60.84 \
  -movflags +faststart \
  demo/ai_weekly_brief_demo_with_voiceover.mp4
```
