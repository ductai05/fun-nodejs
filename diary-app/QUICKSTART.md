# 🚀 Quick Start Guide

## Phát triển Local (5 phút)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo file .env từ template
cp .env.example .env

# 3. Cập nhật .env với thông tin của bạn
# MONGODB_URI=mongodb+srv://...
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# 4. Chạy development server
npm run dev

# 5. Mở browser: http://localhost:3000
```

## Deploy Production (10 phút)

```bash
# 1. Push code lên GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/diary-app.git
git push -u origin main

# 2. Vào vercel.com
# - Import project từ GitHub
# - Thêm Environment Variables (MONGODB_URI, NEXTAUTH_URL, NEXTAUTH_SECRET)
# - Click Deploy

# 3. Cấu hình MongoDB Atlas
# - Network Access → Add IP → 0.0.0.0/0

# 4. Tạo Super Admin (optional)
npm run create-admin
```

## 📖 Chi tiết

- **Development**: Xem [README.md](./README.md)
- **Deployment**: Xem [DEPLOY.md](./DEPLOY.md)
- **Checklist**: Xem [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)

## 🆘 Cần giúp đỡ?

- MongoDB connection errors → Check Network Access
- NextAuth errors → Verify NEXTAUTH_URL và NEXTAUTH_SECRET
- Build errors → Run `npm run build` locally first
