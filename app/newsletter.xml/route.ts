import { NextRequest } from 'next/server'
import { listNewsletters, getArticleById } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get the latest 20 published newsletters
    const newsletters = await listNewsletters(20)

    // Filter to only published newsletters
    const publishedNewsletters = newsletters.filter(n => n.status === 'sent')

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TechHighlight AI Newsletter</title>
    <description>Weekly curated highlights of the latest developments in artificial intelligence</description>
    <link>https://techhighlight.com/newsletter</link>
    <atom:link href="https://techhighlight.com/newsletter.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>TechHighlight CMS</generator>
    <ttl>1440</ttl>

    ${await Promise.all(publishedNewsletters.map(async (newsletter) => {
      // Fetch articles for this newsletter
      const articlePromises = newsletter.items.map(item => getArticleById(item.articleRef))
      const articles = await Promise.all(articlePromises)
      const validArticles = articles.filter((article): article is NonNullable<typeof article> => article !== null)

      // Create description with article list
      const description = `
${newsletter.intro}

${validArticles.slice(0, 5).map((article, index) => `${index + 1}. ${article.title}`).join('\n')}

${validArticles.length > 5 ? `... and ${validArticles.length - 5} more articles` : ''}

Read the full newsletter: https://techhighlight.com/newsletter/${newsletter.issueNumber}
Printable version: https://techhighlight.com/newsletter/${newsletter.issueNumber}/amp
      `.trim()

      const pubDate = newsletter.publishedAt ? new Date(newsletter.publishedAt).toUTCString() : new Date().toUTCString()

      return `
    <item>
      <title>Issue #${newsletter.issueNumber}: ${newsletter.title}</title>
      <description><![CDATA[${description}]]></description>
      <link>https://techhighlight.com/newsletter/${newsletter.issueNumber}</link>
      <guid>https://techhighlight.com/newsletter/${newsletter.issueNumber}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>TechHighlight Team</author>
      <category>AI Newsletter</category>
      <category>Technology</category>
      <category>Artificial Intelligence</category>
    </item>`
    })).then(items => items.join(''))}
  </channel>
</rss>`

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)

    // Return a basic error response
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TechHighlight AI Newsletter</title>
    <description>Weekly curated highlights of the latest developments in artificial intelligence</description>
    <link>https://techhighlight.com/newsletter</link>
    <item>
      <title>Newsletter Feed Temporarily Unavailable</title>
      <description>The newsletter RSS feed is currently unavailable. Please check back later.</description>
      <link>https://techhighlight.com/newsletter</link>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  </channel>
</rss>`

    return new Response(errorXml, {
      status: 500,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes on error
      },
    })
  }
}
