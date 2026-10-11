/**
 * TopNepali Typing PRO — Dynamic Keyboard Visualizer & Active Target Keycap Engine
 */

import { state } from '../core/state.js';
import { KEY_ROWS } from '../data/keyboards.js';

export function renderKeyboard() {
  KEY_ROWS.forEach((row, rI) => {
    const rowEl = document.querySelector(`.kb-row[data-row="${rI + 1}"]`);
    if (!rowEl) return;

    const existingKeycaps = rowEl.children;
    const canReuse = (existingKeycaps.length === row.length);

    if (!canReuse) {
      rowEl.innerHTML = '';
    }

    const currentMode = state.activeInputMode;

    row.forEach((k, kI) => {
      let topLbl = '';
      let mainLbl = '';
      let fontFam = 'var(--font-sans)';

      if (!k.special && !k.shell) {
        if (currentMode === 'qwerty' || state.lang === 'english') {
          topLbl = k.eng[1] !== k.eng[0].toUpperCase() ? k.eng[1] : '';
          mainLbl = state.isShift ? k.eng[1] : k.eng[0];
          fontFam = 'var(--font-sans)';
        } else if (currentMode === 'traditional') {
          topLbl = k.uni[1];
          mainLbl = state.isShift ? k.uni[1] : k.uni[0];
          fontFam = 'var(--font-nepali)';
        } else if (currentMode === 'romanized') {
          topLbl = k.rom[1];
          mainLbl = state.isShift ? k.rom[1] : k.rom[0];
          fontFam = 'var(--font-nepali)';
        } else if (currentMode === 'preeti') {
          topLbl = state.isShift ? k.pre[1] : k.pre[0];
          mainLbl = state.isShift ? k.pre[3] : k.pre[2];
          fontFam = 'var(--font-nepali)';
        }
      }

      if (canReuse) {
        const keyDiv = existingKeycaps[kI];
        if (k.shell) {
          keyDiv.className = 'keycap special-key shell-key';
          keyDiv.textContent = k.label || k.key;
        } else if (k.special) {
          keyDiv.className = 'keycap special-key';
          keyDiv.textContent = k.label || k.key;
        } else {
          keyDiv.className = 'keycap';
          const topSpan = keyDiv.querySelector('.keycap-shift-label');
          const mainSpan = keyDiv.querySelector('.keycap-main-label');
          if (topSpan) topSpan.textContent = topLbl;
          if (mainSpan) {
            mainSpan.textContent = mainLbl;
            mainSpan.style.fontFamily = fontFam;
          }
        }
      } else {
        const keyDiv = document.createElement('div');
        const extraCls = k.shell ? 'special-key shell-key' : (k.special ? 'special-key' : '');
        keyDiv.className = `keycap ${extraCls}`.trim();
        keyDiv.dataset.code = k.code;
        keyDiv.style.flex = `${k.flex} 1 0%`;

        if (k.shell || k.special) {
          keyDiv.textContent = k.label || k.key;
        } else {
          const topSpan = document.createElement('span');
          topSpan.className = 'keycap-shift-label';
          topSpan.textContent = topLbl;

          const mainSpan = document.createElement('span');
          mainSpan.className = 'keycap-main-label';
          mainSpan.style.fontFamily = fontFam;
          mainSpan.textContent = mainLbl;

          keyDiv.appendChild(topSpan);
          keyDiv.appendChild(mainSpan);
        }

        rowEl.appendChild(keyDiv);
      }
    });
  });

  const titleEl = document.getElementById('kb-current-layout-name');
  const pillEl = document.getElementById('kb-layout-pill');

  const LAYOUT_META = {
    english: {
      title: 'English QWERTY Layout',
      pill: 'QWERTY',
      label: 'QWERTY',
      canToggle: false
    },
    nepali_unicode: {
      title: 'Nepali Unicode (Traditional MPP) Layout',
      pill: 'MPP TRADITIONAL',
      label: 'Traditional (MPP)',
      canToggle: true
    },
    nepali_romanized: {
      title: 'Nepali Unicode (Romanized Phonetic) Layout',
      pill: 'PHONETIC QWERTY',
      label: 'Romanized',
      canToggle: true
    },
    nepali_preeti: {
      title: 'Preeti (ASCII Typewriter) Layout',
      pill: 'PREETI TYPEWRITER',
      label: 'Preeti',
      canToggle: true
    }
  };

  const meta = LAYOUT_META[state.lang] || LAYOUT_META.english;
  const isQwertySwitched = (state.activeInputMode === 'qwerty' && meta.canToggle);

  if (titleEl) {
    titleEl.textContent = isQwertySwitched 
      ? `${meta.title} ➔ [QWERTY Passthrough]` 
      : meta.title;
  }
  if (pillEl) {
    if (isQwertySwitched) {
      pillEl.textContent = 'QWERTY ACTIVE (Alt+Shift)';
      pillEl.className = 'px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse';
    } else {
      pillEl.textContent = meta.pill;
      pillEl.className = 'px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400';
    }
  }

  // Update input mode toggle button in visualizer
  const kbModeBtn = document.getElementById('kb-input-mode-btn');
  const kbModeLabel = document.getElementById('kb-input-mode-label');
  const kbModeDot = document.getElementById('kb-input-mode-dot');
  if (kbModeBtn) {
    // English is fixed QWERTY: hide toggle button
    if (!meta.canToggle) {
      kbModeBtn.classList.add('hidden');
    } else {
      kbModeBtn.classList.remove('hidden');
      if (kbModeLabel) {
        kbModeLabel.textContent = isQwertySwitched ? 'QWERTY Passthrough' : meta.label;
      }
      if (kbModeDot) {
        kbModeDot.className = isQwertySwitched 
          ? 'w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse' 
          : 'w-2 h-2 rounded-full bg-emerald-500 inline-block';
      }
    }
  }

  highlightTargetKey();
}

export function highlightTargetKey() {
  document.querySelectorAll('.keycap.is-target').forEach(el => el.classList.remove('is-target'));
  const curWord = state.words[state.wordIdx];
  const inputField = document.getElementById('typing-input');
  if (!curWord) return;

  const typed = inputField ? inputField.value : '';
  let targetCh = '';
  if (typed.length < curWord.length) {
    targetCh = curWord[typed.length];
  } else {
    targetCh = ' ';
  }

  const currentMode = state.activeInputMode;

  const isAsciiSymbol = targetCh && targetCh !== ' ' && targetCh.charCodeAt(0) < 128 && !/[0-9a-zA-Z]/.test(targetCh);

  const targetDisp = document.getElementById('kb-target-char');
  if (targetDisp) {
    if (targetCh === ' ') {
      targetDisp.textContent = '␣ Space';
    } else if (currentMode !== 'qwerty' && isAsciiSymbol && (state.lang === 'nepali_unicode' || state.lang === 'nepali_romanized')) {
      targetDisp.textContent = `${targetCh} (Press Alt+Shift for QWERTY)`;
    } else if (currentMode === 'traditional' && targetCh === '्') {
      targetDisp.textContent = '् (halanta \\)';
    } else if (currentMode === 'traditional' && targetCh === 'आ') {
      targetDisp.textContent = 'आ (Shift + A or अ + ा)';
    } else if (currentMode === 'romanized' && targetCh === '्') {
      targetDisp.textContent = '् (q or /)';
    } else {
      targetDisp.textContent = targetCh;
    }
  }

  if (targetCh === ' ') {
    document.querySelector('.keycap[data-code="Space"]')?.classList.add('is-target');
    return;
  }

  let needsShift = false;
  let targetCode = null;

  for (let r = 0; r < KEY_ROWS.length; r++) {
    for (let k = 0; k < KEY_ROWS[r].length; k++) {
      const item = KEY_ROWS[r][k];
      if (item.special) continue;

      if (currentMode === 'qwerty' || state.lang === 'english') {
        if (item.eng[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.eng[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (currentMode === 'traditional') {
        if (item.uni[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.uni[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (currentMode === 'romanized') {
        if (item.rom[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.rom[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (currentMode === 'preeti') {
        if (item.pre[0] === targetCh || item.pre[2] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.pre[1] === targetCh || item.pre[3] === targetCh) { targetCode = item.code; needsShift = true; break; }
      }
    }
    if (targetCode) break;
  }

  if (targetCode) {
    document.querySelector(`.keycap[data-code="${targetCode}"]`)?.classList.add('is-target');
    if (needsShift) {
      document.querySelector('.keycap[data-code="ShiftLeft"]')?.classList.add('is-target');
    }
  }
}
