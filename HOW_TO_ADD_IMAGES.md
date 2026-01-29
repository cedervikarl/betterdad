# Så här lägger du till bilder

## Steg 1: Lägg bilderna i mappen
Lägg alla dina bilder i mappen: `src/assets/images/`

## Steg 2: Namnge bilderna korrekt

### Hero-sektion
- `hero-workout.jpg` (eller `.png`)

### Info Slides
- `info-1-success.jpg`
- `info-2-michael.jpg`
- `info-3-lifestyle.jpg`

### Body Type Questions - "How do you look right now?"
- `body-low-fat.jpg`
- `body-medium-fat.jpg`
- `body-higher-fat.jpg`
- `body-very-high-fat.jpg`

### Dream Body Questions - "What is your dream body?"
- `dream-lean-defined.jpg`
- `dream-athletic-muscular.jpg`
- `dream-bigger-strong.jpg`
- `dream-slimmer-healthy.jpg`

## Steg 3: Uppdatera import-satserna

### Hero.jsx
Öppna `src/components/Hero.jsx` och ändra:
```javascript
// Ta bort kommentaren och uppdatera sökvägen om nödvändigt
import heroImage from '../assets/images/hero-workout.jpg'

// Uppdatera denna rad:
const imageSrc = heroImage  // istället för null
```

### App.jsx
Öppna `src/App.jsx` och uppdatera import-satserna:

**För Info Slides:**
```javascript
// Ta bort kommentarerna
import infoImage1 from './assets/images/info-1-success.jpg'
import infoImage2 from './assets/images/info-2-michael.jpg'
import infoImage3 from './assets/images/info-3-lifestyle.jpg'

// Uppdatera INFO_SLIDES array:
const INFO_SLIDES = [
  {
    id: 'info-1',
    text: "...",
    position: 4,
    image: infoImage1  // istället för null
  },
  // ... osv
]
```

**För Body Type Questions:**
```javascript
// Ta bort kommentarerna
import bodyLowFat from './assets/images/body-low-fat.jpg'
import bodyMediumFat from './assets/images/body-medium-fat.jpg'
import bodyHigherFat from './assets/images/body-higher-fat.jpg'
import bodyVeryHighFat from './assets/images/body-very-high-fat.jpg'

// Uppdatera i QUIZ_CONFIG:
{
  id: 2,
  question: "How do you look right now?",
  // ...
  images: [
    bodyLowFat,      // istället för null
    bodyMediumFat,
    bodyHigherFat,
    bodyVeryHighFat
  ]
}
```

**För Dream Body Questions:**
```javascript
// Ta bort kommentarerna
import dreamLean from './assets/images/dream-lean-defined.jpg'
import dreamAthletic from './assets/images/dream-athletic-muscular.jpg'
import dreamBigger from './assets/images/dream-bigger-strong.jpg'
import dreamSlimmer from './assets/images/dream-slimmer-healthy.jpg'

// Uppdatera i QUIZ_CONFIG:
{
  id: 3,
  question: "What is your dream body?",
  // ...
  images: [
    dreamLean,       // istället för null
    dreamAthletic,
    dreamBigger,
    dreamSlimmer
  ]
}
```

## Steg 4: Testa
Efter att du lagt till bilderna och uppdaterat import-satserna, starta om dev-servern:
```bash
npm run dev
```

Bilderna ska nu visas istället för placeholders!

## Tips
- Använd JPG för fotografier (mindre filstorlek)
- Använd PNG för bilder med transparens
- Optimera bilderna för web (använd t.ex. TinyPNG eller ImageOptim)
- Rekommenderade storlekar:
  - Hero: 800x1000px
  - Info slides: 600x400px
  - Body type images: 400x300px

