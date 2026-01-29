# Webhook Fix - Email skickas inte efter betalning

## Problem identifierat:
1. ✅ Webhook-endpointen använder nu `express.raw()` FÖRE `bodyParser.json()` (kritisk för Stripe!)
2. ✅ Förbättrad logging för att se exakt vad som händer
3. ✅ Bättre felhantering

## Vad du behöver göra:

### 1. Starta servern om
```bash
cd /Users/karlcedervi/DADBOD
npm run server
```

Du ska se:
```
BetterDad server listening on port 4242
```

### 2. Starta Stripe webhook forwarding (VIKTIGT!)
I en **NY terminal**, kör:
```bash
stripe listen --forward-to localhost:4242/webhook
```

Du ska se något som:
```
> Ready! Your webhook signing secret is whsec_... (^C to quit)
```

**Detta måste köra hela tiden när du testar betalningar!**

### 3. Testa betalningen
1. Gå igenom quizet
2. Klicka "GET MY PLAN"
3. Betala med testkort: `4242 4242 4242 4242`
4. Kolla server-loggarna - du ska se:
   - `=== WEBHOOK RECEIVED ===`
   - `✅ Webhook signature verified`
   - `=== WEBHOOK: checkout.session.completed ===`
   - `✅ Using most recent profile from: [email]`
   - `=== Calling OpenAI API ===`
   - `=== SENDING EMAIL ===`
   - `✅ EMAIL SENT SUCCESSFULLY`

### 4. Om det fortfarande inte fungerar

**Kolla server-loggarna för:**
- Ser du `=== WEBHOOK RECEIVED ===`? Om inte, körs Stripe CLI?
- Ser du `❌ Webhook signature verification failed`? Då är webhook-secret fel
- Ser du `❌ No profiles found`? Då sparas inte profilen innan checkout
- Ser du `❌ OpenAI not configured`? Kolla OPENAI_API_KEY i server/.env
- Ser du `❌ Resend not configured`? Kolla RESEND_API_KEY i server/.env

**Kontrollera att Stripe CLI körs:**
```bash
# I en annan terminal
ps aux | grep "stripe listen"
```

Om inget visas, starta om:
```bash
stripe listen --forward-to localhost:4242/webhook
```

## Viktigt:
- Stripe CLI (`stripe listen`) MÅSTE köra hela tiden när du testar
- Servern måste köra (`npm run server`)
- Båda måste köra samtidigt!

