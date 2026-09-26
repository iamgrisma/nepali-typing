/**
 * Nepali Typing PRO — Hardware Keyboard Matrix
 * Officially verified and matched 100% against:
 * 1. English Standard QWERTY
 * 2. MPP Nepali Unicode Traditional (from Trad.dll binary tables)
 * 3. MPP Nepali Unicode Romanized
 * 4. Preeti (ASCII Typewriter)
 */

export const KEY_ROWS = [
  // Row 1
  [
    { code: 'Backquote', key: '`', eng: ['`', '~'], uni: ['ञ', '॥'], rom: ['़', 'ऽ'], pre: ['`', '~', 'ञ', 'ञ्'], flex: '1' },
    { code: 'Digit1', key: '1', eng: ['1', '!'], uni: ['१', 'ज्ञ'], rom: ['१', '!'], pre: ['1', '!', 'ज्ञ', '१'], flex: '1' },
    { code: 'Digit2', key: '2', eng: ['2', '@'], uni: ['२', 'ई'], rom: ['२', '@'], pre: ['2', '@', 'द्द', '२'], flex: '1' },
    { code: 'Digit3', key: '3', eng: ['3', '#'], uni: ['३', 'घ'], rom: ['३', '#'], pre: ['3', '#', 'घ', '३'], flex: '1' },
    { code: 'Digit4', key: '4', eng: ['4', '$'], uni: ['४', 'द्ध'], rom: ['४', '$'], pre: ['4', '$', 'द्ध', '४'], flex: '1' },
    { code: 'Digit5', key: '5', eng: ['5', '%'], uni: ['५', 'छ'], rom: ['५', '%'], pre: ['5', '%', 'छ', '५'], flex: '1' },
    { code: 'Digit6', key: '6', eng: ['6', '^'], uni: ['६', 'ट'], rom: ['६', '^'], pre: ['6', '^', 'ट', '६'], flex: '1' },
    { code: 'Digit7', key: '7', eng: ['7', '&'], uni: ['७', 'ठ'], rom: ['७', '&'], pre: ['7', '&', 'ठ', '७'], flex: '1' },
    { code: 'Digit8', key: '8', eng: ['8', '*'], uni: ['८', 'ड'], rom: ['८', '*'], pre: ['8', '*', 'ड', '८'], flex: '1' },
    { code: 'Digit9', key: '9', eng: ['9', '('], uni: ['९', 'ढ'], rom: ['९', '('], pre: ['9', '(', 'ढ', '९'], flex: '1' },
    { code: 'Digit0', key: '0', eng: ['0', ')'], uni: ['०', 'ण'], rom: ['०', ')'], pre: ['0', ')', 'ण', '०'], flex: '1' },
    { code: 'Minus', key: '-', eng: ['-', '_'], uni: ['औ', 'ओ'], rom: ['-', '_'], pre: ['-', '_', '❨', '❩'], flex: '1' },
    { code: 'Equal', key: '=', eng: ['=', '+'], uni: ['‍', '‌'], rom: ['‍', '‌'], pre: ['.', '+', '.', 'ं'], flex: '1' },
    { code: 'Backspace', key: 'Backspace', flex: '2', special: true, label: 'Backspace ⌫' }
  ],
  // Row 2
  [
    { code: 'Tab', key: 'Tab', flex: '1.5', special: true, label: 'Tab ⇥' },
    { code: 'KeyQ', key: 'q', eng: ['q', 'Q'], uni: ['त्र', 'त्त'], rom: ['ट', 'ठ'], pre: ['q', 'Q', 'त्र', 'त्त'], flex: '1' },
    { code: 'KeyW', key: 'w', eng: ['w', 'W'], uni: ['ध', 'ड्ढ'], rom: ['ौ', 'औ'], pre: ['w', 'W', 'ध', 'ध्'], flex: '1' },
    { code: 'KeyE', key: 'e', eng: ['e', 'E'], uni: ['भ', 'ऐ'], rom: ['े', 'ै'], pre: ['e', 'E', 'भ', 'भ्'], flex: '1' },
    { code: 'KeyR', key: 'r', eng: ['r', 'R'], uni: ['च', 'द्ब'], rom: ['र', 'ृ'], pre: ['r', 'R', 'च', 'च्'], flex: '1' },
    { code: 'KeyT', key: 't', eng: ['t', 'T'], uni: ['त', 'ट्ट'], rom: ['त', 'थ'], pre: ['t', 'T', 'त', 'त्'], flex: '1' },
    { code: 'KeyY', key: 'y', eng: ['y', 'Y'], uni: ['थ', 'ठ्ठ'], rom: ['य', 'ञ'], pre: ['y', 'Y', 'थ', 'थ्'], flex: '1' },
    { code: 'KeyU', key: 'u', eng: ['u', 'U'], uni: ['ग', 'ऊ'], rom: ['ु', 'ू'], pre: ['u', 'U', 'ग', 'ग्'], flex: '1' },
    { code: 'KeyI', key: 'i', eng: ['i', 'I'], uni: ['ष', 'क्ष'], rom: ['ि', 'ी'], pre: ['i', 'I', 'ष', 'क्ष्'], flex: '1' },
    { code: 'KeyO', key: 'o', eng: ['o', 'O'], uni: ['य', 'इ'], rom: ['ो', 'ओ'], pre: ['o', 'O', 'य', 'इ'], flex: '1' },
    { code: 'KeyP', key: 'p', eng: ['p', 'P'], uni: ['उ', 'ए'], rom: ['प', 'फ'], pre: ['p', 'P', 'उ', 'ए'], flex: '1' },
    { code: 'BracketLeft', key: '[', eng: ['[', '{'], uni: ['र्', 'ृ'], rom: ['इ', 'ई'], pre: ['[', '{', 'ृ', 'र्'], flex: '1' },
    { code: 'BracketRight', key: ']', eng: [']', '}'], uni: ['े', 'ै'], rom: ['ए', 'ऐ'], pre: [']', '}', 'े', 'ै'], flex: '1' },
    { code: 'Backslash', key: '\\', eng: ['\\', '|'], uni: ['्', 'ं'], rom: ['ॐ', 'ः'], pre: ['\\', '|', '्', '्र'], flex: '1.5' }
  ],
  // Row 3
  [
    { code: 'CapsLock', key: 'CapsLock', flex: '1.75', special: true, label: 'Caps ⇪' },
    { code: 'KeyA', key: 'a', eng: ['a', 'A'], uni: ['ब', 'आ'], rom: ['ा', 'आ'], pre: ['a', 'A', 'ब', 'ब्'], flex: '1' },
    { code: 'KeyS', key: 's', eng: ['s', 'S'], uni: ['क', 'ङ्क'], rom: ['स', 'श'], pre: ['s', 'S', 'क', 'क्'], flex: '1' },
    { code: 'KeyD', key: 'd', eng: ['d', 'D'], uni: ['म', 'ङ्ग'], rom: ['द', 'ध'], pre: ['d', 'D', 'म', 'म्'], flex: '1' },
    { code: 'KeyF', key: 'f', eng: ['f', 'F'], uni: ['ा', 'ँ'], rom: ['उ', 'ऊ'], pre: ['f', 'F', 'ा', 'ँ'], flex: '1' },
    { code: 'KeyG', key: 'g', eng: ['g', 'G'], uni: ['न', 'द्द'], rom: ['ग', 'घ'], pre: ['g', 'G', 'न', 'न्'], flex: '1' },
    { code: 'KeyH', key: 'h', eng: ['h', 'H'], uni: ['ज', 'झ'], rom: ['ह', 'अ'], pre: ['h', 'H', 'ज', 'ज्'], flex: '1' },
    { code: 'KeyJ', key: 'j', eng: ['j', 'J'], uni: ['व', 'ो'], rom: ['ज', 'झ'], pre: ['j', 'J', 'व', 'व्'], flex: '1' },
    { code: 'KeyK', key: 'k', eng: ['k', 'K'], uni: ['प', 'फ'], rom: ['क', 'ख'], pre: ['k', 'K', 'प', 'प्'], flex: '1' },
    { code: 'KeyL', key: 'l', eng: ['l', 'L'], uni: ['ि', 'ी'], rom: ['ल', '॥'], pre: ['l', 'L', 'ि', 'ी'], flex: '1' },
    { code: 'Semicolon', key: ';', eng: [';', ':'], uni: ['स', 'ट्ठ'], rom: [';', ':'], pre: [';', ':', 'स', 'स्'], flex: '1' },
    { code: 'Quote', key: '\'', eng: ['\'', '"'], uni: ['ु', 'ू'], rom: ['\'', '"'], pre: ['\'', '"', 'ु', 'ू'], flex: '1' },
    { code: 'Enter', key: 'Enter', flex: '2.25', special: true, label: 'Enter ↵' }
  ],
  // Row 4
  [
    { code: 'ShiftLeft', key: 'Shift', flex: '2.25', special: true, label: 'Shift ⇧' },
    { code: 'KeyZ', key: 'z', eng: ['z', 'Z'], uni: ['श', 'क्क'], rom: ['ष', 'ऋ'], pre: ['z', 'Z', 'श', 'श्'], flex: '1' },
    { code: 'KeyX', key: 'x', eng: ['x', 'X'], uni: ['ह', 'ह्य'], rom: ['ड', 'ढ'], pre: ['x', 'X', 'ह', 'ह्'], flex: '1' },
    { code: 'KeyC', key: 'c', eng: ['c', 'C'], uni: ['अ', 'ऋ'], rom: ['च', 'छ'], pre: ['c', 'C', 'अ', 'ऋ'], flex: '1' },
    { code: 'KeyV', key: 'v', eng: ['v', 'V'], uni: ['ख', 'ॐ'], rom: ['व', 'ँ'], pre: ['v', 'V', 'ख', 'ख्'], flex: '1' },
    { code: 'KeyB', key: 'b', eng: ['b', 'B'], uni: ['द', 'ौ'], rom: ['ब', 'भ'], pre: ['b', 'B', 'द', 'द्य'], flex: '1' },
    { code: 'KeyN', key: 'n', eng: ['n', 'N'], uni: ['ल', 'द्य'], rom: ['न', 'ण'], pre: ['n', 'N', 'ल', 'ल्'], flex: '1' },
    { code: 'KeyM', key: 'm', eng: ['m', 'M'], uni: ['ः', 'ड्ड'], rom: ['म', 'ं'], pre: ['m', 'M', 'फ', 'ः'], flex: '1' },
    { code: 'Comma', key: ',', eng: [',', '<'], uni: ['ऽ', 'ङ'], rom: [',', 'ङ'], pre: [',', '<', ',', '?'], flex: '1' },
    { code: 'Period', key: '.', eng: ['.', '>'], uni: ['।', 'श्र'], rom: ['।', '.'], pre: ['.', '>', '।', 'श्र'], flex: '1' },
    { code: 'Slash', key: '/', eng: ['/', '?'], uni: ['र', 'रु'], rom: ['्', '?'], pre: ['/', '?', 'र', 'रु'], flex: '1' },
    { code: 'ShiftRight', key: 'Shift', flex: '2.75', special: true, label: 'Shift ⇧' }
  ],
  // Row 5: Proportional Space Bar (spanning C-V-B-N-M) with realistic hardware modifier shells
  [
    { code: 'ControlLeft', key: 'Control', flex: '1.25', special: true, shell: true, label: 'Ctrl' },
    { code: 'Fn', key: 'Fn', flex: '0.9', special: true, shell: true, label: 'Fn' },
    { code: 'MetaLeft', key: 'Meta', flex: '1.1', special: true, shell: true, label: 'Win ⊞' },
    { code: 'AltLeft', key: 'Alt', flex: '1.25', special: true, shell: true, label: 'Alt' },
    { code: 'Space', key: ' ', eng: [' ', ' '], uni: [' ', ' '], rom: [' ', ' '], pre: [' ', ' '], flex: '5.5', special: true, label: 'Space' },
    { code: 'AltRight', key: 'AltGraph', flex: '1.2', special: true, shell: true, label: 'Alt' },
    { code: 'ControlRight', key: 'Control', flex: '1.2', special: true, shell: true, label: 'Ctrl' },
    { code: 'ArrowLeft', key: 'ArrowLeft', flex: '0.65', special: true, shell: true, label: '◀' },
    { code: 'ArrowUp', key: 'ArrowUp', flex: '0.65', special: true, shell: true, label: '▲' },
    { code: 'ArrowDown', key: 'ArrowDown', flex: '0.65', special: true, shell: true, label: '▼' },
    { code: 'ArrowRight', key: 'ArrowRight', flex: '0.65', special: true, shell: true, label: '▶' }
  ]
];

export const KEY_CODE_MAP = {};
KEY_ROWS.forEach(row => {
  row.forEach(k => {
    if (k.code) KEY_CODE_MAP[k.code] = k;
  });
});
