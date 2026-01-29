# Enkel start - Steg för steg

## Du behöver köra 3 saker samtidigt:

### 1. Starta servern (Terminal 1)
```bash
cd /Users/karlcedervi/DADBOD
npm run server
```

**Lämna denna terminal öppen!**

### 2. Starta Stripe webhook (Terminal 2)
Öppna en **NY terminal** och kör:

**Alternativ A - Använd scriptet:**
```bash
cd /Users/karlcedervi/DADBOD
./START_STRIPE_WEBHOOK.sh
```

**Alternativ B - Kör direkt:**
```bash
cd /Users/karlcedervi/DADBOD
stripe listen --forward-to localhost:4242/webhook
```

Du ska se:
```
> Ready! Your webhook signing secret is whsec_...
```

**Lämna även denna terminal öppen!**

### 3. Starta frontend (Terminal 3)
Öppna en **TREDJE terminal** och kör:
```bash
cd /Users/karlcedervi/DADBOD
npm run dev
```

Du ska se:
```
➜  Local:   http://localhost:5173/
```

## Nu kan du testa!

1. Gå till http://localhost:5173
2. Gå igenom quizet
3. Klicka "GET MY PLAN"
4. Betala med testkort: `4242 4242 4242 4242`
5. Kolla Terminal 1 (servern) - du ska se alla loggar

## Viktigt:
- **Alla 3 terminaler måste köra samtidigt!**
- Om du stänger någon, starta om den

## Felsökning:

**Om Stripe CLI inte fungerar:**
```bash
# Installera Stripe CLI (om den saknas)
brew install stripe/stripe-cli/stripe

# Eller ladda ner från: https://stripe.com/docs/stripe-cli
```

**Om du ser fel:**
- Kolla att servern körs (Terminal 1)
- Kolla att Stripe CLI körs (Terminal 2)
- Kolla server-loggarna för felmeddelanden

