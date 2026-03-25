'use strict';

/* ─────────────────────────────────────────────────────────────
   CENTRAL STATE
   ───────────────────────────────────────────────────────────── */
const state = {
  level1:   null,   // klucz z PROCEDURES
  level2:   null,   // id z sublevel
  caseType: null    // id z CASE_TYPES
};

/* ─────────────────────────────────────────────────────────────
   DOM HELPERS
   ───────────────────────────────────────────────────────────── */
const el = id => document.getElementById(id);

function show(element) {
  element.classList.remove('hidden');
  element.classList.add('is-entering');
  element.addEventListener('animationend', () => {
    element.classList.remove('is-entering');
  }, { once: true });
}

function hide(element) {
  element.classList.add('hidden');
  element.classList.remove('is-entering');
}

function setActive(container, activeId) {
  container.querySelectorAll('[data-id]').forEach(card => {
    const isActive = card.dataset.id === activeId;
    card.classList.toggle('card--active', isActive);
    card.setAttribute('aria-selected', String(isActive));
  });
}

function smoothScrollTo(element) {
  setTimeout(() => {
    const offset = 24;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 60);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────────────────────
   RENDER — LEVEL 1 CARDS
   ───────────────────────────────────────────────────────────── */
function renderLevel1() {
  const container = el('cards-level1');
  container.innerHTML = '';

  Object.values(PROCEDURES).forEach(proc => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `card card--l1 card--ch-${proc.channel}`;
    btn.dataset.id = proc.id;
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.innerHTML = `
      <span class="card-dot card-dot--${proc.channel}" aria-hidden="true"></span>
      <span class="card-body">
        <span class="card-title">${proc.label}</span>
        <span class="card-desc">${proc.description}</span>
      </span>
      <svg class="card-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    btn.addEventListener('click', () => onLevel1Select(proc.id));
    container.appendChild(btn);
  });
}

/* ─────────────────────────────────────────────────────────────
   HANDLER — LEVEL 1
   ───────────────────────────────────────────────────────────── */
function onLevel1Select(id) {
  state.level1   = id;
  state.level2   = null;
  state.caseType = null;

  setActive(el('cards-level1'), id);
  hide(el('section-result'));
  hide(el('section-cases'));
  hide(el('section-template'));

  renderLevel2(id);
  show(el('section-step2'));
  smoothScrollTo(el('section-step2'));
  showResetBar();
}

/* ─────────────────────────────────────────────────────────────
   RENDER — LEVEL 2 CARDS
   ───────────────────────────────────────────────────────────── */
function renderLevel2(level1Id) {
  const proc = PROCEDURES[level1Id];
  const container = el('cards-level2');
  container.innerHTML = '';

  proc.sublevel.forEach(sub => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `card card--l2 card--ch-${proc.channel}`;
    btn.dataset.id = sub.id;
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.innerHTML = `
      <span class="card-dot card-dot--${proc.channel} card-dot--sm" aria-hidden="true"></span>
      <span class="card-body">
        <span class="card-title">${sub.label}</span>
      </span>
      <svg class="card-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    btn.addEventListener('click', () => onLevel2Select(sub.id));
    container.appendChild(btn);
  });
}

/* ─────────────────────────────────────────────────────────────
   HANDLER — LEVEL 2
   ───────────────────────────────────────────────────────────── */
function onLevel2Select(id) {
  state.level2   = id;
  state.caseType = null;

  const proc = PROCEDURES[state.level1];
  const sub  = proc.sublevel.find(s => s.id === id);

  setActive(el('cards-level2'), id);
  hide(el('section-cases'));
  hide(el('section-template'));

  renderResult(sub.result);
  show(el('section-result'));
  smoothScrollTo(el('section-result'));

  renderCaseTypes(sub.result);
  show(el('section-cases'));
}

/* ─────────────────────────────────────────────────────────────
   RENDER — RESULT PANEL
   ───────────────────────────────────────────────────────────── */
function renderResult(result) {
  const panel  = el('result-panel');
  const chMeta = CHANNEL_META[result.channel];

  const stepsHTML = result.steps.map(step => `
    <li class="proc-step ${step.important ? 'proc-step--important' : ''}">
      <span class="proc-step-num" aria-hidden="true">${step.n}</span>
      <span class="proc-step-text">${step.text}</span>
      ${step.important
        ? '<span class="proc-step-flag" aria-label="Ważny krok">!</span>'
        : ''}
    </li>`).join('');

  panel.className = `result-card result-card--${result.channel}`;
  panel.innerHTML = `
    <div class="result-top">
      <span class="result-badge result-badge--${result.channel}">${chMeta.label}</span>
      <h2 class="result-title">${result.title}</h2>
    </div>
    <div class="result-meta-row">
      <div class="meta-box">
        <span class="meta-box-label">Kanał</span>
        <span class="meta-box-val">${chMeta.label}</span>
      </div>
      <div class="meta-box">
        <span class="meta-box-label">Termin procedury</span>
        <span class="meta-box-val">${result.deadline}</span>
      </div>
      <div class="meta-box">
        <span class="meta-box-label">Status</span>
        <span class="meta-box-val ${result.statusClass}">${result.status}</span>
      </div>
    </div>
    <div class="result-desc">
      <p>${result.description}</p>
    </div>
    <div class="result-steps-section">
      <h3 class="steps-heading">Kroki procedury</h3>
      <ol class="proc-steps-list">
        ${stepsHTML}
      </ol>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   RENDER — CASE TYPE CARDS
   ───────────────────────────────────────────────────────────── */
function renderCaseTypes(result) {
  const container = el('cards-cases');
  container.innerHTML = '';

  CASE_TYPES.forEach(ct => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card card--case';
    btn.dataset.id = ct.id;
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', 'false');
    btn.innerHTML = `
      <span class="case-icon" aria-hidden="true">${ct.icon}</span>
      <span class="card-title">${ct.label}</span>`;
    btn.addEventListener('click', () => onCaseTypeSelect(ct.id, result));
    container.appendChild(btn);
  });
}

/* ─────────────────────────────────────────────────────────────
   HANDLER — CASE TYPE
   ───────────────────────────────────────────────────────────── */
function onCaseTypeSelect(caseTypeId, result) {
  state.caseType = caseTypeId;
  setActive(el('cards-cases'), caseTypeId);

  renderTemplate(result.templateChannel, caseTypeId);
  show(el('section-template'));
  smoothScrollTo(el('section-template'));
}

/* ─────────────────────────────────────────────────────────────
   RENDER — MESSAGE TEMPLATE
   ───────────────────────────────────────────────────────────── */
function renderTemplate(templateChannel, caseTypeId) {
  const panel = el('template-panel');

  if (!templateChannel || !MESSAGE_TEMPLATES[templateChannel]) {
    renderNoTemplate(panel);
    return;
  }

  const tplGroup = MESSAGE_TEMPLATES[templateChannel];
  const tpl      = tplGroup[caseTypeId];

  if (!tpl) {
    renderNoTemplate(panel);
    return;
  }

  const chMeta = CHANNEL_META[templateChannel];

  panel.innerHTML = `
    <div class="tpl-card">
      <div class="tpl-header">
        <div class="tpl-header-left">
          <span class="tpl-label">Szablon wiadomości</span>
          <span class="tpl-ch-badge tpl-ch-badge--${templateChannel}">
            ${chMeta ? chMeta.label : templateChannel}
          </span>
        </div>
        <button type="button" class="btn-copy" id="btn-copy" aria-live="polite">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.4"/>
            <path d="M2 10H1.5A1.5 1.5 0 0 1 0 8.5V1.5A1.5 1.5 0 0 1 1.5 0H8.5A1.5 1.5 0 0 1 10 1.5V2" stroke="currentColor" stroke-width="1.4"/>
          </svg>
          Kopiuj treść
        </button>
      </div>
      <div class="tpl-subject">
        <span class="tpl-field-label">Temat:</span>
        <span class="tpl-subject-text">${escapeHtml(tpl.subject)}</span>
      </div>
      <div class="tpl-body-wrap">
        <pre class="tpl-body" id="tpl-body-text">${escapeHtml(tpl.body)}</pre>
      </div>
      <div class="tpl-footer">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M6.5 4.5v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="6.5" cy="9" r="0.8" fill="currentColor"/>
        </svg>
        <span>Pola w nawiasach <strong>[ ]</strong> należy uzupełnić przed wysyłką</span>
      </div>
    </div>`;
}

function renderNoTemplate(panel) {
  const proc    = PROCEDURES[state.level1];
  const chLabel = proc ? CHANNEL_META[proc.channel].label : 'ta ścieżka';

  panel.innerHTML = `
    <div class="tpl-card tpl-card--empty">
      <div class="no-tpl-icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
          <path d="M20 12v9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="20" cy="26.5" r="2" fill="currentColor" opacity="0.7"/>
        </svg>
      </div>
      <h3 class="no-tpl-title">Brak szablonu elektronicznego</h3>
      <p class="no-tpl-desc">
        Ścieżka <strong>${chLabel}</strong> nie posiada gotowego szablonu wiadomości e-mail.
        Korespondencja w tej ścieżce odbywa się wyłącznie w formie papierowej lub zgodnie
        z wewnętrzną procedurą działu prawnego.
      </p>
      <div class="no-tpl-note">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style="flex-shrink:0;margin-top:1px">
          <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M7.5 5v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="7.5" cy="11" r="0.9" fill="currentColor"/>
        </svg>
        <span>Skorzystaj z dokumentów w zasobach wewnętrznych lub skontaktuj się z działem prawnym.</span>
      </div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   COPY TEMPLATE — event delegation (survives re-renders)
   ───────────────────────────────────────────────────────────── */
document.addEventListener('click', e => {
  if (e.target.closest('#btn-copy')) {
    handleCopy();
  }
});

function handleCopy() {
  const bodyEl = el('tpl-body-text');
  const btn    = el('btn-copy');
  if (!bodyEl || !btn) return;

  const text = bodyEl.textContent;

  const doSuccess = () => setCopySuccess(btn);

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(doSuccess).catch(() => fallbackCopy(text, doSuccess));
  } else {
    fallbackCopy(text, doSuccess);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  Object.assign(ta.style, { position: 'fixed', opacity: '0', top: '0', left: '0' });
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    cb();
  } catch (_) { /* silent */ }
  document.body.removeChild(ta);
}

function setCopySuccess(btn) {
  btn.classList.add('btn-copy--ok');
  btn.setAttribute('aria-label', 'Skopiowano do schowka');
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7l3.5 3.5 6.5-6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Skopiowano!`;

  setTimeout(() => {
    btn.classList.remove('btn-copy--ok');
    btn.removeAttribute('aria-label');
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="8" height="8" rx="1.2" stroke="currentColor" stroke-width="1.4"/>
        <path d="M2 10H1.5A1.5 1.5 0 0 1 0 8.5V1.5A1.5 1.5 0 0 1 1.5 0H8.5A1.5 1.5 0 0 1 10 1.5V2" stroke="currentColor" stroke-width="1.4"/>
      </svg>
      Kopiuj treść`;
  }, 2500);
}

/* ─────────────────────────────────────────────────────────────
   RESET BAR
   ───────────────────────────────────────────────────────────── */
function showResetBar() {
  show(el('reset-bar'));
}

function hideResetBar() {
  hide(el('reset-bar'));
}

/* ─────────────────────────────────────────────────────────────
   RESET
   ───────────────────────────────────────────────────────────── */
function reset() {
  state.level1   = null;
  state.level2   = null;
  state.caseType = null;

  ['section-step2', 'section-result', 'section-cases', 'section-template']
    .forEach(id => hide(el(id)));

  renderLevel1();
  hideResetBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────────────────
   RENDER — LEGEND
   ───────────────────────────────────────────────────────────── */
function renderLegend() {
  const list = el('legend-list');
  list.innerHTML = LEGEND_ITEMS.map(item => `
    <li class="legend-item">
      <span class="legend-dot legend-dot--${item.channel}" aria-hidden="true"></span>
      <span class="legend-item-body">
        <span class="legend-item-label">${item.label}</span>
        <span class="legend-item-desc">${item.description}</span>
      </span>
    </li>`).join('');
}

/* ─────────────────────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────────────────────── */
function init() {
  renderLevel1();
  renderLegend();
  el('btn-reset').addEventListener('click', reset);
}

document.addEventListener('DOMContentLoaded', init);
