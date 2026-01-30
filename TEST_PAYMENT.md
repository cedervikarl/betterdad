# 💳 Testa Betalning i Production

## Steg för Steg

### 1. Gå till din domän
- Öppna `https://betterdadblueprint.com`
- Gå igenom quizet

### 2. När du kommer till Pricing:
- Välj ett plan (t.ex. "4-Week Plan")
- Klicka "GET MY PLAN"

### 3. Stripe Testkort (Live Mode):
**Viktigt:** Även i Live mode kan du använda testkort!

**Testkort:**
- **Kortnummer:** `4242 4242 4242 4242`
- **Datum:** Valfritt framtida datum (t.ex. `12/25`)
- **CVC:** Valfritt 3-siffrigt nummer (t.ex. `123`)
- **ZIP:** Valfritt (t.ex. `12345`)

### 4. Efter betalning:
- Du ska redirectas till Success-sidan
- Kolla Railway logs för att se om webhook kom fram
- Kolla email (likeikeab@gmail.com) för att se om planen skickades

### 5. Verifiera i Stripe Dashboard:
- Gå till Stripe Dashboard → Payments
- Du ska se betalningen
- Kolla webhook logs för att se om webhook triggades

## 🐛 Om något inte fungerar:

**Problem:** "Connection error"
- Kolla att `VITE_BACKEND_URL` är satt i Vercel
- Kolla att backend är online i Railway

**Problem:** Webhook fungerar inte
- Kolla Railway logs
- Verifiera att `STRIPE_WEBHOOK_SECRET` är korrekt i Railway
- Kolla Stripe Dashboard → Webhooks → senaste event

**Problem:** Email skickas inte
- Kolla Railway logs
- Verifiera att `RESEND_API_KEY` är korrekt
- Kolla Resend Dashboard

