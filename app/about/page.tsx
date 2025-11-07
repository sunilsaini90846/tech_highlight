import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About TechHighlight - Curated AI Content | TechHighlight',
  description: 'Learn about TechHighlight, your trusted source for curated AI content. We bring you the latest news, comprehensive guides, and powerful tools to help you stay informed about artificial intelligence.',
  keywords: ['about', 'TechHighlight', 'AI content', 'artificial intelligence', 'mission', 'team'],
}

export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
          About TechHighlight
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Your trusted source for curated AI content. We bring you the latest news,
          comprehensive guides, and powerful tools to help you stay informed about artificial intelligence.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                To make artificial intelligence accessible and understandable for everyone,
                regardless of technical background. We believe that AI should empower,
                not intimidate, and we're committed to providing clear, accurate, and
                actionable information about this transformative technology.
              </p>
              <Link href="/newsletter" className="btn btn-primary">
                Join Our Community
              </Link>
            </div>
            <div className="bg-primary-50 rounded-2xl p-8 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Democratizing AI Knowledge
              </h3>
              <p className="text-neutral-600">
                Making complex AI concepts simple and accessible to everyone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            What We Do
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            We curate, create, and deliver high-quality AI content across multiple formats
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="card text-center p-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
              Curate Latest News
            </h3>
            <p className="text-neutral-600 mb-4">
              We carefully select and highlight the most important AI developments,
              breakthroughs, and industry updates from around the world.
            </p>
            <Link href="/news" className="text-primary-600 hover:text-primary-700 font-medium">
              Explore News →
            </Link>
          </div>

          <div className="card text-center p-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
              Create Expert Guides
            </h3>
            <p className="text-neutral-600 mb-4">
              Our team of AI experts creates comprehensive guides that break down
              complex concepts into understandable, actionable content.
            </p>
            <Link href="/guides" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse Guides →
            </Link>
          </div>

          <div className="card text-center p-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
              Curate AI Tools
            </h3>
            <p className="text-neutral-600 mb-4">
              We maintain an up-to-date directory of the best AI tools, platforms,
              and applications for every use case and skill level.
            </p>
            <Link href="/tools" className="text-primary-600 hover:text-primary-700 font-medium">
              Explore Tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16 bg-neutral-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Our Values
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            The principles that guide everything we do at TechHighlight
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <span className="text-primary-600 font-bold">A</span>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">Accuracy</h3>
            <p className="text-sm text-neutral-600">
              We prioritize factual accuracy and verified information above all else
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <span className="text-primary-600 font-bold">I</span>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">Integrity</h3>
            <p className="text-sm text-neutral-600">
              We maintain transparency and ethical standards in all our content
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <span className="text-primary-600 font-bold">A</span>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">Accessibility</h3>
            <p className="text-sm text-neutral-600">
              Making AI knowledge accessible to everyone, regardless of background
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <span className="text-primary-600 font-bold">I</span>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">Innovation</h3>
            <p className="text-sm text-neutral-600">
              We embrace new technologies and approaches to deliver better content
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          Get in Touch
        </h2>
        <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
          Have questions, suggestions, or want to contribute? We'd love to hear from you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn btn-primary">
            Contact Us
          </Link>
          <Link href="/newsletter" className="btn btn-secondary">
            Subscribe to Updates
          </Link>
        </div>
      </section>
    </div>
  )
}

