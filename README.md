# Cartpanda Funnel Builder

Visual-only funnel builder built for the Cartpanda practical test. It supports drag-and-drop node creation, directed edges, basic validation rules, local persistence, and JSON import/export.

## Setup

```bash
npm install
npm run dev
```

## Core Decisions

- **React + Vite + TypeScript** for fast dev feedback and typed safety.
- **React Flow** for graph rendering, panning, and draggable nodes.
- **Zustand** for concise state management.
- **Zod** for runtime validation of localStorage and imported JSON.
- **Plain CSS** for predictable styling without extra tooling.

## Tradeoffs & Next Improvements

- **Skipped** zoom, minimap, and undo/redo to keep the MVP focused. Next step would add zoom + undo with a small history buffer.
- **Limited** node editing (title/button text). A future pass would add editable fields and inline validation.
- **Validation** is shown as warnings/errors but does not block non-critical rules. Could add an explicit “Publish check” later.

## Accessibility Notes

- Palette items and action buttons are keyboard focusable with visible focus rings.
- Form controls include ARIA labels where needed.
- Validation uses text labels and badges (not color-only).
- Empty state and warnings are readable with adequate contrast.

## How It Works

- Nodes and edges live in a single Zustand store.
- State persists to `localStorage` (debounced).
- Import/export flows are validated with Zod and give friendly errors.
