/* ===================================================
   DRAGONFOCUS — app.js
   Dragon in Space theme
   Vanilla JS ES6+ | localStorage | Web Audio API
   =================================================== */

'use strict';

// ===== CONSTANTS =====
const STORAGE_KEYS = {
  TASKS: 'dragonfocus_tasks',
  SETTINGS: 'dragonfocus_settings',
  SESSIONS_TODAY: 'dragonfocus_sessions_today',
  SESSIONS_DATE: 'dragonfocus_sessions_date',
};

const MASCOT_STATES = {
  idle:    { bubble: 'Siap bertarung bersamamu! ⚔️', cssState: '' },
  focus:   { bubble: 'FOKUS! Nyalakan api dalam dirimu! 🔥', cssState: 'state-focus' },
  break:   { bubble: 'Istirahat sebentar... kumpulkan tenaga 💫', cssState: 'state-break' },
  done:    { bubble: 'LEGENDARIS! Sesi selesai! ⚡', cssState: 'state-done' },
  longbrk: { bubble: 'Recharge total... naga pun butuh tidur 🌌', cssState: 'state-break' },
};

const GREETINGS = [
  '⚡ Siap bertarung, pejuang kosmik!',
  '🐉 Api naga dalam dirimu tak bisa padam!',
  '🌌 Di antara bintang-bintang, kamu yang paling bersinar!',
  '🔥 Setiap tugas adalah musuh yang bisa kamu taklukkan!',
  '💫 Kosmik menunggumu, warrior!',
  '⚔️ Misi hari ini: Habisi semua quest-mu!',
  '🐉 Terbang tinggi, satu quest per satu!',
  '🔮 Kekuatan naga ada dalam fokusmu!',
];

// ===== STATE =====
const state = {
  tasks: [],
  activeTaskId: null,
  currentFilter: 'all',
  timer: {
    mode: 'focus',
    secondsLeft: 25 * 60,
    totalSeconds: 25 * 60,
    running: false,
    interval: null,
  },
  settings: { focus: 25, short: 5, long: 15 },
  sessionsToday: 0,
  ambientSound: null,
  ambientActive: null,
  ambientVolume: 0.5,
  audioCtx: null,
  starsAnimId: null,
};

// ===== DOM REFS =====
const $ = (id) => document.getElementById(id);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

const dom = {
  body: document.body,
  greeting: $('header-greeting'),
  starsCanvas: $('stars-canvas'),

  // Timer
  timerDisplay: $('timer-display'),
  timerMinutes: $('timer-minutes'),
  timerSeconds: $('timer-seconds'),
  progressBar: $('progress-bar'),
  progressBarGlow: $('progress-bar-glow'),
  startPauseBtn: $('start-pause-btn'),
  startPauseText: $('start-pause-text'),
  playIcon: $('play-icon'),
  resetBtn: $('reset-btn'),
  skipBtn: $('skip-btn'),
  modeTabs: $$('.mode-tab'),
  mascotImg: $('mascot-img'),
  mascotBubble: $('mascot-bubble'),
  mascotGlowRing: $('mascot-glow-ring'),
  sessionDots: [$('sess-1'), $('sess-2'), $('sess-3'), $('sess-4')],
  activeTaskDisplay: $('active-task-display'),
  activeTaskName: $('active-task-name'),

  // Todo
  taskInput: $('task-input'),
  taskCategory: $('task-category'),
  taskPomodoro: $('task-pomodoro'),
  addTaskBtn: $('add-task-btn'),
  taskList: $('task-list'),
  todoCount: $('todo-count'),
  emptyState: $('empty-state'),
  filterTabs: $$('.filter-tab'),
  clearDoneBtn: $('clear-done-btn'),

  // Settings
  settingsBtn: $('settings-btn'),
  settingsModal: $('settings-modal'),
  closeSettingsBtn: $('close-settings-btn'),
  saveSettingsBtn: $('save-settings-btn'),
  settingsFocus: $('settings-focus'),
  settingsShort: $('settings-short'),
  settingsLong: $('settings-long'),

  // Ambient
  ambientToggleBtn: $('ambient-toggle-btn'),
  ambientPanel: $('ambient-panel'),
  closeAmbientBtn: $('close-ambient-btn'),
  ambientBtns: $$('.ambient-btn'),
  ambientVolume: $('ambient-volume'),

  confettiCanvas: $('confetti-canvas'),
  toast: $('toast'),
};

// ===== INIT =====
function init() {
  loadFromStorage();
  setRandomGreeting();
  initStarField();
  renderSessionDots();
  renderTasks();
  updateTimerDisplay();
  updateModeUI();
  attachEventListeners();
  updatePageTitle();
}

// ===== STAR FIELD =====
function initStarField() {
  const canvas = dom.starsCanvas;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  const STAR_COLORS = ['#ffffff', '#aaccff', '#ffeecc', '#ccaaff', '#aaffee', '#ffccaa'];
  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.2,
    alpha: Math.random() * 0.8 + 0.1,
    alphaDir: Math.random() < 0.5 ? 1 : -1,
    alphaSpeed: Math.random() * 0.008 + 0.002,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  }));

  // Shooting stars
  const shootingStars = [];
  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      vx: Math.random() * 6 + 3,
      vy: Math.random() * 3 + 1,
      len: Math.random() * 80 + 40,
      alpha: 1,
      life: 1,
    });
  }

  setInterval(spawnShootingStar, 3500);

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw twinkling stars
    stars.forEach(s => {
      s.alpha += s.alphaDir * s.alphaSpeed;
      if (s.alpha >= 0.9) { s.alpha = 0.9; s.alphaDir = -1; }
      if (s.alpha <= 0.05) { s.alpha = 0.05; s.alphaDir = 1; }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.shadowBlur = s.r > 1.2 ? 4 : 0;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= 0.025;
      if (ss.life <= 0 || ss.x > canvas.width + 100) {
        shootingStars.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = ss.life * 0.7;
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 10, ss.y - ss.vy * 10);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * 12, ss.y - ss.vy * 12);
      ctx.stroke();
      ctx.restore();
    }

    state.starsAnimId = requestAnimationFrame(drawFrame);
  }

  drawFrame();
  window.addEventListener('resize', () => { resize(); });
}

// ===== STORAGE =====
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    state.tasks = saved ? JSON.parse(saved) : getDefaultTasks();
  } catch { state.tasks = getDefaultTasks(); }

  try {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) Object.assign(state.settings, JSON.parse(savedSettings));
  } catch {}

  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(STORAGE_KEYS.SESSIONS_DATE);
  if (savedDate === today) {
    state.sessionsToday = parseInt(localStorage.getItem(STORAGE_KEYS.SESSIONS_TODAY) || '0', 10);
  } else {
    state.sessionsToday = 0;
    localStorage.setItem(STORAGE_KEYS.SESSIONS_DATE, today);
    localStorage.setItem(STORAGE_KEYS.SESSIONS_TODAY, '0');
  }

  const dur = state.settings[state.timer.mode];
  state.timer.secondsLeft = dur * 60;
  state.timer.totalSeconds = dur * 60;

  dom.settingsFocus.value = state.settings.focus;
  dom.settingsShort.value = state.settings.short;
  dom.settingsLong.value = state.settings.long;
}

function saveTasks() { localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(state.tasks)); }
function saveSettings() { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings)); }
function saveSessionsToday() { localStorage.setItem(STORAGE_KEYS.SESSIONS_TODAY, String(state.sessionsToday)); }

function getDefaultTasks() {
  return [
    { id: uid(), text: 'Selesaikan laporan mingguan', category: 'kerja', pomodoroTarget: 2, pomodoroDone: 0, done: false },
    { id: uid(), text: 'Baca buku 30 halaman', category: 'pribadi', pomodoroTarget: 1, pomodoroDone: 0, done: false },
    { id: uid(), text: 'Review catatan kuliah', category: 'kuliah', pomodoroTarget: 3, pomodoroDone: 1, done: false },
  ];
}

// ===== UTILS =====
function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
function pad(n) { return String(n).padStart(2, '0'); }
function setRandomGreeting() { dom.greeting.textContent = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]; }

// ===== TIMER =====
function updateTimerDisplay() {
  const m = Math.floor(state.timer.secondsLeft / 60);
  const s = state.timer.secondsLeft % 60;
  dom.timerMinutes.textContent = pad(m);
  dom.timerSeconds.textContent = pad(s);

  const pct = state.timer.totalSeconds > 0
    ? ((state.timer.totalSeconds - state.timer.secondsLeft) / state.timer.totalSeconds) * 100
    : 0;
  dom.progressBar.style.width = `${pct}%`;
  dom.progressBarGlow.style.width = `${pct}%`;
  dom.progressBar.parentElement.setAttribute('aria-valuenow', Math.round(pct));
  updatePageTitle();
}

function updatePageTitle() {
  const m = Math.floor(state.timer.secondsLeft / 60);
  const s = state.timer.secondsLeft % 60;
  const label = state.timer.mode === 'focus' ? 'FOCUS 🔥' : state.timer.mode === 'short' ? 'Break ⚡' : 'Deep Rest 🌌';
  document.title = state.timer.running
    ? `(${pad(m)}:${pad(s)}) ${label} — DragonFocus 🐉`
    : 'DragonFocus 🐉 — Conquer Your Tasks';
}

function startTimer() {
  if (state.timer.running) return;
  clearInterval(state.timer.interval);
  state.timer.running = true;
  dom.startPauseText.textContent = 'Pause';
  dom.playIcon.className = 'ph-bold ph-pause';
  setMascotState(state.timer.mode === 'focus' ? 'focus' : state.timer.mode === 'long' ? 'longbrk' : 'break');

  state.timer.interval = setInterval(() => {
    if (state.timer.secondsLeft <= 0) {
      clearInterval(state.timer.interval);
      state.timer.running = false;
      onTimerDone();
      return;
    }
    state.timer.secondsLeft--;
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  if (!state.timer.running) return;
  clearInterval(state.timer.interval);
  state.timer.running = false;
  dom.startPauseText.textContent = 'Lanjut';
  dom.playIcon.className = 'ph-bold ph-play';
  setMascotState('idle');
}

function resetTimer() {
  clearInterval(state.timer.interval);
  state.timer.running = false;
  const dur = state.settings[state.timer.mode];
  state.timer.secondsLeft = dur * 60;
  state.timer.totalSeconds = dur * 60;
  dom.startPauseText.textContent = 'Start';
  dom.playIcon.className = 'ph-bold ph-play';
  updateTimerDisplay();
  setMascotState('idle');
}

function switchMode(mode) {
  if (state.timer.running) pauseTimer();
  state.timer.mode = mode;
  resetTimer();
  updateModeUI();
}

function updateModeUI() {
  dom.modeTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === state.timer.mode);
    tab.setAttribute('aria-selected', tab.dataset.mode === state.timer.mode);
  });
  const isBreak = state.timer.mode === 'short' || state.timer.mode === 'long';
  dom.body.classList.toggle('mode-break', isBreak);
}

function onTimerDone() {
  playDragonRoar();

  // Flash timer
  dom.timerDisplay.style.animation = 'timerDoneFlare 0.8s ease 3';
  setTimeout(() => dom.timerDisplay.style.animation = '', 2400);

  if (state.timer.mode === 'focus') {
    state.sessionsToday++;
    saveSessionsToday();

    if (state.activeTaskId) {
      const task = state.tasks.find(t => t.id === state.activeTaskId);
      if (task && !task.done) {
        task.pomodoroDone = Math.min(task.pomodoroDone + 1, task.pomodoroTarget);
        if (task.pomodoroDone >= task.pomodoroTarget) {
          showToast(`⚡ "${task.text}" — target sesi tercapai!`);
        }
        saveTasks();
        renderTasks();
      }
    }

    renderSessionDots();
    setMascotState('done');

    if (state.sessionsToday % 4 === 0) {
      showToast('🌌 Luar biasa! 4 sesi fokus. Ambil Long Break, pejuang!');
      setTimeout(() => switchMode('long'), 2500);
    } else {
      showToast('🔥 Sesi selesai! Istirahat sejenak~');
      setTimeout(() => switchMode('short'), 2500);
    }

    setTimeout(() => setMascotState('break'), 2500);
  } else {
    showToast('🐉 Break selesai! Kembali bertarung!');
    switchMode('focus');
    setMascotState('idle');
  }
}

function skipTimer() {
  clearInterval(state.timer.interval);
  state.timer.running = false;
  const next = state.timer.mode === 'focus'
    ? (state.sessionsToday % 4 === 3 ? 'long' : 'short')
    : 'focus';
  switchMode(next);
}

// ===== MASCOT =====
function setMascotState(stateKey) {
  const s = MASCOT_STATES[stateKey] || MASCOT_STATES.idle;
  dom.mascotBubble.textContent = s.bubble;

  // Remove all state classes
  dom.mascotImg.classList.remove('state-focus', 'state-break', 'state-done');
  if (s.cssState) dom.mascotImg.classList.add(s.cssState);
}

// ===== SESSION DOTS =====
function renderSessionDots() {
  const inCycle = state.sessionsToday % 4;
  const allFull = inCycle === 0 && state.sessionsToday > 0;
  dom.sessionDots.forEach((dot, i) => {
    const show = allFull || i < inCycle;
    dot.classList.toggle('filled', show);
    dot.setAttribute('aria-label', show ? `Sesi ${i + 1} selesai` : `Sesi ${i + 1} belum`);
  });
}

// ===== TASKS =====
function addTask() {
  const text = dom.taskInput.value.trim();
  if (!text) {
    dom.taskInput.focus();
    dom.taskInput.style.borderColor = '#EF4444';
    dom.taskInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
    setTimeout(() => {
      dom.taskInput.style.borderColor = '';
      dom.taskInput.style.boxShadow = '';
    }, 800);
    return;
  }

  const task = {
    id: uid(),
    text,
    category: dom.taskCategory.value,
    pomodoroTarget: Math.max(1, parseInt(dom.taskPomodoro.value, 10) || 1),
    pomodoroDone: 0,
    done: false,
    createdAt: Date.now(),
  };

  state.tasks.unshift(task);
  saveTasks();
  dom.taskInput.value = '';
  dom.taskPomodoro.value = 1;
  renderTasks();
  dom.taskInput.focus();
}

function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  if (task.done) {
    if (state.activeTaskId === id) {
      state.activeTaskId = null;
      updateActiveTaskDisplay();
    }
    launchFireParticles();
    showToast(`⚔️ "${task.text}" — quest selesai! Luar biasa!`);
  }
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  if (state.activeTaskId === id) { state.activeTaskId = null; updateActiveTaskDisplay(); }
  saveTasks();
  renderTasks();
}

function setActiveTask(id) {
  state.activeTaskId = (state.activeTaskId === id) ? null : id;
  updateActiveTaskDisplay();
  renderTasks();
}

function updateActiveTaskDisplay() {
  if (state.activeTaskId) {
    const task = state.tasks.find(t => t.id === state.activeTaskId);
    if (task) {
      dom.activeTaskName.textContent = task.text;
      dom.activeTaskDisplay.style.borderColor = 'rgba(255, 107, 53, 0.5)';
      return;
    }
  }
  dom.activeTaskName.textContent = 'Pilih quest dari papan →';
  dom.activeTaskDisplay.style.borderColor = '';
}

function clearDoneTasks() {
  const count = state.tasks.filter(t => t.done).length;
  if (count === 0) { showToast('😤 Tidak ada quest selesai yang bisa dihapus'); return; }
  state.tasks = state.tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
  showToast(`🗑️ ${count} quest selesai dihapus`);
}

function getFilteredTasks() {
  switch (state.currentFilter) {
    case 'active': return state.tasks.filter(t => !t.done);
    case 'done':   return state.tasks.filter(t => t.done);
    default:       return state.tasks;
  }
}

function renderTasks() {
  const filtered = getFilteredTasks();
  dom.taskList.innerHTML = '';

  const total = state.tasks.length;
  const done = state.tasks.filter(t => t.done).length;
  dom.todoCount.textContent = `${done}/${total} quest`;

  if (filtered.length === 0) { dom.emptyState.removeAttribute('hidden'); return; }
  dom.emptyState.setAttribute('hidden', '');

  const tagLabels = { kuliah: '📚 Kuliah', kerja: '⚔️ Misi', pribadi: '🌌 Personal', lainnya: '🔮 Lainnya' };

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.done ? ' done' : ''}${task.id === state.activeTaskId && !task.done ? ' active-task' : ''}`;
    li.dataset.id = task.id;
    li.setAttribute('role', 'listitem');

    const tagClass = `tag-${task.category}`;

    li.innerHTML = `
      <button class="task-checkbox" aria-label="${task.done ? 'Tandai belum selesai' : 'Tandai selesai'}" data-id="${task.id}" data-action="toggle">
        ${task.done ? '<i class="ph-bold ph-check"></i>' : ''}
      </button>
      <div class="task-body">
        <span class="task-text">${escapeHtml(task.text)}</span>
        <div class="task-meta">
          <span class="task-tag ${tagClass}">${tagLabels[task.category] || task.category}</span>
          <span class="task-pomodoro-badge">🔥 ${task.pomodoroDone}/${task.pomodoroTarget}</span>
        </div>
      </div>
      <div class="task-actions">
        ${!task.done ? `<button class="task-action-btn select-btn" aria-label="Jadikan quest aktif" data-id="${task.id}" data-action="select" title="Kerjakan sekarang">
          <i class="ph-bold ph-crosshair-simple"></i>
        </button>` : ''}
        <button class="task-action-btn delete-btn" aria-label="Hapus quest" data-id="${task.id}" data-action="delete" title="Hapus">
          <i class="ph-bold ph-trash"></i>
        </button>
      </div>
    `;

    dom.taskList.appendChild(li);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== SETTINGS =====
function openSettings() {
  dom.settingsFocus.value = state.settings.focus;
  dom.settingsShort.value = state.settings.short;
  dom.settingsLong.value = state.settings.long;
  dom.settingsModal.removeAttribute('hidden');
}

function closeSettings() { dom.settingsModal.setAttribute('hidden', ''); }

function saveSettingsFromModal() {
  const focus = Math.max(1, Math.min(60, parseInt(dom.settingsFocus.value, 10) || 25));
  const short = Math.max(1, Math.min(30, parseInt(dom.settingsShort.value, 10) || 5));
  const long  = Math.max(1, Math.min(60, parseInt(dom.settingsLong.value, 10) || 15));

  state.settings = { focus, short, long };
  saveSettings();

  if (!state.timer.running) {
    const dur = state.settings[state.timer.mode];
    state.timer.secondsLeft = dur * 60;
    state.timer.totalSeconds = dur * 60;
    updateTimerDisplay();
  }

  closeSettings();
  showToast('✅ Pengaturan tersimpan!');
}

function adjustNumber(targetId, action) {
  const input = $(targetId);
  const val = parseInt(input.value, 10) || 0;
  input.value = Math.max(parseInt(input.min, 10), Math.min(parseInt(input.max, 10), action === 'inc' ? val + 1 : val - 1));
}

// ===== AUDIO =====
function getAudioCtx() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return state.audioCtx;
}

// === DRAGON ROAR (synthesized) ===
function playDragonRoar() {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    // Master compressor for final output
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 6;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;
    compressor.connect(ctx.destination);

    // --- LAYER 1: Sub bass growl ---
    const sub = ctx.createOscillator();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(60, now);
    sub.frequency.linearRampToValueAtTime(90, now + 0.15);
    sub.frequency.exponentialRampToValueAtTime(35, now + 1.8);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.55, now + 0.1);
    subGain.gain.setValueAtTime(0.55, now + 0.4);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    const subFilter = ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.value = 300;
    subFilter.Q.value = 2;

    sub.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(compressor);
    sub.start(now);
    sub.stop(now + 1.9);

    // --- LAYER 2: Mid harmonic scream ---
    const mid = ctx.createOscillator();
    mid.type = 'sawtooth';
    mid.frequency.setValueAtTime(180, now);
    mid.frequency.linearRampToValueAtTime(280, now + 0.08);
    mid.frequency.exponentialRampToValueAtTime(100, now + 1.4);

    const midGain = ctx.createGain();
    midGain.gain.setValueAtTime(0, now);
    midGain.gain.linearRampToValueAtTime(0.35, now + 0.06);
    midGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    // Waveshaper distortion for grit
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      const x = (i * 2) / 512 - 1;
      const k = 180;
      curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
    }
    shaper.curve = curve;
    shaper.oversample = '4x';

    mid.connect(shaper);
    shaper.connect(midGain);
    midGain.connect(compressor);
    mid.start(now);
    mid.stop(now + 1.5);

    // --- LAYER 3: Noise burst (attack impact) ---
    const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.6), ctx.sampleRate);
    const nData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseBuf.length; i++) nData[i] = Math.random() * 2 - 1;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 600;
    noiseFilter.Q.value = 1.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(compressor);
    noiseSource.start(now);

    // --- LAYER 4: High freq sizzle (fire) ---
    const fireBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.4), ctx.sampleRate);
    const fData = fireBuf.getChannelData(0);
    for (let i = 0; i < fireBuf.length; i++) fData[i] = Math.random() * 2 - 1;
    const fireSource = ctx.createBufferSource();
    fireSource.buffer = fireBuf;

    const fireFilter = ctx.createBiquadFilter();
    fireFilter.type = 'highpass';
    fireFilter.frequency.value = 2500;

    const fireGain = ctx.createGain();
    fireGain.gain.setValueAtTime(0.18, now + 0.05);
    fireGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    fireSource.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(compressor);
    fireSource.start(now + 0.05);

  } catch (e) {
    console.warn('Dragon roar error:', e);
  }
}

// === AMBIENT SOUNDS (Dragon / Space themed) ===
const ambientGenerators = {
  dragonlair: (ctx, volume) => {
    // Deep cave rumble + fire crackle
    const bufferSize = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * 0.08 * (0.5 + 0.5 * Math.sin(t * 0.7));
    }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth'; osc.frequency.value = 55;
    const oscGain = ctx.createGain(); oscGain.gain.value = volume * 0.04;
    osc.connect(oscGain); oscGain.connect(ctx.destination);
    osc.start();

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 500;
    const gainNode = ctx.createGain(); gainNode.gain.value = volume * 0.5;
    src.connect(filter); filter.connect(gainNode); gainNode.connect(ctx.destination);
    src.start();

    return { source: { stop: () => { src.stop(); osc.stop(); } }, gainNode };
  },

  spacevoid: (ctx, volume) => {
    // Eerie space drone
    const osc1 = ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 45;
    const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 67.5;
    const osc3 = ctx.createOscillator(); osc3.type = 'triangle'; osc3.frequency.value = 90;

    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 8;
    lfo.connect(lfoGain); lfoGain.connect(osc1.frequency);

    const gainNode = ctx.createGain(); gainNode.gain.value = volume * 0.3;
    const g2 = ctx.createGain(); g2.gain.value = volume * 0.2;
    const g3 = ctx.createGain(); g3.gain.value = volume * 0.1;

    osc1.connect(gainNode); gainNode.connect(ctx.destination);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc3.connect(g3); g3.connect(ctx.destination);

    [osc1, osc2, osc3, lfo].forEach(o => o.start());
    return { source: { stop: () => [osc1, osc2, osc3, lfo].forEach(o => o.stop()) }, gainNode };
  },

  volcano: (ctx, volume) => {
    // Fire + deep lava rumble
    const bufSize = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass'; bandpass.frequency.value = 400; bandpass.Q.value = 0.8;

    const gainNode = ctx.createGain(); gainNode.gain.value = volume * 0.45;
    src.connect(bandpass); bandpass.connect(gainNode); gainNode.connect(ctx.destination);

    const bassOsc = ctx.createOscillator(); bassOsc.type = 'sawtooth'; bassOsc.frequency.value = 40;
    const bassGain = ctx.createGain(); bassGain.gain.value = volume * 0.06;
    bassOsc.connect(bassGain); bassGain.connect(ctx.destination);
    bassOsc.start(); src.start();

    return { source: { stop: () => { src.stop(); bassOsc.stop(); } }, gainNode };
  },

  nebula: (ctx, volume) => {
    // Ethereal cosmic pad
    const freqs = [110, 165, 220, 275, 330];
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? 'sine' : 'triangle';
      o.frequency.value = f + (Math.random() - 0.5) * 3;
      const g = ctx.createGain(); g.gain.value = volume * (0.1 / (i + 1));
      o.connect(g); g.connect(ctx.destination);
      o.start();
      return o;
    });
    const gainNode = ctx.createGain(); gainNode.gain.value = 1;
    return { source: { stop: () => oscs.forEach(o => o.stop()) }, gainNode };
  },
};

function stopAmbient() {
  if (state.ambientSound) { try { state.ambientSound.source.stop(); } catch {} state.ambientSound = null; }
  state.ambientActive = null;
  dom.ambientBtns.forEach(b => b.classList.remove('active'));
  dom.ambientToggleBtn.classList.remove('active');
}

function playAmbient(type) {
  stopAmbient();
  if (!type) return;
  try {
    const ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const gen = ambientGenerators[type];
    if (gen) {
      state.ambientSound = gen(ctx, state.ambientVolume);
      state.ambientActive = type;
      dom.ambientToggleBtn.classList.add('active');
      dom.ambientBtns.forEach(b => b.classList.toggle('active', b.dataset.sound === type));
    }
  } catch (e) {
    console.warn('Ambient error:', e);
    showToast('⚠️ Audio tidak tersedia di browser ini');
  }
}

function setAmbientVolume(vol) {
  state.ambientVolume = vol;
  if (state.ambientSound?.gainNode) state.ambientSound.gainNode.gain.value = vol * 0.5;
}

// ===== FIRE PARTICLES (replaces confetti) =====
function launchFireParticles() {
  const canvas = dom.confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#FF6B35', '#FF3D00', '#FFD700', '#FF8C00', '#FFA500', '#FF5500', '#FFCC00'];
  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + 20,
    vx: (Math.random() - 0.5) * 4,
    vy: -(Math.random() * 8 + 4),
    r: Math.random() * 6 + 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 1,
    decay: Math.random() * 0.015 + 0.008,
    gravity: 0.15,
    shape: Math.random() < 0.4 ? 'star' : 'circle',
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      if (p.alpha > 0.01) {
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        p.vx *= 0.99;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        if (p.shape === 'star') {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          drawStar(ctx, p.x, p.y, 5, p.r, p.r / 2);
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });
    frame++;
    if (alive && frame < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
  ctx.beginPath();
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}

// ===== TOAST =====
let toastTimeout = null;
function showToast(msg) {
  dom.toast.textContent = msg;
  dom.toast.removeAttribute('hidden');
  dom.toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    dom.toast.classList.remove('show');
    setTimeout(() => dom.toast.setAttribute('hidden', ''), 400);
  }, 3200);
}

// ===== AMBIENT PANEL TOGGLE =====
function toggleAmbientPanel() {
  if (dom.ambientPanel.hasAttribute('hidden')) dom.ambientPanel.removeAttribute('hidden');
  else dom.ambientPanel.setAttribute('hidden', '');
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
  // Timer
  dom.startPauseBtn.addEventListener('click', () => {
    if (state.timer.running) pauseTimer(); else startTimer();
  });
  dom.resetBtn.addEventListener('click', resetTimer);
  dom.skipBtn.addEventListener('click', skipTimer);
  dom.modeTabs.forEach(tab => tab.addEventListener('click', () => switchMode(tab.dataset.mode)));

  // Tasks
  dom.addTaskBtn.addEventListener('click', addTask);
  dom.taskInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });

  dom.taskList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { id, action } = btn.dataset;
    if (action === 'toggle') toggleTask(id);
    else if (action === 'delete') deleteTask(id);
    else if (action === 'select') setActiveTask(id);
  });

  dom.taskList.addEventListener('click', (e) => {
    const item = e.target.closest('.task-item');
    if (!item || e.target.closest('[data-action]')) return;
    const task = state.tasks.find(t => t.id === item.dataset.id);
    if (task && !task.done) setActiveTask(item.dataset.id);
  });

  dom.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      state.currentFilter = tab.dataset.filter;
      dom.filterTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.filter === state.currentFilter);
        t.setAttribute('aria-selected', t.dataset.filter === state.currentFilter);
      });
      renderTasks();
    });
  });

  dom.clearDoneBtn.addEventListener('click', clearDoneTasks);

  // Settings
  dom.settingsBtn.addEventListener('click', openSettings);
  dom.closeSettingsBtn.addEventListener('click', closeSettings);
  dom.saveSettingsBtn.addEventListener('click', saveSettingsFromModal);
  dom.settingsModal.addEventListener('click', (e) => { if (e.target === dom.settingsModal) closeSettings(); });
  $$('.num-btn').forEach(btn => btn.addEventListener('click', () => adjustNumber(btn.dataset.target, btn.dataset.action)));

  // Ambient
  dom.ambientToggleBtn.addEventListener('click', toggleAmbientPanel);
  dom.closeAmbientBtn.addEventListener('click', () => dom.ambientPanel.setAttribute('hidden', ''));
  dom.ambientBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sound = btn.dataset.sound;
      if (state.ambientActive === sound) stopAmbient();
      else playAmbient(sound);
    });
  });
  dom.ambientVolume.addEventListener('input', (e) => setAmbientVolume(parseFloat(e.target.value)));

  dom.ambientPanel.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', (e) => {
    if (!dom.ambientPanel.hasAttribute('hidden') &&
        !dom.ambientToggleBtn.contains(e.target) &&
        !dom.ambientPanel.contains(e.target)) {
      dom.ambientPanel.setAttribute('hidden', '');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSettings(); dom.ambientPanel.setAttribute('hidden', ''); }
    if (e.key === ' ' && e.target === document.body) { e.preventDefault(); if (state.timer.running) pauseTimer(); else startTimer(); }
  });

  window.addEventListener('resize', () => {
    dom.confettiCanvas.width = window.innerWidth;
    dom.confettiCanvas.height = window.innerHeight;
  });
}

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', init);
