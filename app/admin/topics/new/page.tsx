'use client'

import { useRouter } from 'next/navigation'
import { TopicEditor } from '@/components/admin/topic-editor'

export default function NewTopicPage() {
  const router = useRouter()

  const handleSave = (topicId: string) => {
    router.push('/admin/topics')
  }

  const handleCancel = () => {
    router.push('/admin/topics')
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create New Topic</h1>
        <p className="mt-2 text-neutral-600">
          Add a new topic for categorizing articles
        </p>
      </div>

      <TopicEditor onSave={handleSave} onCancel={handleCancel} />
    </div>
  )
}
