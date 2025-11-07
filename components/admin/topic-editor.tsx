'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { saveTopic, generateSlug } from '@/lib/db'
import { TopicInput } from '@/lib/types'

// Validation schema
const topicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().max(500, 'Description too long'),
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
})

type TopicFormData = z.infer<typeof topicSchema>

interface TopicEditorProps {
  onSave: (topicId: string) => void
  onCancel: () => void
  initialData?: Partial<TopicFormData>
  isEditing?: boolean
}

export function TopicEditor({ onSave, onCancel, initialData, isEditing = false }: TopicEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      featured: initialData?.featured || false,
      order: initialData?.order || 0,
    },
  })

  const watchedName = watch('name')

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !initialData?.slug) {
      const slug = generateSlug(watchedName)
      setValue('slug', slug)
    }
  }, [watchedName, setValue, initialData?.slug])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const topicData = {
        ...data,
        description: data.description || '',
      }

      const topicId = await saveTopic(topicData)
      onSave(topicId)
    } catch (error) {
      console.error('Failed to save topic:', error)
      alert('Failed to save topic. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          {isEditing ? 'Edit Topic' : 'Create New Topic'}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
              Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="input w-full"
              placeholder="Topic name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-neutral-700 mb-2">
              Slug *
            </label>
            <input
              {...register('slug')}
              type="text"
              id="slug"
              className="input w-full"
              placeholder="url-friendly-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="input w-full"
            placeholder="Brief description of this topic..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
          <p className="mt-1 text-sm text-neutral-500">
            {watch('description')?.length || 0}/500 characters
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Settings</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-neutral-700 mb-2">
              Display Order
            </label>
            <input
              {...register('order', { valueAsNumber: true })}
              type="number"
              id="order"
              min="0"
              className="input w-full"
              placeholder="0"
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
            )}
            <p className="mt-1 text-sm text-neutral-500">
              Lower numbers appear first in listings
            </p>
          </div>

          <div className="flex items-center">
            <input
              {...register('featured')}
              type="checkbox"
              id="featured"
              className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-neutral-900">
              Featured Topic
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (isEditing ? 'Update Topic' : 'Create Topic')}
        </button>
      </div>
    </form>
  )
}
