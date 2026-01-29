# 🚀 Quick Start Guide

## Steg 1: Skapa server/.env

Öppna `server/.env` och lägg in:

```env
PORT=4242
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_din_stripe_key_här
STRIPE_WEBHOOK_SECRET=whsec_kommer_efter_steg_2
OPENAI_API_KEY=sk-din_openai_key_här
```

## Steg 2: Starta Stripe Webhook (Terminal 1)

```bash
./start-webhook.sh
```

**VÄNTA** tills du ser:
```
Ready! Your webhook signing secret is whsec_xxxxx
```

**Kopiera `whsec_xxxxx` och lägg in i `server/.env` som `STRIPE_WEBHOOK_SECRET`**

## Steg 3: Starta Backend Server (Terminal 2)

```bash
npm run server
```

Du ska se: `Server running on port 4242`

## Steg 4: Starta Frontend (Terminal 3)

```bash
npm run dev
```

## ✅ Klart!

Öppna http://localhost:5173 och testa flödet!

---

## Var hittar jag mina API-nycklar?

- **Stripe:** https://dashboard.stripe.com/test/apikeys
- **OpenAI:** https://platform.openai.com/api-keys

