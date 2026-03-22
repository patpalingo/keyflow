# KeyFlow Setup Guide

## What You Need

### Hardware
- **Roland FP-10** digital piano (or any USB-MIDI keyboard)
- **USB-B to USB-C cable** — connects from the FP-10's USB port (rectangular Type B on the back) to your MacBook's USB-C port
- No drivers needed — the FP-10 is class-compliant USB-MIDI

### Software
- **Chrome or Edge browser** (Web MIDI API is not supported in Firefox or Safari)
- **Node.js 18+** (for local development)

## Quick Start

```bash
cd ~/Documents/keyflow
npm install
npm run dev
```

Open **Chrome** at `http://localhost:5173`

## Connecting Your Roland FP-10

1. Power on the FP-10
2. Connect the USB-B cable from the FP-10's rear USB port to your MacBook
3. Open KeyFlow in Chrome
4. Chrome will ask for MIDI access permission — click **Allow**
5. The FP-10 should appear as **"Roland Digital Piano"** in the device picker
6. It auto-connects if it's the only MIDI device

### Troubleshooting
- **"MIDI Error"**: You're not using Chrome/Edge, or MIDI permission was denied. Check the address bar for a blocked permission icon.
- **No device found**: Make sure the USB cable is connected and the keyboard is powered on. Try unplugging and replugging.
- **Device shows but no notes register**: Some USB-B cables are charge-only. Use a data-capable USB cable.

## How to Play

### Quick Play Songs
Click any built-in song (Hot Cross Buns, Twinkle Twinkle, etc.) to start immediately.

### Load Your Own Songs
1. Download a `.mid` file from one of the linked sources (Mutopia Project, piano-midi.de, etc.)
2. Drag and drop it into the "Load Your Own" area, or click to browse
3. Click **Start Playing**

### During the Game
- **Falling notes** scroll down toward the hit zone above the piano keyboard
- Play the notes on your Roland FP-10 as they reach the line
- **Pink notes** = right hand, **Blue/indigo notes** = left hand
- Timing: **Perfect** (±50ms), **Good** (±120ms), or **Miss**
- Use the **Speed slider** (0.25x–1.0x) to slow down for practice
- Press **Pause** to take a break

### Scoring
- Perfect: 100 points × combo multiplier
- Good: 50 points × combo multiplier
- Combo multiplier increases every 10 consecutive hits (up to 4x)
- Grades: S (95%+), A (90%+), B (80%+), C (70%+), D (60%+), F (<60%)

## Multi-User Setup

You and your wife can each use KeyFlow on separate MacBooks:
- **Local dev**: Run `npm run dev` on each MacBook (each needs Node.js installed)
- **Deployed**: Deploy to Vercel once, then both access the same URL in Chrome

Each browser stores its own score history locally — no accounts needed.

Note: You'll need the Roland FP-10 connected to whichever MacBook you're actively playing on (one keyboard, one player at a time per machine).

## Deploy to Vercel

```bash
cd ~/Documents/keyflow
npx vercel
```

Follow the prompts. Once deployed, you'll get a URL like `keyflow-xxx.vercel.app` that works on any MacBook with Chrome.

## Project Structure

```
keyflow/
├── src/
│   ├── components/    # React UI components
│   ├── engine/        # Canvas game renderer (60fps)
│   ├── hooks/         # React hooks (MIDI connection, game loop)
│   ├── services/      # MIDI input, file parsing, scoring, audio
│   ├── stores/        # Zustand state stores
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Note mapping, colors, demo songs
├── public/songs/      # Place .mid files here for bundling
├── SETUP.md           # This file
└── package.json
```

## Tech Stack
- React 18 + TypeScript + Vite
- Zustand (state management)
- @tonejs/midi (MIDI file parsing)
- Tone.js (audio playback)
- Canvas 2D API (game rendering)
- Tailwind CSS (styling)
- Web MIDI API (keyboard input)
