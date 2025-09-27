# Modern Todo App 🚀

Một ứng dụng quản lý công việc hiện đại với giao diện đẹp mắt và nhiều tính năng advanced.

## ✨ Tính năng

### 🎨 Giao diện
- **Modern UI/UX** với gradient backgrounds và glassmorphism effects
- **Responsive design** hoạt động tốt trên mọi thiết bị
- **Dark/Light theme** với transitions mượt mà
- **Font Icons** từ Font Awesome
- **Google Fonts** (Inter) cho typography chuyên nghiệp

### 📋 Quản lý Todo
- ✅ **Thêm/Xóa/Sửa** tasks
- 🎯 **Priority levels** (High/Medium/Low) với color coding
- ✔️ **Mark as complete/incomplete** với checkbox animations
- 📊 **Progress tracking** với progress bar
- 📈 **Statistics** hiển thị tổng số tasks và completion rate

### 🔍 Filter & Sort
- **Filter by status**: All, Active, Completed
- **Sort options**: 
  - Newest first
  - Oldest first  
  - By priority
  - Alphabetical (A-Z)

### 🔧 Bulk Actions
- **Clear completed** - Xóa tất cả tasks đã hoàn thành
- **Mark all complete** - Đánh dấu tất cả tasks là hoàn thành

### 💾 Backend Features
- **RESTful API** với Express.js
- **MongoDB** database với Mongoose ODM
- **CORS** enabled cho cross-origin requests
- **Error handling** và validation
- **Environment variables** support

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern CSS với Flexbox/Grid, animations, glassmorphism
- **JavaScript ES6+** - Classes, async/await, fetch API
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd todo-app
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cài đặt development dependencies
```bash
npm install --save-dev nodemon
```

### 4. Tạo file .env
```bash
# Tạo file .env trong root directory và thêm:
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=3000
```

### 5. Khởi động MongoDB
Đảm bảo MongoDB đang chạy trên máy local hoặc sử dụng MongoDB Atlas.

### 6. Chạy ứng dụng

#### Development mode (với nodemon)
```bash
npm run dev
```

#### Production mode
```bash
npm start
```

### 7. Mở trình duyệt
Truy cập `http://localhost:3000` để sử dụng ứng dụng.

## 📁 Cấu trúc Project

```
todo-app/
├── api/
│   └── index.js          # Express server & API routes
├── public/
│   ├── index.html        # Main HTML file
│   ├── script.js         # Frontend JavaScript
│   ├── style.css         # Modern CSS styles
│   └── 404.html         # Custom 404 page
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies & scripts
└── README.md           # Documentation
```

## 🔌 API Endpoints

### GET `/api/todos`
Lấy tất cả todos

### POST `/api/todos`
Tạo todo mới
```json
{
  "task": "Task description",
  "priority": "medium",
  "completed": false
}
```

### PUT `/api/todos/:id`
Toggle completion status của todo

### PATCH `/api/todos/:id`
Cập nhật partial todo data
```json
{
  "task": "Updated task",
  "priority": "high"
}
```

### DELETE `/api/todos/:id`
Xóa todo

## 🎨 Customization

### Colors & Theme
Bạn có thể tùy chỉnh colors trong file `style.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --primary-color: #4c51bf;
  --secondary-color: #667eea;
  /* ... */
}
```

### Fonts
Thay đổi font family trong CSS:
```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px  
- **Desktop**: > 768px

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Connect GitHub repo với Vercel
3. Set environment variables trong Vercel dashboard
4. Deploy!

### Heroku
1. Install Heroku CLI
2. `heroku create your-app-name`
3. Set config vars: `heroku config:set MONGODB_URI=your-mongo-uri`
4. `git push heroku main`

## 🔧 Development

### Scripts có sẵn
```bash
npm start          # Chạy production server
npm run dev        # Chạy development server với nodemon
npm test           # Chạy tests (chưa implement)
```

### Environment Variables
```bash
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=3000
NODE_ENV=development
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Bug Reports & Feature Requests

Nếu bạn tìm thấy bug hoặc muốn request feature mới, vui lòng tạo issue trên GitHub.

## 📞 Support

Nếu bạn cần hỗ trợ, vui lòng:
1. Kiểm tra documentation này
2. Search existing issues trên GitHub
3. Tạo issue mới nếu cần

---

Made with ❤️ and ☕ by [Your Name]
