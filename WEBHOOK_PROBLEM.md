# Problemet: Webhook når inte servern

## Situationen:
- ✅ Betalningen fungerar (du ser "Thank you"-sidan)
- ❌ Email skickas inte
- ❌ Ingen webhook-logging i servern

## Orsaken:
Webhooken från Stripe når inte servern. Detta händer eftersom:
1. Stripe CLI körs inte (`stripe listen`)
2. ELLER webhooken triggas inte alls

## Lösning:

### Steg 1: Starta Stripe CLI
Öppna en **NY terminal** och kör:
```bash
cd /Users/karlcedervi/DADBOD
stripe listen --forward-to localhost:4242/webhook
```

Du ska se:
```
> Ready! Your webhook signing secret is whsec_...
```

**Lämna denna terminal öppen!**

### Steg 2: Testa betalningen igen
1. Gå till http://localhost:5173
2. Gå igenom quizet
3. Klicka "GET MY PLAN"
4. Betala med testkort: `4242 4242 4242 4242`

### Steg 3: Kolla server-loggarna
I servern-terminalen ska du nu se:
- `=== WEBHOOK RECEIVED ===`
- `✅ Webhook signature verified`
- `=== WEBHOOK: checkout.session.completed ===`
- `✅ Using most recent profile`
- `=== generatePlanForUser START ===`
- `=== SENDING EMAIL ===`
- `✅ EMAIL SENT SUCCESSFULLY`

## Varför behövs Stripe CLI?
Stripe's servrar kan inte skicka webhooks direkt till `localhost:4242`. Stripe CLI skapar en tunnel som Stripe kan nå, och den vidarebefordrar webhooks till din lokala server.

## Viktigt:
- Servern måste köra (`npm run server`)
- Stripe CLI måste köra (`stripe listen`)
- Båda måste köra samtidigt!

