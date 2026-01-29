# Nästa Steg för BetterDad Produktion

## 🚀 Prioriterad Checklista

### 1. **Production Deployment** (KRITISKT)
- [ ] **Frontend (Vercel/Netlify)**
  - Deploya React-appen
  - Sätt environment variable: `VITE_BACKEND_URL=https://din-backend-url.com`
  
- [ ] **Backend (Railway/Render/Heroku)**
  - Deploya Express-servern
  - Sätt alla environment variables:
    - `STRIPE_SECRET_KEY` (Live key)
    - `STRIPE_WEBHOOK_SECRET` (Production webhook secret)
    - `OPENAI_API_KEY`
    - `RESEND_API_KEY`
    - `EMAIL_FROM` (din verifierade domän)
    - `FRONTEND_URL` (din frontend URL)
    - `PORT` (oftast 4242 eller auto)

### 2. **Email Domain Setup** (VIKTIGT)
- [ ] Verifiera din domän i Resend Dashboard
- [ ] Lägg till SPF/DKIM records i din DNS
- [ ] Uppdatera `EMAIL_FROM` från `onboarding@resend.dev` till `noreply@dindomän.com`
- [ ] Testa att skicka email från produktion

### 3. **Stripe Production Setup** (VIKTIGT)
- [ ] Växla till Stripe Live Mode
- [ ] Uppdatera `STRIPE_SECRET_KEY` till live key (sk_live_...)
- [ ] Skapa production webhook i Stripe Dashboard
- [ ] Sätt webhook URL till: `https://din-backend-url.com/webhook`
- [ ] Kopiera webhook signing secret till `STRIPE_WEBHOOK_SECRET`
- [ ] Testa en riktig betalning (med testkort)

### 4. **Code Updates för Production**
- [ ] Uppdatera `src/components/Pricing.jsx` - använd environment variable för API URL
- [ ] Uppdatera `src/App.jsx` - använd environment variable för API URL
- [ ] Testa att alla API-anrop fungerar med production URL

### 5. **Testing & QA**
- [ ] Testa hela flödet: Quiz → Betalning → Email
- [ ] Verifiera att AI-planer genereras korrekt
- [ ] Testa olika quiz-kombinationer
- [ ] Testa på mobil och desktop
- [ ] Verifiera att emails kommer fram korrekt formaterade

### 6. **Analytics & Tracking** (REKOMMENDERAT)
- [ ] Lägg till Google Analytics
- [ ] Lägg till Facebook Pixel (för Facebook Ads)
- [ ] Spåra konverteringar (quiz completion, betalningar)
- [ ] Identifiera var användare hoppar av

### 7. **Error Monitoring** (REKOMMENDERAT)
- [ ] Lägg till Sentry eller liknande
- [ ] Logga kritiska steg (betalningar, email-sending, AI-generation)
- [ ] Sätt upp alerts för kritiska fel

### 8. **Legal & Compliance** (VIKTIGT)
- [ ] Verifiera att Privacy Policy är korrekt
- [ ] Verifiera att Terms of Service är korrekt
- [ ] GDPR compliance (om relevant för EU-kunder)
- [ ] Cookie consent (om du använder tracking)

### 9. **Performance Optimization** (OPTIONAL)
- [ ] Optimera bilder (komprimera)
- [ ] Lazy loading för bilder
- [ ] Minify CSS/JS
- [ ] CDN för statiska assets

### 10. **Marketing Prep** (OPTIONAL)
- [ ] Facebook Ads setup
- [ ] Landing page optimization
- [ ] A/B testing av olika delar
- [ ] Conversion rate optimization

---

## 🔧 Snabba Fixar som Behövs

### Uppdatera API URLs till Environment Variables

**I `src/components/Pricing.jsx`:**
```javascript
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242'
const res = await fetch(`${backendUrl}/api/create-checkout-session`, {
```

**I `src/App.jsx`:**
```javascript
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242'
fetch(`${backendUrl}/api/session/${sessionId}`)
fetch(`${backendUrl}/api/profile`, {
```

---

## 📝 Deployment Guides

### Vercel (Frontend)
1. Push till GitHub
2. Connect repo till Vercel
3. Sätt `VITE_BACKEND_URL` environment variable
4. Deploy

### Railway (Backend)
1. Connect GitHub repo
2. Sätt alla environment variables
3. Deploy

### Render (Backend)
1. Create new Web Service
2. Connect GitHub repo
3. Build command: `npm install`
4. Start command: `node server/index.js`
5. Sätt alla environment variables

---

## ✅ När Allt Är Klart

1. Testa en komplett betalning i produktion
2. Verifiera att email kommer fram
3. Kontrollera Stripe Dashboard för betalningar
4. Övervaka logs för första timmarna
5. Starta marknadsföring! 🚀

