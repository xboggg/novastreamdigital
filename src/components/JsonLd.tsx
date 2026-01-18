import { useEffect } from 'react';

const BASE_URL = 'https://novastreamdigital.techtrendi.com';

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NovaStream Digital',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: 'NovaStream Digital crafts refined websites and web applications for modern businesses.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@novastreamdigital.com',
    contactType: 'customer service',
  },
  sameAs: [
    'https://twitter.com/NovaStreamDigi',
    'https://linkedin.com/company/novastreamdigital',
    'https://instagram.com/novastreamdigital',
  ],
};

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NovaStream Digital',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/insights?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// Local Business Schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'NovaStream Digital',
  url: BASE_URL,
  image: `${BASE_URL}/og-image.png`,
  description: 'Digital agency specializing in web design, web development, and brand identity.',
  priceRange: '$$',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 5.6037,
      longitude: -0.1870,
    },
    geoRadius: '50000',
  },
  serviceArea: {
    '@type': 'Place',
    name: 'Worldwide',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Design',
          description: 'Custom website design with modern UI/UX',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Full-stack web application development',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Brand Identity',
          description: 'Logo design and brand strategy',
        },
      },
    ],
  },
};

interface JsonLdProps {
  type?: 'organization' | 'website' | 'localBusiness' | 'article' | 'faq' | 'breadcrumb' | 'service';
  data?: Record<string, unknown>;
}

export const JsonLd = ({ type = 'organization', data }: JsonLdProps) => {
  useEffect(() => {
    let schema: Record<string, unknown>;

    switch (type) {
      case 'organization':
        schema = organizationSchema;
        break;
      case 'website':
        schema = websiteSchema;
        break;
      case 'localBusiness':
        schema = localBusinessSchema;
        break;
      case 'article':
      case 'faq':
      case 'breadcrumb':
      case 'service':
        schema = data || {};
        break;
      default:
        schema = organizationSchema;
    }

    // Create or update script element
    let scriptElement = document.querySelector(
      `script[data-json-ld="${type}"]`
    ) as HTMLScriptElement;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.setAttribute('data-json-ld', type);
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(schema);

    // Cleanup
    return () => {
      const element = document.querySelector(`script[data-json-ld="${type}"]`);
      if (element) {
        element.remove();
      }
    };
  }, [type, data]);

  return null;
};

// Helper to create article schema
export const createArticleSchema = (article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  modifiedAt?: string;
  author?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image || `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/insights/${article.slug}`,
  datePublished: article.publishedAt,
  dateModified: article.modifiedAt || article.publishedAt,
  author: {
    '@type': 'Organization',
    name: article.author || 'NovaStream Digital',
  },
  publisher: {
    '@type': 'Organization',
    name: 'NovaStream Digital',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
    },
  },
});

// Helper to create FAQ schema
export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// Helper to create breadcrumb schema
export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
  })),
});

// Helper to create service schema
export const createServiceSchema = (service: {
  name: string;
  description: string;
  url: string;
  image?: string;
  price?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  url: service.url.startsWith('http') ? service.url : `${BASE_URL}${service.url}`,
  image: service.image || `${BASE_URL}/og-image.png`,
  provider: {
    '@type': 'Organization',
    name: 'NovaStream Digital',
  },
  ...(service.price && {
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'USD',
    },
  }),
});

export default JsonLd;
