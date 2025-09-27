#!/bin/bash

# Quick API test script
echo "🧪 Testing API Endpoints..."

BASE_URL="http://localhost:3000"

echo "1. Testing Health Endpoint..."
health_response=$(curl -s "$BASE_URL/api/health")
if [[ $health_response == *"OK"* ]]; then
    echo "✅ Health check passed"
    echo "   Response: $health_response"
else
    echo "❌ Health check failed"
    echo "   Response: $health_response"
fi

echo ""
echo "2. Testing Todos GET..."
todos_response=$(curl -s "$BASE_URL/api/todos")
if [[ $todos_response == *"["* ]]; then
    echo "✅ Todos GET working"
    todo_count=$(echo "$todos_response" | grep -o '"_id"' | wc -l)
    echo "   Found $todo_count todos"
else
    echo "❌ Todos GET failed"
    echo "   Response: $todos_response"
fi

echo ""
echo "3. Testing Todo POST..."
post_response=$(curl -s -X POST \
  "$BASE_URL/api/todos" \
  -H "Content-Type: application/json" \
  -d '{"task":"Test task from script","priority":"high"}')

if [[ $post_response == *"_id"* ]]; then
    echo "✅ Todo POST working"
    # Extract the ID for cleanup
    todo_id=$(echo "$post_response" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    echo "   Created todo with ID: $todo_id"
    
    # Clean up - delete the test todo
    if [ ! -z "$todo_id" ]; then
        delete_response=$(curl -s -X DELETE "$BASE_URL/api/todos/$todo_id")
        echo "   Cleaned up test todo"
    fi
else
    echo "❌ Todo POST failed"
    echo "   Response: $post_response"
fi

echo ""
echo "🎉 API test completed!"
echo "Ready for Vercel deployment!"
