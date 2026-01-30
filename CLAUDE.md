# Claude Instructions for clockArt

## Conversation Log

**Always update `docs/Conversation.md`** with a **verbatim** record of the conversation. This means:
- User messages must be copied exactly as written, without any editing or paraphrasing
- Assistant responses must be copied exactly as written — the full text, not a summary
- Include all thinking, reasoning, analysis, code snippets, and explanations exactly as they appeared
- Do **not** summarize, condense, or rewrite any part of the conversation
- The file should read as a complete transcript that someone could follow to understand every detail of what was discussed and decided

## Project Context

This is a digital clock built from analog clock faces. Each digit (0-9) is composed of a 2x3 grid of analog clocks whose hands are positioned to form the digit shape.

## Key Patterns

- Direction constants: UP=0°, RIGHT=90°, DOWN=180°, LEFT=270° (clockwise from 12 o'clock)
- Neutral clock position: 225° for both hands (unused clocks in digit patterns)
- Direct angle control via `hourAngleDeg`/`minuteAngleDeg` props for precise positioning

## GitHub Issues

Track all work through GitHub issues. Close issues with descriptive comments when work is complete.

## Tech Stack

- React + TypeScript + Vite
- SVG rendering for clock faces
- No external UI frameworks
