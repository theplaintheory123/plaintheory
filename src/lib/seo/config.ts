import type { Metadata } from 'next'

export const siteConfig = {
  name: 'Plantheory',
  description: 'Transform operational chaos into clarity. The enterprise-grade platform that centralizes your operational knowledge, streamlines processes, and empowers your team to execute with precision.',
  shortDescription: 'Operational playbooks for modern teams',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://plantheory.com',
  ogImage: '/og-image.png',
  creator: '@plantheory',
  keywords: [
    'operational playbooks',
    'process documentation',
    'SOP software',
    'standard operating procedures',
    'team collaboration',
    'knowledge management',
    'workflow automation',
    'business processes',
    'operations management',
    'enterprise software',
    'team productivity',
    'process management',
  ],
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
  canonical,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
  canonical?: string
} = {}): Metadata {
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`

  return {
    title: fullTitle,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonical || '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${siteConfig.shortDescription}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: siteConfig.creator,
    },
    icons: {
      icon: icons,
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// JSON-LD structured data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      'https://twitter.com/plantheory',
      'https://linkedin.com/company/plantheory',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  }
}
