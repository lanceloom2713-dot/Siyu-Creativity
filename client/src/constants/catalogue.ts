import type { Blog, Category, Product } from "../types/catalogue";

const image = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

export const WHATSAPP_NUMBER = "919999999999";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Handcrafted Gifting",
    slug: "handcrafted-gifting",
    description: "Thoughtful handmade pieces for celebrations, teams, and keepsakes.",
    image: image("photo-1513201099705-a9746e1e201f"),
    banner: image("photo-1513519245088-0e12902e5a38"),
    featured: true,
    displayOrder: 1,
    seo: {
      metaTitle: "Handcrafted Gifts | Siyu Creativity",
      metaDescription: "Explore premium handcrafted gifting by Siyu Creativity.",
      keywords: ["handcrafted gifts", "custom gifts", "Siyu Creativity"]
    }
  },
  {
    id: "cat-2",
    name: "Personalized Decor",
    slug: "personalized-decor",
    description: "Soft, elegant decor pieces personalized for homes, studios, and events.",
    image: image("photo-1524758631624-e2822e304c36"),
    banner: image("photo-1505693416388-ac5ce068fe85"),
    featured: true,
    displayOrder: 2,
    seo: {
      metaTitle: "Personalized Decor | Siyu Creativity",
      metaDescription: "Premium custom decor catalogue by Siyu Creativity.",
      keywords: ["personalized decor", "custom decor", "premium decor"]
    }
  }
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Pastel Memory Box",
    slug: "pastel-memory-box",
    shortDescription: "A delicate keepsake box crafted for milestone gifting.",
    longDescription:
      "Designed with soft textures, layered details, and personalized finishing for birthdays, baby showers, weddings, and brand gifting.",
    gallery: [
      image("photo-1549465220-1a8b9238cd48"),
      image("photo-1512909006721-3d6018887383"),
      image("photo-1511988617509-a57c8a288659")
    ],
    features: ["Custom name detailing", "Pastel finishing", "Gift-ready packaging"],
    tags: ["gifting", "keepsake", "personalized"],
    categorySlugs: ["handcrafted-gifting"],
    relatedProductSlugs: ["signature-floral-frame"],
    featured: true,
    trending: true,
    active: true,
    displayOrder: 1,
    seo: {
      metaTitle: "Pastel Memory Box | Siyu Creativity",
      metaDescription: "Enquire for the Pastel Memory Box by Siyu Creativity.",
      keywords: ["memory box", "pastel gift", "custom keepsake"]
    }
  },
  {
    id: "prod-2",
    name: "Signature Floral Frame",
    slug: "signature-floral-frame",
    shortDescription: "A framed floral composition with personalized calligraphy.",
    longDescription:
      "A premium wall or tabletop piece for thoughtful gifting, celebration styling, and elegant everyday decor.",
    gallery: [
      image("photo-1526045612212-70caf35c14df"),
      image("photo-1520763185298-1b434c919102"),
      image("photo-1487530811176-3780de880c2d")
    ],
    features: ["Hand-arranged floral layout", "Name or quote personalization", "Ready to display"],
    tags: ["decor", "floral", "frame"],
    categorySlugs: ["personalized-decor"],
    relatedProductSlugs: ["pastel-memory-box"],
    featured: true,
    trending: false,
    active: true,
    displayOrder: 2,
    seo: {
      metaTitle: "Signature Floral Frame | Siyu Creativity",
      metaDescription: "Discover personalized floral frames by Siyu Creativity.",
      keywords: ["floral frame", "custom frame", "personalized decor"]
    }
  }
];

export const blogs: Blog[] = [
  {
    id: "blog-1",
    title: "How to Choose a Thoughtful Custom Gift",
    slug: "choose-thoughtful-custom-gift",
    excerpt: "A simple guide to choosing handmade gifts that feel personal and premium.",
    content:
      "The strongest custom gifts begin with the recipient: their space, colors, memories, and the occasion. A well-made catalogue helps you compare ideas before sending an enquiry.",
    status: "published",
    tags: ["gifting", "customization"],
    seo: {
      metaTitle: "How to Choose a Custom Gift | Siyu Creativity",
      metaDescription: "Ideas for selecting thoughtful custom gifts.",
      keywords: ["custom gift guide", "personalized gift ideas"]
    }
  }
];
