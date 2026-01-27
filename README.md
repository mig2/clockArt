# clockArt

Digital clock digits made from analog clock faces.

Each digit (0–9) is composed of a 2×3 grid of small analog clocks whose hands are positioned to collectively trace the shape of that digit. This repo contains the web-based simulator/UI — eventually it will drive physical hardware.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (comes with Node)

## Getting started

```bash
git clone https://github.com/mig2/clockArt.git
cd clockArt
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Tech stack

- **React** + **TypeScript**
- **Vite** for build tooling
- **SVG** for clock rendering

## Project structure

```
clockArt/
├── docs/
│   ├── architecture.md
│   ├── Conversation.md
│   └── plans/
├── src/
│   ├── components/
│   │   └── AnalogClock/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## License

MIT
