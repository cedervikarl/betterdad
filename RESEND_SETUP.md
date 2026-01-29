# Resend Email Setup - VIKTIGT!

## Problemet
Resend tillåter **bara test-emails till din egen email-adress** (`likeikeab@gmail.com`). För att skicka emails till kunder behöver du verifiera en domän.

## Lösning 1: Verifiera en domän (Rekommenderat för produktion)

1. Gå till https://resend.com/domains
2. Klicka på **"+ Add domain"**
3. Lägg till din domän (t.ex. `yourdomain.com`)
4. Resend visar DNS-poster som du behöver lägga till:
   - TXT record för verifiering
   - MX records (om du vill ta emot emails)
5. Lägg till DNS-posterna i din domäns DNS-inställningar
6. Vänta på verifiering (kan ta några minuter)
7. När domänen är verifierad, uppdatera `EMAIL_FROM` i `server/.env`:
   ```
   EMAIL_FROM=noreply@yourdomain.com
   ```
8. Starta om servern

## Lösning 2: Använd din egen email för test (Tillfällig lösning)

För att testa kan du ändra så att emails skickas till din egen email istället:

1. Öppna `server/index.js`
2. Hitta funktionen `sendPlanEmail`
3. Ändra `to: email` till `to: 'likeikeab@gmail.com'` temporärt för test

## Lösning 3: Använd en annan email-tjänst

Alternativt kan du använda:
- **SendGrid** (gratis tier: 100 emails/dag)
- **Mailgun** (gratis tier: 5,000 emails/månad)
- **AWS SES** (mycket billigt)

## Testa email-konfigurationen

Efter att du har verifierat en domän, testa med:

```bash
curl "http://localhost:4242/api/test-email?email=likeikeab@gmail.com"
```

eller öppna i webbläsaren:
```
http://localhost:4242/api/test-email?email=likeikeab@gmail.com
```

## Status just nu

- ✅ Resend API-nyckel är konfigurerad
- ✅ Email-funktionen är implementerad
- ❌ Domän är inte verifierad (därför fungerar det inte)

**Nästa steg:** Verifiera en domän i Resend dashboard!

