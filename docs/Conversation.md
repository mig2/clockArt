# clockArt — Conversation Log

---

## Session 1 — 2025-01-27

### User
> Eventually, this will be a hardware project, but to start with, we will build a UI and some mockups. What I want to do is to build a digital clock out of analog clock faces. That is, each digit on the digital clock face will be made of a number of analog clocks. To start with, we will use 6 analog clock faces, in a 2 (horizontal) x 3 (vertical) grid. First, I would like you to create a single analog clock UI that we can use as a building block. You can choose the tech stack, but I think the simulator will be an SPA. So, to get started, pick the tech stack, and then create a resizable analog clock placed in the center of the page. The clock should have a minute and hour hand, and a second hand (that can be configured to be shown or not). Likewise, markings on the clock face should be every hour (just marks, not numbers) with slightly larger marks at 12, 3, 6, and 9.

### Assistant
Recommended **React + TypeScript + Vite** with **SVG** rendering:
- SVG is the natural fit — resolution-independent, CSS-transformable hands, trivially resizable
- React gives clean componentization (one `<AnalogClock>` reused 6x per digit)
- Vite for zero-config fast dev
- No UI framework — all custom visual work

Asked about clock hand aesthetic: minimal/modern vs classic.

### User
> Minimal.

### Assistant
Proposed `<AnalogClock>` component design:
- Circular face with thin border stroke
- 12 tick marks: longer/thicker at cardinal positions (12, 3, 6, 9), shorter elsewhere
- Three hands: hour (short, thickest), minute (long, medium), second (longest, thinnest, red accent)
- No numbers, no center cap, no background fill — just strokes
- Props: `hours`, `minutes`, `seconds`, `showSecondHand`, `showTickMarks`, `size`
- SVG with `viewBox` for resolution-independent scaling
- Page layout: centered single clock, ~300px default

### User
> Yes. But before you start coding — first, create a design doc and write it to the docs/ directory. Also add to that directory an architecture doc. Finally, create issues for this git project for each piece of work that you do. When you are done, we will work on the issues one at a time. Also, I would like to track this conversation and your answers. Can you create a running Conversation.md file that contains my prompts and your responses.

### Assistant
Created:
- `docs/plans/2025-01-27-analog-clock-component-design.md` — full component design spec
- `docs/architecture.md` — project architecture, phase plan, component hierarchy, tech stack, directory structure
- `docs/Conversation.md` — this file (running conversation log)
- GitHub issues for each unit of work (see below)
- Initial git commit with all documentation

### User
> Work on 1.

### Assistant
Completed Issue #1 — Project scaffolding:
- Scaffolded Vite + React 19 + TypeScript project
- Cleaned out all default boilerplate (logos, counter demo, default styles)
- Set up `index.css` with full-viewport flexbox centering
- Set up `App.tsx` with centered container ready for `<AnalogClock>`
- Set up `App.css` with `.app` flexbox layout
- Updated `index.html` title to "clockArt"
- Verified dev server starts and serves clean page
- Committed and pushed, closing issue #1

### User
> Work on issue #2.

### Assistant
Completed Issue #2 — AnalogClock SVG clock face with tick marks:
- Created `src/components/AnalogClock/AnalogClock.tsx` and `.css`
- SVG renders in a `viewBox="0 0 200 200"` for resolution-independent scaling
- Circular clock face: thin `#333` stroke, no fill
- 12 tick marks computed via trigonometry (30° apart, offset -90° so index 0 = 12 o'clock)
- Cardinal ticks (12, 3, 6, 9): 14px long, `stroke-width: 2`
- Regular ticks: 8px long, `stroke-width: 1`
- All ticks use `stroke-linecap: round` for clean ends
- `showTickMarks` prop toggles tick visibility
- `size` prop controls rendered width/height (defaults to `'100%'`)
- Full prop interface defined (hours, minutes, seconds, showSecondHand) — hands implementation deferred to issue #3
- Wired into `App.tsx` at 300px for preview
- TypeScript and production build verified clean
- Committed and pushed, closing issue #2

### User
> Work on 3.

### Assistant
Completed Issue #3 — Hour, minute, and second hands:
- Added three SVG `<line>` elements rendered from center outward, rotated via `transform="rotate(...)"`
- **Hour hand**: 50px long, `stroke-width: 4`, `#333`
- **Minute hand**: 70px long, `stroke-width: 2.5`, `#333`
- **Second hand**: 78px long, `stroke-width: 1`, `#e74c3c` (red accent), toggleable via `showSecondHand`
- Angle formulas from design spec:
  - Hour: `(hours % 12) * 30 + minutes * 0.5`
  - Minute: `minutes * 6 + seconds * 0.1`
  - Second: `seconds * 6`
- All hands use `stroke-linecap: round`
- Demo wired to 10:10:30 (classic clock display pose)
- TypeScript and production build verified clean
- Committed and pushed, closing issue #3

### User
> Great, now let's add a few more issues. Firstly, I'd like to stack 2x3 clocks, and create a bunch of images for each digit. You decide how the digit is displayed — in some instances (e.g. for 1), there may be multiple options. The digit images should be stored in an images directory and in addition, you should write the times of each clock that produces the image in a digits.md file in the image directory. Make sure that this file is readable by you for later on. Let's call the clocks a,b,c,d,e,f, in order like this: ab on the top row, then cd in the middle row, then ef in the bottom row. Create an issue for this. Then create another issue to make the UI clock a ticking clock.

### Assistant
Created two new issues:
- [#5 — Design digit patterns: hand positions for digits 0-9 in 2x3 grid](https://github.com/mig2/clockArt/issues/5)
  - Design hand positions for all digits, generate images, write `images/digits.md` with clock positions (a-f grid)
- [#6 — Make the AnalogClock tick in real time](https://github.com/mig2/clockArt/issues/6)
  - Add `realTime` prop, `useCurrentTime` hook, second-by-second updates

### User
> Work on #5, but before you do all the digits, let's do one together. The number 3...

### Assistant
Designed digit 3 collaboratively:
- Grid: a,b (top), c,d (middle), e,f (bottom)
- Used "time-based" approach initially (e.g., 3:15 = both hands at 3) but hands didn't align exactly due to real clock math
- User pointed out hands should snap to exact positions, not simulate real time
- Added `hourAngleDeg` and `minuteAngleDeg` props to AnalogClock for direct angle control
- Direction constants: UP=0°, RIGHT=90°, DOWN=180°, LEFT=270°
- Re-rendered digit 3 with exact angles — clean result

### User
> Great! Now let's work on the issue.

### Assistant
Completed Issue #5 — Digit patterns for all digits 0-9:
- Designed hand positions for all 10 digits using the 2×3 grid
- Each clock uses `hourAngleDeg`/`minuteAngleDeg` for precise hand placement
- Generated individual screenshots for each digit (`images/digit-0.png` through `images/digit-9.png`)
- Generated overview screenshot (`images/all-digits.png`)
- Wrote `images/digits.md` with:
  - Human-readable tables for each digit (clock, hour angle, minute angle, description)
  - JSON summary for programmatic use
- Added `?digit=X` query param support to App for single-digit rendering
- Added screenshot script: `scripts/screenshot-digits.mjs`
- Committed locally, closing issue #5 (push pending auth refresh)

### User
> The 1, 4, and 7 look funky, that's because you have a few spare clocks. We need to figure out what to do with them.

### Assistant
Implemented "neutral" clock position for unused clocks:
- Both hands at 225° (7:30 position) — a single diagonal line that clearly signals "I'm not part of this digit"
- Updated digits 1, 4, and 7 to use NEUTRAL_HOUR=225, NEUTRAL_MINUTE=225 for unused positions
- Updated `images/digits.md` with neutral position documentation
- Regenerated all digit screenshots
- Committed and pushed

### User
> Let's create a new issue for an interactive clock playground with UI controls.

### Assistant
Created Issue #7 — Interactive clock playground:
- UI controls for customizing individual clock properties
- Real-time preview of changes

### User
> Let's create a new issue, display a 2x3 grid of clocks. When this is the chosen display, you should also have the ability to set a digit. Also, each of the clocks in the display should be able to be set either by degrees or by time.

### Assistant
Created Issue #8 — 2x3 Clock Grid Display with Controls:
- Display 2×3 grid of clocks (a-f)
- Digit preset selector (0-9) to load predefined patterns
- Per-clock controls: toggle between angle mode (degrees) and time mode
- Individual adjustment for each clock's hour/minute hands

---

## Session 2 — 2025-01-28

### User
> Is issue 4 done? It still appears open. And are you updating Conversation.md? Please add to CLAUDE.md to always add to Conversation.md.

### Assistant
- Closed Issue #4 (was completed as part of Issues #2 and #3)
- Created `CLAUDE.md` with instruction to always update `docs/Conversation.md`

### User
> Work on issue 6.

### Assistant
Completed Issue #6 — Make the AnalogClock tick in real time:
- Created `src/hooks/useCurrentTime.ts` — hook that returns current hours/minutes/seconds, updating every second
  - Syncs with wall clock by calculating ms until next second
  - Proper cleanup of timeout and interval on unmount
- Added `realTime` prop to `<AnalogClock>` — when `true`, ignores time props and uses live time from hook
- Added `?realtime=true` query param support in `App.tsx` to demo the ticking clock
- Added `.realtime-container` CSS class for centered real-time display
- TypeScript build verified clean
- Committed and pushed, closing issue #6

### User
> Issue 7 please.

### Assistant
Completed Issue #7 — Interactive clock playground:
- Extended `<AnalogClock>` with new props:
  - `showCardinalTicks`, `showRegularTicks` for granular tick visibility
  - `hourHandColor`, `minuteHandColor`, `secondHandColor`, `tickColor`, `faceColor` for color customization
- Created `src/components/ClockPlayground/ClockPlayground.tsx`:
  - **Hand Position** group: angle/time mode toggle, sliders + number inputs for each hand
  - **Display** group: toggles for second hand, tick marks, cardinal/regular ticks
  - **Colors** group: color pickers + hex text inputs for all customizable elements
  - Reset All button to restore defaults
  - Responsive layout (side-by-side on wide screens, stacked on narrow)
- Created `ClockPlayground.css` with clean form styling
- Added `?playground=true` query param in `App.tsx`
- TypeScript build verified clean
- Committed and pushed, closing issue #7

### User
> Work on 8.

### Assistant
Completed Issue #8 — 2x3 clock grid display with per-clock and digit controls:
- Extracted digit patterns into shared `src/data/digits.ts` (used by both App.tsx and DigitGrid)
- Created `src/components/DigitGrid/DigitGrid.tsx`:
  - 2×3 grid of labeled clocks (a-f) with digit preset selector (0-9 + custom ✎)
  - Selecting a digit loads the predefined pattern; editing any clock switches to custom mode
  - Per-clock controls: angle/time mode toggle, sliders + number inputs
  - Angle mode: hour and minute angle (0-360°) with sliders
  - Time mode: hour (0-11) and minute (0-59) number inputs
- Created `DigitGrid.css` with compact control styling, responsive layout
- Added `?grid=true` query param in `App.tsx`
- TypeScript build verified clean
- Committed and pushed, closing issue #8

### User
> Now I want us to think about the digits, and how we switch from one digit to another in the same 2x3. Switching immediately is jarring. Suggest a couple of ways to transition digits, starting with 1 → 2.

### Assistant
Proposed three transition strategies:
1. **Shortest path rotation** — each hand takes the shortest angular path (≤180°), mixed CW/CCW directions, all simultaneous
2. **Synchronized sweep** — all hands rotate clockwise only, same duration, mechanical feel
3. **Staggered/sequential** — row-by-row cascade, each clock uses shortest path but clocks are staggered in time

Recommended synchronized sweep for the most "clock-like" feel.

### User
> Create an issue for the design doc, write the strategies to docs/digitSweep.md, then create separate issues for each strategy plus a UI issue for the grid view with from/to digit selectors, algorithm picker, and play button.

### Assistant
- Created and closed Issue #9 — Design digit transition strategies
  - Wrote `docs/digitSweep.md` with full documentation: algorithms, worked examples (1→2), comparison table, implementation notes (requestAnimationFrame, easing)
- Created Issue #10 — Implement shortest path rotation transition
- Created Issue #11 — Implement synchronized sweep transition
- Created Issue #12 — Implement staggered/sequential transition
- Created Issue #13 — Grid view: digit transition UI with algorithm picker and play button (depends on #10, #11, #12)

### User
> Work on 10.

### Assistant
Completed Issue #10 — Implement shortest path rotation transition:
- Created shared animation infrastructure in `src/animation/`:
  - `types.ts` — `ClockAngles`, `DigitAngles`, `TransitionStrategy`, `TransitionOptions`
  - `easing.ts` — `easeInOutCubic` function
  - `engine.ts` — `runTransition()` using `requestAnimationFrame`, returns cancel function
  - `shortestPath.ts` — `shortestPathStrategy`: each hand rotates ≤180° via shortest angular path
  - `index.ts` — barrel export
- Created `src/hooks/useDigitTransition.ts`:
  - Returns `angles`, `isAnimating`, `setAngles`, `animateTo`, `cancel`
  - Manages animation lifecycle with refs to avoid stale closures
  - Cancels previous animation when a new one starts
- Architecture designed for reuse: issues #11 and #12 only need to add new strategy functions
- TypeScript build verified clean
- Committed and pushed, closing issue #10

### User
> Work on 11.

### Assistant
Completed Issue #11 — Implement synchronized sweep transition:
- Created `src/animation/synchronizedSweep.ts`:
  - `synchronizedSweepStrategy`: all hands rotate clockwise only, same duration
  - Clockwise delta: `(target - start + 360) % 360` — 0 means no movement
  - Hands with larger deltas move faster to finish together
- Added to barrel export in `index.ts`
- TypeScript build verified clean
- Committed and pushed, closing issue #11

### User
> Work on 12.

### Assistant
Completed Issue #12 — Implement staggered/sequential transition:
- Created `src/animation/staggered.ts`:
  - `staggeredStrategy`: animates row by row (ab → cd → ef) with overlapping windows
  - Each row uses shortest-path rotation internally
  - Timeline: stagger offset = 25% of total, row animation window = 50% of total
  - Rows overlap so the cascade feels smooth, not jerky
- Added to barrel export in `index.ts`
- TypeScript build verified clean
- Committed and pushed, closing issue #12

### User
> Work on 13.

### Assistant
Completed Issue #13 — Grid view: digit transition UI with algorithm picker and play button:
- Refactored `src/components/DigitGrid/DigitGrid.tsx` to integrate transition animation:
  - **From/To digit selectors**: choose source and target digits (0-9)
  - **Algorithm picker**: choose between Shortest Path, Synchronized Sweep, or Staggered strategies
  - **Duration slider**: 200ms to 2000ms range (100ms steps)
  - **Play button**: triggers animated transition from source to target digit
  - All controls disabled during animation; button shows "Playing…" state
  - Integrated `useDigitTransition` hook: during animation, clocks are driven by `transition.angles`; otherwise by manual per-clock state
  - Existing per-clock manual controls (angle/time mode, sliders, number inputs) preserved
- Updated `DigitGrid.css` with transition control styles:
  - `.transition-controls` container with border, rounded corners, light background
  - `.transition-row` layout for each control row
  - `.digit-buttons.compact` variant for smaller button sizing
  - `.play-btn` styled button with disabled state
  - `.duration-value` for tabular-nums display of ms value
- TypeScript build verified clean
- Committed and pushed, closing issue #13

### User
> I'd like to add an algorithm, each clock rotates clockwise once past its current setting into the new setting. Name the algorithm. Open an issue for it and then work on it.

### Assistant
Named the algorithm **"Wind-Up"** — each hand makes at least one full clockwise revolution before landing on its target.

Created Issue #14 — Implement full-revolution clockwise transition strategy.

Completed Issue #14:
- Created `src/animation/windUp.ts`:
  - `windUpStrategy`: every hand rotates clockwise through at least 360° before arriving at the target
  - Delta formula: `((target - start + 360) % 360) + 360` — guarantees one full revolution plus the clockwise distance to the target
  - If target equals start, hand still completes a full 360° sweep
  - Uses `easeInOutCubic` easing for natural motion
- Added to barrel export in `src/animation/index.ts`
- Added "Wind-Up" option to DigitGrid algorithm picker (`AlgorithmKey`, `ALGORITHMS` map, import)
- TypeScript build verified clean
- Committed and pushed, closing issue #14

### User
> Add a feature to cycle through the digits from 0 to 9 and add a cycle-digits button to the UI. Then work on the feature.

### Assistant
Created Issue #15 — Add cycle-digits button to animate through 0-9 sequentially.

Completed Issue #15:
- Added "⟳ Cycle 0–9" button to DigitGrid transition controls, next to Play
- Cycle sequentially animates 0→1→2→…→9 using the selected algorithm and duration
- 300ms pause between each transition for the digit to "land"
- All controls disabled during cycle (`isBusy = isAnimating || isCycling`)
- Button shows "Cycling…" while running, re-enables after reaching 9
- Uses `useRef` to track cycle state for the sequential setTimeout chain
- TypeScript build verified clean
- Committed and pushed, closing issue #15

### User
> Now let's move on and create a clock screen. For this, we will need 4 2×3 grids to represent the hh:mm of the clock. For seconds, let's create a two-digit small digit display to the top right of the hh:mm. I'd like controls to set the clock, the algorithm for transitions, and the ability to run the clock fast (1s in 1s = normal, 1s in 10s = 10× speed). Create issues and then we can review and begin work.

### Assistant
Created 7 issues for the clock screen feature:
- **#16** — DigitDisplay: reusable single-digit 2×3 grid component (building block)
- **#17** — useClockTime: hook with adjustable speed multiplier and manual time setting
- **#18** — ColonSeparator: colon between HH and MM
- **#19** — ClockScreen: main HH:MM display composing 4 DigitDisplays
- **#20** — Seconds display: small SS in top-right corner
- **#21** — Controls panel: time setting, algorithm picker, speed control
- **#22** — Wire ClockScreen into App.tsx routing

Build order: #16, #17, #18 (independent) → #19 (main assembly) → #20, #21 (additions) → #22 (routing)

### User
> Work on 16.

### Assistant
Completed Issue #16 — Reusable DigitDisplay component:
- Created `src/components/DigitDisplay/DigitDisplay.tsx`:
  - `forwardRef` component exposing `DigitDisplayHandle` via `useImperativeHandle`
  - Handle provides: `animateTo(digit, strategy, duration)`, `setDigit(digit)`, `isAnimating`
  - Internally uses `useDigitTransition` hook for animation state
  - Props: `digit` (string "0"-"9"), `clockSize` (px, default 80), `gap` (px, default 2)
  - Renders 2×3 CSS grid of AnalogClocks driven by transition angles
  - Snaps to new digit when `digit` prop changes externally (if not animating)
  - Tracks current digit via `useRef` to avoid redundant updates
- Created `src/components/DigitDisplay/DigitDisplay.css`:
  - `.digit-display` grid container, `.digit-display-cell` centered flex
- TypeScript build verified clean (full `tsc --noEmit`)
- Committed and pushed, closing issue #16

### User
> Work on 17.

### Assistant
Completed Issue #17 — useClockTime hook with adjustable speed:
- Created `src/hooks/useClockTime.ts`:
  - Returns `{ time, setTime, setNow, speed, setSpeed }`
  - `time`: `{ hours, minutes, seconds }` — current simulated clock time
  - `setTime(h, m, s)`: manually set the clock to any time
  - `setNow()`: reset to current wall-clock time
  - `speed` / `setSpeed(s)`: speed multiplier (1–60), clamped
  - Interval = `1000 / speed` ms, each tick advances 1 simulated second
  - speed=1: real time, speed=10: 10× (10 sim seconds per real second), speed=60: 1 sim minute per real second
  - `tickForward()` helper handles second→minute→hour→day rollover
  - Uses `useRef` for current time to avoid stale closures in interval callback
  - Effect re-runs when speed changes, preserving current time position
  - Initializes to wall-clock time via `getNow()`
- TypeScript build verified clean
- Committed and pushed, closing issue #17

### User
> Work on 18.

### Assistant
Completed Issue #18 — ColonSeparator component:
- Created `src/components/ColonSeparator/ColonSeparator.tsx`:
  - Two vertically-centered circular dots styled as a colon (:)
  - Props: `height` (matches digit grid height), `dotScale` (fraction of height, default 0.06)
  - Dot size: `max(6px, height * dotScale)` — minimum 6px for visibility
  - Dot spacing: 20% of total height between dots
  - Clean minimal design: `#333` filled circles, consistent with clock aesthetic
- Created `src/components/ColonSeparator/ColonSeparator.css`:
  - Flex column layout, centered, with 4px horizontal padding
  - `.colon-dot`: `border-radius: 50%` for perfect circles
- TypeScript build verified clean
- Committed and pushed, closing issue #18

### User
> Work on 19.

### Assistant
Completed Issue #19 — Main ClockScreen component with HH:MM display:
- Created `src/components/ClockScreen/ClockScreen.tsx`:
  - Composes 4 `DigitDisplay` instances (H1, H2, M1, M2) with `ColonSeparator` between hours and minutes
  - Uses `useClockTime` hook for live time source
  - `timeToDigits(hours, minutes)` splits time into 4 individual digit strings
  - Tracks previous digits via `useRef` — only animates digits that actually change
  - Each DigitDisplay is driven via `forwardRef` handle: `animateTo(digit, strategy, duration)`
  - Algorithm map with all 4 strategies (shortest, sweep, staggered, wind-up); defaults to shortest path
  - Constants: `CLOCK_SIZE=80`, `CLOCK_GAP=2`, `TRANSITION_DURATION=600ms`
- Created `src/components/ClockScreen/ClockScreen.css`:
  - `.clock-screen`: full-viewport centered flex layout
  - `.clock-display`: horizontal flex row with 8px gap between digit groups
- TypeScript build verified clean (`tsc --noEmit` and full Vite build)
- Committed and pushed, closing issue #19

### User
> Work on 20. (Seconds display — but as standard 7-segment, not 2×3 analog clocks)

### Assistant
Completed Issue #20 — Small seconds display in top-right corner:
- Created `src/components/SevenSegment/SevenSegment.tsx`:
  - SVG-based 7-segment digital display component
  - `SevenSegmentDigit`: renders a single digit with 7 line segments (a-g)
  - `SEGMENT_MAP`: lookup table for which segments are lit per digit (0-9)
  - Segments styled as SVG lines with `strokeLinecap: round`
  - Lit segments: `#333`, unlit segments: `#e8e8e8` (faint ghost)
  - `SevenSegment` wrapper renders multi-character strings (e.g. "42")
  - Props: `value` (string), `height` (px, default 48)
  - Width computed proportionally: `height * 0.55`
- Created `src/components/SevenSegment/SevenSegment.css`:
  - `.seven-segment`: flex row layout
  - `.seg-on` / `.seg-off`: segment stroke colors
- Updated `ClockScreen.tsx`:
  - Replaced analog DigitDisplay seconds with `<SevenSegment value={ss} height={60} />`
  - Seconds formatted as zero-padded 2-digit string
  - Positioned top-right of main display at 50% opacity
- Updated `ClockScreen.css`:
  - `.clock-display-wrapper`: relative positioning container
  - `.seconds-display`: absolute positioned top-right, offset -80px
- TypeScript and Vite build verified clean
- Committed and pushed, closing issue #20

### User
> Work on 21.

### Assistant
Completed Issue #21 — ClockScreen controls panel:
- Updated `src/components/ClockScreen/ClockScreen.tsx`:
  - Wired full `useClockTime` return: `time`, `setTime`, `setNow`, `speed`, `setSpeed`
  - Made `algorithm` stateful with `setAlgorithm`
  - **Time row**: three number inputs (HH:MM:SS) with "Now" button to snap to wall-clock time
  - **Algorithm row**: button group for all 4 strategies (Shortest Path, Synchronized Sweep, Staggered, Wind-Up)
  - **Speed row**: preset buttons for 1×, 2×, 5×, 10×, 30×, 60× speed multipliers
  - `SPEED_PRESETS` and `ALGORITHM_KEYS` constants for clean iteration
- Updated `src/components/ClockScreen/ClockScreen.css`:
  - `.clock-controls`: panel below clock display with border, rounded corners, light background
  - `.clock-controls-row`: flex row with label + inputs/buttons
  - `.clock-controls-label`: uppercase label (matches transition-controls style)
  - `.time-input`: centered number inputs with tabular-nums
  - `.now-btn`: bordered button for time reset
  - `.clock-btn-group` / `.clock-btn`: segmented button group with active state (same pattern as DigitGrid)
  - Responsive: wraps on narrow screens
- TypeScript and Vite build verified clean
- Committed and pushed, closing issue #21

### User
> This is great work. Now, there are a number of different UI panels, please add an issue to put a row of buttons at the top of the app that allow you to switch between each page, then work on the issue.

### Assistant
Created Issue #23 — Navigation bar to switch between app views.

Completed Issue #23 — Persistent nav bar with view switching:
- Created `src/components/NavBar/NavBar.tsx`:
  - `ViewKey` type: `'clock' | 'grid' | 'playground' | 'realtime' | 'gallery'`
  - 5 nav items: Clock, Grid, Playground, Real Time, Gallery
  - Props: `activeView`, `onViewChange` callback
  - Segmented button group, active button highlighted (dark bg/white text)
- Created `src/components/NavBar/NavBar.css`:
  - Fixed position at top of viewport with white background and subtle bottom border
  - `.nav-btn-group` / `.nav-btn`: consistent with existing button patterns (`.clock-btn` style)
  - Active and hover states
  - `z-index: 100` to stay above content
- Refactored `src/App.tsx`:
  - Replaced query-param-only routing with React state-driven view switching
  - `getInitialView()` reads query params on mount for direct-link support
  - `useState<ViewKey>` manages active view; clicking nav buttons switches instantly (no page reload)
  - Single `<div className="app-content">` renders the active view
  - Gallery view shows all digits 0-9 (previously the default overview)
  - Default view: Clock
- Updated `src/App.css`:
  - `.app` changed to flex column layout (nav on top, content below)
  - `.app-content` added with `padding-top: 56px` to clear fixed nav bar
- TypeScript and Vite build verified clean
- Committed and pushed, closing issue #23
