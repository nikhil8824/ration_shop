#!/bin/bash

# Ration Shop Mobile App Setup Script
echo "🛒 Setting up Ration Shop Mobile App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Make sure MongoDB is installed and running."
fi

echo "📦 Setting up Backend..."

# Backend setup
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your MongoDB URI and JWT secret."
else
    echo "✅ .env file already exists."
fi

echo "✅ Backend setup complete!"

echo "📱 Setting up Frontend..."

# Frontend setup
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Start MongoDB (if using local MongoDB)"
echo "3. Start the backend server:"
echo "   cd backend && npm run dev"
echo "4. Start the frontend app:"
echo "   cd frontend && npm start"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
echo "Happy coding! 🚀"



