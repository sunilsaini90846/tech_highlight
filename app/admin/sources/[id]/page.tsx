'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSourceById } from '@/lib/db'
import { Source } from '@/lib/types'
import { SourceEditor } from '@/components/admin/source-editor'

interface EditSourcePageProps {
  params: { id: string }
}

export default function EditSourcePage({ params }: EditSourcePageProps) {
  const router = useRouter()
  const [source, setSource] = useState<Source | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSource() {
      try {
        const sourceData = await getSourceById(params.id)
        if (!sourceData) {
          router.push('/admin/sources')
          return
        }
        setSource(sourceData)
      } catch (error) {
        console.error('Failed to load source:', error)
        router.push('/admin/sources')
      } finally {
        setLoading(false)
      }
    }

    loadSource()
  }, [params.id, router])

  const handleSave = (sourceId: string) => {
    router.push('/admin/sources')
  }

  const handleCancel = () => {
    router.push('/admin/sources')
  }

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading source...</p>
        </div>
      </div>
    )
  }

  if (!source) {
    return null // Will redirect
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Edit Source</h1>
        <p className="mt-2 text-neutral-600">
          Update source information and settings
        </p>
      </div>

      <SourceEditor
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={{
          id: source.id,
          name: source.name,
          url: source.url,
          type: source.type,
          active: source.active,
          logo: source.logo,
          fetchInterval: source.fetchInterval,
        }}
        isEditing={true}
      />
    </div>
  )
}
