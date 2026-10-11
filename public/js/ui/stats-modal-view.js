/**
 * TopNepali Typing PRO — Stats Modal, SVG Timeline Chart, Personal Bests & Windowed Word Audit
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function downsampleTimeline(timeline, maxPoints = 100) {
  if (!timeline || timeline.length <= maxPoints) return timeline;
  const step = (timeline.length - 1) / (maxPoints - 1);
  const result = [];
  for (let i = 0; i < maxPoints; i++) {
    const idx = Math.min(timeline.length - 1, Math.round(i * step));
    const pt = { ...timeline[idx] };
    const prevIdx = i > 0 ? Math.round((i - 1) * step) : 0;
    let windowErrors = 0;
    for (let k = prevIdx; k <= idx; k++) {
      if (timeline[k] && timeline[k].errors > 0) {
        windowErrors = Math.max(windowErrors, timeline[k].errors);
      }
    }
    pt.errors = windowErrors;
    result.push(pt);
  }
  return result;
}

export function renderTimelineChart(timeline) {
  const svg = document.getElementById('timeline-chart-svg');
  if (!svg) return;

  if (!timeline || timeline.length === 0) {
    svg.innerHTML = '<text x="250" y="60" text-anchor="middle" fill="var(--text-muted)" font-size="12">No speed timeline data recorded</text>';
    return;
  }

  // Downsample to max 100 points for smooth SVG performance on long tests (e.g. 15-30 min UN speeches)
  const displayTimeline = downsampleTimeline(timeline, 100);

  const maxWpm = Math.max(40, ...displayTimeline.map(p => Math.max(p.wpm, p.rawWpm)));
  const roundedMax = Math.ceil(maxWpm / 20) * 20;
  const w = 500;
  const h = 120;
  const padL = 30;
  const padR = 20;
  const padT = 15;
  const padB = 25;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const n = Math.max(1, displayTimeline.length - 1);
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

  const rawPoints = displayTimeline.map((p, i) => `${getX(i)},${getY(p.rawWpm)}`).join(' ');
  const netPoints = displayTimeline.map((p, i) => `${getX(i)},${getY(p.wpm)}`).join(' ');

  const areaPoints = `${getX(0)},${padT + innerH} ` + netPoints + ` ${getX(displayTimeline.length - 1)},${padT + innerH}`;
  svgHtml += `<polygon points="${areaPoints}" fill="url(#wpmGradient)" />`;
  svgHtml += `<polyline points="${rawPoints}" fill="none" stroke="#60a5fa" stroke-width="1.75" stroke-linecap="round" opacity="0.8" />`;
  svgHtml += `<polyline points="${netPoints}" fill="none" stroke="var(--accent-primary)" stroke-width="2.5" stroke-linecap="round" />`;

  displayTimeline.forEach((p, i) => {
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

/**
 * Windowed, Memory-Safe Word-by-Word Typing Log & Correction Audit Manager
 * Eliminates browser freezing & DOM memory exhaustion by rendering bounded pages (max 40 items)
 * Supports multi-dimensional filtering (All, Errors, Fixed, Clean) and Full-Dataset CSV Export.
 */
export const WordAuditManager = {
  rawWords: [],
  filteredWords: [],
  filter: 'all',
  page: 1,
  pageSize: 40,
  isInitialized: false,

  init(wordsLog) {
    this.rawWords = Array.isArray(wordsLog) ? wordsLog : [];
    this.filter = 'all';
    this.page = 1;

    this.bindEventsOnce();
    this.updateCounters();
    this.applyFilter();
    this.render();
  },

  bindEventsOnce() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Filter tabs delegation
    const filterTabs = document.getElementById('audit-filter-tabs');
    filterTabs?.addEventListener('click', (e) => {
      const btn = e.target.closest('.audit-tab-btn');
      if (!btn) return;
      const targetFilter = btn.dataset.filter;
      if (targetFilter && targetFilter !== this.filter) {
        this.filter = targetFilter;
        this.page = 1;
        this.updateTabStyles();
        this.applyFilter();
        this.render();
      }
    });

    // Pagination buttons
    document.getElementById('audit-prev-btn')?.addEventListener('click', () => {
      if (this.page > 1) {
        this.page--;
        this.render();
      }
    });

    document.getElementById('audit-next-btn')?.addEventListener('click', () => {
      const maxPages = Math.max(1, Math.ceil(this.filteredWords.length / this.pageSize));
      if (this.page < maxPages) {
        this.page++;
        this.render();
      }
    });

    // Export CSV
    document.getElementById('audit-export-csv-btn')?.addEventListener('click', () => {
      this.exportCSV();
    });
  },

  updateCounters() {
    const total = this.rawWords.length;
    let errors = 0;
    let fixed = 0;
    let clean = 0;

    for (let i = 0; i < total; i++) {
      const w = this.rawWords[i];
      if (!w.isCorrect) errors++;
      else if (w.hadCorrections) fixed++;
      else clean++;
    }

    const cAll = document.getElementById('audit-count-all');
    const cErr = document.getElementById('audit-count-errors');
    const cFix = document.getElementById('audit-count-fixed');
    const cCln = document.getElementById('audit-count-clean');
    const badgeSummary = document.getElementById('audit-badge-summary');

    if (cAll) cAll.textContent = `${total}`;
    if (cErr) cErr.textContent = `${errors}`;
    if (cFix) cFix.textContent = `${fixed}`;
    if (cCln) cCln.textContent = `${clean}`;
    if (badgeSummary) {
      badgeSummary.textContent = `${total} words • ${errors} err • ${fixed} fixed`;
    }
    this.updateTabStyles();
  },

  updateTabStyles() {
    const btns = document.querySelectorAll('.audit-tab-btn');
    btns.forEach(btn => {
      const f = btn.dataset.filter;
      if (f === this.filter) {
        btn.className = 'px-2.5 py-1 rounded-md font-semibold transition-colors bg-[var(--accent-primary)] text-white shadow-xs cursor-pointer audit-tab-btn';
      } else {
        btn.className = 'px-2.5 py-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer audit-tab-btn';
      }
    });
  },

  applyFilter() {
    if (this.filter === 'errors') {
      this.filteredWords = this.rawWords.filter(w => !w.isCorrect);
    } else if (this.filter === 'fixed') {
      this.filteredWords = this.rawWords.filter(w => w.isCorrect && w.hadCorrections);
    } else if (this.filter === 'clean') {
      this.filteredWords = this.rawWords.filter(w => w.isCorrect && !w.hadCorrections);
    } else {
      this.filteredWords = this.rawWords;
    }
  },

  render() {
    const tbody = document.getElementById('modal-words-log-tbody');
    if (!tbody) return;

    const total = this.filteredWords.length;
    const maxPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.page > maxPages) this.page = maxPages;
    if (this.page < 1) this.page = 1;

    const startIdx = (this.page - 1) * this.pageSize;
    const endIdx = Math.min(startIdx + this.pageSize, total);
    const slice = this.filteredWords.slice(startIdx, endIdx);

    if (slice.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-4 text-center text-muted">No ${this.filter} words in this session</td></tr>`;
    } else {
      tbody.innerHTML = slice.map(w => {
        let statusBadge = '';
        if (w.isCorrect && !w.hadCorrections) {
          statusBadge = '<span class="text-emerald-500 font-semibold">✓ Clean</span>';
        } else if (w.isCorrect && w.hadCorrections) {
          const errCount = (w.errorsCount || 0) + (w.backspacesCount || 0);
          statusBadge = `<span class="text-amber-500 font-semibold">⟲ Fixed (${errCount} err)</span>`;
        } else {
          statusBadge = '<span class="text-red-500 font-semibold">✗ Error</span>';
        }

        const strokes = w.strokesCount || ((w.typedWord || '').length + 1);
        const backspaces = w.backspacesCount || 0;
        const dur = w.durationMs || 0;

        return `
          <tr class="hover:bg-[var(--bg-surface)] transition-colors">
            <td class="py-1.5 px-2.5 text-muted">${w.index}</td>
            <td class="py-1.5 px-2.5 font-semibold text-[var(--text-primary)]">${escapeHtml(w.targetWord)}</td>
            <td class="py-1.5 px-2.5 ${w.isCorrect ? 'text-[var(--text-secondary)]' : 'text-red-500 font-medium'}">${escapeHtml(w.typedWord)}</td>
            <td class="py-1.5 px-2.5">${statusBadge}</td>
            <td class="py-1.5 px-2.5 text-muted text-[11px]">${strokes} st (${backspaces} bk)</td>
            <td class="py-1.5 px-2.5 text-muted text-[11px]">${dur}ms</td>
          </tr>
        `;
      }).join('');
    }

    // Update pagination status
    const rangeInfo = document.getElementById('audit-range-info');
    const pageIndicator = document.getElementById('audit-page-indicator');
    const prevBtn = document.getElementById('audit-prev-btn');
    const nextBtn = document.getElementById('audit-next-btn');

    if (rangeInfo) {
      rangeInfo.textContent = total > 0 ? `Showing ${startIdx + 1}–${endIdx} of ${total}` : 'Showing 0–0 of 0';
    }
    if (pageIndicator) {
      pageIndicator.textContent = `${this.page} / ${maxPages}`;
    }
    if (prevBtn) prevBtn.disabled = (this.page <= 1);
    if (nextBtn) nextBtn.disabled = (this.page >= maxPages);
  },

  exportCSV() {
    if (!this.rawWords || this.rawWords.length === 0) return;
    const header = ['Index', 'Target Word', 'Typed Word', 'Status', 'Strokes', 'Backspaces', 'Errors', 'Duration (ms)'];
    const rows = this.rawWords.map(w => {
      const status = (!w.isCorrect) ? 'Error' : (w.hadCorrections ? 'Fixed' : 'Clean');
      return [
        w.index,
        `"${(w.targetWord || '').replace(/"/g, '""')}"`,
        `"${(w.typedWord || '').replace(/"/g, '""')}"`,
        status,
        w.strokesCount || 0,
        w.backspacesCount || 0,
        w.errorsCount || 0,
        w.durationMs || 0
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `topnepali_typing_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
