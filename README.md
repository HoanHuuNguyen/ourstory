# 💜 Our Little Universe — Hữu & Ngân

Trang web tình yêu cá nhân, deploy qua GitHub Pages. Thuần HTML/CSS/JS — không cần build step.

## Cấu trúc

```
index.html          # toàn bộ nội dung 9 section (hero, counter, story, gallery, letter, open-when, constellation, quotes, guestbook, footer)
css/style.css        # theme pastel lãng mạn (hồng phấn · lavender · đào nhạt)
js/main.js            # bokeh nền, counter, scroll-reveal, lightbox, open-when, constellation, quotes, guestbook, music toggle
assets/photos/        # ảnh gallery — thay placeholder tại đây
assets/music.mp3      # (tuỳ chọn) nhạc nền — thêm file mp3 vào đây
```

## Việc cần làm để cá nhân hoá

1. **Ngày bắt đầu yêu** — sửa `START_DATE` trong `js/main.js` (dòng đầu file).
2. **Timeline / câu chuyện** — sửa các thẻ `.timeline-card` trong `index.html` (section `#story`): đổi ngày `[Ngày/Tháng/Năm]` và nội dung.
3. **Ảnh gallery** — bỏ ảnh vào `assets/photos/`, rồi trong `index.html` (section `#gallery`) đổi:
   ```html
   <div class="placeholder"><span>📷</span></div>
   ```
   thành:
   ```html
   <img src="assets/photos/ten-anh.jpg" alt="mô tả">
   ```
4. **Lá thư** — sửa nội dung trong `<p class="letter-body">` (section `#letter`).
5. **Thư "Mở Khi..."** — sửa nội dung trong từng `<template id="letterTpl-...">` (section `#openwhen`). Muốn thêm phong thư mới: thêm 1 `.envelope-card` với `data-letter="ten-moi"` và 1 `<template id="letterTpl-ten-moi">` tương ứng.
6. **Lý do yêu em** — sửa `data-reason="..."` của từng `.reason-star` (section `#constellation`), có thể thêm/bớt ngôi sao.
7. **Nhạc nền** (tuỳ chọn) — thêm file `assets/music.mp3`. Nút nốt nhạc góc dưới phải sẽ tự hoạt động.

## Sổ Lưu Bút (Guestbook) — GitHub Issue comments

Section **"Sổ Lưu Bút"** lưu lời nhắn dưới dạng **comment trên 1 GitHub Issue** của chính repo `ourstory` — **không dùng dịch vụ bên thứ 3 nào** (không Firebase, không Supabase, không cần tài khoản mới). Vì repo public nên đọc lời nhắn không cần đăng nhập; gửi/sửa/xoá dùng 1 token GitHub giới hạn phạm vi.

Issue lưu trữ: **[github.com/HoanHuuNguyen/ourstory/issues/1](https://github.com/HoanHuuNguyen/ourstory/issues/1)** — bạn có thể mở link này để xem/quản lý lời nhắn trực tiếp trên GitHub bất cứ lúc nào, kể cả không qua trang web.

### Kích hoạt (một lần, ~3 phút)

1. Vào **GitHub → bấm avatar góc phải → Settings → Developer settings** (cuối menu bên trái) **→ Personal access tokens → Fine-grained tokens → Generate new token**.
2. Đặt tên (VD: `ourstory-guestbook`), **Expiration**: chọn dài nhất có thể hoặc "No expiration".
3. **Repository access** → **Only select repositories** → chọn `ourstory`.
4. **Permissions → Repository permissions → Issues** → chọn **Read and write** (không cần bật quyền nào khác).
5. **Generate token** → copy token (chỉ hiện 1 lần, dạng `github_pat_...`).
6. Mở `js/guestbook.js`, dán token vào biến `GITHUB_TOKEN` (thay `REPLACE_WITH_TOKEN`).
7. Commit & push — Sổ Lưu Bút hoạt động ngay, đồng bộ cho mọi thiết bị.

> **Lưu ý bảo mật**: vì đây là site tĩnh, token này nằm trong file JS công khai — ai xem mã nguồn trang cũng thấy được. Token đã được giới hạn phạm vi tối đa (chỉ 1 repo, chỉ quyền Issues) nên rủi ro chỉ dừng ở việc ai đó có thể spam/sửa/xoá lời nhắn trong Issue #1 — không thể đụng tới code, không xoá được repo hay site. Phù hợp cho trang riêng tư 2 người, ít ai biết đến. Nếu token bị lộ/lạm dụng, chỉ cần vào Settings thu hồi token đó và tạo token mới.

Cho đến khi cấu hình xong, form sẽ hiển thị dòng nhắc "chưa kích hoạt" và nút gửi bị vô hiệu hoá.

## Deploy lên GitHub Pages

Repo đã có sẵn code trên nhánh `main`. Bật Pages:

1. Vào repo trên GitHub → **Settings → Pages**
2. Ở mục **Build and deployment → Source**, chọn **Deploy from a branch**
3. **Branch**: `main`, folder: `/ (root)` → **Save**
4. Sau 1–2 phút, trang sẽ có tại:
   `https://hoanhuunguyen.github.io/ourstory/`

Mỗi lần `git push` lên `main`, GitHub Pages sẽ tự rebuild.
