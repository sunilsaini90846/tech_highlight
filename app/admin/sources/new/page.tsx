'use client'

import { useRouter } from 'next/navigation'
import { SourceEditor } from '@/components/admin/source-editor'

export default function NewSourcePage() {
  const router = useRouter()

  const handleSave = (sourceId: string) => {
    router.push('/admin/sources')
  }

  const handleCancel = () => {
    router.push('/admin/sources')
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Add New Source</h1>
        <p className="mt-2 text-neutral-600">
          Add a new content source for article aggregation
        </p>
      </div>

      <SourceEditor onSave={handleSave} onCancel={handleCancel} />
    </div>
  )
}
