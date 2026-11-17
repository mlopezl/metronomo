const tempoInput = document.querySelector('#tempo');
const meterSelect = document.querySelector('#meter');
const beatsElement = document.querySelector('#beats');
const playButton = document.querySelector('#play');
const playText = document.querySelector('#play-text');

const MIN_BPM = 30;
const MAX_BPM = 300;
let bpm = 120;
let beatIndex = 0;
let activeBeat = -1;
let playing = false;
let paused = false;
let audioContext;
let nextBeatTime = 0;
let schedulerId;
let visualTimers = [];
let activeOscillators = new Set();
let tapTimes = [];

function beatCount() {
  return Number(meterSelect.value.split('/')[0]);
}

function renderBeats() {
  const count = beatCount();
  beatsElement.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;
  beatsElement.setAttribute('aria-label', `${count} beats in a ${meterSelect.value} measure`);
  beatsElement.innerHTML = Array.from({ length: count }, (_, i) => `
    <div class="beat${i === 0 ? ' is-first' : ''}${i === activeBeat ? ' is-active' : ''}" aria-label="Beat ${i + 1}${i === activeBeat ? ', active' : ''}">
      <div class="beat-box" aria-hidden="true"></div>
      <div class="beat-number">${String(i + 1).padStart(2, '0')}</div>
    </div>`).join('');
}

function showBeat(index) {
  activeBeat = index;
  renderBeats();
}

function setBpm(value) {
  const parsed = Math.round(Number(value));
  if (!Number.isFinite(parsed)) return;
  bpm = Math.min(MAX_BPM, Math.max(MIN_BPM, parsed));
  tempoInput.value = bpm;
  if (playing) {
    clearVisualTimers();
    silenceScheduledAudio();
    nextBeatTime = audioContext.currentTime + 0.03;
  }
}

function clearVisualTimers() {
  visualTimers.forEach(clearTimeout);
  visualTimers = [];
}

function silenceScheduledAudio() {
  for (const oscillator of activeOscillators) {
    try { oscillator.stop(); } catch (_) { /* Already stopped. */ }
  }
  activeOscillators.clear();
}

function scheduleClick(index, time) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const first = index === 0;
  const groupAccent = meterSelect.value === '6/8' && index === 3;
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(first ? 1350 : groupAccent ? 1120 : 880, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(first ? 0.28 : 0.17, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.onended = () => activeOscillators.delete(oscillator);
  activeOscillators.add(oscillator);
  oscillator.start(time);
  oscillator.stop(time + 0.065);

  const delay = Math.max(0, (time - audioContext.currentTime) * 1000);
  visualTimers.push(setTimeout(() => {
    if (playing) showBeat(index);
  }, delay));
}

function scheduler() {
  if (!playing) return;
  while (nextBeatTime < audioContext.currentTime + 0.1) {
    scheduleClick(beatIndex, nextBeatTime);
    nextBeatTime += 60 / bpm;
    beatIndex = (beatIndex + 1) % beatCount();
  }
}

async function start() {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
  } catch (_) {
    playButton.setAttribute('aria-label', 'Audio unavailable');
    return;
  }
  playing = true;
  paused = false;
  nextBeatTime = audioContext.currentTime + 0.03;
  scheduler();
  schedulerId = setInterval(scheduler, 25);
  playButton.classList.add('is-playing');
  playButton.setAttribute('aria-label', 'Pause metronome');
  playText.textContent = 'Pause';
}

function pause() {
  if (!playing) return;
  playing = false;
  paused = true;
  clearInterval(schedulerId);
  clearVisualTimers();
  silenceScheduledAudio();
  playButton.classList.remove('is-playing');
  playButton.setAttribute('aria-label', 'Resume metronome');
  playText.textContent = 'Resume';
}

function stop() {
  playing = false;
  paused = false;
  clearInterval(schedulerId);
  clearVisualTimers();
  silenceScheduledAudio();
  beatIndex = 0;
  showBeat(-1);
  playButton.classList.remove('is-playing');
  playButton.setAttribute('aria-label', 'Start metronome');
  playText.textContent = 'Start';
}

playButton.addEventListener('click', () => playing ? pause() : start());
document.querySelector('#stop').addEventListener('click', stop);
document.querySelector('#decrease').addEventListener('click', () => setBpm(bpm - 1));
document.querySelector('#increase').addEventListener('click', () => setBpm(bpm + 1));
tempoInput.addEventListener('change', () => setBpm(tempoInput.value));
tempoInput.addEventListener('blur', () => { tempoInput.value = bpm; });
meterSelect.addEventListener('change', () => {
  beatIndex = 0;
  showBeat(-1);
  if (playing) {
    clearVisualTimers();
    silenceScheduledAudio();
    nextBeatTime = audioContext.currentTime + 0.03;
  }
});

document.querySelector('#tap').addEventListener('click', () => {
  const now = performance.now();
  if (tapTimes.length && now - tapTimes.at(-1) > 2200) tapTimes = [];
  tapTimes.push(now);
  tapTimes = tapTimes.slice(-5);
  if (tapTimes.length >= 2) {
    const intervals = tapTimes.slice(1).map((time, i) => time - tapTimes[i]);
    const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    setBpm(60000 / average);
  }
});

document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !['INPUT', 'SELECT', 'BUTTON'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    playing ? pause() : start();
  }
});

renderBeats();
