# Email Fix - Instruktioner

## Problem identifierat:
1. ✅ Profilen sparas nu med konsekvent email-nyckel
2. ✅ Webhooken hittar profilen korrekt (använder senaste profilen)
3. ✅ OpenAI-logging förbättrad
4. ✅ Email-logging förbättrad
5. ✅ EMAIL_FROM default är nu `onboarding@resend.dev`

## Vad du behöver göra:

### 1. Uppdatera server/.env
Ändra denna rad i `server/.env`:
```
EMAIL_FROM=onboarding@resend.dev
```

(Om den redan är `delivered@resend.dev`, ändra den till `onboarding@resend.dev`)

### 2. Starta servern om
```bash
cd /Users/karlcedervi/DADBOD
npm run server
```

### 3. Starta Stripe webhook forwarding
I en annan terminal:
```bash
stripe listen --forward-to localhost:4242/webhook
```

### 4. Testa flödet
1. Gå igenom quizet
2. Betala
3. Kolla server-loggarna - du ska se:
   - "=== WEBHOOK: checkout.session.completed ==="
   - "✅ Using most recent profile from: [email]"
   - "=== Calling OpenAI API ==="
   - "✅ OpenAI API call successful"
   - "=== SENDING EMAIL ==="
   - "✅ EMAIL SENT SUCCESSFULLY"

### 5. Om email fortfarande inte skickas
Kolla server-loggarna för:
- Är OpenAI konfigurerad? (ska se "🤖 OpenAI configured: true")
- Är Resend konfigurerad? (ska se "🔑 Resend configured: true")
- Är EMAIL_FROM korrekt? (ska se "📧 Email FROM: onboarding@resend.dev")
- Finns det några fel i loggarna?

## Debugging:
Om inget händer, kolla:
1. Körs Stripe webhook forwarding? (`stripe listen`)
2. Körs servern? (`npm run server`)
3. Är alla API-nycklar satta i `server/.env`?
4. Kolla server-loggarna för detaljerad info

