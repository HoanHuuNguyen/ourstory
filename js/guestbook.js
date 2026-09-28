// ===================================================
// Sổ Lưu Bút — lưu trên GitHub Issue comments (không dùng dịch vụ bên thứ 3)
// ===================================================
//
// CÁCH KÍCH HOẠT (xem chi tiết trong README.md):
// 1. Vào GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token
// 2. Chỉ chọn repo "ourstory", quyền "Issues: Read and write" (không thêm quyền nào khác)
// 3. Copy token, dán vào GITHUB_TOKEN bên dưới

const GITHUB_OWNER = 'HoanHuuNguyen';
const GITHUB_REPO = 'ourstory';
const GUESTBOOK_ISSUE_NUMBER = 1; // Issue "💌 Sổ Lưu Bút" — https://github.com/HoanHuuNguyen/ourstory/issues/1
const GITHUB_TOKEN = 'REPLACE_WITH_TOKEN';

const POLL_INTERVAL_MS = 20000;

(function guestbookGitHub() {
  const form = document.getElementById('guestbookForm');
  const status = document.getElementById('guestbookStatus');
  if (!form) return;

  const isConfigured = GITHUB_TOKEN && !GITHUB_TOKEN.startsWith('REPLACE_WITH');
  if (!isConfigured) {
    status.textContent = '💡 Sổ lưu bút chưa được kích hoạt — làm theo hướng dẫn trong README.md (~3 phút, dùng ngay GitHub bạn đang có).';
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`;
  const HEADERS = {
    Authorization: 'Bearer ' + GITHUB_TOKEN,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const nameInput = document.getElementById('guestbookName');
  const msgInput = document.getElementById('guestbookMessage');
  const list = document.getElementById('guestbookList');
  const empty = document.getElementById('guestbookEmpty');
  let editingId = null;
  let pollTimer = null;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  // Lưu lời nhắn dưới dạng: **Tên**\nNội dung  (đọc được luôn nếu mở thẳng Issue trên GitHub)
  function encodeBody(name, message) {
    return `**${name}**\n${message}`;
  }
  function decodeBody(body) {
    const idx = body.indexOf('\n');
    if (idx === -1) return { name: '', message: body };
    const name = body.slice(0, idx).replace(/^\*\*|\*\*$/g, '').trim();
    const message = body.slice(idx + 1).trim();
    return { name, message };
  }

  function entryHtml(c) {
    const { name, message } = decodeBody(c.body);
    const edited = c.updated_at !== c.created_at;
    return `
      <li class="guestbook-entry" data-id="${c.id}">
        <div class="guestbook-entry-actions">
          <button class="guestbook-entry-edit" data-id="${c.id}" aria-label="Sửa lời nhắn">✎</button>
          <button class="guestbook-entry-delete" data-id="${c.id}" aria-label="Xoá lời nhắn">✕</button>
        </div>
        <div class="guestbook-entry-head">
          <span class="guestbook-entry-name">${escapeHtml(name)}</span>
          <span class="guestbook-entry-time">${formatTime(c.created_at)}${edited ? ' · đã sửa' : ''}</span>
        </div>
        <p class="guestbook-entry-msg">${escapeHtml(message)}</p>
      </li>`;
  }

  function editFormHtml(c) {
    const { name, message } = decodeBody(c.body);
    return `
      <li class="guestbook-entry editing" data-id="${c.id}">
        <div class="guestbook-entry-head">
          <span class="guestbook-entry-name">${escapeHtml(name)}</span>
        </div>
        <textarea class="guestbook-edit-textarea" maxlength="500" rows="3">${escapeHtml(message)}</textarea>
        <div class="guestbook-edit-actions">
          <button class="guestbook-edit-save" data-id="${c.id}" data-name="${escapeHtml(name)}">Lưu</button>
          <button class="guestbook-edit-cancel" data-id="${c.id}">Huỷ</button>
        </div>
      </li>`;
  }

  let latestComments = [];

  function render() {
    empty.classList.toggle('hidden', latestComments.length > 0);
    list.innerHTML = latestComments
      .map((c) => (c.id === editingId ? editFormHtml(c) : entryHtml(c)))
      .join('');
  }

  async function loadComments(silent) {
    try {
      const res = await fetch(`${API_BASE}/${GUESTBOOK_ISSUE_NUMBER}/comments?per_page=100`, { headers: HEADERS });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      latestComments = data.reverse(); // mới nhất lên đầu
      render();
      if (!silent) status.textContent = '';
    } catch (err) {
      console.error('Guestbook load error:', err);
      if (!silent) status.textContent = '⚠️ Không tải được sổ lưu bút — kiểm tra lại token/Issue number trong js/guestbook.js.';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name || !message) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      const res = await fetch(`${API_BASE}/${GUESTBOOK_ISSUE_NUMBER}/comments`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ body: encodeBody(name, message) }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.reset();
      nameInput.focus();
      await loadComments(true);
    } catch (err) {
      console.error('Guestbook submit error:', err);
      status.textContent = '⚠️ Gửi lời nhắn thất bại — thử lại sau.';
    } finally {
      submitBtn.disabled = false;
    }
  });

  list.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.guestbook-entry-edit');
    const deleteBtn = e.target.closest('.guestbook-entry-delete');
    const saveBtn = e.target.closest('.guestbook-edit-save');
    const cancelBtn = e.target.closest('.guestbook-edit-cancel');

    if (editBtn) {
      editingId = Number(editBtn.dataset.id);
      render();
    } else if (cancelBtn) {
      editingId = null;
      render();
    } else if (deleteBtn) {
      if (!confirm('Xoá lời nhắn này?')) return;
      try {
        const res = await fetch(`${API_BASE}/comments/${deleteBtn.dataset.id}`, { method: 'DELETE', headers: HEADERS });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await loadComments(true);
      } catch (err) {
        console.error('Guestbook delete error:', err);
        status.textContent = '⚠️ Xoá thất bại — thử lại sau.';
      }
    } else if (saveBtn) {
      const id = saveBtn.dataset.id;
      const name = saveBtn.dataset.name;
      const textarea = list.querySelector('.guestbook-entry.editing textarea');
      const newMessage = textarea.value.trim();
      if (newMessage) {
        try {
          const res = await fetch(`${API_BASE}/comments/${id}`, {
            method: 'PATCH',
            headers: HEADERS,
            body: JSON.stringify({ body: encodeBody(name, newMessage) }),
          });
          if (!res.ok) throw new Error('HTTP ' + res.status);
        } catch (err) {
          console.error('Guestbook edit error:', err);
          status.textContent = '⚠️ Sửa thất bại — thử lại sau.';
        }
      }
      editingId = null;
      await loadComments(true);
    }
  });

  loadComments();
  pollTimer = setInterval(() => loadComments(true), POLL_INTERVAL_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadComments(true);
  });
})();
