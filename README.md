# Handcrafted Haven

Handcrafted Haven is a Next.js marketplace where artisans can showcase and sell
handmade products and buyers can discover unique, locally crafted goods. It
features role-based authentication (buyer, seller, admin), MongoDB-backed
product persistence, product reviews, a full shopping/checkout flow, and
internationalization in four languages.

Built for **BYU – WDD430: Web Full-Stack Development** as a team project.

## Features

- **Marketplace** — browse, search, and filter artisan products with grid/list views.
- **Seller tools** — seller dashboard to create, edit, and manage product listings.
- **Role-based auth** — separate buyer, seller, and admin experiences with an admin workspace.
- **Reviews** — buyers can leave ratings and written reviews on products.
- **Cart & checkout** — add-to-cart, quantity selection, and a validated checkout form.
- **Internationalization** — English, Spanish, French, and Portuguese via `next-intl`.
- **Resilient data** — pages fall back to static demo data when MongoDB is unavailable.
- **SEO** — per-page metadata, JSON-LD structured data, sitemap, and robots.

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4, `shadcn`/Radix UI, `lucide-react` icons |
| i18n | `next-intl` (EN / ES / FR / PT) |
| Database | MongoDB |
| Validation | Zod |
| Notifications | Sonner |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) running locally (or a connection string)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/samuelavike1/handcrafted-haven.git
cd handcrafted-haven

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed. Defaults point to a local
MongoDB instance:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=handcrafted_haven
```

### Database Setup

Authentication, seller tools, and products are backed by MongoDB. With MongoDB
running, seed the database with demo users, seller profiles, 40 products,
reviews, and a sample order:

```bash
pnpm db:seed
```

Demo accounts (all use the password `Password123!`):

| Email | Role |
|-------|------|
| `buyer@haven.test` | Buyer |
| `seller@haven.test` | Seller |
| `weaves@haven.test` | Seller |
| `woodshop@haven.test` | Seller |
| `admin@haven.test` | Admin |

> If MongoDB is unavailable, the app still runs using built-in static demo data.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the development server (Turbopack) |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm db:seed` | Seed MongoDB with demo data |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Type-check with the TypeScript compiler |
| `pnpm test` | Run the test suite |

## Project Structure

```text
handcrafted-haven/
├── messages/            # Translation files (en, es, fr, pt)
├── scripts/             # Database seed script
├── src/
│   ├── app/
│   │   ├── [locale]/     # Localized pages (home, browse, product, checkout, sell, admin…)
│   │   └── api/          # Route handlers (auth, products, orders, reviews, sellers)
│   ├── components/       # Reusable UI components (product-card, navbar, footer…)
│   ├── i18n/             # next-intl routing and request config
│   └── lib/              # Data access, auth, market data, helpers
└── tests/                # Unit tests
```

## Internationalization

The app ships with four locales served under a locale path segment (e.g.
`/en`, `/es`, `/fr`, `/pt`). Translation strings live in [`messages/`](messages/)
and are wired up through [`src/i18n/`](src/i18n/) with `next-intl`.

## Contributors

| Name | GitHub |
|------|--------|
| Samuel Avike | [@samuelavike1](https://github.com/samuelavike1) |
| Luciano Vilete | [@Luciano-A-Vilete](https://github.com/Luciano-A-Vilete) |
| Bruno | [@Bruno-ui374](https://github.com/Bruno-ui374) |
| Diego Rivmont | [@drivmont](https://github.com/drivmont) |
| Owusu | [@owusuq](https://github.com/owusuq) |

## License

This project was created for educational purposes as part of the BYU WDD430
course.
