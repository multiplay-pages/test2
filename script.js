/**
 * script.js — Logika aplikacji
 * Procedura potwierdzenia otrzymania wypowiedzenia
 *
 * Wersja v2:
 * - stabilniejszy reset stanu
 * - aktywny wskaźnik kroków 1/2/3
 * - mocniejszy smooth scroll
 * - poprawiony feedback po kopiowaniu
 * - bez utrzymywania starego stanu po powrocie z cache przeglądarki
 */

const state = {
  selectedLevel1: null,
  selectedOptionId: null,
  selectedContractType: null,
};

let dom = {};
let copyResetTimeout = null;

function getCurrentOption() {
  if (!state.selectedLevel1 || !state.selectedOptionId) return null;

  const proc = PROCEDURES[state.selectedLevel1];
  if (!proc || !Array.isArray(proc.options)) return null;

  return proc.options.find((option) => option.id === state.selectedOptionId) || null;
}

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
    stepPills: Array.from(document.querySelectorAll(".step-pill")),
  };
}

/* =========================
   Helpers
========================= */

function show(el) {
  if (el) el.classList.remove("is-hidden");
}

function hide(el) {
  if (el) el.classList.add("is-hidden");
}

function setText(el, text) {
  if (el) el.textContent = text ?? "";
}

function clearElement(el) {
  if (el) el.innerHTML = "";
}

function smoothScrollTo(el, block = "start") {
  if (!el) return;

  window.requestAnimationFrame(() => {
    setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block,
      });
    }, 80);
  });
}

function announce(text) {
  if (!dom.liveRegion) return;
  dom.liveRegion.textContent = "";
  window.requestAnimationFrame(() => {
    dom.liveRegion.textContent = text;
  });
}

function setAllPressed(container, activeValue) {
  if (!container) return;

  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    const key =
      button.dataset.key ||
      button.dataset.optionId ||
      button.dataset.type ||
      "";

    button.setAttribute("aria-pressed", key === activeValue ? "true" : "false");
  });
}

function setCopyState(variant, label) {
  if (!dom.copyBtn || !dom.copyLabel) return;

  dom.copyBtn.classList.remove("btn-copy--success", "btn-copy--error");

  if (variant) {
    dom.copyBtn.classList.add(`btn-copy--${variant}`);
  }

  setText(dom.copyLabel, label);
}

function resetCopyButton() {
  if (!dom.copyBtn || !dom.copyLabel) return;

  dom.copyBtn.classList.remove("btn-copy--success", "btn-copy--error");
  dom.copyBtn.disabled = false;
  setText(dom.copyLabel, "Kopiuj tekst");
}

function clearCopyResetTimeout() {
  if (copyResetTimeout) {
    clearTimeout(copyResetTimeout);
    copyResetTimeout = null;
  }
}

function updateResetVisibility() {
  if (state.selectedLevel1) {
    show(dom.resetWrap);
  } else {
    hide(dom.resetWrap);
  }
}

function updateStepProgress() {
  if (!dom.stepPills || dom.stepPills.length < 3) return;

  const currentStep = !state.selectedLevel1
    ? 1
    : !state.selectedOptionId
      ? 2
      : !state.selectedContractType
        ? 3
        : 3;

  dom.stepPills.forEach((pill, index) => {
    const stepNumber = index + 1;

    pill.classList.remove("step-pill--active", "step-pill--done");

    if (stepNumber < currentStep) {
      pill.classList.add("step-pill--done");
    } else if (stepNumber === currentStep) {
      pill.classList.add("step-pill--active");
    }

    pill.setAttribute("aria-current", stepNumber === currentStep ? "step" : "false");
  });
}

function clearResultContent() {
  setText(dom.resMethod, "");
  setText(dom.resDeadline, "");
  setText(dom.resDesc, "");
  clearElement(dom.stepsList);
}

function clearTemplateContent() {
  if (dom.templateContent) {
    dom.templateContent.textContent = "";
    dom.templateContent.classList.remove("is-hidden");
  }

  if (dom.copyBtn) {
    dom.copyBtn.classList.remove("is-hidden");
  }

  const notice = dom.templateArea?.querySelector(".template__notice");
  if (notice) {
    notice.remove();
  }

  if (dom.templateTitle) {
    dom.templateTitle.innerHTML = "Szablon wiadomości";
  }

  clearCopyResetTimeout();
  resetCopyButton();
}

function bindOptionCard(button, optionId) {
  button.addEventListener("click", () => {
    handleLevel2Click(optionId);
  });
}

/* =========================
   Reset logic
========================= */

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
    clearElement(dom.level2Row);
    setAllPressed(dom.level2Row, null);
  }

  if (level <= 3) {
    state.selectedContractType = null;
    hide(dom.conn2);
    hide(dom.resultWrap);
    setAllPressed(dom.typeBtns, null);
    clearResultContent();
  }

  hide(dom.templateArea);
  clearTemplateContent();
  updateResetVisibility();
  updateStepProgress();
}

function resetApplication() {
  resetFrom(1);
}

/* =========================
   Render
========================= */

function renderLevel2() {
  const proc = PROCEDURES[state.selectedLevel1];
  if (!proc) return;

  setAllPressed(dom.level1Row, state.selectedLevel1);

  clearElement(dom.level2Row);

  proc.options.forEach((opt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `card ${opt.colorClass || ""}`.trim();
    button.dataset.optionId = opt.id;
    button.setAttribute("aria-pressed", "false");

    button.innerHTML = `
      <span class="card__top">
        <span class="card__icon">${opt.icon || "•"}</span>
      </span>
      <span class="card__title">${opt.title || ""}</span>
      ${opt.description ? `<span class="card__desc">${opt.description}</span>` : ""}
    `;

    bindOptionCard(button, opt.id);
    dom.level2Row.appendChild(button);
  });

  show(dom.conn1);
  show(dom.level2Label);
  show(dom.level2Row);

  state.selectedOptionId = null;
  state.selectedContractType = null;

  hide(dom.conn2);
  hide(dom.resultWrap);
  hide(dom.templateArea);

  clearResultContent();
  clearTemplateContent();
  setAllPressed(dom.typeBtns, null);

  updateResetVisibility();
  updateStepProgress();
}

function renderResult() {
  const option = getCurrentOption();
  if (!option) return;

  setAllPressed(dom.level2Row, state.selectedOptionId);

  setText(dom.resMethod, option.methodLabel || "");
  setText(dom.resDeadline, option.deadline || "");
  setText(dom.resDesc, option.description || "");

  clearElement(dom.stepsList);

  if (Array.isArray(option.steps)) {
    option.steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      dom.stepsList.appendChild(li);
    });
  }

  state.selectedContractType = null;
  setAllPressed(dom.typeBtns, null);

  hide(dom.templateArea);
  clearTemplateContent();

  show(dom.conn2);
  show(dom.resultWrap);

  updateResetVisibility();
  updateStepProgress();
  announce("Wynik procedury zaktualizowany.");

  smoothScrollTo(dom.resultWrap, "start");
}

function renderTemplate() {
  const option = getCurrentOption();
  if (!option || !state.selectedContractType) return;

  const templateSet = MESSAGE_TEMPLATES[state.selectedContractType];
  if (!templateSet) return;

  setAllPressed(dom.typeBtns, state.selectedContractType);
  clearTemplateContent();

  const channel = option.templateChannel;

  if (channel === "email" || channel === "sms") {
    const content = templateSet[channel] || "";
    const channelLabel = channel === "email" ? "E-MAIL" : "SMS";
    const badgeClass = channel === "email"
      ? "channel-badge--email"
      : "channel-badge--sms";

    dom.templateTitle.innerHTML = `Szablon wiadomości <span class="channel-badge ${badgeClass}">${channelLabel}</span>`;
    dom.templateContent.textContent = content;
    dom.templateContent.classList.remove("is-hidden");
    dom.copyBtn.classList.remove("is-hidden");
  } else {
    const noticeText =
      NO_TEMPLATE_MESSAGES[channel] || NO_TEMPLATE_MESSAGES.none || "Brak gotowego szablonu dla tej ścieżki.";

    dom.templateTitle.innerHTML = "Szablon wiadomości";
    dom.templateContent.classList.add("is-hidden");
    dom.copyBtn.classList.add("is-hidden");

    const notice = document.createElement("div");
    notice.className = "template__notice";
    notice.textContent = noticeText;
    dom.templateArea.appendChild(notice);
  }

  show(dom.templateArea);

  updateResetVisibility();
  updateStepProgress();
  announce("Szablon wiadomości zaktualizowany.");

  smoothScrollTo(dom.templateArea, "nearest");
}

/* =========================
   Event handlers
========================= */

function handleLevel1Click(key) {
  if (!key) return;

  if (state.selectedLevel1 === key) {
    return;
  }

  state.selectedLevel1 = key;
  renderLevel2();
}

function handleLevel2Click(optionId) {
  if (!optionId) return;

  if (state.selectedOptionId === optionId) {
    return;
  }

  state.selectedOptionId = optionId;
  renderResult();
}

function handleContractTypeClick(type) {
  if (!type) return;

  if (state.selectedContractType === type) {
    return;
  }

  state.selectedContractType = type;
  renderTemplate();
}

function handleReset() {
  clearCopyResetTimeout();
  resetApplication();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  announce("Formularz został wyczyszczony.");
}

async function handleCopy() {
  const text = dom.templateContent?.textContent?.trim() || "";
  if (!text || !dom.copyBtn) return;

  clearCopyResetTimeout();
  dom.copyBtn.disabled = true;

  try {
    await navigator.clipboard.writeText(text);
    setCopyState("success", "Skopiowano!");
    announce("Tekst został skopiowany do schowka.");
  } catch (error) {
    setCopyState("error", "Błąd kopiowania");
    announce("Nie udało się skopiować tekstu.");
  }

  copyResetTimeout = window.setTimeout(() => {
    resetCopyButton();
    copyResetTimeout = null;
  }, 3000);
}

/* =========================
   Init
========================= */

function bindStaticEvents() {
  dom.level1Row?.querySelectorAll("button[data-key]").forEach((button) => {
    button.addEventListener("click", () => {
      handleLevel1Click(button.dataset.key);
    });
  });

  dom.typeBtns?.querySelectorAll("button[data-type]").forEach((button) => {
    button.addEventListener("click", () => {
      handleContractTypeClick(button.dataset.type);
    });
  });

  dom.copyBtn?.addEventListener("click", handleCopy);
  dom.resetBtn?.addEventListener("click", handleReset);
}

function init() {
  cacheDom();
  bindStaticEvents();
  resetApplication();
}

document.addEventListener("DOMContentLoaded", init);

/**
 * Reset po powrocie strony z bfcache przeglądarki.
 * To pomaga uniknąć sytuacji, gdy użytkownik wraca na stronę
 * i widzi stary stan formularza mimo oczekiwania czystego startu.
 */
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;

  if (!dom.level1Row) {
    cacheDom();
  }

  resetApplication();
});
