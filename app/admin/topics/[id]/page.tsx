'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTopicById } from '@/lib/db'
import { Topic } from '@/lib/types'
import { TopicEditor } from '@/components/admin/topic-editor'

interface EditTopicPageProps {
  params: { id: string }
}

export default function EditTopicPage({ params }: EditTopicPageProps) {
  const router = useRouter()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTopic() {
      try {
        const topicData = await getTopicById(params.id)
        if (!topicData) {
          router.push('/admin/topics')
          return
        }
        setTopic(topicData)
      } catch (error) {
        console.error('Failed to load topic:', error)
        router.push('/admin/topics')
      } finally {
        setLoading(false)
      }
    }

    loadTopic()
  }, [params.id, router])

  const handleSave = (topicId: string) => {
    router.push('/admin/topics')
  }

  const handleCancel = () => {
    router.push('/admin/topics')
  }

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading topic...</p>
        </div>
      </div>
    )
  }

  if (!topic) {
    return null // Will redirect
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Edit Topic</h1>
        <p className="mt-2 text-neutral-600">
          Update topic information and settings
        </p>
      </div>

      <TopicEditor
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={{
          id: topic.id,
          name: topic.name,
          slug: topic.slug,
          description: topic.description,
          featured: topic.featured,
          order: topic.order,
        }}
        isEditing={true}
      />
    </div>
  )
}
