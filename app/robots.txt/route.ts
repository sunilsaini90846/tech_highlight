import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const robotsTxt = `User-agent: *
Allow: /

# Block admin and preview routes
Disallow: /admin/
Disallow: /preview/
Disallow: /api/

# Block draft content
Disallow: /*?*status=draft
Disallow: /*?*preview=

# Sitemap
Sitemap: https://techhighlight.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  })
}
