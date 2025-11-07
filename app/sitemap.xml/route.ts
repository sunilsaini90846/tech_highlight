import { NextRequest } from 'next/server'
import { listArticles, listTopics, listNewsletters } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch all data for the sitemap
    const [articles, topics, newsletters] = await Promise.all([
      listArticles({ limit: 1000 }), // Get all published articles
      listTopics({ limit: 100 }), // Get all topics
      listNewsletters(100), // Get recent newsletters
    ])

    // Filter to only published content
    const publishedArticles = articles.filter(a => a.status === 'published')
    const publishedNewsletters = newsletters.filter(n => n.status === 'sent')

    // Generate XML sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home Page -->
  <url>
    <loc>https://techhighlight.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>https://techhighlight.com/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://techhighlight.com/news</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://techhighlight.com/guides</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://techhighlight.com/tools</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://techhighlight.com/newsletter</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://techhighlight.com/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Topics Pages -->
  ${topics.map(topic => `
  <url>
    <loc>https://techhighlight.com/topics</loc>
    <lastmod>${topic.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://techhighlight.com/topics/${topic.slug}</loc>
    <lastmod>${topic.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}

  <!-- Article Pages -->
  ${publishedArticles.map(article => `
  <url>
    <loc>https://techhighlight.com/articles/${article.slug}</loc>
    <lastmod>${article.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${article.category === 'news' ? '0.8' : '0.9'}</priority>
  </url>`).join('')}

  <!-- Newsletter Issues -->
  ${publishedNewsletters.map(newsletter => `
  <url>
    <loc>https://techhighlight.com/newsletter/${newsletter.issueNumber}</loc>
    <lastmod>${newsletter.publishedAt ? newsletter.publishedAt.toISOString().split('T')[0] : newsletter.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Return a basic sitemap with just the home page on error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://techhighlight.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new Response(basicSitemap, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes on error
      },
    })
  }
}
