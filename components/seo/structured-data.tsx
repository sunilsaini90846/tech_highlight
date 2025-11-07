import { Article, Topic } from '@/lib/types'

interface ArticleStructuredDataProps {
  article: Article
  topics?: Topic[]
}

export function ArticleStructuredData({ article, topics }: ArticleStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    image: article.coverImage ? [article.coverImage] : ['/og/default.jpg'],
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'TechHighlight',
      url: 'https://techhighlight.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechHighlight',
      logo: {
        '@type': 'ImageObject',
        url: 'https://techhighlight.com/og/default.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://techhighlight.com/articles/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    ...(topics && topics.length > 0 && {
      about: topics.map(topic => ({
        '@type': 'Thing',
        name: topic.name,
        description: topic.description,
      })),
    }),
    url: `https://techhighlight.com/articles/${article.slug}`,
    isAccessibleForFree: true,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-title', '.article-summary'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

interface WebsiteStructuredDataProps {
  title?: string
  description?: string
  url?: string
}

export function WebsiteStructuredData({
  title = 'TechHighlight - Curated AI Highlights',
  description = 'Stay informed with curated highlights about AI for a general audience.',
  url = 'https://techhighlight.com'
}: WebsiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TechHighlight',
    alternateName: 'TechHighlight AI',
    url: url,
    description: description,
    publisher: {
      '@type': 'Organization',
      name: 'TechHighlight',
      logo: {
        '@type': 'ImageObject',
        url: 'https://techhighlight.com/og/default.jpg',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://techhighlight.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

interface OrganizationStructuredDataProps {
  url?: string
}

export function OrganizationStructuredData({ url = 'https://techhighlight.com' }: OrganizationStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechHighlight',
    url: url,
    logo: 'https://techhighlight.com/og/default.jpg',
    description: 'Curated AI highlights and technology insights for everyone',
    sameAs: [
      'https://twitter.com/techhighlight',
      'https://github.com/techhighlight',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
