# clockArt Architecture

**Date:** 2025-01-27
**Status:** Living Document

## Vision

clockArt renders digital clock digits using grids of analog clock faces. Each digit (0-9) is composed of a 2x3 grid of small analog clocks whose hands are positioned to collectively trace the shape of that digit. Eventually this will drive physical hardware — but we start with a web-based simulator/UI.

## High-Level Architecture

```
┌─────────────────────────────────────────────┐
│                 clockArt SPA                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌─────────┐      ┌────────┐  │
│  │ Analog  │  │  Digit  │      │ Clock  │  │
│  │ Clock   │──│  Grid   │──────│Display │  │
│  │Component│  │Component│      │  View  │  │
│  └─────────┘  └─────────┘      └────────┘  │
│       │                             │       │
│       │        ┌──────────┐         │       │
│       └────────│  Digit   │─────────┘       │
│                │ Patterns │                 │
│                │  (data)  │                 │
│                └──────────┘                 │
│                                             │
└─────────────────────────────────────────────┘
```

## Component Hierarchy (Planned)

```
App
├── ClockDisplay          # Full digital clock (HH:MM:SS)
│   ├── DigitGrid         # Single digit (2x3 grid of clocks)
│   │   └── AnalogClock   # Single analog clock face (SVG)
│   └── Separator         # Colon between digit pairs
└── Controls              # UI for configuration
```

## Phase Plan

### Phase 1: Single Clock (Current)
- `<AnalogClock>` component with configurable hands
- SVG-based, resizable, minimal aesthetic
- Props for hour/minute/second hand positions
- Centered on page for development/testing

### Phase 2: Digit Grid
- `<DigitGrid>` component: 2x3 grid of `<AnalogClock>`
- Digit pattern data: hand positions for each clock to form digits 0-9
- Pattern editor/visualizer

### Phase 3: Clock Display
- `<ClockDisplay>` component: renders current time as digit grids
- Colon separators between HH, MM, SS
- Real-time updates

### Phase 4: Configuration & Polish
- Toggle second hand, tick marks
- Color themes (light/dark)
- Animation transitions between digit changes
- Responsive layout

### Phase 5: Hardware Bridge
- Protocol/API to communicate hand positions to physical clock hardware
- Mapping between digit patterns and servo/stepper motor positions

## Tech Stack

| Concern | Choice |
|---------|--------|
| Language | TypeScript |
| Framework | React |
| Build Tool | Vite |
| Rendering | SVG |
| Styling | CSS (plain or modules) |
| Package Manager | npm |

## Key Design Decisions

### SVG over Canvas
Analog clocks are discrete DOM elements — SVG gives us native scaling, CSS transforms, and simplicity. Canvas would be premature optimization at our grid sizes.

### Props-driven hands (not real-time by default)
The `<AnalogClock>` component receives hand positions as props rather than computing from `Date.now()`. This is essential because the digit-forming use case requires arbitrary hand positions. A real-time mode can be layered on top via a wrapper or hook.

### Minimal aesthetic
Thin strokes, no numbers, no embellishments. The clocks will be small building blocks in a grid — visual simplicity ensures readability at small sizes.

## Directory Structure (Planned)

```
clockArt/
├── docs/
│   ├── architecture.md          # This file
│   └── plans/
│       └── 2025-01-27-analog-clock-component-design.md
├── src/
│   ├── components/
│   │   ├── AnalogClock/
│   │   │   ├── AnalogClock.tsx
│   │   │   └── AnalogClock.css
│   │   ├── DigitGrid/           # Phase 2
│   │   └── ClockDisplay/        # Phase 3
│   ├── data/
│   │   └── digitPatterns.ts     # Phase 2
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
