# Quitt

A minimal workday countdown app that visualizes your remaining work time as a grid of blocks — one block per minute.

## What it does

- Displays your full workday as a grid of 480+ blocks (60 per row = 1 hour per row)
- Blocks fill in as time passes, giving you a satisfying visual of progress
- Shows a countdown to lunch break (morning) or end of day (afternoon)
- Lunch break row is displayed separately with a distinct color
- Motivational messages change throughout the day
- Configurable schedule via settings panel (saved in localStorage)

## Default schedule

| Period    | Time          |
|-----------|---------------|
| Morning   | 09:00 - 13:00 |
| Lunch     | 13:00 - 14:00 |
| Afternoon | 14:00 - 18:00 |

## Tech stack

- React + TypeScript
- Vite
- Roboto Mono font
- No external UI libraries

## Getting started

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

Deploys to GitHub Pages via `gh-pages`.

## Live

[gerardbaholli.github.io/Quitt](https://gerardbaholli.github.io/Quitt/)
