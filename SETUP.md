# Setup Guide för BetterDad

## Snabbstart

### 1. Installera dependencies
```bash
npm install
```

### 2. Konfigurera environment variables

Skapa filen `server/.env` med följande innehåll:

```env
PORT=4242
FRONTEND_URL=http://localhost:5173

# Stripe (hämta från https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# OpenAI (hämta från https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-xxxxx
```

### 3. Starta servern

**Terminal 1 - Backend server:**
```bash
npm run server
```

### 4. Starta Stripe webhook forwarding

**Terminal 2 - Stripe webhooks:**
```bash
./start-webhook.sh
```

När detta startar kommer du se:
```
Ready! Your webhook signing secret is whsec_xxxxx
```

**Kopiera den `whsec_xxxxx` och lägg in i `server/.env` som `STRIPE_WEBHOOK_SECRET`**

### 5. Starta frontend

**Terminal 3 - Frontend:**
```bash
npm run dev
```

## Testa flödet

1. Gå till http://localhost:5173
2. Gå igenom quizet
3. Fyll i height, weight, goal weight, age, email
4. Välj plan på pricing-sidan
5. Klicka "GET MY PLAN" → du kommer till Stripe Checkout
6. Använd test-kort: `4242 4242 4242 4242` (valfritt datum, valfritt CVC)
7. Efter betalning → webhook triggas → AI-plan genereras
8. Planen sparas och kan hämtas via API

## Stripe Test Cards

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

## API Endpoints

- `POST /api/profile` - Spara användarprofil
- `POST /api/create-checkout-session` - Skapa Stripe checkout
- `POST /webhook` - Stripe webhook endpoint
- `GET /api/plan?email=xxx` - Hämta genererad plan

## Troubleshooting

**Webhook fungerar inte?**
- Se till att `stripe listen` körs i en separat terminal
- Kontrollera att `STRIPE_WEBHOOK_SECRET` i `.env` matchar det som visas när du startar `stripe listen`

**Server startar inte?**
- Kontrollera att `server/.env` finns och har alla värden
- Se till att port 4242 inte är upptagen

**OpenAI fungerar inte?**
- Kontrollera att `OPENAI_API_KEY` är korrekt i `server/.env`
- Se till att du har krediter på ditt OpenAI-konto

