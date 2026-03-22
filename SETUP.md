# KeyFlow Setup Guide

## What You Need

- **Roland FP-10** digital piano (or any USB-MIDI keyboard)
- **USB-B to USB-C cable** — connects from the FP-10's USB port (rectangular Type B on the back) to your MacBook's USB-C port. Make sure it's a data cable, not charge-only.
- **Chrome or Edge browser** — Web MIDI doesn't work in Firefox or Safari
- No drivers or software to install — the FP-10 is class-compliant USB-MIDI

## Getting Started

1. Go to **https://keyflow-theta.vercel.app** in Chrome
2. Power on your Roland FP-10
3. Connect the USB-B cable from the FP-10's rear USB port to your MacBook
4. Chrome will ask for MIDI access — click **Allow**
5. The FP-10 should appear as **"Roland Digital Piano"** in the device picker
6. Pick a song and play!

## How to Play

### Quick Play Songs
Click any built-in song (Hot Cross Buns, Twinkle Twinkle, etc.) to start immediately.

### Load Your Own Songs
1. Download a `.mid` file from one of the linked sources (Mutopia Project, piano-midi.de, etc.)
2. Drag and drop it into the "Load Your Own" area, or click to browse
3. Click **Start Playing**

### During the Game
- **Falling notes** scroll down toward the hit zone above the piano keyboard
- Play the notes on your FP-10 as they reach the line
- **Pink notes** = right hand, **Purple notes** = left hand
- Use the **Speed slider** (0.25x–1.0x) to slow down for practice
- Press **Pause** to take a break

### Scoring
- **Perfect** (±50ms): 100 points × combo multiplier
- **Good** (±120ms): 50 points × combo multiplier
- Combo multiplier increases every 10 consecutive hits (up to 4x)
- Grades: S (95%+), A (90%+), B (80%+), C (70%+), D (60%+), F (<60%)

## Two Players

You and your wife can both use KeyFlow on your own MacBooks — just open the same URL in Chrome. You'll need the Roland FP-10 plugged into whichever MacBook you're playing on (one keyboard, one player at a time).

## Troubleshooting

- **"MIDI unavailable"**: You're not using Chrome/Edge, or MIDI permission was denied. Check the address bar for a blocked permission icon.
- **No device found**: Make sure the USB cable is connected and the keyboard is powered on. Try unplugging and replugging.
- **Device shows but no notes register**: Some USB-B cables are charge-only. Use a data-capable USB cable.
- **No sound**: The app uses piano samples that load from the internet. Make sure you're online and your volume is up.
