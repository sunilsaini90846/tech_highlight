'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NewsletterEditor } from '@/components/admin/newsletter-editor'

export default function NewNewsletterPage() {
  const router = useRouter()

  const handleSave = (newsletterId: string) => {
    router.push(`/admin/newsletter/${newsletterId}`)
  }

  const handleCancel = () => {
    router.push('/admin/newsletter')
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create New Newsletter Issue</h1>
        <p className="mt-2 text-neutral-600">
          Curate and publish a newsletter issue with selected articles
        </p>
      </div>

      <NewsletterEditor onSave={handleSave} onCancel={handleCancel} />
    </div>
  )
}
