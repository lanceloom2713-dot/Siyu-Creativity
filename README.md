# Siyu Creativity

Premium catalogue website, enterprise admin CMS, and Express API for Siyu Creativity.

This is intentionally **not** an ecommerce platform. There is no cart, checkout, payment, customer login, wishlist, coupon, wallet, order, or inventory workflow. The system showcases products and converts visitors through WhatsApp and contact enquiries.

## Apps

- `client` - Customer-facing React + Vite catalogue website.
- `admin` - Admin CMS built with React + Vite.
- `server` - Express + MongoDB backend API.

## Getting Started

```bash
npm install
npm run dev:client
npm run dev:admin
npm run dev:server
```

Copy environment examples before running the backend:

```bash
cp server/.env.example server/.env
```

The backend defaults to `http://localhost:5002` to avoid common local port collisions.

## Core Workflows

- Public visitors browse categories, products, gallery, blogs, FAQs, and contact pages.
- Product detail pages generate WhatsApp enquiries with the product name injected into the message.
- Admin users manage products, categories, media, homepage sections, SEO, FAQs, blogs, testimonials, settings, and enquiries.

## Documentation

- [Architecture](docs/architecture.md)
