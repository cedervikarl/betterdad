# Debug Webhook - Email skickas inte

## Steg för att debugga:

### 1. Starta servern med logging
```bash
cd /Users/karlcedervi/DADBOD
npm run server
```

### 2. Starta Stripe webhook forwarding (VIKTIGT!)
I en **NY terminal**:
```bash
stripe listen --forward-to localhost:4242/webhook
```

### 3. Gå igenom quizet och betala

### 4. Kolla server-loggarna för dessa meddelanden:

**Steg 1: Webhook mottagen?**
- Ska se: `=== WEBHOOK RECEIVED ===`
- Om inte: Stripe CLI körs inte eller webhook når inte servern

**Steg 2: Signature verifierad?**
- Ska se: `✅ Webhook signature verified`
- Ska se: `Event type: checkout.session.completed`
- Om inte: Webhook secret är fel i `.env`

**Steg 3: Profil hittad?**
- Ska se: `✅ Using most recent profile from: [email]`
- Ska se: `Profile found: true`
- Om inte: Profilen sparas inte innan checkout

**Steg 4: Plan generation startad?**
- Ska se: `=== generatePlanForUser START ===`
- Ska se: `=== Calling OpenAI API ===`
- Om inte: OpenAI är inte konfigurerad eller profil saknas

**Steg 5: Email skickas?**
- Ska se: `=== sendPlanEmail START ===`
- Ska se: `=== SENDING EMAIL ===`
- Ska se: `✅ EMAIL SENT SUCCESSFULLY`
- Om inte: Resend är inte konfigurerad eller emailFrom är fel

## Vanliga problem:

1. **Ingen webhook mottagen**
   - Lösning: Starta `stripe listen --forward-to localhost:4242/webhook`

2. **Signature verification failed**
   - Lösning: Uppdatera `STRIPE_WEBHOOK_SECRET` i `server/.env` med secret från `stripe listen`

3. **No profiles found**
   - Lösning: Profilen måste sparas innan checkout. Kolla att `handleConfidenceAnswer` anropas.

4. **OpenAI not configured**
   - Lösning: Sätt `OPENAI_API_KEY` i `server/.env`

5. **Resend not configured**
   - Lösning: Sätt `RESEND_API_KEY` och `EMAIL_FROM=onboarding@resend.dev` i `server/.env`

