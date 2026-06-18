# Handcrafted Haven

## Overview

Handcrafted Haven is a full-stack artisan marketplace developed for the
WDD 430: Web Full-Stack Development course at BYU-Idaho.

The application connects artisans with customers who value unique,
handcrafted products. Sellers can create profiles, share their stories, list
products, upload images, and manage orders. Buyers can browse and filter the
catalog, save products, leave reviews, and complete purchases as registered
users or guests.

The project demonstrates collaborative full-stack development, cloud
deployment, database integration, role-based access, responsive design, and
modern software development practices.

## Features

### Marketplace

- Database-backed product catalog
- Product search, category filtering, and price filtering
- Product detail pages with seller information
- Product reviews and ratings
- Saved items and shopping cart
- Registered and guest checkout
- Responsive layouts for desktop, tablet, and mobile devices

### Buyer Experience

- Buyer registration and authentication
- Saved product collection
- Order history and order detail pages
- Checkout confirmation and order tracking

### Seller Experience

- Seller registration and authentication
- Public seller profiles with studio stories and product collections
- Product creation, editing, image upload, and deletion
- Seller-specific order visibility
- Inventory and low-stock warnings
- Revenue, units sold, and sales statistics

### Administration

- Dedicated role-protected admin workspace
- User and administrator account management
- Product management
- Order management and fulfillment status updates
- Marketplace statistics and operational alerts

### Quality

- Server-side and client-side form validation
- Loading, empty, and error states
- Keyboard focus styles and semantic interface controls
- SEO metadata
- Responsive navigation and consistent branding
- Automated tests, linting, type checking, and production build validation

## Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI and shadcn/ui components
- Lucide icons

### Backend

- Next.js Route Handlers
- Node.js
- MongoDB
- Zod validation
- Role-based session authentication

### Cloud and Development Tools

- Vercel
- Vercel Blob for product image storage
- Git and GitHub
- GitHub Boards
- ESLint and Prettier
- Node.js test runner

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm
- MongoDB, either locally or through MongoDB Atlas
- A public Vercel Blob store for persistent product image uploads

### Installation

Clone the repository:

```bash
git clone https://github.com/samuelavike1/handcrafted-haven.git
cd handcrafted-haven
```

Install the dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env` or `.env.local`, then configure:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=handcrafted_haven
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
BLOB_STORE_ID=your_vercel_blob_store_id
```

Do not commit real database credentials or Blob tokens to Git.

Seed the database with demonstration users, sellers, products, reviews, and a
sample order:

```bash
pnpm db:seed
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

The seeded accounts use the password `Password123!`.

| Role          | Email                 |
| ------------- | --------------------- |
| Buyer         | `buyer@haven.test`    |
| Seller        | `seller@haven.test`   |
| Seller        | `weaves@haven.test`   |
| Seller        | `woodshop@haven.test` |
| Administrator | `admin@haven.test`    |

These credentials are intended only for local demonstrations and must not be
used as production credentials.

## Available Scripts

```bash
pnpm dev        # Start the development server
pnpm build      # Create a production build
pnpm start      # Run the production server
pnpm test       # Run automated tests
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript checks
pnpm format     # Format TypeScript and TSX files
pnpm db:seed    # Seed MongoDB with demonstration data
```

## Project Structure

```text
handcrafted-haven/
|-- public/               Static assets
|-- scripts/
|   `-- seed.mjs          MongoDB seed script
|-- src/
|   |-- app/              Pages, layouts, loading states, and API routes
|   |-- components/       Shared UI and feature components
|   |-- hooks/            Reusable React hooks
|   `-- lib/              Database, authentication, schemas, and server logic
|-- tests/                Automated tests
|-- next.config.mjs       Next.js configuration
|-- package.json          Dependencies and project scripts
`-- tsconfig.json         TypeScript configuration
```

## Deployment

The application is designed for deployment on Vercel.

Before deploying:

1. Connect the GitHub repository to a Vercel project.
2. Connect the MongoDB database and configure `MONGODB_URI`.
3. Create and connect a **public** Vercel Blob store.
4. Confirm that `BLOB_READ_WRITE_TOKEN` and `BLOB_STORE_ID` are available in
   the required Preview and Production environments.
5. Deploy the application and seed the production database when appropriate.

Uploaded product images are stored in Vercel Blob rather than the Vercel
function filesystem, which is temporary and unsuitable for persistent uploads.

## Team Members

- Diego Alejandro Rivera Montano
- Samuel Apusiyine Avike
- Bruno Martin Ssematimba
- Kwadjo Owusu Ansah Quarshie
- Kingsley Kwarteng

## Course Requirements

Handcrafted Haven was created to demonstrate:

- Full-stack application development with Next.js, Node.js, and MongoDB
- Collaborative project management using GitHub
- Git-based team workflows and code management
- Cloud deployment through Vercel
- Responsive and usable interface design
- Performance, validation, accessibility, and SEO best practices

The application was developed with WCAG 2.1 Level AA principles in mind.
Formal accessibility auditing should be completed before making a compliance
claim.

## License

This project was developed for educational purposes as part of the WDD 430
course at BYU-Idaho.
