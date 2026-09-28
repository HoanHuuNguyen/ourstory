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

## Sổ Lưu Bút (Guestbook) — Firebase Firestore

Section **"Sổ Lưu Bút"** dùng [Firebase Firestore](https://firebase.google.com) — lời nhắn lưu trên cloud, **đồng bộ cho mọi thiết bị/trình duyệt**, ai vào trang cũng thấy cùng danh sách, sửa/xoá realtime. Miễn phí (gói Spark), không cần thẻ tín dụng, đủ dùng thoải mái cho quy mô 2 người.

### Kích hoạt (một lần, ~5 phút)

1. Vào [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → đặt tên bất kỳ (VD: `ourstory`) → tắt Google Analytics nếu không cần → Create.
2. Trong project → menu trái **Build → Firestore Database** → **Create database** → chọn **Production mode** → chọn region gần (VD: `asia-southeast1`) → Enable.
3. Tab **Rules** của Firestore, thay toàn bộ bằng:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /guestbook/{entryId} {
         allow read: if true;
         allow create: if request.resource.data.name is string
                       && request.resource.data.name.size() > 0
                       && request.resource.data.name.size() <= 40
                       && request.resource.data.message is string
                       && request.resource.data.message.size() > 0
                       && request.resource.data.message.size() <= 500;
         allow update: if request.resource.data.diff(resource.data).affectedKeys()
                       .hasOnly(['message', 'editedAt']);
         allow delete: if true;
       }
     }
   }
   ```
   → **Publish**.
4. Về trang chủ project → bấm icon **`</>`** (Add app → Web) → đặt tên app → **Register app** (không cần Hosting).
5. Firebase sẽ hiện đoạn `firebaseConfig = {...}` → copy 6 giá trị đó.
6. Mở `js/firebase-guestbook.js`, dán vào `FIREBASE_CONFIG` (thay các giá trị `REPLACE_WITH_...`).
7. Commit & push — Sổ Lưu Bút sẽ hoạt động ngay, dữ liệu đồng bộ thật giữa các thiết bị.

> **Lưu ý bảo mật**: rule trên cho phép ai cũng xoá được lời nhắn (không có đăng nhập) — phù hợp vì đây là trang riêng tư cho 2 người, ít người biết đến. Nếu muốn chặt chẽ hơn (chỉ người gửi mới xoá được lời nhắn của mình), cần thêm Firebase Authentication — báo mình nếu muốn nâng cấp.

Cho đến khi cấu hình xong, form sẽ hiển thị dòng nhắc "chưa kích hoạt" và nút gửi bị vô hiệu hoá.

## Deploy lên GitHub Pages

Repo đã có sẵn code trên nhánh `main`. Bật Pages:

1. Vào repo trên GitHub → **Settings → Pages**
2. Ở mục **Build and deployment → Source**, chọn **Deploy from a branch**
3. **Branch**: `main`, folder: `/ (root)` → **Save**
4. Sau 1–2 phút, trang sẽ có tại:
   `https://hoanhuunguyen.github.io/ourstory/`

Mỗi lần `git push` lên `main`, GitHub Pages sẽ tự rebuild.
