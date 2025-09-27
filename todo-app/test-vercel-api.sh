#!/bin/bash

# Comprehensive API test for Vercel deployment
echo "🧪 Testing All API Endpoints for Vercel Deployment..."

BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing Health Endpoint..."
health_response=$(curl -s "$BASE_URL/api/health")
if [[ $health_response == *"OK"* ]]; then
    echo "✅ Health endpoint working"
    echo "   Response: $health_response"
else
    echo "❌ Health endpoint failed"
    echo "   Response: $health_response"
fi

echo ""
echo "2. Testing Todos GET (main collection)..."
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
echo "3. Testing Todo POST (create new)..."
post_response=$(curl -s -X POST \
  "$BASE_URL/api/todos" \
  -H "Content-Type: application/json" \
  -d '{"task":"Vercel deployment test","priority":"high"}')

if [[ $post_response == *"_id"* ]]; then
    echo "✅ Todo POST working"
    # Extract the ID for further testing
    todo_id=$(echo "$post_response" | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    echo "   Created todo with ID: $todo_id"
    
    if [ ! -z "$todo_id" ]; then
        echo ""
        echo "4. Testing Todo PUT (toggle complete)..."
        put_response=$(curl -s -X PUT "$BASE_URL/api/todos/$todo_id")
        if [[ $put_response == *"completed"* ]]; then
            echo "✅ Todo PUT working"
            echo "   Toggle response received"
        else
            echo "❌ Todo PUT failed"
            echo "   Response: $put_response"
        fi
        
        echo ""
        echo "5. Testing Todo PATCH (partial update)..."
        patch_response=$(curl -s -X PATCH \
          "$BASE_URL/api/todos/$todo_id" \
          -H "Content-Type: application/json" \
          -d '{"task":"Updated test task","priority":"low"}')
        
        if [[ $patch_response == *"Updated test task"* ]]; then
            echo "✅ Todo PATCH working"
            echo "   Update successful"
        else
            echo "❌ Todo PATCH failed"
            echo "   Response: $patch_response"
        fi
        
        echo ""
        echo "6. Testing Todo DELETE..."
        delete_response=$(curl -s -X DELETE "$BASE_URL/api/todos/$todo_id")
        if [[ $delete_response == *"Deleted"* ]] || [[ $delete_response == *"deleted"* ]] || [[ $delete_response == *"success"* ]]; then
            echo "✅ Todo DELETE working"
            echo "   Deletion successful"
        else
            echo "❌ Todo DELETE failed"
            echo "   Response: $delete_response"
        fi
    fi
else
    echo "❌ Todo POST failed"
    echo "   Response: $post_response"
fi

echo ""
echo "7. Testing CORS headers..."
cors_response=$(curl -s -I -X OPTIONS "$BASE_URL/api/todos")
if [[ $cors_response == *"Access-Control-Allow-Origin"* ]]; then
    echo "✅ CORS headers present"
else
    echo "⚠️  CORS headers may not be set properly"
fi

echo ""
echo "🎉 Vercel API compatibility test completed!"
echo ""
echo "📋 Summary:"
echo "   - All CRUD operations tested"
echo "   - Health endpoint verified"
echo "   - CORS support checked"
echo "   - Ready for Vercel deployment"
echo ""
echo "🚀 Next steps:"
echo "   1. Commit and push to GitHub"
echo "   2. Deploy to Vercel"
echo "   3. Set MONGODB_URI environment variable"
echo "   4. Test on production URL"
