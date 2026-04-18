import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  url?: string;
  image?: string;
}

export function useSEO({ title, description, type = 'website', url, image }: SEOProps) {
  useEffect(() => {
    // Basic SEO pattern
    document.title = `${title} – Sai Ashirwad`;

    const setMetaTag = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    
    // Open Graph
    setMetaTag('property', 'og:title', `${title} – Sai Ashirwad`);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    
    if (url) setMetaTag('property', 'og:url', url);
    if (image) setMetaTag('property', 'og:image', image);

    // Twitter
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', `${title} – Sai Ashirwad`);
    setMetaTag('name', 'twitter:description', description);
    if (image) setMetaTag('name', 'twitter:image', image);

  }, [title, description, type, url, image]);
}
