# Claude Instructions for clockArt

## Conversation Log

**Always update `docs/Conversation.md`** after completing significant work or receiving user instructions. This file serves as a running log of all prompts and responses throughout development.

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
