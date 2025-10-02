# 📝 Hướng dẫn sử dụng Diary App

## 🚀 Các bước chạy ứng dụng:

### 1. Cập nhật file .env
Thay thế `<db_username>` và `<db_password>` bằng thông tin MongoDB của bạn

### 2. Chạy development server
```bash
npm run dev
```

### 3. Mở trình duyệt
Truy cập: http://localhost:3000

### 4. Đăng ký tài khoản
- Nhập thông tin cá nhân
- Tạo mã nhóm (ví dụ: `nhom-1`)
- Các thành viên cùng mã nhóm sẽ xem được nhật ký của nhau

### 5. Viết nhật ký
- Đăng nhập và bắt đầu viết nhật ký
- Xem nhật ký của các thành viên khác trong nhóm

## 📦 Build cho production
```bash
npm run build
npm start
```

## 🚀 Deploy lên Vercel
1. Push code lên GitHub
2. Import vào Vercel
3. Thêm biến môi trường từ file .env
4. Deploy!

## 🗄️ Database Structure
- **Database name**: `diary-app` (tách biệt với các app khác)
- **Collections**: `users`, `diaryentries`

## 🔐 Bảo mật
- Không commit file `.env` lên Git
- Đã được thêm vào `.gitignore`
