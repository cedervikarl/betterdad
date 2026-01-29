# Viktigt att förstå!

## Problemet:
Stripe kan **INTE** skicka webhooks direkt till `localhost:4242` eftersom Stripe's servrar inte kan nå din lokala dator.

## Lösningen:
Du måste köra **Stripe CLI** som en "tunnel" som:
1. Tar emot webhooks från Stripe's servrar
2. Skickar dem vidare till din lokala server på `localhost:4242`

## Så här fungerar det:

```
Stripe Servrar → Stripe CLI (tunnel) → Din lokala server (localhost:4242)
```

## Vad du behöver göra:

### 1. Servern körs redan ✅
Du har redan `npm run server` igång - bra!

### 2. Starta Stripe CLI (detta saknas!)
Öppna en **NY terminal** och kör:
```bash
stripe listen --forward-to localhost:4242/webhook
```

Detta skapar en "tunnel" som tar emot webhooks från Stripe och skickar dem till din server.

### 3. Testa betalningen
När både servern OCH Stripe CLI körs, testa betalningen.

## Varför behövs detta?
- Stripe's servrar kan inte nå `localhost` (din lokala dator)
- Stripe CLI skapar en tunnel som Stripe kan nå
- Webhooks kommer från Stripe → Stripe CLI → Din server

## Sammanfattning:
- ✅ Webhook-koden är fixad
- ✅ API-nycklarna är i .env
- ❌ Men Stripe CLI måste köra för att ta emot webhooks!

**Kör detta i en ny terminal:**
```bash
stripe listen --forward-to localhost:4242/webhook
```

