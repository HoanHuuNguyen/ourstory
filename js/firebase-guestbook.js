// ===================================================
// Sổ Lưu Bút — Firebase Firestore (đồng bộ mọi thiết bị)
// ===================================================
//
// CÁCH KÍCH HOẠT (xem chi tiết trong README.md):
// 1. Tạo project miễn phí tại https://console.firebase.google.com
// 2. Bật Firestore Database (chế độ production), dán Security Rules trong README.
// 3. Vào Project settings → tạo Web App → copy config → dán vào FIREBASE_CONFIG bên dưới.
//
// Lưu ý: config Firebase KHÔNG phải là secret — an toàn để để công khai trong
// code (bảo mật thật sự nằm ở Security Rules phía Firestore), khác hẳn một
// token/API key riêng tư như GitHub PAT.

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBvqY0XZHS7iVoYdWkRJK299cTUntXwKdQ',
  authDomain: 'ourstory-8736c.firebaseapp.com',
  projectId: 'ourstory-8736c',
  storageBucket: 'ourstory-8736c.firebasestorage.app',
  messagingSenderId: '52992033440',
  appId: '1:52992033440:web:ab65688a977f348c86bfc5',
};

const isConfigured = !Object.values(FIREBASE_CONFIG).some((v) => String(v).startsWith('REPLACE_WITH'));

const form = document.getElementById('guestbookForm');
const status = document.getElementById('guestbookStatus');

if (!form) {
  // Trang này không có Sổ Lưu Bút, không cần làm gì thêm.
} else if (!isConfigured) {
  status.textContent = '💡 Sổ lưu bút chưa được kích hoạt — làm theo hướng dẫn Firebase trong README.md (~5 phút, miễn phí).';
  form.querySelector('button[type="submit"]').disabled = true;
} else {
  initGuestbook();
}

async function initGuestbook() {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js');
    const {
      getFirestore, collection, addDoc, deleteDoc, doc, updateDoc,
      onSnapshot, query, orderBy, serverTimestamp,
    } = await import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js');

    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    const guestbookRef = collection(db, 'guestbook');

    const msgInput = document.getElementById('guestbookMessage');
    const list = document.getElementById('guestbookList');
    const empty = document.getElementById('guestbookEmpty');

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function formatTime(ts) {
      if (!ts || !ts.toDate) return '';
      return ts.toDate().toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    }

    function entryHtml(id, data) {
      return `
        <li class="guestbook-entry" data-id="${id}">
          <div class="guestbook-entry-actions">
            <button class="guestbook-entry-edit" data-id="${id}" aria-label="Sửa lời nhắn">✎</button>
            <button class="guestbook-entry-delete" data-id="${id}" aria-label="Xoá lời nhắn">✕</button>
          </div>
          <div class="guestbook-entry-head">
            <span class="guestbook-entry-name">${escapeHtml(data.name || '')}</span>
            <span class="guestbook-entry-time">${formatTime(data.time)}${data.editedAt ? ' · đã sửa' : ''}</span>
          </div>
          <p class="guestbook-entry-msg">${escapeHtml(data.message || '')}</p>
        </li>`;
    }

    function editFormHtml(id, data) {
      return `
        <li class="guestbook-entry editing" data-id="${id}">
          <div class="guestbook-entry-head">
            <span class="guestbook-entry-name">${escapeHtml(data.name || '')}</span>
          </div>
          <textarea class="guestbook-edit-textarea" maxlength="500" rows="3">${escapeHtml(data.message || '')}</textarea>
          <div class="guestbook-edit-actions">
            <button class="guestbook-edit-save" data-id="${id}">Lưu</button>
            <button class="guestbook-edit-cancel" data-id="${id}">Huỷ</button>
          </div>
        </li>`;
    }

    let editingId = null;
    let latestDocs = [];

    function render() {
      empty.classList.toggle('hidden', latestDocs.length > 0);
      list.innerHTML = latestDocs
        .map(({ id, data }) => (id === editingId ? editFormHtml(id, data) : entryHtml(id, data)))
        .join('');
    }

    onSnapshot(
      query(guestbookRef, orderBy('time', 'desc')),
      (snapshot) => {
        latestDocs = snapshot.docs.map((d) => ({ id: d.id, data: d.data() }));
        render();
      },
      (err) => {
        console.error('Guestbook load error:', err);
        status.textContent = '⚠️ Không tải được sổ lưu bút — kiểm tra lại cấu hình Firebase / Security Rules.';
      }
    );

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameRadio = form.querySelector('input[name="guestbookNamePick"]:checked');
      const name = nameRadio ? nameRadio.value : '';
      const message = msgInput.value.trim();

      if (!name) {
        status.textContent = '💡 Hãy chọn Hữu hoặc Ngân trước khi gửi nhé.';
        return;
      }
      if (!message) {
        status.textContent = '💡 Đừng để trống lời nhắn nhé.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      try {
        await addDoc(guestbookRef, { name, message, time: serverTimestamp() });
        status.textContent = '';
        form.reset();
        msgInput.focus();
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
        editingId = editBtn.dataset.id;
        render();
      } else if (cancelBtn) {
        editingId = null;
        render();
      } else if (deleteBtn) {
        if (!confirm('Xoá lời nhắn này?')) return;
        await deleteDoc(doc(db, 'guestbook', deleteBtn.dataset.id));
      } else if (saveBtn) {
        const id = saveBtn.dataset.id;
        const textarea = list.querySelector('.guestbook-entry.editing textarea');
        const newMessage = textarea.value.trim();
        if (newMessage) {
          await updateDoc(doc(db, 'guestbook', id), { message: newMessage, editedAt: serverTimestamp() });
        }
        editingId = null;
      }
    });
  } catch (err) {
    console.error('Firebase init error:', err);
    status.textContent = '⚠️ Không khởi tạo được Firebase — kiểm tra lại config trong js/firebase-guestbook.js.';
  }
}
