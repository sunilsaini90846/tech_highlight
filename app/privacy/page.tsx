import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - TechHighlight',
  description: 'Learn how TechHighlight collects, uses, and protects your data. Our privacy policy covers analytics, cookies, and user rights.',
  keywords: ['privacy policy', 'data protection', 'analytics', 'cookies', 'GDPR', 'user rights'],
  openGraph: {
    title: 'Privacy Policy - TechHighlight',
    description: 'Learn how TechHighlight collects, uses, and protects your data.',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-neutral-600 max-w-3xl">
          Last updated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="text-neutral-600 mt-4">
          This privacy policy explains how TechHighlight collects, uses, and protects your information.
        </p>
      </div>

      <div className="prose prose-lg max-w-4xl">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Information We Collect</h2>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Analytics and Usage Data</h3>
          <p className="mb-4">
            We use Google Analytics and Microsoft Clarity to understand how visitors interact with our website.
            This helps us improve the user experience and content quality.
          </p>

          <h4 className="text-lg font-semibold text-neutral-800 mb-2">Google Analytics</h4>
          <p className="mb-3">
            Google Analytics collects information about:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Pages you visit and how long you spend on them</li>
            <li>Your approximate location (city/region level)</li>
            <li>Your device type, operating system, and browser</li>
            <li>Referral sources (how you found our site)</li>
            <li>Basic demographic information (age range, interests)</li>
          </ul>

          <h4 className="text-lg font-semibold text-neutral-800 mb-2">Microsoft Clarity</h4>
          <p className="mb-3">
            Microsoft Clarity provides session recordings and heatmaps to help us understand user behavior:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Mouse movements and clicks</li>
            <li>Scroll behavior and page interactions</li>
            <li>Anonymous session recordings (no personal information)</li>
            <li>Heatmaps showing popular areas of pages</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Website Improvement:</strong> Analytics help us understand what content is most valuable to our readers</li>
            <li><strong>Performance Optimization:</strong> We use data to improve site speed and user experience</li>
            <li><strong>Content Strategy:</strong> Understanding reading patterns helps us create better articles</li>
            <li><strong>Technical Support:</strong> Error tracking helps us fix issues quickly</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Sharing and Third Parties</h2>
          <p className="mb-4">
            We share anonymized, aggregated data with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google Analytics:</strong> Data is processed and stored by Google (see their <a href="https://policies.google.com/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener">privacy policy</a>)</li>
            <li><strong>Microsoft Clarity:</strong> Data is processed and stored by Microsoft (see their <a href="https://privacy.microsoft.com/en-us/privacystatement" className="text-primary-600 hover:underline" target="_blank" rel="noopener">privacy policy</a>)</li>
          </ul>
          <p className="mb-4">
            We do not sell, trade, or rent individual user data to third parties.
            All analytics data is aggregated and anonymized before any external sharing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Privacy Choices</h2>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Do Not Track</h3>
          <p className="mb-4">
            We respect the "Do Not Track" browser setting. If you have Do Not Track enabled,
            our analytics tools will not load or collect any data about your visit.
          </p>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Browser Opt-outs</h3>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary-600 hover:underline" target="_blank" rel="noopener">Opt-out browser add-on</a></li>
            <li><strong>Microsoft Clarity:</strong> Contact Microsoft directly for opt-out options</li>
          </ul>

          <h3 className="text-xl font-semibold text-neutral-900 mb-3">Admin Routes</h3>
          <p className="mb-4">
            Analytics are completely disabled on admin pages and preview routes to protect
            editorial privacy and content strategy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar technologies for analytics and to improve your experience:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Analytics Cookies:</strong> Used by Google Analytics and Microsoft Clarity to track usage patterns</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Performance Cookies:</strong> Help us understand how our site performs</li>
          </ul>
          <p className="mb-4">
            Most analytics cookies expire after 2 years. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your data:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>All data transmission is encrypted using HTTPS</li>
            <li>Analytics data is stored securely by trusted third-party providers</li>
            <li>We regularly review and update our security practices</li>
            <li>Access to analytics data is limited to authorized personnel only</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Data Retention</h2>
          <p className="mb-4">
            Analytics data is retained according to our third-party providers' policies:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google Analytics:</strong> Data is typically retained for 26 months</li>
            <li><strong>Microsoft Clarity:</strong> Data retention varies; contact Microsoft for details</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Children's Privacy</h2>
          <p className="mb-4">
            Our website is not intended for children under 13 years of age.
            We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your Rights (GDPR)</h2>
          <p className="mb-4">
            Under GDPR and similar privacy laws, you have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Access:</strong> Request information about what personal data we have about you</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Restriction:</strong> Request limitation of data processing</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Objection:</strong> Object to data processing based on legitimate interests</li>
          </ul>
          <p className="mb-4">
            Since we primarily collect anonymous analytics data, these rights may have limited application.
            However, you can always opt-out of analytics collection using the methods described above.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">International Data Transfers</h2>
          <p className="mb-4">
            Analytics data may be transferred to and processed in countries other than your own,
            including the United States. These transfers are governed by appropriate safeguards
            and comply with applicable data protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to This Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. When we make significant changes,
            we will update the "Last updated" date at the top of this page and may provide additional notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have questions about this privacy policy or our data practices, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: privacy@techhighlight.com</li>
            <li>Subject line: "Privacy Policy Inquiry"</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Additional Resources</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><a href="https://policies.google.com/technologies/partner-sites" className="text-primary-600 hover:underline" target="_blank" rel="noopener">Google Analytics Partner Sites</a></li>
            <li><a href="https://privacy.microsoft.com/en-us/privacystatement" className="text-primary-600 hover:underline" target="_blank" rel="noopener">Microsoft Privacy Statement</a></li>
            <li><a href="https://gdpr.eu/what-is-gdpr/" className="text-primary-600 hover:underline" target="_blank" rel="noopener">GDPR Information</a></li>
            <li><a href="https://allaboutcookies.org/" className="text-primary-600 hover:underline" target="_blank" rel="noopener">All About Cookies</a></li>
          </ul>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-neutral-200">
        <div className="flex flex-wrap gap-6 justify-center">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            ← Back to Home
          </Link>
          <Link href="/about" className="text-primary-600 hover:text-primary-700">
            About Us
          </Link>
          <Link href="/newsletter" className="text-primary-600 hover:text-primary-700">
            Newsletter
          </Link>
          <Link href="/topics" className="text-primary-600 hover:text-primary-700">
            Topics
          </Link>
        </div>
      </div>
    </div>
  )
}
