# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 3000

# Build
npm run build        # Production build (Webpack)

# Code quality
npm run lint         # ESLint on TS/TSX/JS files
npm run format       # Prettier format
npm run type-check   # TypeScript type check

# Unit tests (Jest + React Testing Library)
npm test                        # Run all unit tests
npm run test:watch              # Watch mode
npm run test:coverage           # With coverage (90% threshold required)
npx jest src/components/Foo     # Run tests for a specific component

# Cypress E2E
npm run cy:open      # Interactive Cypress test runner

# Playwright E2E
npx playwright test                        # All browsers
npx playwright test --project=chromium     # Single browser
npx playwright test --ui                   # Interactive UI mode
npx playwright test e2e/example.spec.ts    # Specific file
```

## Architecture

**React 18 TypeScript SPA** focused on date/time utilities, bundled with Webpack 5.

### Routing & Pages

React Router v6 with lazy-loaded pages. Pages live in `src/pages/` (BerlinClock, DatePicker, DateRange, Home). The `App` component in `src/components/App/` handles routing configuration.

### Component Structure

Each component under `src/components/` follows this pattern:

- `ComponentName.tsx` — implementation
- `ComponentName.test.tsx` — unit tests
- `ComponentName.module.scss` — scoped styles
- `index.ts` — re-export

### State Management

React Context API only — `src/context/themeContext.tsx` manages light/dark theme. No Redux or other global state library.

### Styling

SCSS with CSS Modules for component scoping. Global styles in `src/styles/` (variables, reset, fonts). Bootstrap 5 + React Bootstrap for UI primitives.

### Date/Time

Moment.js + Moment Timezone are used throughout for all date/time logic.

### Testing Utilities

Custom render helpers in `src/utils/testingHelpers/`:

- `renderWithRouterV6.tsx` — wraps components with Router
- `renderWithAllProviders.tsx` — wraps with Router + Theme context

Use these instead of plain `render` in tests.

### Build

Webpack config is split across `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`. Entry: `src/index.tsx`. Output: `dist/`.

### Pre-commit Hooks

Husky runs ESLint + Prettier via lint-staged on staged files before each commit.
