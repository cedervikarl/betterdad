# 🚀 Testa Vercel Update

## Steg för att testa Vercel deployment

### 1. Kontrollera att allt är pushat till GitHub

Alla ändringar är redan pushat till GitHub:
- ✅ Mobilförbättringar
- ✅ Säkerhetsfixar
- ✅ Alla commits är på `main` branch

### 2. Gå till Vercel Dashboard

1. Öppna [vercel.com](https://vercel.com)
2. Logga in med ditt konto
3. Gå till ditt projekt (eller skapa nytt om det inte finns)

### 3. Om projektet redan finns:

**Auto-deploy ska hända automatiskt:**
- Vercel övervakar GitHub-repot
- När du pushar till `main` branch deployar det automatiskt
- Kolla "Deployments" fliken för att se status

**Om auto-deploy inte fungerar:**
1. Gå till projektet i Vercel
2. Klicka på "Deployments"
3. Klicka på "..." bredvid senaste deployment
4. Välj "Redeploy"

### 4. Om projektet INTE finns ännu:

1. Klicka "Add New..." → "Project"
2. Importera från GitHub
3. Välj `cedervikarl/betterdad`
4. Vercel kommer automatiskt upptäcka att det är en Vite-app
5. Klicka "Deploy"

### 5. Lägg till Environment Variable

**Viktigt:** Efter första deployment:

1. Gå till projektet → "Settings" → "Environment Variables"
2. Lägg till:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `http://localhost:4242` (temporärt, uppdatera när backend är deployad)
   - **Environment:** Production, Preview, Development (välj alla)
3. Klicka "Save"
4. Klicka "Redeploy" för att applicera ändringarna

### 6. Verifiera Deployment

Efter deployment:

1. Klicka på deployment-URL:en (t.ex. `betterdad.vercel.app`)
2. Testa att appen fungerar
3. Kolla konsolen för eventuella fel

### 7. Om du får fel om GitHub-konto:

Om Vercel säger att GitHub-kontot inte är kopplat:

1. Gå till Vercel Settings → "Connected Accounts"
2. Koppla GitHub-kontot
3. Gå tillbaka till projektet och försök deploya igen

## ✅ Checklista

- [ ] Alla ändringar är pushat till GitHub
- [ ] Vercel projekt är skapat/uppdaterat
- [ ] Environment variable `VITE_BACKEND_URL` är satt
- [ ] Deployment är klar och fungerar
- [ ] Appen fungerar på Vercel URL

## 🐛 Troubleshooting

**Problem:** "GitHub account not connected"
- **Lösning:** Koppla GitHub-konto i Vercel Settings

**Problem:** "Deployment failed"
- **Lösning:** Kolla build logs i Vercel Dashboard

**Problem:** "App doesn't work"
- **Lösning:** Kolla browser console för fel
- Kontrollera att `VITE_BACKEND_URL` är satt korrekt

