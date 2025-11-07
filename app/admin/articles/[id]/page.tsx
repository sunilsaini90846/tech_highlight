'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getArticleById } from '@/lib/db'
import { Article } from '@/lib/types'
import { ArticleEditor } from '@/components/admin/article-editor'

interface EditArticlePageProps {
  params: { id: string }
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticle() {
      try {
        const articleData = await getArticleById(params.id)
        if (!articleData) {
          router.push('/admin/articles')
          return
        }
        setArticle(articleData)
      } catch (error) {
        console.error('Failed to load article:', error)
        router.push('/admin/articles')
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [params.id, router])

  const handleSave = (articleId: string) => {
    router.push(`/admin/articles/${articleId}`)
  }

  const handleCancel = () => {
    router.push('/admin/articles')
  }

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return null // Will redirect
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Edit Article</h1>
        <p className="mt-2 text-neutral-600">
          Update article content and settings
        </p>
      </div>

      <ArticleEditor
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          body: article.body,
          category: article.category,
          topics: article.topics,
          tags: article.tags,
          status: article.status,
          publishedAt: article.publishedAt,
          coverImage: article.coverImage,
          seo: article.seo,
        }}
      />
    </div>
  )
}
