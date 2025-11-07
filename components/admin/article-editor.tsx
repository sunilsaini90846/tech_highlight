'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import { saveArticle, listTopics, generateSlug } from '@/lib/db'
import { ArticleInput, ArticleCategory, ArticleStatus } from '@/lib/types'
import { ImageUpload } from '@/components/ui/image-upload'

// Dynamically import MDX editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

// Validation schema
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  summary: z.string().min(1, 'Summary is required').max(500, 'Summary too long'),
  body: z.string().min(1, 'Content is required'),
  category: z.enum(['news', 'guide', 'tool']),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'scheduled', 'published']),
  publishedAt: z.date().nullable(),
  coverImage: z.string().url().optional().or(z.literal('')),
  seo: z.object({
    title: z.string().min(1, 'SEO title is required').max(60, 'SEO title too long'),
    description: z.string().min(1, 'SEO description is required').max(160, 'SEO description too long'),
  }),
})

// Pre-publish validation (stricter)
const publishValidation = articleSchema.refine((data) => {
  return data.summary.length >= 10 && // Require meaningful summary
         data.coverImage && data.coverImage.length > 0 && // Require cover image
         data.topics.length >= 1 && // Require topics
         data.seo.title.length >= 10 && // Require SEO title
         data.seo.description.length >= 50 // Require SEO description
}, {
  message: "Missing required fields for publication",
  path: ["publishValidation"]
})

type ArticleFormData = z.infer<typeof articleSchema>

interface ArticleEditorProps {
  onSave: (articleId: string) => void
  onCancel: () => void
  initialData?: Partial<ArticleFormData>
}

export function ArticleEditor({ onSave, onCancel, initialData }: ArticleEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTopics, setAvailableTopics] = useState<Array<{id: string, name: string}>>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      summary: initialData?.summary || '',
      body: initialData?.body || '',
      category: initialData?.category || 'news',
      topics: initialData?.topics || [],
      tags: initialData?.tags || [],
      status: initialData?.status || 'draft',
      publishedAt: initialData?.publishedAt || null,
      coverImage: initialData?.coverImage || '',
      seo: {
        title: initialData?.seo?.title || '',
        description: initialData?.seo?.description || '',
      },
    },
  })

  const watchedTitle = watch('title')
  const watchedStatus = watch('status')
  const watchedCoverImage = watch('coverImage')

  // Load available topics
  useEffect(() => {
    async function loadTopics() {
      try {
        const topics = await listTopics()
        setAvailableTopics(topics.map(t => ({ id: t.id, name: t.name })))
      } catch (error) {
        console.error('Failed to load topics:', error)
      }
    }
    loadTopics()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !initialData?.slug) {
      const slug = generateSlug(watchedTitle)
      setValue('slug', slug)
    }
  }, [watchedTitle, setValue, initialData?.slug])

  const validateForPublish = async (data: ArticleFormData): Promise<boolean> => {
    if (data.status !== 'published') return true

    try {
      await publishValidation.parseAsync(data)
      return true
    } catch (error) {
      alert('Cannot publish: Missing required fields. Please check summary, cover image, topics, and SEO fields.')
      return false
    }
  }

  const onSubmit = async (data: ArticleFormData) => {
    const isValidForPublish = await validateForPublish(data)
    if (!isValidForPublish) return

    setIsSubmitting(true)
    try {
      const articleData = {
        ...data,
        coverImage: data.coverImage || undefined,
        publishedAt: data.status === 'scheduled' ? data.publishedAt : null,
      }

      const articleId = await saveArticle(articleData)
      onSave(articleId)
    } catch (error) {
      console.error('Failed to save article:', error)
      alert('Failed to save article. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = (status: ArticleStatus) => {
    setValue('status', status)
    if (status === 'scheduled') {
      // Set default scheduled date (tomorrow)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setValue('publishedAt', tomorrow)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title and Slug */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
            Title *
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="input w-full"
            placeholder="Enter article title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-neutral-700 mb-2">
          Summary * {watchedStatus === 'published' && <span className="text-red-500">(Required for publish)</span>}
        </label>
        <textarea
          {...register('summary')}
          id="summary"
          rows={3}
          className="input w-full"
          placeholder="Brief summary of the article (shown in previews)"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
        <p className="mt-1 text-sm text-neutral-500">
          {watch('summary')?.length || 0}/500 characters
        </p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Content *
        </label>
        <div data-color-mode="light">
          <MDEditor
            value={watch('body')}
            onChange={(value) => setValue('body', value || '')}
            preview="edit"
            hideToolbar={false}
            visibleDragBar={false}
            height={400}
            textareaProps={{
              placeholder: 'Write your article content here... (Markdown supported)',
            }}
          />
        </div>
        {errors.body && (
          <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
        )}
        <p className="mt-1 text-sm text-neutral-500">
          Supports Markdown formatting: **bold**, *italic*, [links](url), and more
        </p>
      </div>

      {/* Category and Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
            Category *
          </label>
          <select {...register('category')} id="category" className="input w-full">
            <option value="news">News</option>
            <option value="guide">Guide</option>
            <option value="tool">Tool</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
            Status *
          </label>
          <select
            value={watchedStatus}
            onChange={(e) => handleStatusChange(e.target.value as ArticleStatus)}
            className="input w-full"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        {watchedStatus === 'scheduled' && (
          <div>
            <label htmlFor="publishedAt" className="block text-sm font-medium text-neutral-700 mb-2">
              Publish Date *
            </label>
            <input
              {...register('publishedAt', { valueAsDate: true })}
              type="datetime-local"
              id="publishedAt"
              className="input w-full"
            />
          </div>
        )}
      </div>

      {/* Topics */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Topics * {watchedStatus === 'published' && <span className="text-red-500">(Required for publish)</span>}
        </label>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {availableTopics.map((topic) => (
            <label key={topic.id} className="flex items-center">
              <input
                type="checkbox"
                {...register('topics')}
                value={topic.id}
                className="h-4 w-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-neutral-700">{topic.name}</span>
            </label>
          ))}
        </div>
        {errors.topics && (
          <p className="mt-1 text-sm text-red-600">{errors.topics.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
          Tags
        </label>
        <input
          {...register('tags')}
          type="text"
          id="tags"
          className="input w-full"
          placeholder="tag1, tag2, tag3 (comma-separated)"
          onChange={(e) => {
            const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
            setValue('tags', tags)
          }}
        />
      </div>

      {/* Cover Image */}
      <ImageUpload
        label={`Cover Image ${watchedStatus === 'published' ? '* (Required for publish)' : ''}`}
        value={watchedCoverImage}
        onChange={(url) => setValue('coverImage', url || '')}
        onError={(error) => {
          // Handle upload errors
          console.error('Image upload error:', error)
        }}
        helpText="Upload a high-quality image (recommended: 1200x630px for best social sharing)"
        placeholder="Click to upload cover image or drag and drop"
      />

      {errors.coverImage && (
        <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>
      )}

      {/* SEO Fields */}
      <div className="bg-neutral-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">SEO Settings</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="seoTitle" className="block text-sm font-medium text-neutral-700 mb-2">
              SEO Title * {watchedStatus === 'published' && <span className="text-red-500">(Required for publish)</span>}
            </label>
            <input
              {...register('seo.title')}
              type="text"
              id="seoTitle"
              className="input w-full"
              placeholder="SEO title for search engines"
            />
            {errors.seo?.title && (
              <p className="mt-1 text-sm text-red-600">{errors.seo.title.message}</p>
            )}
            <p className="mt-1 text-sm text-neutral-500">
              {watch('seo.title')?.length || 0}/60 characters
            </p>
          </div>

          <div>
            <label htmlFor="seoDescription" className="block text-sm font-medium text-neutral-700 mb-2">
              SEO Description * {watchedStatus === 'published' && <span className="text-red-500">(Required for publish)</span>}
            </label>
            <textarea
              {...register('seo.description')}
              id="seoDescription"
              rows={3}
              className="input w-full"
              placeholder="SEO description for search engines"
            />
            {errors.seo?.description && (
              <p className="mt-1 text-sm text-red-600">{errors.seo.description.message}</p>
            )}
            <p className="mt-1 text-sm text-neutral-500">
              {watch('seo.description')?.length || 0}/160 characters
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>
    </form>
  )
}
