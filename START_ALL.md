# Starta allt - Steg för steg

## 1. Starta servern
```bash
cd /Users/karlcedervi/DADBOD
npm run server
```

Du ska se:
```
BetterDad server listening on port 4242
```

**Lämna denna terminal öppen!**

## 2. Starta Stripe webhook forwarding (NY TERMINAL)
Öppna en **NY terminal** och kör:
```bash
cd /Users/karlcedervi/DADBOD
stripe listen --forward-to localhost:4242/webhook
```

Du ska se:
```
> Ready! Your webhook signing secret is whsec_...
```

**Lämna även denna terminal öppen!**

## 3. Starta frontend (NY TERMINAL)
Öppna en **TREDJE terminal** och kör:
```bash
cd /Users/karlcedervi/DADBOD
npm run dev
```

## 4. Testa betalningen
1. Gå till http://localhost:5173
2. Gå igenom quizet
3. Klicka "GET MY PLAN"
4. Betala med testkort: `4242 4242 4242 4242`
5. Kolla server-loggarna (terminal 1) - du ska se alla steg

## Viktigt:
- **Båda** servern OCH Stripe CLI måste köra samtidigt!
- Om du stänger någon av dem, starta om den

## Felsökning:
Om email inte skickas, kolla server-loggarna för:
- `=== WEBHOOK RECEIVED ===` (webhook mottagen)
- `✅ Using most recent profile` (profil hittad)
- `=== generatePlanForUser START ===` (plan generation startad)
- `=== SENDING EMAIL ===` (email skickas)
- `✅ EMAIL SENT SUCCESSFULLY` (email skickat)

