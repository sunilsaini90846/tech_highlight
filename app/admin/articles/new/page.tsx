'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleEditor } from '@/components/admin/article-editor'

export default function NewArticlePage() {
  const router = useRouter()

  const handleSave = (articleId: string) => {
    router.push(`/admin/articles/${articleId}`)
  }

  const handleCancel = () => {
    router.push('/admin/articles')
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create New Article</h1>
        <p className="mt-2 text-neutral-600">
          Write and publish your next article
        </p>
      </div>

      <ArticleEditor onSave={handleSave} onCancel={handleCancel} />
    </div>
  )
}
