/**
 * TopNepali Typing PRO — Windows-Style Left Alt + Left Shift Layout Switcher
 */

import { state } from './state.js';

export const LAYOUT_CYCLE = ['nepali_unicode', 'nepali_romanized', 'nepali_preeti', 'english'];
export const LAYOUT_NAMES = {
  nepali_unicode: 'Nepali Traditional',
  nepali_romanized: 'Nepali Romanized',
  nepali_preeti: 'Preeti (ASCII)',
  english: 'English QWERTY'
};

export const layoutShortcutState = {
  leftShiftDown: false,
  leftAltDown: false,
  layoutSwitchTriggered: false
};

export function showLayoutSwitchToast(layoutName) {
  let toast = document.getElementById('layout-switch-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'layout-switch-toast';
    toast.className = 'fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-neutral-900/95 text-white dark:bg-neutral-100 dark:text-neutral-900 border border-[var(--border-subtle)] shadow-2xl flex items-center gap-2.5 text-sm font-semibold pointer-events-none transition-all duration-200 transform scale-95 opacity-0 backdrop-blur-md';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="text-base">⌨️</span>
    <span>Layout: <b>${layoutName}</b></span>
    <span class="text-[10px] opacity-75 font-mono px-1.5 py-0.5 rounded bg-white/20 dark:bg-neutral-900/10">Left Alt+Shift</span>
  `;

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'scale-95');
    toast.classList.add('opacity-100', 'scale-100');
  });

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'scale-100');
    toast.classList.add('opacity-0', 'scale-95');
  }, 1400);
}

export function cycleNextLayout(onLayoutChanged) {
  const curIdx = LAYOUT_CYCLE.indexOf(state.lang);
  const nextIdx = (curIdx + 1) % LAYOUT_CYCLE.length;
  const nextLang = LAYOUT_CYCLE[nextIdx];

  state.lang = nextLang;

  document.querySelectorAll('.lang-tab-btn').forEach(b => {
    const isTarget = (b.dataset.lang === nextLang);
    b.classList.toggle('active', isTarget);
    b.classList.toggle('bg-[var(--bg-surface)]', isTarget);
    b.classList.toggle('text-[var(--accent-primary)]', isTarget);
    b.classList.toggle('shadow-sm', isTarget);
    b.classList.toggle('text-[var(--text-secondary)]', !isTarget);
  });

  showLayoutSwitchToast(LAYOUT_NAMES[nextLang]);

  if (typeof onLayoutChanged === 'function') {
    onLayoutChanged(nextLang);
  }
}
