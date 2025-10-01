#!/bin/bash

# Demo script để tạo dữ liệu test cho deadline feature
echo "🎯 Creating demo todos with deadlines..."

API_URL="http://localhost:3000/api/todos"

# 1. Todo due today
echo "📅 Creating todo due today..."
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"task":"Submit report - Due today!","priority":"high","deadline":"2025-09-27T23:59:00.000Z"}' > /dev/null

# 2. Todo due tomorrow  
echo "📅 Creating todo due tomorrow..."
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"task":"Team meeting preparation","priority":"medium","deadline":"2025-09-28T10:30:00.000Z"}' > /dev/null

# 3. Overdue todo from 2 days ago
echo "⚠️  Creating overdue todo..."
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"task":"Fix critical bug (OVERDUE!)","priority":"high","deadline":"2025-09-25T16:00:00.000Z"}' > /dev/null

# 4. Todo due next week
echo "📅 Creating todo due next week..."
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"task":"Quarterly review preparation","priority":"low","deadline":"2025-10-04T14:00:00.000Z"}' > /dev/null

# 5. Todo without deadline
echo "📝 Creating todo without deadline..."
curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"task":"Read new documentation","priority":"low"}' > /dev/null

echo ""
echo "✅ Demo data created! Features to test:"
echo ""
echo "🌟 DEADLINE FEATURES:"
echo "   • Add todos with deadline using datetime picker"
echo "   • View deadline info next to each todo"
echo "   • See overdue tasks highlighted in red"  
echo "   • Filter tasks by 'Overdue' status"
echo "   • Sort tasks by deadline"
echo "   • Edit deadlines in the edit modal"
echo "   • Stats show total overdue count"
echo ""
echo "🎨 UI IMPROVEMENTS:"
echo "   • Overdue todos have red border and background"
echo "   • Deadline dates show relative time (due today, overdue, etc.)"
echo "   • Calendar icon for deadline display"
echo "   • Responsive design for mobile"
echo ""
echo "📱 Open http://localhost:3000 to see the demo!"
