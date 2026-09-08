# TiresDash client app

Next.js/TypeScript customer-facing application for TiresDash — booking, product/catalog flows, and fleet-related client surfaces used in the WordPress-to-custom modernization path.

## What I worked on

Product engineering implementation on the customer-facing Next.js application as part of the TiresDash modernization. This repository is the client app, not a claim of sole business/product ownership or marketing outcomes.

Public delivery boundary: [TiresDash case study](https://shafinsadnan.com/case-studies/tiresdash-wordpress-to-nextjs-migration)

## Core functionality

- Customer booking and related appointment flows
- Catalog / product browsing paths (tires, wheels, related entities)
- Auth and account-related client routes
- Fleet-oriented client surfaces that talk to the backend API
- Checkout/payment-related client integration points (backed by the API)

## Tech

- Next.js
- React
- TypeScript
- Tailwind CSS
- HeroUI component library

## Architecture / implementation notes

- App Router structure under `src/app`
- Client talks to a separate Express/MongoDB API (`tiresdash-app-server`)
- Local development defaults to port `3001`

## Running locally

```bash
npm install
npm run dev
```

Build / start:

```bash
npm run build
npm start
```

Create a local `.env.local` for API base URLs and any required public keys. Do not commit env files.

## Related proof

- Case study: https://shafinsadnan.com/case-studies/tiresdash-wordpress-to-nextjs-migration
- API repository: https://github.com/shshafin/tiresdash-app-server
