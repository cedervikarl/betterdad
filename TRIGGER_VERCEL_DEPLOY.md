# 🔄 Trigga Vercel Deployment

## Problem
Vercel visar fortfarande den gamla commiten (`1073165`) istället för de senaste ändringarna (`5718ae8`, `6939cac`).

## Lösning: Manuell Redeploy i Vercel

### Steg 1: Gå till Vercel Dashboard
1. Öppna [vercel.com](https://vercel.com)
2. Logga in
3. Gå till ditt projekt "BetterDad"

### Steg 2: Trigga Ny Deployment
1. Gå till fliken **"Deployments"**
2. Klicka på **"..."** (tre prickar) bredvid senaste deployment
3. Välj **"Redeploy"**
4. Välj **"Use existing Build Cache"** (eller lämna obockat för fresh build)
5. Klicka **"Redeploy"**

### Alternativ: Skapa Ny Deployment från GitHub
1. Gå till **"Deployments"**
2. Klicka på **"Create Deployment"** (om det finns)
3. Välj branch: **`main`**
4. Välj commit: **`5718ae8`** eller **`6939cac`** (de senaste)
5. Klicka **"Deploy"**

### Steg 3: Verifiera
Efter deployment:
1. Kolla att commit-hashen är `5718ae8` eller `6939cac`
2. Testa appen på mobil
3. Verifiera att auto-scroll fungerar
4. Kolla att bilderna är mindre på mobil

## Om Auto-Deploy Inte Fungerar

Om Vercel inte automatiskt deployar när du pushar:

1. **Kolla GitHub Integration:**
   - Gå till projektet → "Settings" → "Git"
   - Verifiera att rätt GitHub-repo är kopplat
   - Verifiera att rätt branch (`main`) är vald

2. **Kolla Webhook:**
   - Gå till GitHub repo → "Settings" → "Webhooks"
   - Se om Vercel webhook finns och är aktiv

3. **Manuell Trigger:**
   - Använd "Redeploy" som beskrivet ovan

## ✅ Efter Deployment

När deploymenten är klar:
- ✅ Commit-hash ska vara `5718ae8` eller senare
- ✅ Auto-scroll ska fungera på mobil
- ✅ Bilderna ska vara mindre på mobil
- ✅ Knappar ska vara större och lättare att klicka
- ✅ Ingen zoom vid input

