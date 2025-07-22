# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
npm run dev
```

**Build and type check:**
```bash
npm run build
```

**Linting (with auto-fix):**
```bash
npm run lint
```

**Code formatting:**
```bash
npm run format
```

**Run unit tests:**
```bash
npm run test:unit
```

**Run E2E tests:**
```bash
npm run test:e2e
```

**Preview production build:**
```bash
npm run preview
```

## Architecture Overview

This is a Vue 3 + TypeScript single-page application for generating weekly reports. The app uses:

- **Vue 3 Composition API** for reactive components
- **Pinia** for state management
- **Vue Router** for navigation
- **Vite** as build tool and dev server
- **Vitest** for unit testing
- **Playwright** for E2E testing

### Key Files Structure

- `src/main.ts` - Application entry point with Vue app initialization
- `src/App.vue` - Root component with navigation layout
- `src/views/HomeView.vue` - Main application logic (1,300+ lines) containing the report generator
- `src/views/AboutView.vue` - Feature documentation and usage instructions
- `src/router/index.ts` - Client-side routing configuration

### Core Application Logic

The main functionality is concentrated in `src/views/HomeView.vue`, which implements:

- **Weekly report form** with sections for basic info, work items, achievements, and next week's plans
- **Real-time preview** of the generated report
- **Local storage persistence** to save user data
- **HTML export functionality** with inline CSS for email compatibility
- **Responsive design** optimized for both desktop and mobile

### TypeScript Configuration

The project uses a modular TypeScript setup:
- `tsconfig.app.json` - Main application configuration
- `tsconfig.node.json` - Build tools and Node.js scripts
- `tsconfig.vitest.json` - Testing environment

### Testing Strategy

- **Unit tests** in `src/components/__tests__/` using Vitest and Vue Test Utils
- **E2E tests** in `e2e/` using Playwright with multi-browser support
- Tests run in jsdom environment for unit tests and real browsers for E2E

### State Management

Uses Pinia stores (in `src/stores/`) for application state management. The main report data is managed locally within the HomeView component.

### Styling Approach

- Scoped CSS in Vue Single File Components
- Responsive design with mobile-first approach
- Inline CSS generation for HTML export to ensure email compatibility

## Development Notes

- The application focuses on client-side functionality with no backend dependencies
- All report data is stored in browser localStorage
- The HTML export feature generates reports with inline styles for maximum compatibility
- The codebase follows Vue 3 best practices with Composition API throughout