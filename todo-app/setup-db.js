require('dotenv').config();

// Database setup script
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

async function setupDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully');

        // Define Todo schema
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

        const Todo = mongoose.model('Todo', todoSchema);

        // Clear existing data (optional)
        const existingTodos = await Todo.countDocuments();
        console.log(`Found ${existingTodos} existing todos`);

        // Insert sample data
        const sampleTodos = [
            {
                task: 'Welcome to your new Todo App! 🎉',
                priority: 'high',
                completed: false,
                createdAt: new Date()
            },
            {
                task: 'Try editing this task by clicking the edit button',
                priority: 'medium',
                completed: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
            },
            {
                task: 'Mark this task as completed',
                priority: 'low',
                completed: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
            },
            {
                task: 'This is a completed task example',
                priority: 'medium',
                completed: true,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
            }
        ];

        if (existingTodos === 0) {
            console.log('Adding sample todos...');
            await Todo.insertMany(sampleTodos);
            console.log('✅ Sample todos added successfully');
        } else {
            console.log('Database already has todos, skipping sample data');
        }

        console.log('\n🚀 Database setup completed!');
        console.log('You can now start the server with: npm start or npm run dev');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

setupDatabase();
