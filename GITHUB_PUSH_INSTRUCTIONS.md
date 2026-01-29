# 🚀 Push till GitHub - Steg för Steg

## ✅ Steg 1: Skapa GitHub Repo

1. Gå till [github.com](https://github.com) och logga in
2. Klicka på **"+"** uppe till höger → **"New repository"**
3. Fyll i:
   - **Repository name**: `betterdad` (eller valfritt namn)
   - **Description**: "BetterDad quiz funnel with Stripe, OpenAI, and email integration"
   - **Visibility**: Private eller Public (välj själv)
   - **Viktigt**: INTE kryssa i "Add a README file", "Add .gitignore", eller "Choose a license"
4. Klicka **"Create repository"**

## ✅ Steg 2: Kopiera Repo URL

Efter att repot är skapat kommer GitHub visa instruktioner. Kopiera URL:en:
- **HTTPS**: `https://github.com/ditt-användarnamn/betterdad.git`
- **SSH**: `git@github.com:ditt-användarnamn/betterdad.git`

## ✅ Steg 3: Push till GitHub

Kör dessa kommandon i terminalen (ersätt URL:en med din):

```bash
cd /Users/karlcedervi/DADBOD

# Lägg till GitHub repo som remote
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/betterdad.git

# Pusha till GitHub
git push -u origin main
```

Om du använder SSH istället:
```bash
git remote add origin git@github.com:DITT-ANVÄNDARNAMN/betterdad.git
git push -u origin main
```

## 🔐 Om Du Får Autentiseringsfel

Om GitHub kräver autentisering:

1. **För HTTPS**: Använd Personal Access Token
   - Gå till GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Skapa ny token med `repo` permissions
   - Använd token som lösenord när du pushar

2. **För SSH**: Lägg till din SSH-nyckel till GitHub
   - Följ: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## ✅ Klart!

Efter push kommer din kod finnas på GitHub och du kan deploya till Vercel!

