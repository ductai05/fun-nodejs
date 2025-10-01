// api/index.js - Vercel serverless function
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-app.vercel.app', '*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection với caching để tối ưu cho serverless
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
        
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        console.log('Connecting to MongoDB...');
        
        const connection = await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            maxPoolSize: 1, // Tối ưu cho serverless
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        cachedConnection = connection;
        console.log('✅ MongoDB connected successfully');
        return connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

// Middleware để đảm bảo kết nối database cho mỗi request
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ 
            message: 'Database connection failed', 
            error: error.message 
        });
    }
});

// Định nghĩa Schema (cấu trúc) cho một "Todo"
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    deadline: { 
        type: Date, 
        default: null 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Tạo Model từ Schema (tránh OverwriteModelError cho Vercel)
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

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
    console.log('POST /api/todos - Request body:', req.body);
    const todo = new Todo({
        task: req.body.task,
        completed: req.body.completed || false,
        priority: req.body.priority || 'medium',
        deadline: req.body.deadline || null,
        createdAt: req.body.createdAt || new Date()
    });
    try {
        console.log('Todo before save:', todo);
        const newTodo = await todo.save();
        console.log('Todo after save:', newTodo);
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
        if (req.body.deadline !== undefined) todo.deadline = req.body.deadline;
        
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve static files cho local development
if (process.env.NODE_ENV !== 'production') {
    app.use(express.static('public'));
    
    const path = require('path');
    
    // Serve index.html cho root path khi local
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}

// Export cho Vercel
module.exports = app;

// Chạy server ở local (chỉ khi file này được chạy trực tiếp)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}