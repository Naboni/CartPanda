# Cartpanda Funnel Builder

A visual drag-and-drop funnel builder for creating sales funnels with connected pages.

## Quick Start

```bash
npm install
npm run dev      # Start dev server at localhost:5173
npm run test:run # Run unit tests
```

## Features

**Canvas**
- Drag-and-drop nodes from palette to canvas
- Pan to navigate infinite canvas
- Connect nodes with directed arrows
- Inline edit node titles (click edit icon)
- Delete nodes and edges (click trash icon)

**Node Types**
- Sales Page, Order Page, Upsell, Downsell, Thank You
- Each type has distinct color coding
- Auto-incrementing labels (Upsell 1, Upsell 2...)
- Thank You pages cannot have outgoing connections

**History & Persistence**
- Undo/Redo support for all actions
- Auto-saves to localStorage
- Export/Import JSON files
- Reset to clear everything

**Validation**
- Real-time validation panel
- Errors: Thank You with outgoing edges
- Warnings: Sales Page not connected to Order Page

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React + TypeScript + Vite |
| Canvas | React Flow |
| State | Zustand |
| Validation | Zod |
| Testing | Vitest |
| Styling | Plain CSS |

## Project Structure

```
src/
├── features/funnel/
│   ├── components/    # UI components (nodes, edges, layout)
│   ├── constants/     # Colors, palette items
│   ├── hooks/         # Validation, persistence, import/export
│   ├── schema/        # Zod schemas
│   ├── state/         # Zustand store
│   └── types.ts       # TypeScript types
├── assets/            # Icons (trash, undo, redo, etc.)
└── App.tsx            # Main app composition
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Lint code |
| `npm run format` | Format with Prettier |

## Accessibility

- Keyboard navigable controls
- Visible focus indicators
- ARIA labels on interactive elements
- Color + text for validation (not color-only)

## Architecture Doc

See `docs/dashboard-architecture.md` for the Part 2 dashboard architecture answer.
