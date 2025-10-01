// Test script for deadline functionality
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testDeadlineAPI() {
    try {
        console.log('🧪 Testing Deadline API...\n');
        
        // Test 1: Create todo with deadline
        console.log('1️⃣ Creating todo with deadline...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(15, 30, 0, 0);
        
        const newTodo = {
            task: 'Test todo with deadline - Tomorrow 3:30 PM',
            priority: 'high',
            deadline: tomorrow.toISOString()
        };
        
        const createResponse = await axios.post(`${API_URL}/todos`, newTodo);
        console.log('✅ Created:', {
            id: createResponse.data._id,
            task: createResponse.data.task,
            deadline: createResponse.data.deadline,
            priority: createResponse.data.priority
        });
        
        // Test 2: Get all todos and verify deadline
        console.log('\n2️⃣ Fetching all todos...');
        const getResponse = await axios.get(`${API_URL}/todos`);
        const todosWithDeadlines = getResponse.data.filter(todo => todo.deadline);
        console.log(`✅ Found ${todosWithDeadlines.length} todos with deadlines`);
        
        todosWithDeadlines.forEach(todo => {
            console.log(`   📅 ${todo.task}: ${new Date(todo.deadline).toLocaleString()}`);
        });
        
        // Test 3: Update deadline
        if (createResponse.data._id) {
            console.log('\n3️⃣ Updating deadline...');
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            nextWeek.setHours(10, 0, 0, 0);
            
            const updateResponse = await axios.patch(`${API_URL}/todos/${createResponse.data._id}`, {
                deadline: nextWeek.toISOString()
            });
            console.log('✅ Updated deadline:', new Date(updateResponse.data.deadline).toLocaleString());
        }
        
        // Test 4: Create overdue todo (for testing UI)
        console.log('\n4️⃣ Creating overdue todo for UI testing...');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(10, 0, 0, 0);
        
        const overdueTodo = {
            task: 'Overdue task - Yesterday 10 AM',
            priority: 'medium',
            deadline: yesterday.toISOString()
        };
        
        const overdueResponse = await axios.post(`${API_URL}/todos`, overdueTodo);
        console.log('✅ Created overdue todo:', {
            task: overdueResponse.data.task,
            deadline: overdueResponse.data.deadline,
            isOverdue: new Date(overdueResponse.data.deadline) < new Date()
        });
        
        console.log('\n🎉 All deadline tests passed!');
        console.log('💡 Now check the web interface at http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

// Install axios if not available and run test
async function runTest() {
    try {
        await testDeadlineAPI();
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('📦 Installing axios...');
            const { exec } = require('child_process');
            exec('npm install axios', (err, stdout, stderr) => {
                if (err) {
                    console.error('Failed to install axios:', err);
                    return;
                }
                console.log('✅ Axios installed, running test...\n');
                testDeadlineAPI();
            });
        } else {
            throw error;
        }
    }
}

runTest();
