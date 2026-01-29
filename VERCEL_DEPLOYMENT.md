# Vercel Deployment Guide för BetterDad

## 🚀 Steg för Steg Deployment

### 1. Frontend Deployment på Vercel

1. **Push till GitHub** (om du inte redan gjort det):
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy på Vercel**:
   - Gå till [vercel.com](https://vercel.com)
   - Klicka "New Project"
   - Importera ditt GitHub repo
   - Vercel kommer automatiskt upptäcka att det är en Vite-app

3. **Environment Variables i Vercel**:
   - Gå till Project Settings → Environment Variables
   - Lägg till:
     ```
     VITE_BACKEND_URL=https://din-backend-url.com
     ```
   - (Ersätt med din faktiska backend URL)

4. **Deploy**:
   - Klicka "Deploy"
   - Vercel kommer automatiskt bygga och deploya

### 2. Backend Deployment (Railway/Render)

#### Option A: Railway (Rekommenderat)

1. **Skapa konto på Railway**:
   - Gå till [railway.app](https://railway.app)
   - Logga in med GitHub

2. **Deploy Backend**:
   - Klicka "New Project"
   - Välj "Deploy from GitHub repo"
   - Välj ditt repo
   - Railway kommer automatiskt upptäcka att det är en Node.js-app

3. **Environment Variables**:
   - Gå till Variables tab
   - Lägg till alla variabler från `server/.env`:
     ```
     STRIPE_SECRET_KEY=sk_live_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     OPENAI_API_KEY=sk-...
     RESEND_API_KEY=re_...
     EMAIL_FROM=noreply@dindomän.com
     FRONTEND_URL=https://din-frontend-url.vercel.app
     PORT=4242
     ```

4. **Webhook Setup**:
   - Railway ger dig en URL som: `https://din-app.railway.app`
   - Uppdatera Stripe webhook URL till: `https://din-app.railway.app/webhook`

#### Option B: Render

1. **Skapa konto på Render**:
   - Gå till [render.com](https://render.com)
   - Logga in med GitHub

2. **Deploy Backend**:
   - Klicka "New" → "Web Service"
   - Connect ditt GitHub repo
   - Settings:
     - **Build Command**: `npm install`
     - **Start Command**: `node server/index.js`
     - **Environment**: Node

3. **Environment Variables**:
   - Lägg till alla variabler (samma som Railway)

### 3. Stripe Production Setup

1. **Växla till Live Mode** i Stripe Dashboard
2. **Kopiera Live Secret Key** (`sk_live_...`)
3. **Skapa Production Webhook**:
   - Gå till Stripe Dashboard → Webhooks
   - Klicka "Add endpoint"
   - URL: `https://din-backend-url.com/webhook`
   - Events: `checkout.session.completed`
   - Kopiera webhook signing secret (`whsec_...`)

### 4. Resend Email Setup

1. **Verifiera domän** i Resend Dashboard
2. **Lägg till DNS records** (SPF/DKIM)
3. **Uppdatera EMAIL_FROM** till din verifierade domän

### 5. Testa Produktion

1. Gå till din frontend URL
2. Gå igenom quizet
3. Testa en betalning (använd Stripe testkort)
4. Verifiera att email kommer fram

## ✅ Checklista

- [ ] Frontend deployad på Vercel
- [ ] Backend deployad på Railway/Render
- [ ] Environment variables satta
- [ ] Stripe webhook konfigurerad
- [ ] Resend domän verifierad
- [ ] Testat hela flödet i produktion
- [ ] Email kommer fram korrekt
- [ ] AI-planer genereras korrekt

## 🔧 Troubleshooting

### Frontend kan inte nå backend
- Kontrollera att `VITE_BACKEND_URL` är satt korrekt i Vercel
- Kontrollera att backend är online
- Kontrollera CORS-inställningar i backend

### Webhooks fungerar inte
- Kontrollera att webhook URL är korrekt i Stripe
- Kontrollera att `STRIPE_WEBHOOK_SECRET` är satt
- Använd Stripe CLI för att testa lokalt: `stripe listen --forward-to https://din-backend-url.com/webhook`

### Email skickas inte
- Kontrollera att `RESEND_API_KEY` är satt
- Kontrollera att `EMAIL_FROM` är en verifierad domän
- Kolla logs i backend för felmeddelanden

