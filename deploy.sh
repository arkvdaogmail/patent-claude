#!/bin/bash

echo "🚀 VeChain Document Notarization - Vercel Deployment"
echo "=================================================="
echo ""

# Check if vercel CLI is available
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI found"
    
    # Check if user is logged in
    if vercel whoami &> /dev/null; then
        echo "✅ User is logged in to Vercel"
        echo "🚀 Deploying to production..."
        vercel --prod --yes
    else
        echo "❌ Not logged in to Vercel"
        echo "Please run: vercel login"
        echo "Then run this script again or run: vercel --prod"
    fi
else
    echo "❌ Vercel CLI not found"
    echo ""
    echo "📋 Manual Deployment Instructions:"
    echo "1. Go to https://vercel.com"
    echo "2. Sign in with your GitHub account"
    echo "3. Click 'New Project'"
    echo "4. Import repository: arkvdaogmail/patent-claude"
    echo "5. Deploy with default settings"
    echo ""
    echo "Or install Vercel CLI:"
    echo "npm install -g vercel"
    echo "vercel login"
    echo "vercel --prod"
fi

echo ""
echo "📁 Project Structure Ready:"
echo "├── index.html           # Main VeChain app"
echo "├── lookup.html          # Transaction lookup"
echo "├── lookup-data/         # JSON data files"
echo "├── vercel.json          # ✅ Vercel config"
echo "├── package.json         # ✅ Node.js metadata"
echo "└── .vercelignore        # ✅ Deployment exclusions"
echo ""
echo "🌐 After deployment, your app will be at:"
echo "https://your-app-name.vercel.app"