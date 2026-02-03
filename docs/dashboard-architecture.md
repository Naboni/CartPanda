## Modern Dashboard Architecture

### 1) Architecture

I would use a feature-first layout where each domain owns its routes, data logic, and UI. The app shell contains shared navigation, layout primitives, and top-level providers. Each feature (funnels, orders, customers, subscriptions, analytics, settings) is a self-contained module with:

- `routes/` for page-level layouts and routing
- `api/` for data access, query keys, and caching rules
- `components/` for feature-specific UI
- `state/` for client-only state
- `tests/` for integration and unit tests

Shared UI (buttons, form fields, tables, icons) and utilities live in a `shared/` or `ui/` package. This avoids cross-feature imports and keeps boundaries explicit. Route-level code splitting ensures only the current section is loaded.

### 2) Design System

I’d start with a lightweight design system built in-house using a small UI foundation library (Radix or Headless UI) and shared tokens (colors, spacing, typography). This allows:

- Consistent accessibility and interactions across screens
- Controlled variation via variants instead of ad-hoc styles
- A shared token file for theming and dark mode

Components are documented in Storybook. Tokens are centralized so teams can’t “invent” new values. This reduces UI drift over time.

### 3) Data Fetching + State

Use TanStack Query for server state and caching, and a small state store (Zustand) for UI-only state. Each feature owns its query keys, API wrappers, and selectors. Global filters (date range, workspace) are stored in a shared context or store.

For tables: keep filtering, sorting, and pagination in URL params so views are shareable. Provide explicit loading, error, empty, and offline states in each page. Batch requests and use cursor pagination for large datasets.

### 4) Performance

- Code-split routes and large feature modules
- Virtualize long lists (orders, customers)
- Use memoization around complex tables and charting
- Track core web vitals and add custom performance marks

For “dashboard feels slow” issues, I’d instrument with a performance dashboard and user timing marks (page load, search latency, table render). This allows targeting the actual bottleneck.

### 5) DX & Team Scaling

Establish conventions early:

- Lint/format rules and CI checks
- PR templates and required review checklists
- Code owners for feature modules
- Component and route templates for new work

Shared components and patterns are documented in a short playbook. Engineers are encouraged to extend existing primitives instead of rolling their own.

### 6) Testing Strategy

- Unit tests for pure utilities and critical data transforms
- Integration tests for feature flows (e.g., filter + export)
- E2E tests for core critical paths (checkout, orders, refunds)

Minimum bar before shipping: tests for any new user-facing critical flow and a quick smoke test of core routes.

### 7) Release & Quality

Use feature flags and staged rollouts for risky features. Capture errors via monitoring (Sentry), add client logging for high-volume areas, and use canary releases for major UI changes. Every deployment should be quick to rollback and include automated checks.

### Tradeoffs

At MVP stage, I’d skip heavy internal tooling and focus on a lean component library plus strict boundaries. As the team scales, I’d invest more in design tokens, Storybook automation, and performance budgets.
