#!/bin/bash

# UrAi Email System Setup Script
echo "🌱 UrAi Transactional Email System Setup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: Please run this script from the root of your UrAi project"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase:"
    firebase login
fi

echo "✅ Firebase authentication verified"

# Install dependencies
echo "📦 Installing dependencies..."
cd functions
npm install
cd ..
npm install

echo "✅ Dependencies installed"

# Set up SendGrid API key
echo ""
echo "🔑 Setting up SendGrid API key..."
echo "Please enter your SendGrid API key (it will be stored securely as a Firebase secret):"
read -s SENDGRID_API_KEY

if [ -z "$SENDGRID_API_KEY" ]; then
    echo "❌ No API key provided. You can set it later with:"
    echo "   firebase functions:secret:set SENDGRID_API_KEY"
else
    echo "$SENDGRID_API_KEY" | firebase functions:secret:set SENDGRID_API_KEY
    echo "✅ SendGrid API key configured"
fi

# Update sender email
echo ""
echo "📧 Configuring sender email..."
echo "Please enter your verified SendGrid sender email (e.g., noreply@yourdomain.com):"
read SENDER_EMAIL

if [ ! -z "$SENDER_EMAIL" ]; then
    # Update the email in the source file
    sed -i.bak "s/noreply@urai.app/$SENDER_EMAIL/g" functions/src/email-engine.ts
    echo "✅ Sender email updated to: $SENDER_EMAIL"
    echo "⚠️  Make sure this email is verified in your SendGrid account!"
else
    echo "⚠️  Sender email not updated. Please manually update functions/src/email-engine.ts"
fi

# Build functions
echo ""
echo "🔨 Building Cloud Functions..."
cd functions
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Functions built successfully"
else
    echo "❌ Functions build failed. Please check the errors above."
    exit 1
fi

cd ..

# Deploy functions
echo ""
echo "🚀 Deploy functions now? (y/N)"
read -n 1 DEPLOY_NOW
echo ""

if [[ $DEPLOY_NOW =~ ^[Yy]$ ]]; then
    firebase deploy --only functions
    if [ $? -eq 0 ]; then
        echo "✅ Functions deployed successfully"
    else
        echo "❌ Functions deployment failed"
        exit 1
    fi
else
    echo "⏭️  Skipping deployment. Deploy later with:"
    echo "   firebase deploy --only functions"
fi

# Summary
echo ""
echo "🎉 UrAi Email System Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Verify your sender email in SendGrid dashboard"
echo "2. Test the system using the EmailTestingPanel component"
echo "3. Check Cloud Function logs: firebase functions:log"
echo ""
echo "📚 Documentation: docs/EMAIL_SYSTEM.md"
echo "🧪 Test component: src/components/EmailTestingPanel.tsx"
echo ""
echo "Happy emailing! 📧✨"