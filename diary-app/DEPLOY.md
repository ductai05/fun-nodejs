# 🚀 Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị

1. **Tạo tài khoản Vercel** tại [vercel.com](https://vercel.com)
2. **Đẩy code lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/diary-app.git
   git push -u origin main
   ```

## Bước 2: Import Project vào Vercel

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Chọn repository **diary-app** từ GitHub
4. Click **"Import"**

## Bước 3: Cấu hình Environment Variables

Trong phần **Environment Variables**, thêm các biến sau:

### 1. MONGODB_URI
```
mongodb+srv://dtai:dtai@cieldt.37clwun.mongodb.net/diary-app
```
**Lưu ý**: Nên tạo user MongoDB mới với quyền hạn phù hợp cho production

### 2. NEXTAUTH_URL
```
https://your-app-name.vercel.app
```
**Lưu ý**: Sẽ được cập nhật sau khi deploy lần đầu

### 3. NEXTAUTH_SECRET
```
gtMTW2xW05z6G/jADJonLeNTDYFCCoeeDTKFt+QYXCY=
```
Hoặc tạo secret mới bằng:
```bash
openssl rand -base64 32
```

## Bước 4: Deploy

1. Click **"Deploy"**
2. Đợi quá trình build hoàn tất (~2-3 phút)
3. Sau khi deploy xong, copy URL của app (ví dụ: `https://diary-app-xyz.vercel.app`)

## Bước 5: Cập nhật NEXTAUTH_URL

1. Quay lại **Vercel Dashboard** → Project Settings → Environment Variables
2. Sửa `NEXTAUTH_URL` thành URL thực của app
3. **Redeploy** project

## Bước 6: Cấu hình MongoDB Network Access (Quan trọng!)

MongoDB Atlas mặc định chỉ cho phép kết nối từ IP cụ thể. Để Vercel có thể kết nối:

1. Đăng nhập [MongoDB Atlas](https://cloud.mongodb.com)
2. Chọn cluster → **Network Access** → **Add IP Address**
3. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Confirm**

**⚠️ Lưu ý bảo mật**: Nên giới hạn IP range của Vercel nếu có thể

## Bước 7: Tạo Super Admin trên Production

Sau khi deploy thành công, bạn cần tạo tài khoản Super Admin:

### Option 1: Chạy script local (khuyên dùng)
```bash
# Cập nhật MONGODB_URI trong .env về production database
MONGODB_URI=mongodb+srv://... npm run create-admin
```

### Option 2: Tạo trực tiếp trong MongoDB Atlas
1. Vào MongoDB Atlas → Collections → `users`
2. Insert Document với nội dung:
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "$2a$12$hashedPasswordHere",
  "groupId": "admin-group",
  "isGroupAdmin": false,
  "isSuperAdmin": true,
  "createdAt": { "$date": "2025-10-02T00:00:00.000Z" }
}
```

## Bước 8: Kiểm tra

1. Truy cập URL app của bạn
2. Đăng nhập bằng tài khoản Super Admin
3. Test các tính năng:
   - ✅ Đăng ký user mới
   - ✅ Tạo/xem/sửa/xóa diary
   - ✅ Đổi mật khẩu nhóm (Group Admin)
   - ✅ Quản lý users/groups (Super Admin)

## 🔧 Troubleshooting

### Lỗi "MongoServerError: bad auth"
- Kiểm tra username/password trong MONGODB_URI
- Đảm bảo user có quyền truy cập database `diary-app`

### Lỗi "MongooseServerSelectionError"
- Kiểm tra Network Access trong MongoDB Atlas
- Thêm 0.0.0.0/0 vào whitelist

### Lỗi "Invalid credentials" khi đăng nhập
- Đảm bảo đã tạo Super Admin
- Kiểm tra email và password chính xác

### Lỗi NextAuth
- Kiểm tra NEXTAUTH_URL khớp với URL production
- Kiểm tra NEXTAUTH_SECRET đã được set

## 📝 Lưu ý

- ✅ Vercel tự động deploy khi push code lên GitHub
- ✅ Hỗ trợ serverless functions cho API routes
- ✅ Tự động scale theo traffic
- ✅ SSL certificate miễn phí
- ⚠️ Free tier có giới hạn: 100GB bandwidth/tháng

## 🔗 Links hữu ích

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
