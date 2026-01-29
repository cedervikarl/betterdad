#!/bin/bash

# Start Stripe webhook forwarding
# This forwards Stripe events to your local server

echo "🚀 Starting Stripe webhook forwarding..."
echo "📡 Forwarding events to: http://localhost:4242/webhook"
echo ""
echo "⚠️  Keep this terminal open while testing!"
echo ""
echo "When you see 'Ready! Your webhook signing secret is whsec_...'"
echo "Copy that secret and add it to server/.env as STRIPE_WEBHOOK_SECRET"
echo ""
echo "Press Ctrl+C to stop"
echo ""

stripe listen --forward-to localhost:4242/webhook

