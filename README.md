# Re Workshop — Organic Store & Café

Storefront for **Re Workshop**, Jabalpur's organic food store and heritage café. Customers browse the catalogue, build a basket, and place orders through WhatsApp — no online payment, no checkout form.

**Live site →** [re-workshop.vercel.app](https://re-workshop.vercel.app)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Vanilla CSS (editorial design system) |
| **Routing** | Wouter |
| **Database** | Supabase (Postgres + Storage + Auth — no SDK, raw fetch) |
| **Deployment** | Vercel (static SPA) |

## Project Structure

```
├── client/
│   ├── public/            # Favicons, OG image, product photos
│   └── src/
│       ├── components/    # UI components (home/, admin/, ui/)
│       ├── contexts/      # React contexts (Cart, Catalog)
│       ├── data/          # Static catalogue & store info
│       ├── lib/           # Supabase client, WhatsApp, utilities
│       └── pages/         # Route-level pages
├── server/                # Minimal Express server (optional)
├── shared/                # Shared constants
├── docs/                  # Design direction & brand notes
├── logo/                  # Brand logo source file
└── patches/               # pnpm patch for wouter
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type-check
pnpm check

# Production build
pnpm build
```

### Environment Variables

Copy `.env.example` → `.env` and fill in values if pointing to a different Supabase project. The defaults are baked into the code for the production project.

```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

> **Never** put secret keys (`sb_secret_…`) in any `VITE_` variable.

## Key Features

- 📦 **WhatsApp ordering** — basket becomes a pre-filled WhatsApp message to the store
- 🛒 **Slide-out cart drawer** with persistent local storage
- 🔐 **Admin panel** (`/admin`) — product & category CRUD, image uploads
- 🖼️ **Client-side image compression** before upload to Supabase Storage
- 📱 **Mobile-first** editorial design with DM Serif Display + Manrope typography

## License

MIT
