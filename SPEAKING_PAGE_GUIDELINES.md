# Speaking Page Guidelines

## Purpose

Use one standard layout and interaction pattern for speaking pages across the project.
This keeps future speaking activities visually consistent, mobile-efficient, and easier to maintain.

Speaking pages must also follow the broader shared rules in [PAGE_DESIGN_GUIDELINES.md](PAGE_DESIGN_GUIDELINES.md).

## Official Standard

The official reference for speaking pages is the `c15` speaking PRO format.

Canonical reference pages:

- `c15/grammar1-speaking-pro.html`
- `c15/grammar2-speaking-pro.html`

Canonical shared implementation:

- `shared/c15-speaking-pro.js`
- `shared/c15-speaking-pro.css`

When a new speaking page is created, treat these files as the baseline unless a different format is explicitly requested.

## Required Layout Rules

- Use the compact top bar pattern already adopted in the project.
- Do not place a large hero or explanation card above the main speaking activity.
- Start the learner flow as close to the activity card as possible.
- Show the scene title, but omit extra gray scene-hint text unless the page specifically needs it.
- Keep the first mobile viewport focused on the task itself.

On first automatic scroll, a phone-sized viewport should show:

- the situation question
- the model answer
- the speaking action area, including the record button

## Required Interaction Rules

- Follow the same high-level flow used by the `c15` speaking PRO pages:
  1. listen
  2. record-ready
  3. recording
  4. result
  5. summary
- Prioritize speech-recognition evaluation over recorded-audio playback.
- Do not open `getUserMedia`/`MediaRecorder` before `SpeechRecognition` when automatic evaluation is available; mobile browsers can fail to deliver recognition results if another recorder holds the microphone.
- Recorded-audio replay is optional. If it conflicts with automatic evaluation, omit replay and let Web Speech use the microphone directly.
- Use visual guidance only for learner focus.
- Do not add a text-based "current step guide" card unless explicitly requested.
- Use highlight, pulse, wave, and auto-scroll cues to guide attention.
- Auto-scroll should fit the current task region as a group, not just align one single element.

## Required Content Placement Rules

- Keep the question and model answer in a compact stacked layout near the top of the activity card.
- Place listening controls before the recording area.
- Keep speaking tips collapsed by default with a `details/summary` pattern.
- Place speaking tips below the core action area so they do not consume first-view space.
- Keep post-speaking score feedback compact and summary-first.

## Reuse Rules

- Prefer extending the shared `c15` speaking PRO assets instead of creating a new one-off speaking-page framework.
- If a new speaking page needs different content, swap the content config first before changing structure.
- If the standard itself changes, update this guide and the shared `c15` speaking PRO files together.

## First Reference Set

The first official standard set is:

- `c15/grammar1-speaking-pro.html`
- `c15/grammar2-speaking-pro.html`
- `shared/c15-speaking-pro.js`
- `shared/c15-speaking-pro.css`
