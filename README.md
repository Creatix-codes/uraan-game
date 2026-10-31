# Uraan-e-Pakistan

A complete, browser-playable Flappy Bird–inspired adventure through eight Pakistani destinations, painted in a contemporary truck-art style. Guide Uraan the parrot from the Badshahi Mosque to Nanga Parbat, collect golden stars and fill a postcard album.

## Features

- **Eight original destinations** — Lahore, Karachi, Mohenjo-Daro, Islamabad, Swat, Hunza, Skardu and Fairy Meadows, each with its own palette, parallax landscape and landmark art.
- **Hand-built canvas world** — delta-time flight physics, environment-themed obstacles, animated stars, particles, screen shake and a smooth parallax camera.
- **Animated parrot** — SVG mascot on the home screen and a fully canvas-drawn parrot in flight, with wing flaps, blinking, tilt and feather accents.
- **Forgiving flight** — generous obstacle gaps, three hearts, collision bounce, invulnerability frames and short routes.
- **Progression** — stars, best scores, 24 total star ratings, postcard collection, automatic level unlocking and private `localStorage` persistence.
- **First-flight tutorial**, pause panel, restart, victory celebration and defeat recovery.
- **Original audio** — a lightweight Web Audio courtyard melody and synthesized sound effects, unlocked only after the first tap or key press.
- **Responsive portrait layout** — a framed 9:16 device on desktop with a painted backdrop; edge-to-edge play with safe-area support on phones.
- **No external art or audio assets** — every illustration, pattern and sound is generated in the project.

## Tech stack

- React 19 + TypeScript
- Vite 6
- Canvas 2D for gameplay
- Web Audio API for music and SFX
- Local SVG / CSS artwork
- Local fonts via Fontsource: Baloo 2, Nunito and Noto Nastaliq Urdu

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

### Type checking

```bash
npm run typecheck
```

## Controls

| Action | Input |
| --- | --- |
| Flap | Click / tap anywhere, `Space` or `↑` |
| Pause | `Esc` or the pause button |
| Resume | `Esc` or the resume button |
| Navigate | On-screen painted buttons |

## Project structure

```
src/
  audio/        Web Audio music and sound-effect manager
  components/   Shared UI, SVG illustrations and the device shell
  data/         Level definitions and localStorage progress
  game/         Canvas engine, physics, parallax scenes, parrot and effects
  screens/      Home, map, gameplay, victory and settings
  styles/       Layered CSS design system and responsive rules
  types.ts      Shared domain types
public/
  favicon.svg   Original truck-art parrot mark
```

Progress is stored under `uraan-e-pakistan::progress::v1`. Resetting the journey clears stars, scores and postcards while keeping sound preferences.

---

Made for the love of Pakistan.
