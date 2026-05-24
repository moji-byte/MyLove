/* ════════════════════════════════════════════════════════════
   KONFIGURASI
════════════════════════════════════════════════════════════ */
const CONFIG = {
  partnerName: 'Sayang',       // Nama pasangan (tampil di ending)
  musicFile:   'music.mp3',    // File mp3 lokal
};

/* ════════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════════ */
let musicPlaying = false;
let letterOpened = false;
let surpriseDone = false;
let candlesOut   = 0;
const TOTAL_CANDLES = 5;

/* ════════════════════════════════════════════════════════════
   DOM READY
════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Opening date
  const d = document.getElementById('current-date');
  if (d) d.textContent = new Date().toLocaleDateString('id-ID', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });

  // Scroll bar
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    const bar = document.getElementById('scroll-bar');
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Wish textarea — enable btn when not empty
  const ta = document.getElementById('wish-input');
  if (ta) {
    ta.addEventListener('input', () => {
      const btn = document.getElementById('btn-to-cake');
      if (btn) btn.disabled = ta.value.trim().length === 0;
    });
  }
});

/* ════════════════════════════════════════════════════════════
   START STORY
════════════════════════════════════════════════════════════ */
function startStory() {
  playMusic();
  const curtain = document.getElementById('page-curtain');
  curtain.classList.add('up');

  setTimeout(() => {
    document.getElementById('opening').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    curtain.classList.remove('up');
    curtain.classList.add('down');
    setTimeout(() => curtain.classList.remove('down'), 600);
    initObservers();
    setPartnerName();
  }, 680);
}

function setPartnerName() {
  const el = document.getElementById('ending-partner-name');
  if (el && CONFIG.partnerName) el.textContent = CONFIG.partnerName + ' 🤍';
}

/* ════════════════════════════════════════════════════════════
   MUSIC
════════════════════════════════════════════════════════════ */
function playMusic() {
  const a = document.getElementById('bg-music');
  if (!a) return;
  a.src = CONFIG.musicFile;
  a.volume = 0;
  a.play().then(() => {
    musicPlaying = true;
    fadeVol(a, 0, 0.44, 2600);
    updateMusicUI(true);
  }).catch(() => {});
}

function fadeVol(a, from, to, ms) {
  const steps = 55, step = ms / steps, inc = (to - from) / steps;
  let v = from;
  const iv = setInterval(() => {
    v = Math.min(Math.max(v + inc, 0), 1);
    a.volume = +v.toFixed(4);
    if ((inc > 0 && v >= to) || (inc < 0 && v <= to)) clearInterval(iv);
  }, step);
}

function toggleMusic() {
  const a = document.getElementById('bg-music');
  if (!a) return;
  if (musicPlaying) {
    fadeVol(a, a.volume, 0, 600);
    setTimeout(() => a.pause(), 650);
    musicPlaying = false;
    updateMusicUI(false);
  } else {
    a.volume = 0;
    a.play().then(() => { musicPlaying = true; fadeVol(a, 0, 0.44, 900); updateMusicUI(true); }).catch(() => {});
  }
}

function updateMusicUI(on) {
  const ic = document.getElementById('music-icon');
  const lb = document.getElementById('music-label');
  if (ic) ic.classList.toggle('playing', on);
  if (lb) lb.textContent = on ? 'Jeda' : 'Musik';
}

/* ════════════════════════════════════════════════════════════
   SCROLL OBSERVERS
════════════════════════════════════════════════════════════ */
function initObservers() {
  // Section headers
  const hObs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); hObs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section-header').forEach(h => hObs.observe(h));

  // Timeline items
  const tlObs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        const idx = +e.target.dataset.idx || 0;
        setTimeout(() => e.target.classList.add('vis'), idx * 130);
        tlObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-aos]').forEach((el, i) => { el.dataset.idx = i; tlObs.observe(el); });

  // Gallery
  const gObs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        const idx = +e.target.dataset.gi || 0;
        setTimeout(() => e.target.classList.add('vis'), idx * 100);
        gObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.gallery-item').forEach((el, i) => { el.dataset.gi = i; gObs.observe(el); });

  // Ending step-1 reveal
  const endObs = new IntersectionObserver(es => {
    if (es[0].isIntersecting) {
      const p = document.getElementById('step-1');
      if (p) p.style.animationDelay = '0s';
      endObs.disconnect();
    }
  }, { threshold: 0.2 });
  const s1 = document.getElementById('step-1');
  if (s1) endObs.observe(s1);
}

/* ════════════════════════════════════════════════════════════
   GALLERY LIGHTBOX
════════════════════════════════════════════════════════════ */
function openLightbox(el) {
  const img = el.querySelector('img');
  const lb  = document.getElementById('lightbox');
  const li  = document.getElementById('lightbox-img');
  if (!img || !lb || !li) return;
  li.src = img.src; li.alt = img.alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ════════════════════════════════════════════════════════════
   LETTER
════════════════════════════════════════════════════════════ */
function openLetter() {
  if (letterOpened) return;
  letterOpened = true;
  const env   = document.getElementById('letter-envelope');
  const paper = document.getElementById('letter-paper');
  env.style.transition = 'opacity .45s, transform .45s';
  setTimeout(() => {
    env.style.opacity = '0';
    env.style.transform = 'translateY(-18px) scale(.94)';
    setTimeout(() => {
      env.style.display = 'none';
      paper.classList.add('open');
      setTimeout(() => paper.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
    }, 460);
  }, 230);
}

/* ════════════════════════════════════════════════════════════
   SURPRISE
════════════════════════════════════════════════════════════ */
function triggerSurprise() {
  if (surpriseDone) return;
  surpriseDone = true;
  const btn  = document.getElementById('btn-surprise');
  const msg  = document.getElementById('surprise-message');
  const hint = document.querySelector('.surprise-hint');

  btn.style.transition = 'opacity .35s, transform .35s';
  btn.style.opacity = '0'; btn.style.transform = 'scale(.85)';
  if (hint) { hint.style.transition = 'opacity .3s'; hint.style.opacity = '0'; }

  setTimeout(() => {
    btn.style.display = 'none';
    if (hint) hint.style.display = 'none';
    msg.style.display = 'block';
    msg.style.animation = 'revealUp .75s var(--ease) both';
    launchParticles('particles-container', 60, ['🤍','💕','🌸','✨','🌷','💗','🌺','⭐'], 3);
  }, 380);
}

/* ════════════════════════════════════════════════════════════
   ENDING — Step helpers
════════════════════════════════════════════════════════════ */
function showStep(id) {
  const curtain = document.getElementById('page-curtain');
  // Fade current step out inline (no full curtain — just panel fade)
  ['step-1','step-2','step-3'].forEach(sid => {
    const el = document.getElementById(sid);
    if (!el) return;
    if (sid === id) return;
    if (el.style.display !== 'none') {
      el.style.transition = 'opacity .5s, transform .5s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-16px)';
      setTimeout(() => { el.style.display = 'none'; }, 520);
    }
  });
  setTimeout(() => {
    const next = document.getElementById(id);
    if (!next) return;
    next.style.display = 'block';
    next.style.opacity = '0';
    next.style.transform = 'translateY(20px)';
    next.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      next.style.opacity = '1';
      next.style.transform = 'translateY(0)';
    }));
  }, 560);
}

/* ── Wish count ── */
function updateWishCount(ta) {
  const c = document.getElementById('wish-chars');
  if (c) c.textContent = ta.value.length;
  const btn = document.getElementById('btn-to-cake');
  if (btn) btn.disabled = ta.value.trim().length === 0;
}

/* ── Go to cake ── */
function goToCake() {
  const ta   = document.getElementById('wish-input');
  const wish = ta ? ta.value.trim() : '';
  if (!wish) return;

  // Store wish for later display
  window._birthdayWish = wish;
  showStep('step-2');

  // Scroll ending into view
  setTimeout(() => {
    const ending = document.getElementById('ending');
    if (ending) ending.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

/* ── Blow candles ── */
function blowAllCandles() {
  const btn = document.getElementById('btn-blow');
  if (btn) { btn.disabled = true; }

  for (let i = 0; i < TOTAL_CANDLES; i++) {
    setTimeout(() => {
      const cu = document.getElementById('c' + i);
      if (!cu) return;
      cu.classList.add('out', 'smoking');
      setTimeout(() => cu.classList.remove('smoking'), 1500);
      candlesOut++;
      if (candlesOut === TOTAL_CANDLES) {
        setTimeout(() => showWishSent(), 1000);
      }
    }, i * 200);
  }
}

function showWishSent() {
  // Fill wish display
  const disp = document.getElementById('wish-display');
  if (disp) disp.textContent = window._birthdayWish || '';

  showStep('step-3');

  // Stars burst
  setTimeout(() => {
    launchParticles('end-particles', 35, ['✦','✨','⭐','🌙','💫','🌟','🤍'], 1);
  }, 400);
}

/* ════════════════════════════════════════════════════════════
   PARTICLES helper
════════════════════════════════════════════════════════════ */
function launchParticles(containerId, count, symbols, waves) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let w = 0; w < waves; w++) {
    setTimeout(() => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const p = document.createElement('div');
          p.className = 'particle';
          const isEmoji = Math.random() > 0.3;
          if (isEmoji) {
            p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            p.style.fontSize = (.6 + Math.random() * .75) + 'rem';
          } else {
            const colors = ['#f5ddd5','#e8c4b8','#c97b6e','#faf7f2'];
            const sz = 5 + Math.random() * 7;
            Object.assign(p.style, {
              width: sz + 'px', height: sz + 'px',
              background: colors[Math.floor(Math.random() * colors.length)],
              borderRadius: '2px'
            });
          }
          const left = 4 + Math.random() * 92;
          const dur  = 2.2 + Math.random() * 2.4;
          const dx   = (Math.random() - .5) * 80;
          const dr   = (Math.random() > .5 ? 1 : -1) * (120 + Math.random() * 300);
          p.style.left = left + '%';
          p.style.top  = '-12px';
          p.style.animationDuration = dur + 's';
          p.style.setProperty('--dx', dx + 'px');
          p.style.setProperty('--dr', dr + 'deg');
          container.appendChild(p);
          setTimeout(() => p.remove(), dur * 1000 + 300);
        }, i * 50);
      }
    }, w * 550);
  }
}

/* ════════════════════════════════════════════════════════════
   SCROLL TO
════════════════════════════════════════════════════════════ */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
}

/* ════════════════════════════════════════════════════════════
   REPLAY
════════════════════════════════════════════════════════════ */
function replayStory() {
  const curtain = document.getElementById('page-curtain');
  curtain.classList.add('up');

  setTimeout(() => {
    // Stop music
    const a = document.getElementById('bg-music');
    if (a) { a.pause(); a.currentTime = 0; }
    musicPlaying = false; updateMusicUI(false);

    // Reset letter
    letterOpened = false;
    const env   = document.getElementById('letter-envelope');
    const paper = document.getElementById('letter-paper');
    if (env)   { env.style.cssText = ''; }
    if (paper) { paper.classList.remove('open'); }

    // Reset surprise
    surpriseDone = false;
    const btn  = document.getElementById('btn-surprise');
    const msg  = document.getElementById('surprise-message');
    const hint = document.querySelector('.surprise-hint');
    if (btn)  { btn.style.cssText = ''; }
    if (msg)  { msg.style.display = 'none'; }
    if (hint) { hint.style.cssText = ''; }
    document.getElementById('particles-container').innerHTML = '';

    // Reset ending
    candlesOut = 0;
    window._birthdayWish = '';
    for (let i = 0; i < TOTAL_CANDLES; i++) {
      const cu = document.getElementById('c' + i);
      if (cu) cu.classList.remove('out', 'smoking');
    }
    const bBlow = document.getElementById('btn-blow');
    if (bBlow) bBlow.disabled = false;

    // Reset steps
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    const s3 = document.getElementById('step-3');
    if (s1) { s1.style.cssText = ''; s1.style.display = 'block'; }
    if (s2) { s2.style.cssText = ''; s2.style.display = 'none'; }
    if (s3) { s3.style.cssText = ''; s3.style.display = 'none'; }

    const ta = document.getElementById('wish-input');
    if (ta) { ta.value = ''; updateWishCount(ta); }
    const disp = document.getElementById('wish-display');
    if (disp) disp.textContent = '';
    document.getElementById('end-particles').innerHTML = '';

    // Reset animation classes
    document.querySelectorAll('[data-aos]').forEach(e => e.classList.remove('vis'));
    document.querySelectorAll('.gallery-item').forEach(e => e.classList.remove('vis'));
    document.querySelectorAll('.section-header').forEach(e => e.classList.remove('vis'));

    // Back to opening
    window.scrollTo(0, 0);
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('opening').style.display = 'flex';

    curtain.classList.remove('up');
    curtain.classList.add('down');
    setTimeout(() => curtain.classList.remove('down'), 600);
  }, 700);
}