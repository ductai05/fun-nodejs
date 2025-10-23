# 🌟 Random Quote Generator

Một ứng dụng web đơn giản để tạo quote ngẫu nhiên, được xây dựng bằng Node.js và deploy trên Vercel.

## ✨ Tính năng

- 🎲 Tạo quote ngẫu nhiên từ bộ sưu tập 20+ quotes
- 📱 Giao diện responsive, đẹp mắt
- 📤 Chia sẻ quote dễ dàng
- ⌨️ Hỗ trợ phím tắt (Space/Enter để lấy quote mới)
- 🚀 Deploy miễn phí trên Vercel

## 🛠️ Công nghệ sử dụng

- **Backend**: Node.js với Vercel Functions
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Deploy**: Vercel
- **API**: RESTful API đơn giản

## 📁 Cấu trúc dự án

```
quote-generator/
├── api/
│   ├── index.js          # API endpoint chính
│   └── quotes.js         # Database quotes
├── index.html            # Giao diện web
├── package.json          # Dependencies
├── vercel.json          # Cấu hình Vercel
└── README.md            # Hướng dẫn này
```

## 🚀 Cách chạy local

1. **Clone repository:**
```bash
git clone <your-repo-url>
cd quote-generator
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Chạy development server:**
```bash
npm run dev
# hoặc
vercel dev
```

4. **Mở trình duyệt:**
```
http://localhost:3000
```

## 🌐 API Endpoints

### GET `/api`
Lấy một quote ngẫu nhiên.

**Response:**
```json
{
  "success": true,
  "quote": {
    "text": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  },
  "totalQuotes": 20
}
```

## 📤 Deploy trên Vercel

### Cách 1: Deploy từ GitHub (Khuyến nghị)

1. **Push code lên GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Đăng ký/đăng nhập Vercel:**
   - Truy cập [vercel.com](https://vercel.com)
   - Đăng ký bằng GitHub account

3. **Import project:**
   - Click "New Project"
   - Chọn repository từ GitHub
   - Vercel sẽ tự động detect cấu hình

4. **Deploy:**
   - Click "Deploy"
   - Chờ vài phút để hoàn thành

### Cách 2: Deploy bằng Vercel CLI

1. **Cài đặt Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login và deploy:**
```bash
vercel login
vercel --prod
```

## 🎨 Tùy chỉnh

### Thêm quotes mới:
Chỉnh sửa file `api/quotes.js` để thêm quotes mới:

```javascript
{
  text: "Quote mới của bạn",
  author: "Tác giả"
}
```

### Thay đổi giao diện:
Chỉnh sửa CSS trong file `index.html` để thay đổi màu sắc, font chữ, layout...

### Thêm tính năng mới:
- Thêm endpoint API mới trong thư mục `api/`
- Cập nhật `vercel.json` nếu cần thiết

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **API không hoạt động:**
   - Kiểm tra file `vercel.json` có đúng cấu hình
   - Đảm bảo file API có export function đúng

2. **Giao diện không hiển thị:**
   - Kiểm tra file `index.html` có trong root directory
   - Kiểm tra route configuration trong `vercel.json`

3. **Deploy thất bại:**
   - Kiểm tra logs trong Vercel dashboard
   - Đảm bảo Node.js version tương thích (>=18.x)

## 📝 License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Hãy:

1. Fork project
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Liên hệ

Nếu có câu hỏi hoặc góp ý, hãy tạo issue trên GitHub repository.

---

**Happy Coding! 🚀**

