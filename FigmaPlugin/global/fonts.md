# Typography System

> Typography definitions and scale for generated Figma screens.
> When `@newproject <ProjectName>` is executed, this file is copied to `<ProjectName>/local/fonts.md`.
> Strict Rule: ALL font sizes MUST use even numbers. NEVER use odd sizes like 11, 13, 15, or 17.

---

## 🔤 Primary Font Family

- **Font Family:** `DM Sans`
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
| `micro` | **10px** | Medium | 14px | Micro tags, bestseller badges, pill labels |
| `caption` | **12px** | Regular / Medium | 16px | Timestamps, ratings, delivery time, secondary captions |
| `body` | **14px** | Regular / Medium | 20px | Main body descriptions, input field placeholders, button labels |
| `subhead` | **16px** | Medium / Bold | 24px | Card sub-headers, list item titles, price labels |
| `title` | **20px** | Bold | 28px | Screen section headers, dish titles |
| `heading` | **24px** | Bold | 32px | Primary screen titles, modal headers |
| `hero` | **32px** | Bold | 40px | Hero banner titles, large promotional figures |

> **STRICT ENFORCEMENT RULE FOR AI:**  
> Only use size values from the scale above: `10`, `12`, `14`, `16`, `20`, `24`, `32`.  
> Do NOT use `11`, `13`, `15`, `17`, `19`, or any other odd-number font size.

---

## ⚡ Text Creator Helper Pattern

```javascript
function createText(content, fontSize, fontStyle = "Regular", color = { r: 0.067, g: 0.094, b: 0.153 }) {
  const text = figma.createText();
  text.fontName = { family: "DM Sans", style: fontStyle };
  text.fontSize = fontSize; // Must be an EVEN number: 10, 12, 14, 16, 20, 24, 32
  text.characters = String(content);
  text.fills = [{ type: 'SOLID', color }];
  return text;
}
```
