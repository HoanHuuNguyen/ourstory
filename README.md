# 💜 Our Little Universe — Hữu & Ngân

Trang web tình yêu cá nhân, deploy qua GitHub Pages. Thuần HTML/CSS/JS — không cần build step.

## Cấu trúc

```
index.html          # toàn bộ nội dung 7 section (hero, counter, story, gallery, letter, constellation, footer)
css/style.css        # theme tím-hồng vũ trụ
js/main.js            # starfield, counter, scroll-reveal, lightbox, constellation, music toggle
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
5. **Lý do yêu em** — sửa `data-reason="..."` của từng `.reason-star` (section `#constellation`), có thể thêm/bớt ngôi sao.
6. **Nhạc nền** (tuỳ chọn) — thêm file `assets/music.mp3`. Nút nốt nhạc góc dưới phải sẽ tự hoạt động.

## Sổ Lưu Bút (Guestbook)

Section **"Sổ Lưu Bút"** là form comment thuần JS, không cần cấu hình gì — hoạt động ngay sau khi deploy. Lời nhắn được lưu vào `localStorage` của trình duyệt (key `olu_guestbook_entries`) và hiển thị ngay bên dưới form, có thể xoá từng lời nhắn.

**Giới hạn cần biết**: `localStorage` lưu **theo từng trình duyệt/thiết bị** — lời nhắn viết trên điện thoại của bạn sẽ không tự hiện trên máy của người kia, vì trang không có server/database để đồng bộ. Đây là lựa chọn đơn giản nhất, không tốn phí, không cần đăng ký dịch vụ nào.

Nếu sau này muốn lời nhắn **đồng bộ giữa các thiết bị** (viết trên điện thoại, người kia thấy trên máy tính), cần thêm một backend lưu trữ thật (ví dụ Firebase, Supabase, hoặc một API tự viết) — báo mình khi cần, đây là việc build thêm.

## Deploy lên GitHub Pages

Repo đã có sẵn code trên nhánh `main`. Bật Pages:

1. Vào repo trên GitHub → **Settings → Pages**
2. Ở mục **Build and deployment → Source**, chọn **Deploy from a branch**
3. **Branch**: `main`, folder: `/ (root)` → **Save**
4. Sau 1–2 phút, trang sẽ có tại:
   `https://hoanhuunguyen.github.io/ourstory/`

Mỗi lần `git push` lên `main`, GitHub Pages sẽ tự rebuild.
