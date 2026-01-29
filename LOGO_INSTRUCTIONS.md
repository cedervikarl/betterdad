# Var ska loggan läggas?

Lägg din logga-fil (Better Dad med smiley face) i:

**`src/assets/images/better-dad-logo.png`** (eller `.jpg` om det är en jpg)

Sedan kan du importera den i `src/components/Logo.jsx` så här:

```jsx
import logoImage from '../assets/images/better-dad-logo.png'

function Logo() {
  return (
    <div className="logo">
      <img src={logoImage} alt="Better Dad" className="logo-image" />
    </div>
  )
}
```

Eller om du vill behålla text-versionen men använda bilden som bakgrund, kan du göra så här i CSS:

```css
.logo {
  background-image: url('../assets/images/better-dad-logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 150px;
  height: 60px;
}
```

