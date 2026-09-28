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

## Sổ Lưu Bút (Guestbook)

Section **"Sổ Lưu Bút"** là form comment thuần JS, không dùng dịch vụ bên thứ 3 nào, không cần cấu hình hay token gì cả — hoạt động ngay sau khi deploy. Lời nhắn lưu vào `localStorage` của trình duyệt (key `olu_guestbook_entries`), hiển thị ngay bên dưới form, có thể **sửa** hoặc **xoá** từng lời nhắn.

**Giới hạn cần biết**: `localStorage` lưu **theo từng trình duyệt/thiết bị** — lời nhắn viết trên điện thoại sẽ không tự hiện trên máy tính hay máy của người kia, vì trang không có nơi lưu trữ dùng chung. Đây là đánh đổi để giữ mọi thứ đơn giản, miễn phí, không secret nào cần quản lý.

> Đã thử 2 hướng đồng bộ đa thiết bị (Firebase, và lưu qua GitHub Issue comments) nhưng đều cần hoặc một dịch vụ bên thứ 3 (Firebase), hoặc một secret không thể an toàn để lộ trong code public (GitHub token — bị chính GitHub Push Protection chặn). Nếu sau này vẫn muốn đồng bộ thật, cách khả thi duy nhất không lộ secret là thêm một proxy nhỏ (VD: Cloudflare Worker miễn phí) đứng giữa — báo mình nếu muốn làm.

## Deploy lên GitHub Pages

Repo đã có sẵn code trên nhánh `main`. Bật Pages:

1. Vào repo trên GitHub → **Settings → Pages**
2. Ở mục **Build and deployment → Source**, chọn **Deploy from a branch**
3. **Branch**: `main`, folder: `/ (root)` → **Save**
4. Sau 1–2 phút, trang sẽ có tại:
   `https://hoanhuunguyen.github.io/ourstory/`

Mỗi lần `git push` lên `main`, GitHub Pages sẽ tự rebuild.
