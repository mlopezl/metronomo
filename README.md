# Metronome

A responsive digital metronome for focused music practice and band rehearsals. It combines an adjustable tempo, selectable time signatures, tap tempo, synthesized clicks, and a visual beat display in a single-page interface.

**Language:** English · [Español](README.es.md)

## Features

- **Adjustable tempo:** Enter a value or use the `−` and `+` buttons to change the tempo by 1 BPM. Values are limited to **30–300 BPM**.
- **Time signatures:** Choose **2/4, 3/4, 4/4, or 6/8**. The number of visual indicators follows the number of beats in the selected measure.
- **Playback controls:** Start, pause, resume, and stop. Pause keeps the current progression; stop clears the indicator and returns to the first beat.
- **Tap tempo:** Press `TAP` at least twice. The tempo is calculated from the average interval between recent taps, using up to five taps. A gap longer than 2.2 seconds starts a new tap sequence.
- **Audio and visual accents:** The first beat has a stronger, higher-pitched click and a rust-red indicator. Other beats use gold. In 6/8, the fourth beat has a distinct pitch to mark the second group of three.
- **Responsive and accessible controls:** The layout adapts to narrower screens, provides visible keyboard focus, and respects reduced-motion preferences.

## Getting started

No installation or build step is required. Open `index.html` in a modern browser, then select **Start** to enable audio and begin playback. The font files are loaded from Google Fonts, so an internet connection is needed for the intended typography; system fallback fonts remain available offline.

## Controls

| Control | Action |
| --- | --- |
| BPM field | Enter a tempo from 30 to 300 BPM. |
| `−` / `+` | Decrease or increase tempo by 1 BPM. |
| Meter selector | Switch between 2/4, 3/4, 4/4, and 6/8. |
| Start / Pause / Resume | Toggle playback while retaining the beat position when paused. |
| Stop | Stop playback and reset to the first beat. |
| TAP | Set tempo from the rhythm of repeated taps. |
| Space | Start or pause playback when focus is outside an input, selector, or button. |

## Tools and technologies

| Technology | Role |
| --- | --- |
| HTML5 | Page structure, form controls, and accessibility labels. |
| CSS3 | Responsive layout, typography, colors, gradients, and beat animations. |
| Vanilla JavaScript | Tempo calculations, state, events, and visual updates. |
| Web Audio API | Clock-based scheduling and synthesized click sounds. |
| Google Fonts | Montserrat, Barlow Condensed, DM Mono, and Inter. |

## Implementation

The project uses **HTML5, CSS3, and vanilla JavaScript**. It has no application framework, package manager, or third-party JavaScript dependency.

- **`index.html`** contains the semantic controls and accessible labels.
- **`styles.css`** defines the responsive layout, colors, gradients, metronome-shaped beat indicators, focus states, and reduced-motion behavior. Typography uses **Montserrat, Barlow Condensed, DM Mono, and Inter** through Google Fonts.
- **`script.js`** manages tempo and meter state, tap-tempo calculation, playback, and visual updates.

Audio is generated in the browser with the **Web Audio API**. A scheduler runs every 25 ms and queues clicks approximately 100 ms ahead on the audio clock. Each click is a short sine-wave oscillator with a gain envelope. Visual indicators are timed to the scheduled audio events. Changing tempo or meter while playing cancels pending clicks and reschedules from the new setting.

In **6/8**, each of the six displayed beats receives one click at the selected BPM; the fourth click marks the second group of three. The tempo therefore refers to the displayed eighth-note beats, rather than dotted-quarter beats.

## Project files

```text
metronomo/
├── index.html       # Page structure and controls
├── styles.css       # Visual design and responsive layout
├── script.js        # Metronome behavior and audio scheduling
├── README.md        # English documentation
└── README.es.md     # Spanish documentation
```