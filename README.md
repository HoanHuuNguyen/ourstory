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

## Sổ Lưu Bút / Comments (giscus)

Section **"Sổ Lưu Bút"** dùng [giscus](https://giscus.app) — bình luận lưu vào GitHub Discussions của chính repo này, miễn phí, không cần server, không cần database. Kích hoạt 1 lần (~2 phút):

1. Vào repo → **Settings → General → Features** → tick ✅ **Discussions** → Save.
2. Vào [giscus.app](https://giscus.app):
   - Nhập repo: `HoanHuuNguyen/ourstory`
   - Trang sẽ báo cần cài **giscus app** → bấm link, **Install** app đó vào riêng repo `ourstory` (đăng nhập bằng tài khoản GitHub chủ repo).
   - Sau khi cài xong, giscus.app sẽ hiện ✅ và sinh ra đoạn cấu hình gồm `data-repo-id` và `data-category-id`.
   - Ở mục **Discussion Category**, chọn `General` (hoặc tạo category riêng tên "Lời nhắn").
3. Copy 2 giá trị `data-repo-id="..."` và `data-category-id="..."` từ giscus.app.
4. Mở `index.html`, tìm `REPLACE_WITH_REPO_ID` và `REPLACE_WITH_CATEGORY_ID` (section `#guestbook`) → dán giá trị thật vào.
5. Commit & push — comment box sẽ hoạt động ngay, mỗi lời nhắn là 1 comment trong GitHub Discussions, ai vào trang cũng đọc được.

> Cho đến khi hoàn tất bước trên, trang sẽ hiển thị dòng nhắc "chưa kích hoạt" thay vì khung bình luận.

## Deploy lên GitHub Pages

Repo đã có sẵn code trên nhánh `main`. Bật Pages:

1. Vào repo trên GitHub → **Settings → Pages**
2. Ở mục **Build and deployment → Source**, chọn **Deploy from a branch**
3. **Branch**: `main`, folder: `/ (root)` → **Save**
4. Sau 1–2 phút, trang sẽ có tại:
   `https://hoanhuunguyen.github.io/ourstory/`

Mỗi lần `git push` lên `main`, GitHub Pages sẽ tự rebuild.
