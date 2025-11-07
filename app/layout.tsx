import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { AuthProvider } from '@/context/auth-context'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { MicrosoftClarity } from '@/components/analytics/microsoft-clarity'
import { WebsiteStructuredData, OrganizationStructuredData } from '@/components/seo/structured-data'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://techhighlight.com'),
  title: 'TechHighlight - Curated AI Highlights',
  description: 'Stay informed with curated highlights about AI for a general audience.',
  keywords: ['AI', 'technology', 'news', 'guides', 'tools'],
  authors: [{ name: 'TechHighlight Team' }],
  creator: 'TechHighlight',
  publisher: 'TechHighlight',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'TechHighlight - Curated AI Highlights',
    description: 'Stay informed with curated highlights about AI for a general audience.',
    type: 'website',
    siteName: 'TechHighlight',
    images: [
      {
        url: '/og/default.jpg',
        width: 1200,
        height: 630,
        alt: 'TechHighlight - Curated AI Highlights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechHighlight - Curated AI Highlights',
    description: 'Stay informed with curated highlights about AI for a general audience.',
    images: ['/og/default.jpg'],
    creator: '@techhighlight',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <WebsiteStructuredData />
        <OrganizationStructuredData />
      </head>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <GoogleAnalytics />
          <MicrosoftClarity />
        </AuthProvider>
      </body>
    </html>
  )
}

