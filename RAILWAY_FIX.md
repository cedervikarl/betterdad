# 🔧 Fixa Railway Build Error

## Problem
Railway försöker bygga Docker image men misslyckas.

## Lösning

### I Railway Dashboard:

1. **Gå till Settings → Build & Deploy**

2. **Sätt Root Directory:**
   - Lämna TOM (ingen root directory)
   - Eller sätt till: `/` (root)

3. **Sätt Build Command:**
   ```
   cd server && npm install
   ```

4. **Sätt Start Command:**
   ```
   cd server && node index.js
   ```

5. **Spara och Deploy igen**

### Alternativ: Använd railway.json

Jag har skapat `railway.json` som Railway automatiskt läser.

**Om det fortfarande inte fungerar:**

1. **Skapa separat package.json i server-mappen:**
   - Kopiera dependencies från root package.json
   - Lägg till express, dotenv, openai, stripe, resend

2. **Eller flytta server-koden till root:**
   - Flytta `server/index.js` till `index.js` i root
   - Uppdatera imports

### Snabbaste lösningen:

I Railway Settings:
- **Root Directory:** (tom)
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && node index.js`

Spara och deploy igen.

