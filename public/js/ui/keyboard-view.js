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

    row.forEach((k, kI) => {
      let topLbl = '';
      let mainLbl = '';
      let fontFam = 'var(--font-sans)';

      if (!k.special && !k.shell) {
        if (state.lang === 'english') {
          topLbl = k.eng[1] !== k.eng[0].toUpperCase() ? k.eng[1] : '';
          mainLbl = state.isShift ? k.eng[1] : k.eng[0];
        } else if (state.lang === 'nepali_unicode') {
          topLbl = k.uni[1];
          mainLbl = state.isShift ? k.uni[1] : k.uni[0];
          fontFam = 'var(--font-nepali)';
        } else if (state.lang === 'nepali_romanized') {
          topLbl = k.rom[1];
          mainLbl = state.isShift ? k.rom[1] : k.rom[0];
          fontFam = 'var(--font-nepali)';
        } else if (state.lang === 'nepali_preeti') {
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
  const titles = {
    english: 'English QWERTY Layout',
    nepali_unicode: 'Nepali Unicode (Traditional MPP) Layout',
    nepali_romanized: 'Nepali Unicode (Romanized Phonetic) Layout',
    nepali_preeti: 'Preeti (ASCII Typewriter) Layout'
  };
  const pills = {
    english: 'QWERTY',
    nepali_unicode: 'MPP TRADITIONAL',
    nepali_romanized: 'PHONETIC QWERTY',
    nepali_preeti: 'PREETI TYPEWRITER'
  };
  if (titleEl) titleEl.textContent = titles[state.lang] || '';
  if (pillEl) pillEl.textContent = pills[state.lang] || '';

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

  const targetDisp = document.getElementById('kb-target-char');
  if (targetDisp) {
    if (targetCh === ' ') {
      targetDisp.textContent = '␣ Space';
    } else if (state.lang === 'nepali_unicode' && targetCh === '्') {
      targetDisp.textContent = '् (halanta \\)';
    } else if (state.lang === 'nepali_unicode' && targetCh === 'आ') {
      targetDisp.textContent = 'आ (Shift + A or अ + ा)';
    } else if (state.lang === 'nepali_romanized' && targetCh === '्') {
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

      if (state.lang === 'english') {
        if (item.eng[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.eng[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (state.lang === 'nepali_unicode') {
        if (item.uni[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.uni[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (state.lang === 'nepali_romanized') {
        if (item.rom[0] === targetCh) { targetCode = item.code; needsShift = false; break; }
        if (item.rom[1] === targetCh) { targetCode = item.code; needsShift = true; break; }
      } else if (state.lang === 'nepali_preeti') {
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
