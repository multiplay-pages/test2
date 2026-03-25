/**
 * script.js — Logika aplikacji
 * Procedura potwierdzenia otrzymania wypowiedzenia
 *
 * Centralny stan + render functions.
 * Brak inline eventów — wszystko podpinane tutaj.
 */

/* ═══════════════════════════════════════
   State
   ═══════════════════════════════════════ */
const state = {
  selectedLevel1: null,       // "email" | "poczta" | "bok"
  selectedOptionId: null,     // e.g. "poczta-telkom"
  selectedContractType: null, // "zaleglosc" | "nadplata" | "zerwanie"
};

/* Helper — get current option object from data */
function getCurrentOption() {
  if (!state.selectedLevel1 || !state.selectedOptionId) return null;
  const proc = PROCEDURES[state.selectedLevel1];
  if (!proc) return null;
  return proc.options.find((o) => o.id === state.selectedOptionId) || null;
}

/* ═══════════════════════════════════════
   DOM refs (cached once on DOMContentLoaded)
   ═══════════════════════════════════════ */
let dom = {};

function cacheDom() {
  dom = {
    level1Row: document.getElementById("level1-row"),
    conn1: document.getElementById("conn1"),
    level2Label: document.getElementById("level2-label"),
    level2Row: document.getElementById("level2-row"),
    conn2: document.getElementById("conn2"),
    resultWrap: document.getElementById("result-wrap"),
    resMethod: document.getElementById("res-method"),
    resDeadline: document.getElementById("res-deadline"),
    resDesc: document.getElementById("res-desc"),
    stepsList: document.getElementById("steps-list"),
    typeBtns: document.getElementById("type-btns"),
    templateArea: document.getElementById("template-area"),
    templateTitle: document.getElementById("template-title"),
    templateContent: document.getElementById("template-content"),
    copyBtn: document.getElementById("copy-btn"),
    copyLabel: document.getElementById("copy-label"),
    resetBtn: document.getElementById("reset-btn"),
    resetWrap: document.getElementById("reset-wrap"),
    liveRegion: document.getElementById("live-region"),
  };
}

/* ═══════════════════════════════════════
   Render functions
   ═══════════════════════════════════════ */

/** Clear everything below a given level */
function resetFrom(level) {
  if (level <= 1) {
    state.selectedLevel1 = null;
    setAllPressed(dom.level1Row, null);
  }
  if (level <= 2) {
    state.selectedOptionId = null;
    hide(dom.conn1);
    hide(dom.level2Label);
    hide(dom.level2Row);
    dom.level2Row.innerHTML = "";
  }
  if (level <= 3) {
    state.selectedContractType = null;
    hide(dom.conn2);
    hide(dom.resultWrap);
  }
  hide(dom.templateArea);
  updateResetVisibility();
}

function renderLevel2() {
  const proc = PROCEDURES[state.selectedLevel1];
  if (!proc) return;

  /* Update level 1 pressed states */
  setAllPressed(dom.level1Row, state.selectedLevel1);

  /* Build level 2 cards */
  dom.level2Row.innerHTML = "";
  proc.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = `card ${opt.colorClass}`;
    btn.type = "button";
    btn.setAttribute("aria-pressed", "false");
    btn.dataset.optionId = opt.id;
    btn.innerHTML = `<span class="card__icon">${opt.icon}</span><span class="card__title">${opt.title}</span>`;
    btn.addEventListener("click", () => handleLevel2Click(opt.id));
    dom.level2Row.appendChild(btn);
  });

  show(dom.conn1);
  show(dom.level2Label);
  show(dom.level2Row);

  /* Hide lower levels */
  state.selectedOptionId = null;
  state.selectedContractType = null;
  hide(dom.conn2);
  hide(dom.resultWrap);
  hide(dom.templateArea);

  updateResetVisibility();
}

function renderResult() {
  const opt = getCurrentOption();
  if (!opt) return;

  /* Update level 2 pressed states */
  setAllPressed(dom.level2Row, state.selectedOptionId);

  /* Fill meta */
  setText(dom.resMethod, opt.methodLabel);
  setText(dom.resDeadline, opt.deadline);
  setText(dom.resDesc, opt.description);

  /* Fill steps */
  dom.stepsList.innerHTML = "";
  opt.steps.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    dom.stepsList.appendChild(li);
  });

  /* Reset contract type */
  state.selectedContractType = null;
  setAllPressed(dom.typeBtns, null);
  hide(dom.templateArea);

  show(dom.conn2);
  show(dom.resultWrap);
  dom.resultWrap.scrollIntoView({ behavior: "smooth", block: "start" });

  announce("Wynik procedury zaktualizowany.");
  updateResetVisibility();
}

function renderTemplate() {
  const opt = getCurrentOption();
  if (!opt || !state.selectedContractType) return;

  setAllPressed(dom.typeBtns, state.selectedContractType);

  const channel = opt.templateChannel;
  const tmpl = MESSAGE_TEMPLATES[state.selectedContractType];
  if (!tmpl) return;

  if (channel === "email" || channel === "sms") {
    /* Show actual template */
    const content = tmpl[channel] || "";
    const channelLabel = channel === "email" ? "E-mail" : "SMS";
    const badgeClass = channel === "email" ? "channel-badge--email" : "channel-badge--sms";

    dom.templateTitle.innerHTML = `Szablon wiadomości <span class="channel-badge ${badgeClass}">${channelLabel}</span>`;
    dom.templateContent.textContent = content;
    dom.templateContent.classList.remove("is-hidden");
    dom.copyBtn.classList.remove("is-hidden");

    /* Hide notice if it exists */
    const notice = dom.templateArea.querySelector(".template__notice");
    if (notice) notice.classList.add("is-hidden");
  } else {
    /* No electronic template — show notice */
    const noticeText = NO_TEMPLATE_MESSAGES[channel] || NO_TEMPLATE_MESSAGES.none;
    dom.templateTitle.innerHTML = "Szablon wiadomości";

    /* Hide content + copy, show notice */
    dom.templateContent.classList.add("is-hidden");
    dom.copyBtn.classList.add("is-hidden");

    let notice = dom.templateArea.querySelector(".template__notice");
    if (!notice) {
      notice = document.createElement("div");
      notice.className = "template__notice";
      dom.templateArea.appendChild(notice);
    }
    notice.textContent = noticeText;
    notice.classList.remove("is-hidden");
  }

  resetCopyButton();
  show(dom.templateArea);
  dom.templateArea.scrollIntoView({ behavior: "smooth", block: "nearest" });

  announce("Szablon wiadomości zaktualizowany.");
}

/* ═══════════════════════════════════════
   Event handlers
   ═══════════════════════════════════════ */

function handleLevel1Click(key) {
  if (state.selectedLevel1 === key) return; // already selected
  state.selectedLevel1 = key;
  renderLevel2();
}

function handleLevel2Click(optionId) {
  if (state.selectedOptionId === optionId) return;
  state.selectedOptionId = optionId;
  renderResult();
}

function handleContractTypeClick(type) {
  if (state.selectedContractType === type) return;
  state.selectedContractType = type;
  renderTemplate();
}

function handleReset() {
  resetFrom(1);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleCopy() {
  const text = dom.templateContent.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    setCopyState("success", "Skopiowano!");
  } catch {
    setCopyState("error", "Błąd kopiowania");
  }

  setTimeout(() => resetCopyButton(), 2200);
}

/* ═══════════════════════════════════════
   Helpers
   ═══════════════════════════════════════ */

function show(el) {
  if (el) el.classList.remove("is-hidden");
}

function hide(el) {
  if (el) el.classList.add("is-hidden");
}

function setText(el, text) {
  if (el) el.textContent = text;
}

/** Set aria-pressed on the button whose data-key or data-option-id or data-type matches `activeValue` */
function setAllPressed(container, activeValue) {
  if (!container) return;
  const buttons = container.querySelectorAll("button");
  buttons.forEach((btn) => {
    const key = btn.dataset.key || btn.dataset.optionId || btn.dataset.type || "";
    btn.setAttribute("aria-pressed", key === activeValue ? "true" : "false");
  });
}

function setCopyState(variant, label) {
  dom.copyBtn.classList.remove("btn-copy--success", "btn-copy--error");
  if (variant) dom.copyBtn.classList.add(`btn-copy--${variant}`);
  setText(dom.copyLabel, label);
}

function resetCopyButton() {
  dom.copyBtn.classList.remove("btn-copy--success", "btn-copy--error");
  setText(dom.copyLabel, "Kopiuj tekst");
}

function updateResetVisibility() {
  if (state.selectedLevel1) {
    show(dom.resetWrap);
  } else {
    hide(dom.resetWrap);
  }
}

function announce(text) {
  if (dom.liveRegion) {
    dom.liveRegion.textContent = text;
  }
}

/* ═══════════════════════════════════════
   Init
   ═══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();

  /* Level 1 buttons */
  dom.level1Row.querySelectorAll("button[data-key]").forEach((btn) => {
    btn.addEventListener("click", () => handleLevel1Click(btn.dataset.key));
  });

  /* Contract type buttons */
  dom.typeBtns.querySelectorAll("button[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => handleContractTypeClick(btn.dataset.type));
  });

  /* Copy */
  dom.copyBtn.addEventListener("click", handleCopy);

  /* Reset */
  dom.resetBtn.addEventListener("click", handleReset);

  /* Initial state */
  resetFrom(1);
});
