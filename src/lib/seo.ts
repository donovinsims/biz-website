import { useEffect } from "react";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Sets the page title, description, OG tags, and one JSON-LD block per route. */
export function useSeo(title: string, description: string, jsonLd?: object) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);

    const script = document.createElement("script");
    if (jsonLd) {
      script.type = "application/ld+json";
      script.dataset.seo = "route";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => script.remove();
  }, [title, description, jsonLd]);
}

export const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "";
