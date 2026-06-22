const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const form = document.querySelector('#estimator-form');
const eventTypeInput = document.querySelector('#event-type');
const guestCountInput = document.querySelector('#guest-count');
const guestCountError = document.querySelector('#guest-count-error');
const extraTablesInput = document.querySelector('#extra-tables');
const chairBufferInput = document.querySelector('#chair-buffer');
const resetButton = document.querySelector('#reset-estimator');
const quoteLink = document.querySelector('#quote-link');

const modeToggle = document.querySelector('#mode-toggle');
const modeDescription = document.querySelector('#mode-description');
const walkthroughMode = document.querySelector('#walkthrough-mode');
const manualMode = document.querySelector('#manual-mode');
const walkthroughForm = document.querySelector('#walkthrough-form');
const walkthroughSteps = [...document.querySelectorAll('.walkthrough-step')];
const walkthroughBack = document.querySelector('#walkthrough-back');
const walkthroughStepNumber = document.querySelector('#walkthrough-step-number');
const walkthroughProgressFill = document.querySelector('#walkthrough-progress-fill');
const walkthroughVisual = document.querySelector('#walkthrough-visual');
const walkthroughVisualImage = document.querySelector('#walkthrough-visual-image');
const walkthroughVisualLabel = document.querySelector('#walkthrough-visual-label');
const guidedGuestCount = document.querySelector('#guided-guest-count');
const guidedGuestError = document.querySelector('#guided-guest-error');
const guidedExtraTables = document.querySelector('#guided-extra-tables');
const guidedQuoteLink = document.querySelector('#walkthrough-quote-link');
const fineTuneButton = document.querySelector('#fine-tune-manually');
const restartWalkthroughButton = document.querySelector('#restart-walkthrough');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const tableStyles = {
  round: { name: 'round tables', capacity: 8, lowRate: 18, highRate: 28 },
  rectangle6: { name: '6-foot rectangular tables', capacity: 8, lowRate: 15, highRate: 24 },
  rectangle8: { name: '8-foot rectangular tables', capacity: 10, lowRate: 18, highRate: 28 },
};

const chairPackSize = 20;
const chairPackPrice = 79;
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
let currentStep = 1;
let currentMode = 'guided';
let isTransitioning = false;

const output = {
  eventType: document.querySelector('#results-event-type'),
  total: document.querySelector('#estimated-cost'),
  guestTables: document.querySelector('#guest-tables'),
  serviceTables: document.querySelector('#service-tables'),
  chairs: document.querySelector('#recommended-chairs'),
  chairPacks: document.querySelector('#chair-packs'),
  tableLabel: document.querySelector('#table-breakdown-label'),
  tableCost: document.querySelector('#table-cost'),
  chairLabel: document.querySelector('#chair-breakdown-label'),
  chairCost: document.querySelector('#chair-cost'),
  guidedEventType: document.querySelector('#walkthrough-summary-label'),
  guidedTotal: document.querySelector('#walkthrough-total'),
  guidedGuestTables: document.querySelector('#walkthrough-guest-tables'),
  guidedServiceTables: document.querySelector('#walkthrough-service-tables'),
  guidedChairs: document.querySelector('#walkthrough-chairs'),
  guidedChairPacks: document.querySelector('#walkthrough-chair-packs'),
};

const getSelectedTableStyle = () => form.elements.tableStyle.value;

const validateGuestCount = () => {
  const guestCount = Number(guestCountInput.value);
  const isValid = Number.isInteger(guestCount) && guestCount >= 1 && guestCount <= 500;
  guestCountInput.setAttribute('aria-invalid', String(!isValid));
  guestCountError.hidden = isValid;
  return isValid;
};

const validateGuidedGuestCount = () => {
  const guestCount = Number(guidedGuestCount.value);
  const isValid = Number.isInteger(guestCount) && guestCount >= 1 && guestCount <= 500;
  guidedGuestCount.setAttribute('aria-invalid', String(!isValid));
  guidedGuestError.hidden = isValid;
  return isValid;
};

const calculateEstimate = () => {
  if (!validateGuestCount()) return null;

  const eventType = eventTypeInput.value;
  const guestCount = Number(guestCountInput.value);
  const extraTables = Math.min(12, Math.max(0, Number(extraTablesInput.value) || 0));
  extraTablesInput.value = String(extraTables);
  const bufferPercent = Number(chairBufferInput.value);
  const tableStyle = tableStyles[getSelectedTableStyle()];
  const guestTables = Math.ceil(guestCount / tableStyle.capacity);
  const totalTables = guestTables + extraTables;
  const recommendedChairs = Math.ceil((guestCount * (100 + bufferPercent)) / 100);
  const chairPacks = Math.ceil(recommendedChairs / chairPackSize);
  const chairCost = chairPacks * chairPackPrice;
  const tableCostLow = totalTables * tableStyle.lowRate;
  const tableCostHigh = totalTables * tableStyle.highRate;
  const subtotalLow = chairCost + tableCostLow;
  const subtotalHigh = chairCost + tableCostHigh;

  return { eventType, guestCount, extraTables, bufferPercent, tableStyle, guestTables, totalTables, recommendedChairs, chairPacks, chairCost, tableCostLow, tableCostHigh, subtotalLow, subtotalHigh };
};

const createQuoteHref = (estimate) => {
  const subject = `Event rental estimate for ${estimate.guestCount} guests`;
  const body = [
    'Hello Funfetti Events,',
    '',
    'I used the event estimator and would like an exact quote.',
    '',
    `Event type: ${estimate.eventType}`,
    `Guest count: ${estimate.guestCount}`,
    `Table style: ${estimate.tableStyle.name}`,
    `Guest tables: ${estimate.guestTables}`,
    `Additional service tables: ${estimate.extraTables}`,
    `Recommended chairs: ${estimate.recommendedChairs}`,
    `20-chair packages: ${estimate.chairPacks}`,
    `Planning subtotal: ${currency.format(estimate.subtotalLow)}–${currency.format(estimate.subtotalHigh)}`,
    '',
    'Please let me know what you recommend and what is available.',
  ].join('\n');

  return `mailto:Events@funfettievents.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const renderEstimate = () => {
  const estimate = calculateEstimate();
  if (!estimate) return null;

  const total = `${currency.format(estimate.subtotalLow)}–${currency.format(estimate.subtotalHigh)}`;
  const summary = `${estimate.eventType} for ${estimate.guestCount} guests`;
  output.eventType.textContent = summary;
  output.total.textContent = total;
  output.guestTables.textContent = estimate.guestTables;
  output.serviceTables.textContent = estimate.extraTables;
  output.chairs.textContent = estimate.recommendedChairs;
  output.chairPacks.textContent = estimate.chairPacks;
  output.tableLabel.textContent = `${estimate.totalTables} ${estimate.tableStyle.name} (${currency.format(estimate.tableStyle.lowRate)}–${currency.format(estimate.tableStyle.highRate)} each)`;
  output.tableCost.textContent = `${currency.format(estimate.tableCostLow)}–${currency.format(estimate.tableCostHigh)}`;
  output.chairLabel.textContent = `${estimate.chairPacks} × 20-chair package`;
  output.chairCost.textContent = currency.format(estimate.chairCost);
  output.guidedEventType.textContent = summary;
  output.guidedTotal.textContent = total;
  output.guidedGuestTables.textContent = estimate.guestTables;
  output.guidedServiceTables.textContent = estimate.extraTables;
  output.guidedChairs.textContent = estimate.recommendedChairs;
  output.guidedChairPacks.textContent = estimate.chairPacks;
  const quoteHref = createQuoteHref(estimate);
  quoteLink.href = quoteHref;
  guidedQuoteLink.href = quoteHref;
  return estimate;
};

const getGuidedEventInput = () => walkthroughForm.elements.guidedEvent;
const getGuidedTableStyle = () => walkthroughForm.elements.guidedTableStyle;
const getGuidedChairBuffer = () => walkthroughForm.elements.guidedChairBuffer;

const updateWalkthroughVisual = () => {
  const selectedEvent = [...getGuidedEventInput()].find((input) => input.checked);
  walkthroughVisual.classList.add('is-changing');
  window.setTimeout(() => {
    walkthroughVisualImage.src = selectedEvent.dataset.image;
    walkthroughVisualLabel.textContent = selectedEvent.value;
    walkthroughVisual.classList.remove('is-changing');
  }, reducedMotion.matches ? 0 : 180);
};

const syncManualFromGuided = () => {
  const selectedEvent = [...getGuidedEventInput()].find((input) => input.checked);
  const selectedTable = [...getGuidedTableStyle()].find((input) => input.checked);
  const selectedBuffer = [...getGuidedChairBuffer()].find((input) => input.checked);
  eventTypeInput.value = selectedEvent.value;
  guestCountInput.value = guidedGuestCount.value;
  form.elements.tableStyle.value = selectedTable.value;
  extraTablesInput.value = String(Math.min(12, Math.max(0, Number(guidedExtraTables.value) || 0)));
  guidedExtraTables.value = extraTablesInput.value;
  chairBufferInput.value = selectedBuffer.value;
  guestCountInput.removeAttribute('aria-invalid');
  guestCountError.hidden = true;
  renderEstimate();
};

const syncGuidedFromManual = () => {
  const guidedEvent = [...getGuidedEventInput()].find((input) => input.value === eventTypeInput.value);
  const guidedTable = [...getGuidedTableStyle()].find((input) => input.value === form.elements.tableStyle.value);
  const guidedBuffer = [...getGuidedChairBuffer()].find((input) => input.value === chairBufferInput.value);
  if (guidedEvent) guidedEvent.checked = true;
  if (guidedTable) guidedTable.checked = true;
  if (guidedBuffer) guidedBuffer.checked = true;
  guidedGuestCount.value = guestCountInput.value;
  guidedExtraTables.value = extraTablesInput.value;
  updateWalkthroughVisual();
};

const updateWalkthroughChrome = () => {
  const progressStep = Math.min(currentStep, 4);
  walkthroughStepNumber.textContent = progressStep;
  walkthroughProgressFill.style.width = `${progressStep * 25}%`;
  walkthroughBack.hidden = currentStep === 1;
  walkthroughVisual.hidden = currentStep === 1;
};

const swapStep = (targetStep) => {
  walkthroughSteps.forEach((step) => {
    const isTarget = Number(step.dataset.step) === targetStep;
    step.hidden = !isTarget;
    step.classList.toggle('is-active', isTarget);
    step.classList.remove('is-leaving');
  });
  currentStep = targetStep;
  updateWalkthroughChrome();
  const activeHeading = walkthroughSteps.find((step) => Number(step.dataset.step) === targetStep)?.querySelector('h2');
  activeHeading?.focus({ preventScroll: true });
  isTransitioning = false;
};

const showStep = (targetStep) => {
  if (isTransitioning || targetStep === currentStep) return;
  const currentPanel = walkthroughSteps.find((step) => Number(step.dataset.step) === currentStep);
  if (reducedMotion.matches) {
    swapStep(targetStep);
    return;
  }
  isTransitioning = true;
  currentPanel.classList.add('is-leaving');
  window.setTimeout(() => swapStep(targetStep), 190);
};

const switchMode = (mode) => {
  currentMode = mode;
  const manualIsActive = mode === 'manual';
  if (manualIsActive) {
    syncManualFromGuided();
  } else {
    syncGuidedFromManual();
  }
  walkthroughMode.hidden = manualIsActive;
  manualMode.hidden = !manualIsActive;
  modeToggle.textContent = manualIsActive ? 'Use Guided Walkthrough' : 'Enter Manually';
  modeDescription.textContent = manualIsActive ? 'Want help choosing each detail?' : 'Prefer to enter everything at once?';
  modeToggle.setAttribute('aria-pressed', String(manualIsActive));
};

document.querySelectorAll('[data-next-step]').forEach((button) => {
  button.addEventListener('click', () => {
    if (currentStep === 1) {
      updateWalkthroughVisual();
      syncManualFromGuided();
    }
    if (currentStep === 2) {
      if (!validateGuidedGuestCount()) return;
      syncManualFromGuided();
    }
    if (currentStep === 3) syncManualFromGuided();
    showStep(currentStep + 1);
  });
});

document.querySelector('[data-show-results]').addEventListener('click', () => {
  syncManualFromGuided();
  if (!renderEstimate()) return;
  showStep(5);
});

walkthroughBack.addEventListener('click', () => showStep(Math.max(1, currentStep - 1)));

document.querySelectorAll('[data-guest-count]').forEach((button) => {
  button.addEventListener('click', () => {
    guidedGuestCount.value = button.dataset.guestCount;
    guidedGuestCount.removeAttribute('aria-invalid');
    guidedGuestError.hidden = true;
  });
});

[...getGuidedEventInput()].forEach((input) => input.addEventListener('change', updateWalkthroughVisual));

modeToggle.addEventListener('click', () => switchMode(currentMode === 'guided' ? 'manual' : 'guided'));
fineTuneButton.addEventListener('click', () => {
  switchMode('manual');
  eventTypeInput.focus({ preventScroll: true });
});

restartWalkthroughButton.addEventListener('click', () => {
  walkthroughForm.reset();
  form.reset();
  guidedGuestError.hidden = true;
  guidedGuestCount.removeAttribute('aria-invalid');
  syncManualFromGuided();
  updateWalkthroughVisual();
  swapStep(1);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderEstimate();
});

form.addEventListener('input', renderEstimate);
form.addEventListener('change', renderEstimate);

resetButton.addEventListener('click', () => {
  form.reset();
  guestCountInput.removeAttribute('aria-invalid');
  guestCountError.hidden = true;
  syncGuidedFromManual();
  renderEstimate();
  guestCountInput.focus();
});

updateWalkthroughChrome();
renderEstimate();
