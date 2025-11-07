'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { saveNewsletter, listArticles, getNextIssueNumber } from '@/lib/db'
import { Article, NewsletterInput, NewsletterStatus } from '@/lib/types'
import { ArticleCard } from '@/components/ui/article-card'
import { DateBadge } from '@/components/ui/date-badge'

// Validation schema
const newsletterSchema = z.object({
  issueNumber: z.number().int().positive(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  intro: z.string().max(1000, 'Intro too long'),
  items: z.array(z.object({
    articleRef: z.string(),
    customNote: z.string().optional(),
  })).min(1, 'At least one article is required'),
  status: z.enum(['draft', 'sent']),
  publishedAt: z.date().nullable(),
  seo: z.object({
    title: z.string().min(1, 'SEO title is required').max(60, 'SEO title too long'),
    description: z.string().min(1, 'SEO description is required').max(160, 'SEO description too long'),
  }),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterEditorProps {
  onSave: (newsletterId: string) => void
  onCancel: () => void
  initialData?: Partial<NewsletterFormData>
}

export function NewsletterEditor({ onSave, onCancel, initialData }: NewsletterEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableArticles, setAvailableArticles] = useState<Article[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set())

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      issueNumber: initialData?.issueNumber || 0,
      title: initialData?.title || '',
      intro: initialData?.intro || '',
      items: initialData?.items || [],
      status: initialData?.status || 'draft',
      publishedAt: initialData?.publishedAt || null,
      seo: {
        title: initialData?.seo?.title || '',
        description: initialData?.seo?.description || '',
      },
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedStatus = watch('status')
  const watchedItems = watch('items')

  // Load available published articles and next issue number
  useEffect(() => {
    async function loadData() {
      try {
        // Load published articles
        const articles = await listArticles({ status: 'published', limit: 100 })
        setAvailableArticles(articles)

        // Load next issue number if not editing existing
        if (!initialData?.issueNumber) {
          const nextIssueNumber = await getNextIssueNumber()
          setValue('issueNumber', nextIssueNumber)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    loadData()
  }, [initialData?.issueNumber, setValue])

  // Update selected articles set when items change
  useEffect(() => {
    const selected = new Set(watchedItems?.map(item => item.articleRef) || [])
    setSelectedArticles(selected)
  }, [watchedItems])

  const addArticle = (articleId: string) => {
    if (!selectedArticles.has(articleId)) {
      append({ articleRef: articleId, customNote: '' })
    }
  }

  const removeArticle = (index: number) => {
    remove(index)
  }

  const updateCustomNote = (index: number, note: string) => {
    update(index, { ...fields[index], customNote: note })
  }

  const moveArticle = (fromIndex: number, toIndex: number) => {
    const newItems = [...watchedItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)

    // Update all items
    newItems.forEach((item, index) => {
      update(index, item)
    })
  }

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    try {
      const newsletterData = {
        ...data,
        publishedAt: data.status === 'sent' ? new Date() : null,
      }

      const newsletterId = await saveNewsletter(newsletterData)
      onSave(newsletterId)
    } catch (error) {
      console.error('Failed to save newsletter:', error)
      alert('Failed to save newsletter. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredArticles = availableArticles.filter(article => !selectedArticles.has(article.id))

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Newsletter Details</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="issueNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                Issue Number *
              </label>
              <input
                {...register('issueNumber', { valueAsNumber: true })}
                type="number"
                id="issueNumber"
                className="input w-full"
                min="1"
              />
              {errors.issueNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.issueNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select {...register('status')} id="status" className="input w-full">
                <option value="draft">Draft</option>
                <option value="sent">Published</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="input w-full"
              placeholder="Weekly AI Highlights - Issue #X"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="intro" className="block text-sm font-medium text-neutral-700 mb-2">
              Introduction
            </label>
            <textarea
              {...register('intro')}
              id="intro"
              rows={3}
              className="input w-full"
              placeholder="Brief introduction to this week's highlights..."
            />
            {errors.intro && (
              <p className="mt-1 text-sm text-red-600">{errors.intro.message}</p>
            )}
          </div>
        </div>

        {/* Selected Articles */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Selected Articles ({fields.length})
          </h2>

          {fields.length > 0 ? (
            <div className="space-y-4">
              {fields.map((field, index) => {
                const article = availableArticles.find(a => a.id === field.articleRef)
                if (!article) return null

                return (
                  <div key={field.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900">{article.title}</h3>
                          <p className="text-sm text-neutral-600 line-clamp-2">{article.summary}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                              {article.category}
                            </span>
                            <DateBadge date={article.publishedAt || article.createdAt} />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeArticle(index)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Remove article"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Custom Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={field.customNote || ''}
                        onChange={(e) => updateCustomNote(index, e.target.value)}
                        placeholder="Why this article matters..."
                        className="input w-full"
                      />
                    </div>

                    {/* Move buttons */}
                    <div className="flex justify-end gap-2 mt-3">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveArticle(index, index - 1)}
                          className="btn btn-secondary btn-sm"
                        >
                          ↑ Move Up
                        </button>
                      )}
                      {index < fields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveArticle(index, index + 1)}
                          className="btn btn-secondary btn-sm"
                        >
                          ↓ Move Down
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <svg className="mx-auto h-12 w-12 text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No articles selected yet</p>
              <p className="text-sm">Add articles from the list below</p>
            </div>
          )}

          {errors.items && (
            <p className="mt-4 text-sm text-red-600">{errors.items.message}</p>
          )}
        </div>

        {/* Available Articles */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Available Articles ({filteredArticles.length})
          </h2>

          {filteredArticles.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredArticles.map((article) => (
                <div key={article.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-neutral-600 line-clamp-2 mt-1">{article.summary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                          {article.category}
                        </span>
                        <DateBadge date={article.publishedAt || article.createdAt} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addArticle(article.id)}
                    className="w-full btn btn-primary btn-sm"
                  >
                    Add to Newsletter
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <p>No more articles available</p>
              <p className="text-sm">All published articles have been added to this newsletter</p>
            </div>
          )}
        </div>

        {/* SEO Settings */}
        <div className="bg-neutral-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">SEO Settings</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-neutral-700 mb-2">
                SEO Title *
              </label>
              <input
                {...register('seo.title')}
                type="text"
                id="seoTitle"
                className="input w-full"
                placeholder="Newsletter title for search engines"
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
                SEO Description *
              </label>
              <textarea
                {...register('seo.description')}
                id="seoDescription"
                rows={3}
                className="input w-full"
                placeholder="Newsletter description for search engines"
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
              {isSubmitting ? 'Saving...' : 'Save Newsletter'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
