#!/bin/bash

set -e  # Exit on any error

echo "======================================"
echo "  Building Pollify React Frontend"
echo "======================================"

cd pollify-frontend

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building production bundle..."
npm run build

cd ..

echo ""
echo "✅ Frontend build complete!"
echo "   Output: src/main/resources/static/"
