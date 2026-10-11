/**
 * TopNepali Typing PRO — Enterprise Client Application Engine
 * Main Application Orchestrator & Entry Point
 *
 * Modular Architecture:
 * - core/state.js: Application state & Web Audio synthesizer
 * - core/words-pool.js: Text corpora generation & Intl.Segmenter ligatures
 * - core/engine.js: Typing session lifecycle, timer & adaptive mastery
 * - ui/workbench-view.js: 2-line sliding scroll, caret position & live HUD
 * - ui/keyboard-view.js: Hardware keyboard visualizer & active keycap targets
 * - ui/stats-modal-view.js: Biomechanics charts & personal best records
 * - input/input-handler.js: Physical key chords, Devanagari transliteration & backspace
 * - input/toolbar-handler.js: Modals, durations, words, paragraphs & cert claiming
 */

import { state } from './core/state.js';
import { setupTest } from './core/engine.js';
import { bindInputEvents } from './input/input-handler.js';
import { bindToolbarEvents } from './input/toolbar-handler.js';
import { updateHeaderTelemetryBadge } from './utils/telemetry-parameters.js';

function initApp() {
  updateHeaderTelemetryBadge();

  const wb = document.getElementById('typing-workbench');
  if (wb) {
    if (wb.dataset.defaultLang) {
      state.lang = wb.dataset.defaultLang;
    }
    if (wb.dataset.defaultMode) {
      state.mode = wb.dataset.defaultMode;
    }
    if (wb.dataset.defaultDuration) {
      const parsedDur = parseInt(wb.dataset.defaultDuration, 10);
      if (!isNaN(parsedDur) && parsedDur > 0) {
        state.duration = parsedDur;
        state.secsLeft = parsedDur;
      }
    }
  }

  if (document.getElementById('typing-workbench') || document.getElementById('typing-input')) {
    bindInputEvents();
    bindToolbarEvents();
    setupTest();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
