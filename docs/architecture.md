# Siyu Creativity Architecture

## Product Positioning

Siyu Creativity is a premium catalogue and enquiry platform. Products are discoverable, SEO-friendly, and visually rich, but never purchasable through the website.

## System Boundaries

- Customer website consumes public APIs only.
- Admin CMS consumes protected admin APIs.
- Backend owns validation, authentication, persistence, uploads, and SEO data.

## Public Website

Pages:

- Home
- Categories
- Category Details
- Product Details
- Gallery
- About
- Blogs
- Blog Details
- Contact
- FAQs
- Privacy Policy
- Terms

Primary conversions:

- WhatsApp enquiry
- Contact form enquiry

## Admin CMS

Modules:

- Dashboard
- Products
- Categories
- Media Library
- Homepage Builder
- Hero Banner
- Testimonials
- FAQs
- Blogs
- Contact Enquiries
- SEO Manager
- Website Settings
- Admin Users

## Collections

- admins
- products
- categories
- media
- homepageSections
- heroBanners
- testimonials
- faqs
- blogs
- contactEnquiries
- seoMetadata
- websiteSettings

## API Groups

Public:

- `GET /api/public/home`
- `GET /api/public/categories`
- `GET /api/public/categories/:slug`
- `GET /api/public/products`
- `GET /api/public/products/:slug`
- `GET /api/public/blogs`
- `GET /api/public/blogs/:slug`
- `GET /api/public/faqs`
- `POST /api/public/contact`

Admin:

- `POST /api/admin/auth/login`
- `GET /api/admin/dashboard`
- `/api/admin/products`
- `/api/admin/categories`
- `/api/admin/media`
- `/api/admin/homepage`
- `/api/admin/banners`
- `/api/admin/testimonials`
- `/api/admin/faqs`
- `/api/admin/blogs`
- `/api/admin/enquiries`
- `/api/admin/seo`
- `/api/admin/settings`
- `/api/admin/users`
