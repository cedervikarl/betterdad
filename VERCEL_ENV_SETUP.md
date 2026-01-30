# 🔧 Lägg till Environment Variable i Vercel

## Problem
Frontend försöker nå `localhost:4242` istället för production backend.

## Lösning

### I Vercel Dashboard:

1. **Gå till ditt projekt "BetterDad"**

2. **Settings → Environment Variables**

3. **Klicka "Add Environment Variable"**

4. **Fyll i:**
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://betterdad-production.up.railway.app`
   - **Environment:** Välj alla (Production, Preview, Development)

5. **Klicka "Save"**

6. **Redeploy:**
   - Gå till "Deployments"
   - Klicka "..." → "Redeploy"
   - Lämna "Use existing Build Cache" obockat

### Efter deployment:
- Frontend kommer nu använda Railway backend
- Error-meddelandet ska försvinna

