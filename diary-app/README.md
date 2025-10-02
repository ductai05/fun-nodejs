# 📔 Ứng Dụng Nhật Ký Nhóm

Ứng dụng ghi nhật ký nhóm với xác thực người dùng, được xây dựng với Next.js, NextAuth.js và MongoDB.

## ✨ Tính năng

- 🔐 **Xác thực người dùng**: Đăng ký và đăng nhập an toàn với NextAuth.js
- 👥 **Nhật ký nhóm**: Các thành viên trong cùng nhóm có thể xem nhật ký của nhau
- 👑 **Quản lý admin nhóm**: Người tạo nhóm đầu tiên trở thành admin với quyền đặc biệt
- 🛡️ **Super Admin**: Quản lý toàn bộ hệ thống (users, groups)
- 🔒 **Mật khẩu nhóm**: Bảo vệ nhóm bằng mật khẩu, chỉ người có mật khẩu mới tham gia được
- ✏️ **CRUD đầy đủ**: Tạo, đọc, cập nhật và xóa nhật ký
- 🌙 **Dark Mode**: Chế độ tối bảo vệ mắt
- 🎨 **Giao diện đẹp**: UI hiện đại với Tailwind CSS
- 🚀 **Deploy trên Vercel**: Dễ dàng deploy với một cú click

## 🛠️ Công nghệ sử dụng

- **Next.js 15** - React framework
- **NextAuth.js** - Xác thực
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **Tailwind CSS** - Styling với Dark Mode
- **TypeScript** - Type safety

## 📦 Cài đặt

1. **Clone repository và cài đặt dependencies:**

```bash
npm install
```

2. **Cấu hình biến môi trường:**

Tạo file `.env` trong thư mục gốc:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diary-app?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

Để tạo `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

3. **Chạy ứng dụng:**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

4. **Tạo Super Admin (tùy chọn):**

Nếu bạn muốn có quyền quản trị toàn hệ thống:

```bash
npm run create-admin
```

Làm theo hướng dẫn để tạo tài khoản Super Admin. Sau đó đăng nhập và truy cập [http://localhost:3000/admin](http://localhost:3000/admin).

## 🚀 Deploy lên Vercel

Project này **đã sẵn sàng deploy lên Vercel** với cấu hình hoàn chỉnh!

### Triển khai nhanh:

1. **Push code lên GitHub**

2. **Import vào Vercel:**
   - Truy cập [vercel.com](https://vercel.com) và đăng nhập
   - Click "New Project" → Import repository
   - Chọn repository `diary-app`

3. **Cấu hình Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://dtai:dtai@cieldt.37clwun.mongodb.net/diary-app
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=gtMTW2xW05z6G/jADJonLeNTDYFCCoeeDTKFt+QYXCY=
   ```

4. **Deploy!** - Chỉ mất ~2-3 phút

5. **⚠️ Quan trọng**: Cấu hình MongoDB Network Access
   - Vào MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (Allow from anywhere)

📖 **Xem hướng dẫn chi tiết**: [DEPLOY.md](./DEPLOY.md)

### ✅ Điều kiện deploy thành công:

- ✅ File `vercel.json` đã được cấu hình
- ✅ MongoDB Atlas đã sẵn sàng (network access)
- ✅ Environment variables được thiết lập đúng
- ✅ Project structure tương thích với Vercel
- ✅ API Routes hoạt động như serverless functions

## 📱 Cách sử dụng

### Người dùng thường:

1. **Tạo nhóm mới hoặc tham gia nhóm:**
   - **Tạo nhóm mới**: Nhập mã nhóm chưa tồn tại và đặt mật khẩu nhóm → Bạn sẽ trở thành admin
   - **Tham gia nhóm**: Nhập mã nhóm đã tồn tại và mật khẩu đúng → Tham gia như thành viên
   
2. **Quyền admin nhóm:**
   - Admin có badge 👑 bên cạnh tên
   - Admin có thể xóa nhật ký của bất kỳ thành viên nào trong nhóm
   - Thành viên chỉ có thể sửa/xóa nhật ký của mình

3. **Viết nhật ký:**
   - Click "Viết nhật ký mới"
   - Nhập tiêu đề và nội dung
   - Lưu lại

### Super Admin:

1. **Truy cập Admin Panel:**
   - Click nút "🛡️ Admin Panel" ở góc phải thanh navigation
   - Hoặc truy cập trực tiếp: [/admin](/admin)

2. **Quản lý Users:**
   - Xem danh sách tất cả users
   - Cấp/gỡ quyền Super Admin
   - Xóa users (không thể xóa chính mình)
   - Xem thông tin: tên, email, nhóm, quyền, ngày tạo

3. **Quản lý Groups:**
   - Xem danh sách tất cả nhóm
   - Xem số lượng thành viên trong mỗi nhóm
   - Xóa nhóm (chỉ khi nhóm không còn thành viên)

## 🗄️ Cấu trúc Database

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  groupId: String,
  isGroupAdmin: Boolean,
  isSuperAdmin: Boolean,  // Quyền quản trị toàn hệ thống
  createdAt: Date
}
```

### Groups Collection
```javascript
{
  groupId: String (unique),
  groupPassword: String (hashed),
  adminId: String,
  adminName: String,
  createdAt: Date
}
```

### DiaryEntries Collection
```javascript
{
  title: String,
  content: String,
  authorId: String,
  authorName: String,
  groupId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Bảo mật

- Mật khẩu được hash với bcryptjs
- Session-based authentication với JWT
- API routes được bảo vệ với NextAuth
- Validation đầy đủ ở cả client và server

## 📝 License

MIT

## 👨‍💻 Phát triển bởi

Dự án mẫu cho việc học tập và phát triển ứng dụng Next.js với MongoDB.
