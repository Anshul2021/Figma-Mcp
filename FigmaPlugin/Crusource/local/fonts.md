# Typography System — Crusource

> Font scale and configuration for Crusource screens.
> Specified Font Family: `Instrument Sans`

---

## 🔤 Primary Font Family

- **Font Family:** `Instrument Sans`
- **Fallback:** `Inter`, `system-ui`, `sans-serif`

### Mandatory Asynchronous Pre-loading
All generated scripts MUST pre-load these font styles before setting `.characters`:

```javascript
await figma.loadFontAsync({ family: "Instrument Sans", style: "Regular" });
await figma.loadFontAsync({ family: "Instrument Sans", style: "Medium" });
await figma.loadFontAsync({ family: "Instrument Sans", style: "Bold" });
await figma.loadFontAsync({ family: "Instrument Sans", style: "SemiBold" });
```

---

## 📐 Strict Even-Number Typography Scale

| Token | Size | Weight | Allowed Use Cases |
|:------|:-----|:-------|:------------------|
| `micro` | **10px** | Medium | Status badges, table tags |
| `caption` | **12px** | Regular / Medium | Timestamps, table meta text, secondary captions |
| `body` | **14px** | Regular / Medium | Body text, input text, table cell content |
| `subhead` | **16px** | SemiBold / Bold | Section titles, card headings, user names |
| `title` | **20px** | Bold | Metric values, widget headers |
| `heading` | **24px** | Bold | Page main title |
| `hero` | **32px** | Bold | Metric numbers, overview figures |

> **STRICT ENFORCEMENT RULE:** Only use even font sizes: `10`, `12`, `14`, `16`, `20`, `24`, `32`.
