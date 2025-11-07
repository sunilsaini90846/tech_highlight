'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getNewsletterById } from '@/lib/db'
import { Newsletter } from '@/lib/types'
import { NewsletterEditor } from '@/components/admin/newsletter-editor'

interface EditNewsletterPageProps {
  params: { id: string }
}

export default function EditNewsletterPage({ params }: EditNewsletterPageProps) {
  const router = useRouter()
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNewsletter() {
      try {
        const newsletterData = await getNewsletterById(params.id)
        if (!newsletterData) {
          router.push('/admin/newsletter')
          return
        }
        setNewsletter(newsletterData)
      } catch (error) {
        console.error('Failed to load newsletter:', error)
        router.push('/admin/newsletter')
      } finally {
        setLoading(false)
      }
    }

    loadNewsletter()
  }, [params.id, router])

  const handleSave = (newsletterId: string) => {
    router.push('/admin/newsletter')
  }

  const handleCancel = () => {
    router.push('/admin/newsletter')
  }

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading newsletter...</p>
        </div>
      </div>
    )
  }

  if (!newsletter) {
    return null // Will redirect
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Edit Newsletter Issue</h1>
        <p className="mt-2 text-neutral-600">
          Update newsletter content and settings
        </p>
      </div>

      <NewsletterEditor
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={{
          id: newsletter.id,
          issueNumber: newsletter.issueNumber,
          title: newsletter.title,
          intro: newsletter.intro,
          items: newsletter.items,
          status: newsletter.status,
          publishedAt: newsletter.publishedAt,
          seo: newsletter.seo,
        }}
        isEditing={true}
      />
    </div>
  )
}
