// SEO meta tag management
export interface SEOMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
}

export function generateSEOTags(meta: SEOMeta): string {
  const tags: string[] = [];

  if (meta.title) {
    tags.push(`<title>${meta.title}</title>`);
    tags.push(`<meta property="og:title" content="${meta.title}" />`);
  }

  if (meta.description) {
    tags.push(`<meta name="description" content="${meta.description}" />`);
    tags.push(`<meta property="og:description" content="${meta.description}" />`);
  }

  if (meta.keywords && meta.keywords.length > 0) {
    tags.push(`<meta name="keywords" content="${meta.keywords.join(", ")}" />`);
  }

  if (meta.ogImage) {
    tags.push(`<meta property="og:image" content="${meta.ogImage}" />`);
  }

  if (meta.twitterCard) {
    tags.push(`<meta name="twitter:card" content="${meta.twitterCard}" />`);
  }

  return tags.join("\n");
}

