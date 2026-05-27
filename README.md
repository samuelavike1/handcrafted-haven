# Handcrafted Haven

Handcrafted Haven is a Next.js marketplace for artisans to showcase and sell
handmade products. It includes role-based authentication for buyers, sellers,
and admins, plus MongoDB-backed product persistence.

## Local Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## MongoDB Setup

Authentication, seller tools, and products use a local MongoDB database.

1. Start MongoDB locally.
2. Copy `.env.example` to `.env` if needed.
3. Use these defaults:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=handcrafted_haven
```

Seed the database with demo users, seller profiles, 40 products, product
reviews, and a sample order:

```bash
pnpm db:seed
```

Demo accounts all use `Password123!`:

- `buyer@haven.test`
- `seller@haven.test`
- `weaves@haven.test`
- `woodshop@haven.test`
- `admin@haven.test`

## Useful Scripts

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm build
pnpm db:seed
```
