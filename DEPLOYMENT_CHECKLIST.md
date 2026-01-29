# ✅ Deployment Checklist - BetterDad

## 🎯 Innan Du Deployar

### Frontend (Vercel)
- [x] `vercel.json` skapad
- [x] `package.json` har `build` script
- [x] Environment variables förberedda (`VITE_BACKEND_URL`)
- [x] Alla API-anrop använder environment variables

### Backend (Railway/Render)
- [ ] Environment variables lista klar:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `OPENAI_API_KEY`
  - `RESEND_API_KEY`
  - `EMAIL_FROM`
  - `FRONTEND_URL`
  - `PORT`

### Email & Stripe
- [ ] Resend domän verifierad
- [ ] Stripe Live keys redo
- [ ] Stripe webhook konfigurerad

## 📋 Snabb Deployment Guide

### 1. Frontend på Vercel
```bash
# 1. Push till GitHub
git add .
git commit -m "Ready for production"
git push

# 2. Gå till vercel.com
# 3. Import repo
# 4. Lägg till environment variable:
#    VITE_BACKEND_URL=https://din-backend-url.com
# 5. Deploy
```

### 2. Backend på Railway
```bash
# 1. Gå till railway.app
# 2. New Project → Deploy from GitHub
# 3. Lägg till alla environment variables
# 4. Railway ger dig en URL automatiskt
```

### 3. Uppdatera Stripe Webhook
- Stripe Dashboard → Webhooks
- URL: `https://din-backend-url.com/webhook`
- Events: `checkout.session.completed`

### 4. Uppdatera Frontend Environment Variable
- Vercel Dashboard → Settings → Environment Variables
- Uppdatera `VITE_BACKEND_URL` till din backend URL

## ✅ Testa Efter Deployment

1. Gå till frontend URL
2. Gå igenom quizet
3. Testa betalning
4. Verifiera att email kommer fram
5. Kolla att AI-planen genereras korrekt

## 🐛 Vanliga Problem

**Frontend kan inte nå backend:**
- Kontrollera `VITE_BACKEND_URL` i Vercel
- Kontrollera CORS i backend

**Webhooks fungerar inte:**
- Kontrollera webhook URL i Stripe
- Kontrollera `STRIPE_WEBHOOK_SECRET` i backend

**Email skickas inte:**
- Kontrollera `RESEND_API_KEY`
- Kontrollera att `EMAIL_FROM` är verifierad domän

