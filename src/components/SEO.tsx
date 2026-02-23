import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://novastreamdigital.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'NovaStream Digital';

export const SEO = ({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noindex = false,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = `${BASE_URL}${location.pathname}`;

  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Designing Digital Experiences That Flow`;

  const defaultDescription = 'NovaStream Digital crafts refined websites and web applications for modern businesses. From captivating designs to powerful platforms.';
  const metaDescription = description || defaultDescription;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // Basic meta tags
    setMetaTag('description', metaDescription);
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // Robots
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

    // Open Graph tags
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', metaDescription, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:site_name', SITE_NAME, true);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime, true);
      }
      if (author) {
        setMetaTag('article:author', author, true);
      }
    }

    // Twitter Card tags
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', metaDescription);
    setMetaTag('twitter:image', image);

    // Canonical URL
    setLinkTag('canonical', currentUrl);

    // Cleanup function - reset to defaults when component unmounts
    return () => {
      document.title = `${SITE_NAME} | Designing Digital Experiences That Flow`;
    };
  }, [fullTitle, metaDescription, keywords, image, type, currentUrl, publishedTime, modifiedTime, author, noindex]);

  return null;
};

export default SEO;
