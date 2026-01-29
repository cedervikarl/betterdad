#!/bin/bash

echo "🔐 Getting Stripe webhook secret..."
echo ""
echo "This will start Stripe webhook forwarding and show you the secret."
echo "Press Ctrl+C after you see 'whsec_...'"
echo ""
echo "---"
echo ""

stripe listen --forward-to localhost:4242/webhook

