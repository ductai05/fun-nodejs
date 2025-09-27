// api/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Cho phép các domain khác gọi API
app.use(express.json()); // Phân tích body của request dưới dạng JSON
app.use(express.static('public')); // Serve static files từ thư mục public

console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);

// Kết nối tới MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));

// Định nghĩa Schema (cấu trúc) cho một "Todo"
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Tạo Model từ Schema
const Todo = mongoose.model('Todo', todoSchema);

// --- Các tuyến đường API (API Routes) ---

// 1. Lấy tất cả công việc
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Thêm một công việc mới
app.post('/api/todos', async (req, res) => {
    const todo = new Todo({
        task: req.body.task,
        completed: req.body.completed || false,
        priority: req.body.priority || 'medium',
        createdAt: req.body.createdAt || new Date()
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. Cập nhật một công việc (đánh dấu hoàn thành)
app.put('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({ message: 'Cannot find todo' });
        }
        todo.completed = !todo.completed; // Đảo ngược trạng thái
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// 4. Cập nhật một phần của công việc (PATCH)
app.patch('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({ message: 'Cannot find todo' });
        }
        
        // Cập nhật chỉ các trường được gửi trong request
        if (req.body.task !== undefined) todo.task = req.body.task;
        if (req.body.completed !== undefined) todo.completed = req.body.completed;
        if (req.body.priority !== undefined) todo.priority = req.body.priority;
        
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// 5. Xóa một công việc
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (todo == null) {
             return res.status(404).json({ message: 'Cannot find todo' });
        }
        res.json({ message: 'Deleted Todo' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xuất app để Vercel có thể sử dụng
module.exports = app;

// Chạy server ở local (chỉ khi file này được chạy trực tiếp)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}