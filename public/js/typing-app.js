/**
 * TopNepali Typing PRO — Enterprise Client Application Engine
 * Main Application Orchestrator & Entry Point
 *
 * Modular Architecture:
 * - core/state.js: Application state & Web Audio synthesizer
 * - core/words-pool.js: Text corpora generation & Intl.Segmenter ligatures
 * - core/layout-switcher.js: Windows Alt+Shift chord & layout switching
 * - core/engine.js: Typing session lifecycle, timer & adaptive mastery
 * - ui/workbench-view.js: 2-line sliding scroll, caret position & live HUD
 * - ui/keyboard-view.js: Hardware keyboard visualizer & active keycap targets
 * - ui/stats-modal-view.js: Biomechanics charts & personal best records
 * - input/input-handler.js: Physical key chords, Devanagari transliteration & backspace
 * - input/toolbar-handler.js: Modals, durations, words, paragraphs & cert claiming
 */

import { setupTest } from './core/engine.js';
import { bindInputEvents } from './input/input-handler.js';
import { bindToolbarEvents } from './input/toolbar-handler.js';
import { updateHeaderTelemetryBadge } from './utils/telemetry-parameters.js';

function initApp() {
  bindInputEvents();
  bindToolbarEvents();
  setupTest();
  updateHeaderTelemetryBadge();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
