# EthicSim

A functional, responsive software engineering ethics learning prototype built with **Vue 3, Vite and Tailwind CSS 4**. Inspired by the [EthicSim Lovable draft](https://ethicsim.lovable.app/) and Group 10's project brief for 953420 Ethics & Professionalism.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. No API keys, accounts, database, or environment variables are required.

```sh
npm test
npm run build
npm run preview
```

Production files are written to `dist/`. They can be hosted on any static server. Relative asset URLs and hash navigation support hosting in a subdirectory without server rewrite rules.

## Experience

**Learning lab → animated briefing → interactive decisions → immediate feedback → ethics radar & reflection**

All four modules are playable, with two decisions each:

| Module | Learning focus | Interaction |
| --- | --- | --- |
| The Privacy Shield | Containment, minimization, scoped consent | Dialogue + keyboard-accessible scope slider |
| Bug, Bounty & Liability | Minimal evidence, coordinated disclosure | Dialogue |
| Unmasking AI | Subgroup evaluation, explanations, appeal | Dialogue |
| Code Wars & Intellectual Property | Permission, licensing, attribution | Dialogue |

Each decision explains consequences, ethical reasoning and trade-offs, with a link to the relevant [ACM Code of Ethics](https://www.acm.org/code-of-ethics) principle. All organizations, roles and scenarios are fictional. The content is an educational simulation, not legal guidance.

## State and assessment

- Completed answers and a reflection are stored under `ethicsim.progress.v1` in localStorage. There is no analytics or backend transmission.
- In-progress scenarios restart when left or refreshed; completed modules persist. Storage errors display a session-only notice.
- Each option carries an illustrative score in `src/data/modules.js`. The module score is the rounded mean of its two decisions. Unplayed modules remain **unassessed**, not zero. Their radar points sit at the center and an accessible text description explains this.
- Archetypes use the mean of assessed module scores: 80+ Thoughtful Guardian, 50–79 Pragmatic Navigator, below 50 Momentum Builder. A partial profile is explicitly labeled.
- XP is 100 per completed module. Replaying replaces the prior answers and does not accumulate extra XP.
- Scores are an inspectable teaching rubric, not a validated assessment, personality test, or ACM endorsement. Feedback matters more than the number.
- Reset requires an in-app confirmation and clears this prototype's progress and reflection only.

## Source structure

```text
src/
  App.vue                       App shell, hash navigation, persistence
  main.js                       Vue entry
  style.css                     Tailwind and responsive visual system
  data/modules.js               All fictional scenarios and feedback
  lib/progress.js               Validation, scores and archetypes
  components/
    AppIcon.vue                 Lucide icon mapping
    Dashboard.vue               Progress and module selection
    ScenarioPlayer.vue          Briefing, dialogue, slider and feedback
    RadarChart.vue              SVG radar with accessible description
    ResultsView.vue             Profile, review, reflection and reset
tests/progress.test.js           Scoring, replay and storage validation
```

Native buttons, visible keyboard focus, a skip link, labeled range input, live feedback, an accessible modal and reduced-motion support are included. A small SVG/CSS hero illustration keeps the interface independent of remote assets and fonts.

## Scope

This version implements the requested dialogue and scale mechanics. It does not include item matching, authentication, cross-device syncing, a backend, or a formally validated ethics rubric. The original PDF is not included in the public repository.

## Validation

- `npm test`: covers unassessed domains, contrasting decision profiles, replay replacement, storage validation and completeness of every feedback path.
- `npm run build`: verifies Vue compilation and production assets.
- Browser walkthrough: all four modules, slider keyboard input, immediate feedback, completion, saved reflection after refresh, replay, reset and responsive layout.

The included GitHub Actions workflow runs the tests and production build on pushes and pull requests.
