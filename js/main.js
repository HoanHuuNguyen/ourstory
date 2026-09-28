// ===================================================
// Our Little Universe — Hữu & Ngân
// ===================================================

/* ---------- CONFIG: chỉnh ngày bắt đầu yêu tại đây ---------- */
const START_DATE = new Date('2026-08-03T00:00:00');

/* ---------- Pastel bokeh + floating hearts background ---------- */
(function pastelSky() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  const PALETTE = ['#ff9ec7', '#b48ee8', '#ffb877', '#ffd1e3', '#d8c4ff'];
  let dots = [];
  let hearts = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 22000);
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 5 + 2,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      vy: Math.random() * 0.18 + 0.05,
      sway: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function maybeSpawnHeart() {
    if (hearts.length < 3 && Math.random() < 0.004) {
      hearts.push({
        x: Math.random() * w,
        y: h + 20,
        vy: Math.random() * 0.35 + 0.25,
        sway: Math.random() * 0.8 + 0.3,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 10 + 12,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 0,
      });
    }
  }

  function drawHeart(x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.fill();
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    for (const d of dots) {
      const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * d.sway + d.phase);
      ctx.globalAlpha = 0.15 + twinkle * 0.35;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x + Math.sin(t * 0.0006 + d.phase) * 12, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
      d.y -= d.vy;
      if (d.y < -10) d.y = h + 10;
    }
    ctx.globalAlpha = 1;

    maybeSpawnHeart();
    hearts.forEach((hh) => {
      hh.life++;
      hh.y -= hh.vy;
      const dx = Math.sin(hh.life * 0.02 * hh.sway) * 18;
      const fadeIn = Math.min(1, hh.life / 60);
      const fadeOut = hh.y < 80 ? hh.y / 80 : 1;
      drawHeart(hh.x + dx, hh.y, hh.size, hh.color, 0.35 * fadeIn * Math.max(0, fadeOut));
    });
    hearts = hearts.filter((hh) => hh.y > -40);

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

/* ---------- Open When letters ---------- */
(function openWhenLetters() {
  const cards = document.querySelectorAll('.envelope-card');
  const modal = document.getElementById('letterModal');
  if (!cards.length || !modal) return;
  const content = document.getElementById('letterModalContent');
  const closeBtn = document.getElementById('letterModalClose');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const tpl = document.getElementById('letterTpl-' + card.dataset.letter);
      content.innerHTML = tpl ? tpl.innerHTML : '';
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

/* ---------- Quotes carousel ---------- */
(function quotes() {
  const viewport = document.getElementById('quoteViewport');
  if (!viewport) return;
  const slides = Array.from(viewport.querySelectorAll('.quote-slide'));
  const dotsWrap = document.getElementById('quoteDots');
  const savedHint = document.getElementById('quoteSavedHint');
  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'qdot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Câu ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    slides[index].classList.remove('active');
    dots[index].classList.remove('active');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 7000);
  }

  document.getElementById('quotePrev').addEventListener('click', () => goTo(index - 1));
  document.getElementById('quoteNext').addEventListener('click', () => goTo(index + 1));
  resetAutoplay();

  // Lưu câu thích nhất vào trình duyệt (localStorage) — chỉ để cá nhân đánh dấu, không đồng bộ giữa 2 người
  slides.forEach((slide) => {
    slide.style.cursor = 'pointer';
    slide.title = 'Chạm để đánh dấu câu này là câu bạn thích nhất';
    slide.addEventListener('click', () => {
      try {
        localStorage.setItem('olu_favorite_quote', slide.querySelector('p').textContent);
        savedHint.textContent = '💾 Đã lưu làm câu yêu thích của bạn trên trình duyệt này.';
      } catch (e) { /* localStorage không khả dụng, bỏ qua */ }
    });
  });
})();

/* ---------- Guestbook (lưu localStorage, không cần server/bên thứ 3) ---------- */
(function guestbook() {
  const form = document.getElementById('guestbookForm');
  if (!form) return;
  const msgInput = document.getElementById('guestbookMessage');
  const list = document.getElementById('guestbookList');
  const empty = document.getElementById('guestbookEmpty');
  const STORAGE_KEY = 'olu_guestbook_entries';
  let editingId = null;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function save(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) { /* localStorage không khả dụng, bỏ qua */ }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function entryHtml(e) {
    return `
      <li class="guestbook-entry" data-id="${e.id}">
        <div class="guestbook-entry-actions">
          <button class="guestbook-entry-edit" data-id="${e.id}" aria-label="Sửa lời nhắn">✎</button>
          <button class="guestbook-entry-delete" data-id="${e.id}" aria-label="Xoá lời nhắn">✕</button>
        </div>
        <div class="guestbook-entry-head">
          <span class="guestbook-entry-name">${escapeHtml(e.name)}</span>
          <span class="guestbook-entry-time">${formatTime(e.time)}${e.editedAt ? ' · đã sửa' : ''}</span>
        </div>
        <p class="guestbook-entry-msg">${escapeHtml(e.message)}</p>
      </li>`;
  }

  function editFormHtml(e) {
    return `
      <li class="guestbook-entry editing" data-id="${e.id}">
        <div class="guestbook-entry-head">
          <span class="guestbook-entry-name">${escapeHtml(e.name)}</span>
        </div>
        <textarea class="guestbook-edit-textarea" maxlength="500" rows="3">${escapeHtml(e.message)}</textarea>
        <div class="guestbook-edit-actions">
          <button class="guestbook-edit-save" data-id="${e.id}">Lưu</button>
          <button class="guestbook-edit-cancel" data-id="${e.id}">Huỷ</button>
        </div>
      </li>`;
  }

  function render() {
    const entries = load();
    empty.classList.toggle('hidden', entries.length > 0);
    list.innerHTML = entries
      .slice()
      .reverse()
      .map((e) => (e.id === editingId ? editFormHtml(e) : entryHtml(e)))
      .join('');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameRadio = form.querySelector('input[name="guestbookNamePick"]:checked');
    const name = nameRadio ? nameRadio.value : '';
    const message = msgInput.value.trim();
    if (!name || !message) return;

    const entries = load();
    entries.push({ id: Date.now().toString(36), name, message, time: new Date().toISOString() });
    save(entries);
    render();
    form.reset();
    msgInput.focus();
  });

  list.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.guestbook-entry-edit');
    const deleteBtn = e.target.closest('.guestbook-entry-delete');
    const saveBtn = e.target.closest('.guestbook-edit-save');
    const cancelBtn = e.target.closest('.guestbook-edit-cancel');

    if (editBtn) {
      editingId = editBtn.dataset.id;
      render();
    } else if (cancelBtn) {
      editingId = null;
      render();
    } else if (deleteBtn) {
      const entries = load().filter((entry) => entry.id !== deleteBtn.dataset.id);
      save(entries);
      render();
    } else if (saveBtn) {
      const id = saveBtn.dataset.id;
      const textarea = list.querySelector('.guestbook-entry.editing textarea');
      const newMessage = textarea.value.trim();
      if (newMessage) {
        const entries = load().map((entry) =>
          entry.id === id ? { ...entry, message: newMessage, editedAt: new Date().toISOString() } : entry
        );
        save(entries);
      }
      editingId = null;
      render();
    }
  });

  render();
})();

/* ---------- Footer year ---------- */
document.getElementById('footerYear').textContent = new Date().getFullYear();
