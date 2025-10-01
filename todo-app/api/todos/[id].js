// api/todos/[id].js - Vercel API Route for individual todos
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

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Todo ID is required' });
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
            case 'PUT':
                // Toggle completion status
                const todo = await Todo.findById(id);
                if (!todo) {
                    return res.status(404).json({ message: 'Todo not found' });
                }
                
                todo.completed = !todo.completed;
                const updatedTodo = await todo.save();
                return res.status(200).json(updatedTodo);

            case 'PATCH':
                // Partial update
                const todoToUpdate = await Todo.findById(id);
                if (!todoToUpdate) {
                    return res.status(404).json({ message: 'Todo not found' });
                }
                
                if (req.body.task !== undefined) todoToUpdate.task = req.body.task;
                if (req.body.completed !== undefined) todoToUpdate.completed = req.body.completed;
                if (req.body.priority !== undefined) todoToUpdate.priority = req.body.priority;
                if (req.body.deadline !== undefined) todoToUpdate.deadline = req.body.deadline;
                
                const patchedTodo = await todoToUpdate.save();
                return res.status(200).json(patchedTodo);

            case 'DELETE':
                const deletedTodo = await Todo.findByIdAndDelete(id);
                if (!deletedTodo) {
                    return res.status(404).json({ message: 'Todo not found' });
                }
                return res.status(200).json({ message: 'Todo deleted successfully' });

            default:
                res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE']);
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
