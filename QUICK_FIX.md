# Snabb fix - Email skickas inte

## Problemet:
Email skickas inte efter betalning trots att betalningen fungerar.

## Lösning:

### Steg 1: Starta Stripe webhook forwarding
**Detta är det viktigaste steget!** Webhooks från Stripe når inte localhost direkt, så du MÅSTE använda Stripe CLI.

Öppna en **NY terminal** och kör:
```bash
cd /Users/karlcedervi/DADBOD
stripe listen --forward-to localhost:4242/webhook
```

Du ska se:
```
> Ready! Your webhook signing secret is whsec_...
```

**Lämna denna terminal öppen hela tiden när du testar!**

### Steg 2: Verifiera att servern körs
I en annan terminal, kör:
```bash
cd /Users/karlcedervi/DADBOD
npm run server
```

Du ska se:
```
BetterDad server listening on port 4242
```

### Steg 3: Testa betalningen
1. Gå till http://localhost:5173
2. Gå igenom quizet
3. Klicka "GET MY PLAN"
4. Betala med testkort: `4242 4242 4242 4242`
5. Kolla server-loggarna - du ska se:
   - `=== WEBHOOK RECEIVED ===`
   - `✅ Webhook signature verified`
   - `=== WEBHOOK: checkout.session.completed ===`
   - `✅ Using most recent profile`
   - `=== generatePlanForUser START ===`
   - `=== SENDING EMAIL ===`
   - `✅ EMAIL SENT SUCCESSFULLY`

## Om det fortfarande inte fungerar:

1. **Kolla att Stripe CLI körs:**
   ```bash
   ps aux | grep "stripe listen"
   ```
   Om inget visas, starta om `stripe listen`

2. **Kolla server-loggarna:**
   - Ser du `=== WEBHOOK RECEIVED ===`? Om inte → Stripe CLI körs inte
   - Ser du `❌ No profiles found`? → Profilen sparas inte innan checkout
   - Ser du `❌ OpenAI not configured`? → Sätt `OPENAI_API_KEY` i `server/.env`
   - Ser du `❌ Resend not configured`? → Sätt `RESEND_API_KEY` och `EMAIL_FROM=onboarding@resend.dev` i `server/.env`

## Viktigt:
- **Båda** servern OCH Stripe CLI måste köra samtidigt!
- Om du stänger någon av dem, starta om den

