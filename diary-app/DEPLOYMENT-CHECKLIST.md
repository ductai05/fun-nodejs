# ✅ Checklist Deploy Vercel

## 📋 Trước khi Deploy

### 1. Code & Configuration
- [x] `vercel.json` đã được tạo
- [x] `next.config.js` đã cấu hình
- [x] `.env.example` đã có template
- [x] `.gitignore` đã loại trừ `.env`
- [x] `package.json` có đầy đủ scripts (build, start)
- [x] Tất cả dependencies đã được cài đặt
- [x] TypeScript không có lỗi compile

### 2. Database
- [x] MongoDB Atlas cluster đang hoạt động
- [x] Database name: `diary-app`
- [x] Collections: `users`, `groups`, `diaryentries`
- [ ] **QUAN TRỌNG**: Network Access cho phép 0.0.0.0/0

### 3. Environment Variables (cần thiết lập trên Vercel)
- [ ] `MONGODB_URI`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`

## 🚀 Các bước Deploy

1. **Push lên GitHub**
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/diary-app.git
   git push -u origin main
   ```

2. **Import vào Vercel**
   - Đăng nhập [vercel.com](https://vercel.com)
   - New Project → Import từ GitHub
   - Chọn repository `diary-app`

3. **Thiết lập Environment Variables**
   
   **MONGODB_URI**:
   ```
   mongodb+srv://dtai:dtai@cieldt.37clwun.mongodb.net/diary-app
   ```
   
   **NEXTAUTH_URL** (cập nhật sau khi deploy lần đầu):
   ```
   https://your-app-name.vercel.app
   ```
   
   **NEXTAUTH_SECRET**:
   ```
   gtMTW2xW05z6G/jADJonLeNTDYFCCoeeDTKFt+QYXCY=
   ```

4. **Deploy**
   - Click "Deploy"
   - Đợi build hoàn tất (~2-3 phút)

5. **Cập nhật NEXTAUTH_URL**
   - Copy URL production
   - Settings → Environment Variables
   - Update NEXTAUTH_URL
   - Redeploy

6. **Cấu hình MongoDB Network Access**
   - MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0`
   - Comment: "Vercel serverless functions"

## ✅ Sau khi Deploy

### Test cơ bản:
- [ ] Trang chủ load được
- [ ] Đăng ký user mới thành công
- [ ] Đăng nhập thành công
- [ ] Tạo diary entry mới
- [ ] Xem danh sách diaries
- [ ] Chỉnh sửa diary
- [ ] Xóa diary
- [ ] Dark mode hoạt động
- [ ] Group admin functions
- [ ] Super admin panel (nếu đã tạo super admin)

### Test nâng cao:
- [ ] Tạo nhiều users trong cùng group
- [ ] Test group password protection
- [ ] Test group admin quyền xóa diary
- [ ] Test super admin quản lý users
- [ ] Test super admin quản lý groups
- [ ] Test đổi mật khẩu nhóm
- [ ] Test session timeout
- [ ] Test trên mobile

## 🔧 Troubleshooting

### Build Failed
- Kiểm tra `npm run build` local
- Kiểm tra TypeScript errors
- Kiểm tra dependencies version conflicts

### Runtime Errors
- Check Vercel logs: Dashboard → Functions → Logs
- Verify environment variables
- Check MongoDB connection string

### Authentication Issues
- Verify NEXTAUTH_URL matches production URL
- Check NEXTAUTH_SECRET is set
- Clear browser cookies và retry

### Database Connection Failed
- Verify MongoDB Network Access includes 0.0.0.0/0
- Check connection string format
- Verify database user credentials

## 📊 Performance Checklist

- [ ] Images optimized (nếu có)
- [ ] API routes có proper error handling
- [ ] Database queries có indexes phù hợp
- [ ] No console.logs in production code
- [ ] Environment specific configs

## 🔒 Security Checklist

- [ ] `.env` không được commit vào git
- [ ] MongoDB credentials an toàn
- [ ] NEXTAUTH_SECRET đủ mạnh (32+ characters)
- [ ] Password được hash với bcrypt
- [ ] API routes có authentication check
- [ ] Admin routes có authorization check
- [ ] Input validation ở cả client và server

## 📝 Post-deployment Tasks

1. **Tạo Super Admin trên Production**
   ```bash
   # Update .env to point to production DB
   MONGODB_URI=<production-uri> npm run create-admin
   ```

2. **Monitor Application**
   - Check Vercel Analytics
   - Monitor error logs
   - Check database usage

3. **Update Documentation**
   - Add production URL to README
   - Document any environment-specific behavior

## 🎉 Done!

Khi tất cả checklist đã hoàn thành, app của bạn đã sẵn sàng cho production! 🚀
