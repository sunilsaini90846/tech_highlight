import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNewsletterByIssueNumber, getArticleById } from '@/lib/db'

interface NewsletterAMPPageProps {
  params: { issueNumber: string }
}

export async function generateMetadata({ params }: NewsletterAMPPageProps): Promise<Metadata> {
  const issueNumber = parseInt(params.issueNumber)
  const newsletter = await getNewsletterByIssueNumber(issueNumber)

  if (!newsletter) {
    return {
      title: 'Newsletter Issue Not Found | TechHighlight',
    }
  }

  return {
    title: `Newsletter #${newsletter.issueNumber}: ${newsletter.title} | TechHighlight`,
    description: newsletter.intro,
    keywords: ['AI newsletter', 'newsletter', `issue ${newsletter.issueNumber}`, newsletter.title],
  }
}

export default async function NewsletterAMPPage({ params }: NewsletterAMPPageProps) {
  const issueNumber = parseInt(params.issueNumber)

  if (isNaN(issueNumber)) {
    notFound()
  }

  const newsletter = await getNewsletterByIssueNumber(issueNumber)

  if (!newsletter) {
    notFound()
  }

  // Fetch all articles referenced in the newsletter
  const articlePromises = newsletter.items.map(item => getArticleById(item.articleRef))
  const articles = await Promise.all(articlePromises)

  // Filter out null articles (in case some were deleted)
  const validArticles = articles.filter((article): article is NonNullable<typeof article> => article !== null)

  // Generate AMP-compatible HTML
  const ampHtml = `
    <!DOCTYPE html>
    <html amp lang="en">
    <head>
      <meta charset="utf-8">
      <script async src="https://cdn.ampproject.org/v0.js"></script>
      <script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"></script>
      <title>Newsletter #${newsletter.issueNumber}: ${newsletter.title} | TechHighlight</title>
      <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
      <meta name="description" content="${newsletter.intro}">
      <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;-ms-animation:none;animation:none}</style></noscript>
      <style amp-custom>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .issue-title {
          font-size: 28px;
          font-weight: bold;
          margin: 10px 0;
          color: #1f2937;
        }
        .issue-intro {
          font-size: 18px;
          color: #6b7280;
          margin: 15px 0;
        }
        .issue-meta {
          font-size: 14px;
          color: #9ca3af;
          margin-top: 10px;
        }
        .article {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .article-header {
          background: #f9fafb;
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .article-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: #dbeafe;
          color: #2563eb;
          border-radius: 50%;
          font-weight: bold;
          font-size: 14px;
          margin-right: 15px;
        }
        .article-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        .article-summary {
          color: #6b7280;
          margin-bottom: 10px;
        }
        .article-meta {
          font-size: 12px;
          color: #9ca3af;
        }
        .article-category {
          display: inline-block;
          background: #dbeafe;
          color: #2563eb;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: medium;
          text-transform: capitalize;
          margin-right: 10px;
        }
        .article-content {
          padding: 15px;
        }
        .article-content p {
          margin-bottom: 15px;
          line-height: 1.7;
        }
        .read-more {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: medium;
        }
        .read-more:hover {
          background: #1d4ed8;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
        }
        .custom-note {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 10px 15px;
          margin: 10px 0;
          font-style: italic;
        }
        @media print {
          body { max-width: none; margin: 0; padding: 0; }
          .article { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">TechHighlight</div>
        <h1 class="issue-title">Issue #${newsletter.issueNumber}: ${newsletter.title}</h1>
        <p class="issue-intro">${newsletter.intro}</p>
        <div class="issue-meta">
          ${newsletter.items.length} articles featured •
          Published ${newsletter.publishedAt ? new Date(newsletter.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'Draft'}
        </div>
      </div>

      ${newsletter.items.map((item, index) => {
        const article = validArticles.find(a => a.id === item.articleRef)
        if (!article) return ''

        return `
          <div class="article">
            <div class="article-header">
              <span class="article-number">${index + 1}</span>
              <h2 class="article-title">${article.title}</h2>
              <p class="article-summary">${article.summary}</p>
              <div class="article-meta">
                <span class="article-category">${article.category}</span>
                Published ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}
                ${article.tags.length > 0 ? ` • ${article.tags.slice(0, 3).join(', ')}` : ''}
              </div>
            </div>
            <div class="article-content">
              ${item.customNote ? `<div class="custom-note">${item.customNote}</div>` : ''}
              <p>${article.body.replace(/\n/g, '</p><p>')}</p>
              <a href="/articles/${article.slug}" class="read-more">Read Full Article →</a>
            </div>
          </div>
        `
      }).join('')}

      <div class="footer">
        <p>Thank you for reading TechHighlight's weekly AI newsletter!</p>
        <p>Visit <a href="/">techhighlight.com</a> for more AI insights and updates.</p>
      </div>
    </body>
    </html>
  `

  // Return the AMP HTML directly
  return new Response(ampHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
