/**
 * TopNepali Typing PRO — Stats Modal, SVG Timeline Chart & Personal Bests
 */

export function renderTimelineChart(timeline) {
  const svg = document.getElementById('timeline-chart-svg');
  if (!svg) return;

  if (!timeline || timeline.length === 0) {
    svg.innerHTML = '<text x="250" y="60" text-anchor="middle" fill="var(--text-muted)" font-size="12">No speed timeline data recorded</text>';
    return;
  }

  const maxWpm = Math.max(40, ...timeline.map(p => Math.max(p.wpm, p.rawWpm)));
  const roundedMax = Math.ceil(maxWpm / 20) * 20;
  const w = 500;
  const h = 120;
  const padL = 30;
  const padR = 20;
  const padT = 15;
  const padB = 25;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const n = Math.max(1, timeline.length - 1);
  const getX = (i) => padL + (i / n) * innerW;
  const getY = (val) => padT + innerH - (Math.min(val, roundedMax) / roundedMax) * innerH;

  let svgHtml = `
    <defs>
      <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
  `;

  const gridSteps = [0, 0.5, 1];
  gridSteps.forEach(ratio => {
    const yVal = padT + innerH * (1 - ratio);
    const labelVal = Math.round(roundedMax * ratio);
    svgHtml += `<line x1="${padL}" y1="${yVal}" x2="${w - padR}" y2="${yVal}" stroke="var(--border-subtle)" stroke-dasharray="3,3" stroke-width="1" />`;
    svgHtml += `<text x="${padL - 6}" y="${yVal + 3}" text-anchor="end" fill="var(--text-muted)" font-size="9" font-family="monospace">${labelVal}</text>`;
  });

  const rawPoints = timeline.map((p, i) => `${getX(i)},${getY(p.rawWpm)}`).join(' ');
  const netPoints = timeline.map((p, i) => `${getX(i)},${getY(p.wpm)}`).join(' ');

  const areaPoints = `${getX(0)},${padT + innerH} ` + netPoints + ` ${getX(timeline.length - 1)},${padT + innerH}`;
  svgHtml += `<polygon points="${areaPoints}" fill="url(#wpmGradient)" />`;
  svgHtml += `<polyline points="${rawPoints}" fill="none" stroke="#60a5fa" stroke-width="1.75" stroke-linecap="round" opacity="0.8" />`;
  svgHtml += `<polyline points="${netPoints}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" stroke-linecap="round" />`;

  timeline.forEach((p, i) => {
    if (p.errors > 0) {
      svgHtml += `<circle cx="${getX(i)}" cy="${getY(p.wpm)}" r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />`;
    }
  });

  svg.innerHTML = svgHtml;
}

export function updatePersonalBestsCards() {
  try {
    const hist = JSON.parse(localStorage.getItem('nepali_typing_history') || '[]');
    let pbEng = 0;
    let pbUni = 0;
    let pbRom = 0;
    let pbPre = 0;

    hist.forEach(r => {
      const w = Number(r.wpm) || 0;
      if (r.layout === 'english') pbEng = Math.max(pbEng, w);
      if (r.layout === 'nepali_unicode') pbUni = Math.max(pbUni, w);
      if (r.layout === 'nepali_romanized') pbRom = Math.max(pbRom, w);
      if (r.layout === 'nepali_preeti') pbPre = Math.max(pbPre, w);
    });

    const elEng = document.getElementById('pb-english');
    const elUni = document.getElementById('pb-unicode');
    const elRom = document.getElementById('pb-romanized');
    const elPre = document.getElementById('pb-preeti');
    const elTotal = document.getElementById('total-tests-count');

    if (elEng) elEng.textContent = `${pbEng} WPM`;
    if (elUni) elUni.textContent = `${pbUni} WPM`;
    if (elRom) elRom.textContent = `${pbRom} WPM`;
    if (elPre) elPre.textContent = `${pbPre} WPM`;
    if (elTotal) elTotal.textContent = `${hist.length} test${hist.length === 1 ? '' : 's'} recorded`;
  } catch (e) {}
}
