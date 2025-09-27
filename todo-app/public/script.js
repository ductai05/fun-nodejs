// Modern Todo App JavaScript
class TodoApp {
    constructor() {
        // Tự động detect API URL dựa trên môi trường
        this.API_URL = this.getAPIUrl();
        this.todos = [];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.editingTodo = null;
        
        this.initializeElements();
        this.bindEvents();
        this.fetchTodos();
    }

    getAPIUrl() {
        // Kiểm tra xem đang chạy từ đâu
        const currentHost = window.location.host;
        
        if (currentHost.includes(':5500') || currentHost.includes('127.0.0.1:5500')) {
            // Đang chạy từ Live Server
            return 'http://localhost:3000/api/todos';
        } else if (currentHost.includes('localhost:3000') || currentHost.includes('127.0.0.1:3000')) {
            // Đang chạy từ Express server
            return '/api/todos';
        } else {
            // Production hoặc các môi trường khác
            return '/api/todos';
        }
    }

    initializeElements() {
        // Form elements
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.prioritySelect = document.getElementById('priority-select');
        
        // Display elements
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        this.totalTasks = document.getElementById('total-tasks');
        this.completedTasks = document.getElementById('completed-tasks');
        this.progressFill = document.getElementById('progress-fill');
        this.progressPercentage = document.getElementById('progress-percentage');
        
        // Filter and sort elements
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.sortSelect = document.getElementById('sort-select');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.markAllCompleteBtn = document.getElementById('mark-all-complete');
        
        // Modal elements
        this.editModal = document.getElementById('edit-modal');
        this.editInput = document.getElementById('edit-input');
        this.editPrioritySelect = document.getElementById('edit-priority-select');
        this.saveEditBtn = document.getElementById('save-edit');
        this.cancelEditBtn = document.getElementById('cancel-edit');
        this.closeModal = document.querySelector('.close');
    }

    bindEvents() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
        
        // Sort selection
        this.sortSelect.addEventListener('change', (e) => this.handleSort(e));
        
        // Bulk actions
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.markAllCompleteBtn.addEventListener('click', () => this.markAllComplete());
        
        // Server check button
        document.getElementById('check-server').addEventListener('click', () => this.checkServerConnection());
        
        // Modal events
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.saveEditBtn.addEventListener('click', () => this.saveEdit());
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editModal.style.display === 'block') {
                this.closeEditModal();
            }
        });
    }

    async fetchTodos() {
        try {
            console.log('Fetching todos from:', this.API_URL);
            const response = await fetch(this.API_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            this.todos = await response.json();
            this.renderTodos();
            this.updateStats();
            this.showConnectionStatus(true);
        } catch (error) {
            console.error('Error fetching todos:', error);
            this.showConnectionStatus(false);
            this.showError(`Failed to connect to server. Make sure the server is running on port 3000.\nError: ${error.message}`);
        }
    }

    async handleAddTodo(e) {
        e.preventDefault();
        
        const task = this.todoInput.value.trim();
        const priority = this.prioritySelect.value;
        
        if (!task) return;

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    task: task,
                    priority: priority,
                    createdAt: new Date().toISOString()
                })
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const newTodo = await response.json();
            this.todos.unshift(newTodo);
            
            // Reset form
            this.todoInput.value = '';
            this.prioritySelect.value = 'medium';
            
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error adding todo:', error);
            this.showError('Failed to add todo. Please try again.');
        }
    }

    async deleteTodo(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        try {
            const response = await fetch(`${this.API_URL}/${id}`, { 
                method: 'DELETE' 
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            this.todos = this.todos.filter(todo => todo._id !== id);
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error deleting todo:', error);
            this.showError('Failed to delete todo. Please try again.');
        }
    }

    async toggleComplete(id) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, { 
                method: 'PUT' 
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const updatedTodo = await response.json();
            const index = this.todos.findIndex(todo => todo._id === id);
            
            if (index !== -1) {
                this.todos[index] = updatedTodo;
            }
            
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showError('Failed to update todo. Please try again.');
        }
    }

    async updateTodo(id, updates) {
        try {
            const response = await fetch(`${this.API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const updatedTodo = await response.json();
            const index = this.todos.findIndex(todo => todo._id === id);
            
            if (index !== -1) {
                this.todos[index] = updatedTodo;
            }
            
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error updating todo:', error);
            this.showError('Failed to update todo. Please try again.');
        }
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        const sortedTodos = this.getSortedTodos(filteredTodos);
        
        this.todoList.innerHTML = '';
        
        if (sortedTodos.length === 0) {
            this.emptyState.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
            sortedTodos.forEach(todo => this.createTodoElement(todo));
        }
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item priority-${todo.priority || 'medium'}`;
        if (todo.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'completed' : ''}" onclick="app.toggleComplete('${todo._id}')">
                ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
            </div>
            <div class="todo-content">
                <div class="todo-text">${this.escapeHtml(todo.task)}</div>
                <div class="todo-meta">
                    <span class="priority-badge">${todo.priority || 'medium'}</span>
                    <span class="todo-date">${this.formatDate(todo.createdAt)}</span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="btn-icon btn-edit" onclick="app.openEditModal('${todo._id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="app.deleteTodo('${todo._id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        this.todoList.appendChild(li);
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    getSortedTodos(todos) {
        switch (this.currentSort) {
            case 'oldest':
                return [...todos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return [...todos].sort((a, b) => {
                    const aPriority = priorityOrder[a.priority || 'medium'];
                    const bPriority = priorityOrder[b.priority || 'medium'];
                    return bPriority - aPriority;
                });
            case 'alphabetical':
                return [...todos].sort((a, b) => a.task.toLowerCase().localeCompare(b.task.toLowerCase()));
            case 'newest':
            default:
                return [...todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    handleFilter(e) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderTodos();
    }

    handleSort(e) {
        this.currentSort = e.target.value;
        this.renderTodos();
    }

    async clearCompleted() {
        const completedTodos = this.todos.filter(todo => todo.completed);
        
        if (completedTodos.length === 0) {
            this.showError('No completed tasks to clear.');
            return;
        }
        
        if (!confirm(`Are you sure you want to delete ${completedTodos.length} completed tasks?`)) {
            return;
        }

        try {
            const deletePromises = completedTodos.map(todo => 
                fetch(`${this.API_URL}/${todo._id}`, { method: 'DELETE' })
            );
            
            await Promise.all(deletePromises);
            this.todos = this.todos.filter(todo => !todo.completed);
            this.renderTodos();
            this.updateStats();
            
        } catch (error) {
            console.error('Error clearing completed todos:', error);
            this.showError('Failed to clear completed tasks. Please try again.');
        }
    }

    async markAllComplete() {
        const incompleteTodos = this.todos.filter(todo => !todo.completed);
        
        if (incompleteTodos.length === 0) {
            this.showError('All tasks are already completed.');
            return;
        }

        try {
            const updatePromises = incompleteTodos.map(todo => 
                fetch(`${this.API_URL}/${todo._id}`, { method: 'PUT' })
            );
            
            await Promise.all(updatePromises);
            this.fetchTodos(); // Refresh to get updated data
            
        } catch (error) {
            console.error('Error marking all complete:', error);
            this.showError('Failed to mark all tasks complete. Please try again.');
        }
    }

    openEditModal(id) {
        const todo = this.todos.find(t => t._id === id);
        if (!todo) return;

        this.editingTodo = todo;
        this.editInput.value = todo.task;
        this.editPrioritySelect.value = todo.priority || 'medium';
        this.editModal.style.display = 'block';
        this.editInput.focus();
    }

    closeEditModal() {
        this.editModal.style.display = 'none';
        this.editingTodo = null;
    }

    async saveEdit() {
        if (!this.editingTodo) return;

        const newTask = this.editInput.value.trim();
        const newPriority = this.editPrioritySelect.value;

        if (!newTask) {
            this.showError('Task cannot be empty.');
            return;
        }

        try {
            await this.updateTodo(this.editingTodo._id, {
                task: newTask,
                priority: newPriority
            });
            
            this.closeEditModal();
            
        } catch (error) {
            console.error('Error saving edit:', error);
            this.showError('Failed to save changes. Please try again.');
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.progressFill.style.width = `${percentage}%`;
        this.progressPercentage.textContent = `${percentage}%`;
    }

    formatDate(dateString) {
        if (!dateString) return 'Today';
        
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        
        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showConnectionStatus(isConnected) {
        // Tạo hoặc cập nhật status indicator
        let statusEl = document.getElementById('connection-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'connection-status';
            statusEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusEl);
        }

        if (isConnected) {
            statusEl.textContent = '✅ Connected to server';
            statusEl.style.background = '#48bb78';
            setTimeout(() => {
                statusEl.style.opacity = '0';
                setTimeout(() => statusEl.remove(), 300);
            }, 2000);
        } else {
            statusEl.textContent = '❌ Server disconnected';
            statusEl.style.background = '#f56565';
        }
    }

    showError(message) {
        // Enhanced error notification
        const errorEl = document.createElement('div');
        errorEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 1001;
            max-width: 400px;
            text-align: center;
        `;
        
        errorEl.innerHTML = `
            <div style="color: #f56565; margin-bottom: 15px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
            </div>
            <h3 style="margin-bottom: 10px; color: #4a5568;">Connection Error</h3>
            <p style="color: #718096; margin-bottom: 20px; white-space: pre-line;">${message}</p>
            <button onclick="this.parentElement.remove()" style="background: #4c51bf; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">OK</button>
        `;
        
        document.body.appendChild(errorEl);
    }

    async checkServerConnection() {
        const btn = document.getElementById('check-server');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        btn.disabled = true;

        try {
            console.log('Checking server connection to:', this.API_URL);
            const response = await fetch(this.API_URL);
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Server Online';
                btn.style.background = '#48bb78';
                btn.style.borderColor = '#48bb78';
                btn.style.color = 'white';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 2000);
            } else {
                throw new Error(`Server responded with ${response.status}`);
            }
        } catch (error) {
            console.error('Server check failed:', error);
            
            btn.innerHTML = '<i class="fas fa-times"></i> Server Offline';
            btn.style.background = '#f56565';
            btn.style.borderColor = '#f56565';
            btn.style.color = 'white';
            
            // Show detailed error
            this.showServerGuide();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                btn.disabled = false;
            }, 3000);
        }
    }

    showServerGuide() {
        const guideEl = document.createElement('div');
        guideEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 1001;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        guideEl.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-server" style="font-size: 3rem; color: #f56565;"></i>
                <h2 style="margin: 15px 0 10px; color: #4a5568;">Server Not Running</h2>
            </div>
            
            <div style="text-align: left; color: #718096; line-height: 1.6;">
                <p><strong>The Node.js server is not running. To start it:</strong></p>
                <ol style="margin: 15px 0;">
                    <li>Open terminal in the project directory</li>
                    <li>Run: <code style="background: #f7fafc; padding: 2px 6px; border-radius: 4px;">npm run dev</code></li>
                    <li>Wait for "Server is running on http://localhost:3000"</li>
                    <li>Then access: <strong>http://localhost:3000</strong></li>
                </ol>
                
                <div style="background: #fef5e7; border: 1px solid #f6e05e; border-radius: 8px; padding: 15px; margin: 15px 0;">
                    <strong style="color: #d69e2e;">💡 Tips:</strong>
                    <ul style="margin: 10px 0 0 20px;">
                        <li>Don't use Live Server for this full-stack app</li>
                        <li>Use localhost:3000, not 127.0.0.1:5500</li>
                        <li>Make sure MongoDB is connected</li>
                    </ul>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #4c51bf; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
                    Got it!
                </button>
            </div>
        `;
        
        document.body.appendChild(guideEl);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});