'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { saveSource, uploadImage } from '@/lib/db'
import { SourceInput, SourceType } from '@/lib/types'
import { ImageUpload } from '@/components/ui/image-upload'

// Validation schema
const sourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['rss', 'manual']),
  active: z.boolean().default(true),
  logo: z.string().url().optional().or(z.literal('')),
  fetchInterval: z.number().int().positive().default(24),
})

type SourceFormData = z.infer<typeof sourceSchema>

interface SourceEditorProps {
  onSave: (sourceId: string) => void
  onCancel: () => void
  initialData?: Partial<SourceFormData & { id: string }>
  isEditing?: boolean
}

export function SourceEditor({ onSave, onCancel, initialData, isEditing = false }: SourceEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SourceFormData>({
    resolver: zodResolver(sourceSchema),
    defaultValues: {
      name: initialData?.name || '',
      url: initialData?.url || '',
      type: initialData?.type || 'manual',
      active: initialData?.active ?? true,
      logo: initialData?.logo || '',
      fetchInterval: initialData?.fetchInterval || 24,
    },
  })

  const watchedType = watch('type')

  const onSubmit = async (data: SourceFormData) => {
    setIsSubmitting(true)
    try {
      const sourceData = {
        ...data,
        logo: data.logo || undefined,
      }

      const sourceId = await saveSource(sourceData, isEditing ? initialData?.id : undefined)
      onSave(sourceId)
    } catch (error) {
      console.error('Failed to save source:', error)
      alert('Failed to save source. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          {isEditing ? 'Edit Source' : 'Create New Source'}
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
              placeholder="Source name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-2">
              Type *
            </label>
            <select {...register('type')} id="type" className="input w-full">
              <option value="manual">Manual Entry</option>
              <option value="rss">RSS Feed</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="url" className="block text-sm font-medium text-neutral-700 mb-2">
            URL *
          </label>
          <input
            {...register('url')}
            type="url"
            id="url"
            className="input w-full"
            placeholder="https://example.com"
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
          )}
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Logo</h2>

        <ImageUpload
          label="Source Logo"
          value={watch('logo') || ''}
          onChange={(url) => setValue('logo', url || '')}
          onError={(error) => {
            console.error('Logo upload error:', error)
          }}
          helpText="Upload a square logo image (recommended: 200x200px)"
          placeholder="Click to upload source logo"
        />

        {errors.logo && (
          <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Settings</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="fetchInterval" className="block text-sm font-medium text-neutral-700 mb-2">
              Fetch Interval (hours)
            </label>
            <input
              {...register('fetchInterval', { valueAsNumber: true })}
              type="number"
              id="fetchInterval"
              min="1"
              max="168"
              className="input w-full"
              disabled={watchedType === 'manual'}
            />
            {errors.fetchInterval && (
              <p className="mt-1 text-sm text-red-600">{errors.fetchInterval.message}</p>
            )}
            <p className="mt-1 text-sm text-neutral-500">
              How often to check for new content (1-168 hours)
            </p>
          </div>

          <div className="flex items-center">
            <input
              {...register('active')}
              type="checkbox"
              id="active"
              className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-neutral-900">
              Active Source
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
          {isSubmitting ? 'Saving...' : (isEditing ? 'Update Source' : 'Create Source')}
        </button>
      </div>
    </form>
  )
}
