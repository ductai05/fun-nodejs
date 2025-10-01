// api/todos.js - Vercel API Route
require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection với caching
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
        
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        if (mongoose.connection.readyState === 0) {
            console.log('Connecting to MongoDB...');
            const connection = await mongoose.connect(MONGODB_URI, {
                bufferCommands: false,
                maxPoolSize: 1,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            cachedConnection = connection;
            console.log('✅ MongoDB connected successfully');
        }
        
        return cachedConnection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

// Todo Schema
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

// Avoid OverwriteModelError
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectToDatabase();
    } catch (error) {
        console.error('Database connection failed:', error);
        return res.status(500).json({ 
            message: 'Database connection failed', 
            error: error.message 
        });
    }

    try {
        switch (req.method) {
            case 'GET':
                const todos = await Todo.find().sort({ createdAt: -1 });
                return res.status(200).json(todos);

            case 'POST':
                console.log('Request body:', req.body);
                const newTodo = new Todo({
                    task: req.body.task,
                    completed: req.body.completed || false,
                    priority: req.body.priority || 'medium',
                    deadline: req.body.deadline || null,
                    createdAt: req.body.createdAt || new Date()
                });
                
                console.log('New todo before save:', newTodo);
                const savedTodo = await newTodo.save();
                console.log('Saved todo:', savedTodo);
                return res.status(201).json(savedTodo);

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).json({ message: `Method ${req.method} not allowed` });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
}
