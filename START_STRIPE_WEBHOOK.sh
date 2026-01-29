#!/bin/bash

# Start Stripe webhook forwarding
# This forwards Stripe webhooks to your local server

echo "🚀 Starting Stripe webhook forwarding..."
echo "📡 Forwarding to: localhost:4242/webhook"
echo ""
echo "Press Ctrl+C to stop"
echo ""

stripe listen --forward-to localhost:4242/webhook

