# Nepali Typing Test PRO 🇳🇵

An ultra-modern, high-performance **Nepali Typing Test & Speed Benchmarking Platform** built with **Astro SSR**, supporting all four primary typing layouts used in Nepal:
- **English QWERTY**
- **Nepali Unicode (Traditional)** — Government & Madan Puraskar Pustakalaya (MPP) standard
- **Nepali Unicode (Romanized)** — Phonetic QWERTY Devanagari standard
- **Preeti (ASCII)** — Classic typewriter layout with authentic font rendering

---

## ✨ Key Features

1. **Four Typing Standards Supported**:
   - **Preeti (Legacy ASCII)**: Full support for legacy typewriter glyphs with authentic `preeti.ttf` rendering and contextual rule mapping (Raswa Ikaar `l`, Reph `{`, compound ligatures).
   - **Nepali Unicode Traditional**: Standard Devanagari layout matching official government and banking typing tests.
   - **Nepali Unicode Romanized**: Phonetic layout allowing English speakers to type Devanagari with intuitive spelling.
   - **English (QWERTY)**: International touch typing practice.

2. **Interactive Hardware Keyboard Visualizer**:
   - 5-row responsive keyboard layout mirroring standard physical 104/105-key hardware keyboards.
   - Guaranteed 15.0 Flex Units per row for pixel-perfect boundary alignment.
   - Live hardware keystroke highlighting: lights up pressed keys on physical keyboard in real time.
   - Target keycap guide: pulsing indicator pointing to the next required character to guide finger placement.
   - Vector SVG export of the complete keyboard layout diagram.

3. **Curated Test Datasets**:
   - Over **100+ words** per difficulty level (Easy, Medium, Hard).
   - Authentic sentences from Nepali literature, Constitution, Loksewa exams, and national proverbs.
   - Special characters & numbers: Devanagari numerals (०, १, २, ...), punctuation (।, ?, !), and complex administrative symbols.
   - Flexible test configurations: Timed (15s, 30s, 60s, 120s, 300s) or Target Words (10, 25, 50, 100 words).

4. **Detailed Post-Test Analytics (Monkeytype & Loksewa Grade)**:
   - **Net WPM** (Words Per Minute based on 5 characters = 1 word)
   - **Raw (Gross) WPM**
   - **Accuracy %** (Net correct strokes / Total strokes)
   - **CPM** (Characters Per Minute)
   - **Consistency %** (Standard deviation rhythm stability analysis)
   - **Interactive SVG Timeline Graph**: Second-by-second speed curve with error markers.
   - **Missed Key Heatmap**: Instant diagnosis of your most mistyped keys.
   - **Official Loksewa Assessment**: Automatic grade assignment (Distinction, First Class, Passed, Needs Practice) and score breakdown according to Nepal Public Service Commission standards.

5. **Audio Feedback**:
   - In-browser synthesized mechanical switch clicks and mistake alerts via the Web Audio API (zero external audio file downloads required).

6. **Full Offline & CDN Support**:
   - Self-contained local TTF font bundle (`public/fonts/`) + Cosmic font proxy route (`/pluto/[...path].ts`) connecting to Cloudflare R2 / TopNepali CDN (`https://fonts-cdn.topnepali.com/font-files`).

7. **Extensive SEO & Educational Content**:
   - Complete guides comparing Preeti vs Unicode Traditional vs Romanized.
   - Loksewa Aayog exam benchmarks and syllabus.
   - Preeti typing cheat sheet (Halanta, Reph, Raswa Ikaar rules).
   - Structured JSON-LD metadata for WebApplication and FAQPage rich Google search results.

---

## 🚀 Quick Start

### 1. Development Server
```bash
# Start local development server on port 3000
node scripts/astro-cli.js dev --host 0.0.0.0 --port 3000
```
Then open `http://localhost:3000` in your web browser.

### 2. Build for Production
```bash
# Build standalone or Cloudflare SSR bundle
node scripts/astro-cli.js build
```

### 3. Deploy to Cloudflare Workers / Pages
```bash
# Deploy with Wrangler
npx wrangler deploy
```

---

## 🏛️ Loksewa Aayog Typing Standards

| Criteria | Nepali Typing | English Typing |
| :--- | :--- | :--- |
| **Pass Benchmark** | 20 Net WPM | 25 Net WPM |
| **Good Benchmark** | 30 Net WPM | 35 Net WPM |
| **Distinction Benchmark** | 40+ Net WPM | 50+ Net WPM |
| **Standard Exam Duration** | 5 Minutes (300 Seconds) | 5 Minutes (300 Seconds) |
| **Accuracy Required** | ≥ 85% | ≥ 90% |

---

## ⌨️ Keyboard Shortcuts
- `Tab + Enter` or `Esc`: Instant test restart.
- `Shift`: Toggle uppercase / secondary character layer on the keyboard visualizer.
- `Click Workbench`: Regain typing focus if clicked outside.

---

## 📜 License
MIT License © 2026 [iamgrisma](https://github.com/iamgrisma). Built with Astro SSR.
