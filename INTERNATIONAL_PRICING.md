k# 🌍 Internationell Prissättning - Lösningar

## Problem
Just nu är priser i SEK (kr), men du vill göra ads i UK först.

## Lösningar

### Option 1: Standardisera till EUR (Rekommenderat - Enklast)

**Fördelar:**
- ✅ Enklast att implementera
- ✅ Fungerar för hela EU
- ✅ Stripe stödjer EUR bra

**Vad som behöver ändras:**

1. **Frontend (Pricing.jsx):**
   - Ändra alla priser från SEK till EUR
   - Ändra "kr" till "€"
   - Konvertera priser (t.ex. 428.56 SEK ≈ 38 EUR)

2. **Backend (server/index.js):**
   - Ändra `currency: 'sek'` till `currency: 'eur'`
   - Konvertera amounts (EUR använder cent, så 38 EUR = 3800 cent)

**Exempel konvertering:**
- 428.56 SEK ≈ 38 EUR
- 142.84 SEK ≈ 13 EUR
- 714.27 SEK ≈ 64 EUR

### Option 2: Dynamisk Prissättning Baserat på Land

**Fördelar:**
- ✅ Visar rätt valuta för varje land
- ✅ Bättre UX

**Nackdelar:**
- ❌ Mer komplext
- ❌ Kräver geolocation API
- ❌ Måste hantera flera valutor

**Hur det fungerar:**
1. Detektera användarens land (via IP eller browser)
2. Visa rätt valuta och pris
3. Skicka rätt currency till Stripe

## 🎯 Rekommendation

**Börja med EUR:**
- Enklare att implementera
- Fungerar för hela EU (inklusive UK om du vill)
- Kan lägga till fler valutor senare

**När du expanderar:**
- Lägg till GBP för UK
- Lägg till USD för USA
- Använd geolocation för automatisk detektion

## 💡 Snabb EUR-konvertering

**Nuvarande priser (SEK):**
- 1-Week: 142.84 SEK
- 4-Week: 428.56 SEK  
- 12-Week: 714.27 SEK

**EUR-priser (ungefär):**
- 1-Week: 13 EUR (1300 cent)
- 4-Week: 38 EUR (3800 cent)
- 12-Week: 64 EUR (6400 cent)

*Kurs: ~1 SEK = 0.089 EUR (kolla aktuell kurs)*

