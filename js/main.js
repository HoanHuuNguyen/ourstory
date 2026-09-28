// ===================================================
// Our Little Universe — Hữu & Ngân
// ===================================================

/* ---------- CONFIG: chỉnh ngày bắt đầu yêu tại đây ---------- */
const START_DATE = new Date('2023-01-01T00:00:00'); // TODO: đổi thành ngày thật

/* ---------- Starfield background ---------- */
(function starfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 8000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  let shootingStar = null;
  function maybeSpawnShootingStar() {
    if (!shootingStar && Math.random() < 0.006) {
      const startX = Math.random() * w * 0.6;
      shootingStar = { x: startX, y: -10, vx: 6, vy: 3, life: 0 };
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    for (const s of stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      ctx.globalAlpha = 0.25 + twinkle * 0.75;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    maybeSpawnShootingStar();
    if (shootingStar) {
      const ss = shootingStar;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * 6, ss.y - ss.vy * 6);
      ctx.stroke();
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life++;
      if (ss.x > w || ss.y > h || ss.life > 200) shootingStar = null;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ---------- Live counter ---------- */
(function counter() {
  const els = {
    days: document.getElementById('cDays'),
    hours: document.getElementById('cHours'),
    minutes: document.getElementById('cMinutes'),
    seconds: document.getElementById('cSeconds'),
  };
  if (!els.days) return;

  function tick() {
    const diff = Math.max(0, Date.now() - START_DATE.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    els.days.textContent = days;
    els.hours.textContent = String(hours).padStart(2, '0');
    els.minutes.textContent = String(minutes).padStart(2, '0');
    els.seconds.textContent = String(seconds).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Scroll reveal (timeline, gallery, letter) ---------- */
(function reveal() {
  const targets = document.querySelectorAll('.reveal, .letter-paper');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  targets.forEach((t) => io.observe(t));
})();

/* ---------- Gallery lightbox ---------- */
(function lightbox() {
  const modal = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const caption = document.getElementById('lightboxCaption');
  const items = document.querySelectorAll('.gallery-item');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      caption.textContent = item.dataset.caption || '';
      modal.classList.add('open');
    });
  });

  function close() { modal.classList.remove('open'); }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ---------- Constellation of reasons ---------- */
(function constellation() {
  const stars = document.querySelectorAll('.reason-star');
  const tooltip = document.getElementById('reasonTooltip');
  stars.forEach((star) => {
    star.addEventListener('click', () => {
      tooltip.textContent = '"' + star.dataset.reason + '"';
    });
    star.addEventListener('mouseenter', () => {
      tooltip.textContent = '"' + star.dataset.reason + '"';
    });
  });
})();

/* ---------- Music toggle ---------- */
(function music() {
  const btn = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  let playing = false;

  btn.addEventListener('click', () => {
    if (!playing) {
      audio.play().catch(() => {
        console.warn('Chưa có file nhạc tại assets/music.mp3 — hãy thêm file để bật nhạc nền.');
      });
      playing = true;
      btn.classList.add('playing');
    } else {
      audio.pause();
      playing = false;
      btn.classList.remove('playing');
    }
  });
})();

/* ---------- Footer heart burst ---------- */
(function heartBurst() {
  const btn = document.getElementById('heartBtn');
  const hearts = ['❤️', '💜', '💕', '✨'];

  btn.addEventListener('click', () => {
    for (let i = 0; i < 14; i++) {
      const h = document.createElement('span');
      h.className = 'floating-heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = 45 + Math.random() * 10 + 'vw';
      h.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      h.style.animationDelay = Math.random() * 0.4 + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 3000);
    }
  });
})();

/* ---------- Dot nav active state ---------- */
(function dotNav() {
  const links = document.querySelectorAll('.dot-nav a');
  if (!links.length) return;
  const sections = Array.from(links).map((l) => document.querySelector(l.getAttribute('href')));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.indexOf(entry.target);
          links.forEach((l) => l.classList.remove('active'));
          if (links[idx]) links[idx].classList.add('active');
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => s && io.observe(s));
})();

/* ---------- Footer year ---------- */
document.getElementById('footerYear').textContent = new Date().getFullYear();
