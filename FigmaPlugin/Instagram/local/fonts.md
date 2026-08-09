# Typography System — Instagram

> Typography definitions for Instagram Mobile UI screens.
> Strict Rule: ALL font sizes MUST use even numbers. NEVER use odd sizes like 11, 13, 15, or 17.

---

## 🔤 Primary Font Family

- **Font Family:** `DM Sans` (or `Instrument Sans`)
- **Fallback:** `Inter`, `system-ui`

### Mandatory Asynchronous Pre-loading
All generated scripts MUST pre-load these exact font styles before setting `.characters`:

```javascript
await figma.loadFontAsync({ family: "DM Sans", style: "Regular" });
await figma.loadFontAsync({ family: "DM Sans", style: "Medium" });
await figma.loadFontAsync({ family: "DM Sans", style: "Bold" });
```

---

## 📐 Strict Even-Number Typography Scale

| Token | Size | Weight | Line Height | Allowed Use Cases |
|:------|:-----|:-------|:------------|:------------------|
| `micro` | **10px** | Medium | 14px | Story avatar username handles, micro timestamps |
| `caption` | **12px** | Regular / Medium | 16px | Post timestamps ("2 HOURS AGO"), count subtitles, tab bar labels |
| `body` | **14px** | Regular / Medium | 20px | User handle headers, post caption body, comment text |
| `subhead` | **16px** | Medium / Bold | 24px | Profile stats counters, section titles, blue button text |
| `title` | **20px** | Bold | 28px | Instagram logo title header, screen header titles |
| `heading` | **24px** | Bold | 32px | Profile display name header, large reel stats |
| `hero` | **32px** | Bold | 40px | High-impact promotional numbers & callouts |

---

## ⚡ Text Creator Helper Pattern

```javascript
function createText(content, fontSize, fontStyle = "Regular", color = { r: 0.059, g: 0.090, b: 0.165 }) {
  const text = figma.createText();
  text.fontName = { family: "DM Sans", style: fontStyle };
  text.fontSize = fontSize; // EVEN numbers only: 10, 12, 14, 16, 20, 24, 32
  text.characters = String(content);
  text.fills = [{ type: 'SOLID', color }];
  return text;
}
```
