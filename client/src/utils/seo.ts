import type { SeoMetadata } from "../types/catalogue";

export const applySeo = (seo: SeoMetadata) => {
  document.title = seo.metaTitle;

  const description = document.querySelector("meta[name='description']");
  description?.setAttribute("content", seo.metaDescription);
};
