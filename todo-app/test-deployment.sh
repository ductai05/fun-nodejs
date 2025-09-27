#!/bin/bash

# Local deployment test script
echo "🧪 Testing Vercel-ready configuration locally..."

# Check if required files exist
echo "📋 Checking required files..."
files=("vercel.json" "api/index.js" "public/index.html" "package.json")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check environment variables
echo "🔧 Checking environment variables..."
if [ -z "$MONGODB_URI" ]; then
    if [ -f ".env" ]; then
        source .env
        echo "✅ Loading .env file"
    else
        echo "❌ No .env file found and MONGODB_URI not set"
        exit 1
    fi
fi

# Test database connection
echo "🔌 Testing database connection..."
npm run setup

# Start server in production mode
echo "🚀 Starting server in production-like mode..."
export NODE_ENV=production
node api/index.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test API endpoints
echo "🧪 Testing API endpoints..."

# Test health endpoint
health_response=$(curl -s http://localhost:3000/api/health)
if [[ $health_response == *"OK"* ]]; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
fi

# Test todos endpoint
todos_response=$(curl -s http://localhost:3000/api/todos)
if [[ $todos_response == *"["* ]]; then
    echo "✅ Todos endpoint working"
else
    echo "❌ Todos endpoint failed"
fi

# Test static files
static_response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3000/public/index.html)
if [[ $static_response == "200" ]]; then
    echo "✅ Static files served correctly"
else
    echo "❌ Static files not accessible"
fi

# Kill server
kill $SERVER_PID

echo "🎉 Vercel deployment test completed!"
echo "📋 Ready for deployment with:"
echo "   1. Push to GitHub"
echo "   2. Import project in Vercel"
echo "   3. Set MONGODB_URI environment variable"
echo "   4. Deploy!"
