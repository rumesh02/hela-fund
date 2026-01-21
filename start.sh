#!/bin/bash

# Hela Fund - Quick Start Script for Testing Authentication

echo "🚀 Hela Fund Authentication Test Setup"
echo "======================================"
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running"
    echo "Please start MongoDB first:"
    echo "  - On macOS: brew services start mongodb-community"
    echo "  - On Linux: sudo systemctl start mongod"
    echo "  - On Windows: net start MongoDB"
    exit 1
fi

echo ""

# Backend Setup
echo "🔧 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
else
    echo "✅ .env file exists"
fi

echo ""
echo "🌐 Starting Backend Server..."
npm run dev &
BACKEND_PID=$!

cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Frontend Setup
echo ""
echo "🎨 Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
else
    echo "✅ Frontend .env file exists"
fi

echo ""
echo "🌐 Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "========================================" 
echo "✅ Hela Fund is now running!"
echo "========================================" 
echo ""
echo "📍 Backend API:  http://localhost:5000"
echo "📍 Frontend App: http://localhost:5173"
echo ""
echo "🔐 Test the authentication:"
echo "  1. Open http://localhost:5173 in your browser"
echo "  2. Click 'Sign Up' to create a new account"
echo "  3. Choose either Requester or Supporter role"
echo "  4. Fill in the registration form"
echo "  5. After registration, you'll be logged in automatically"
echo ""
echo "💡 To stop both servers, press Ctrl+C"
echo ""

# Wait for user interrupt
wait
