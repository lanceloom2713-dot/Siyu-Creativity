import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { publicCatalogueApi } from "../../services/publicCatalogueApi";

const normalize = (value: string) => value.toLowerCase().replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/";

const upsertMeta = (name: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

export function SeoSync() {
  const location = useLocation();
  const { data: seoPages = [] } = useQuery({ queryKey: ["public-seo"], queryFn: publicCatalogueApi.getSeoPages, staleTime: 5 * 60 * 1000 });

  useEffect(() => {
    const route = normalize(location.pathname);
    const seo = seoPages.find((page) => normalize(page.page) === route || page.page.toLowerCase() === route.slice(1));
    if (!seo) return;

    document.title = seo.metaTitle;
    upsertMeta("description", seo.metaDescription);
    if (seo.keywords) upsertMeta("keywords", seo.keywords);
  }, [location.pathname, seoPages]);

  return null;
}
