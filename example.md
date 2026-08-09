# FrameForge — Example Prompts & Workflows

## Plugin Workflow Examples (Direct Mode)

### Creating a Project

1. Open FrameForge plugin in Figma (launches directly to Home Dashboard)
2. Click **New Project**
3. Fill in:
   - **Name:** `FoodDelivery`
   - **Brief:** *A food delivery app for urban millennials. Browse restaurants, customize orders, track delivery in real-time.*
   - **Colors:** `#FF6B35` (Orange), `#2EC4B6` (Teal), `#1A1A2E` (Dark), `#E8E8E8` (Light)
   - **Font:** `Poppins`
   - **Taste:** *Warm, rounded corners (12px), soft shadows, vibrant food photography*
4. Click **Create Project**

### Generating Screens with Model Selection

Select any of the 7 supported Gemini Flash models:
- **Gemini 3.6 Flash** (Recommended default)
- **Gemini 3.5 Flash**
- **Gemini 3.5 Flash Lite**
- **Gemini 3.1 Flash Lite**
- **Gemini 3 Flash**
- **Gemini 2.5 Flash**
- **Gemini 2.5 Flash Lite**

Sample screen prompts:

```
Home screen with restaurant cards, search bar, and category pills
```

```
Restaurant detail page with hero image, menu items, ratings, and add to cart
```

```
Cart screen with order summary, item quantities, promo code, and checkout button
```

```
@skip-autolayout Order tracking map view with delivery driver location and ETA
```

### Daily Rate Limiting

- Each model has **10 generations per day**.
- The credit counter (e.g. `⚡ 10/10 today`) updates live after every generation.
- Credits reset automatically at midnight.

---

## API Usage Examples

### Check remaining model credits

```bash
curl http://localhost:3003/api/credits
```

### Generate a screen via API

```bash
curl -X POST http://localhost:3003/api/generate/screen \
  -H "Content-Type: application/json" \
  -d '{"project":"FoodDelivery","prompt":"Home screen with food cards","model":"gemini-3.6-flash"}'
```
