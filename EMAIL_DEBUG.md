# Email Debugging Guide

## Problem: Inga emails skickas

### Steg 1: Kontrollera att RESEND_API_KEY finns i server/.env

Öppna `server/.env` och se till att dessa rader finns:

```env
RESEND_API_KEY=re_ditt_api_key_här
EMAIL_FROM=onboarding@resend.dev
```

### Steg 2: Starta om servern

Servern måste startas om för att läsa nya env-variabler:

```bash
# Stoppa servern (Ctrl+C eller):
pkill -f "node server/index.js"

# Starta om:
npm run server
```

### Steg 3: Kontrollera att Stripe Webhook körs

För att emails ska skickas måste Stripe webhook köras i en separat terminal:

```bash
cd /Users/karlcedervi/DADBOD
stripe listen --forward-to localhost:4242/webhook
```

### Steg 4: Testa flödet

1. Gå igenom quizet på http://localhost:5173
2. När du kommer till "confidence question", sparas profilen automatiskt
3. Gå till pricing och betala
4. Efter betalning kommer Stripe webhook att triggas
5. Kolla server-loggar för att se om email skickas

### Steg 5: Kolla server-loggar

Servern loggar nu mycket mer information. Kolla efter:

- `Profile saved for: [email]` - när profilen sparas
- `Webhook received: checkout.session.completed` - när betalning är klar
- `Generating plan for: [email]` - när plan generation startar
- `Plan generated for [email]` - när planen är klar
- `Sending email to: [email]` - när email skickas
- `Email sent successfully` - när email är skickad

### Vanliga problem:

1. **"Resend not configured"** - RESEND_API_KEY saknas i .env eller servern har inte startats om
2. **"Missing profile"** - Profilen sparas inte innan checkout. Se till att gå igenom hela quizet
3. **"Webhook not received"** - Stripe webhook körs inte. Starta `stripe listen`
4. **Email error från Resend** - Kolla Resend dashboard för felmeddelanden

### Testa manuellt:

Du kan testa email-sending direkt genom att köra:

```bash
curl -X POST http://localhost:4242/api/profile \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","age":35,"weight":85,"height":180,"2":"Medium body fat","5":"Lose fat","6":"20–30 minutes","7":"No equipment","8":"Motivation","9":"Exhausted","10":"My belly","11":"Have more energy for my kids","confidence":"Confident"}'
```

Sedan simulera en webhook (detta kräver Stripe CLI):

```bash
stripe trigger checkout.session.completed
```

