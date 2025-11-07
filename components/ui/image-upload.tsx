'use client'

import { useState, useRef } from 'react'
import { uploadImage, deleteImage, validateImageFile, StorageError } from '@/lib/storage'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | undefined) => void
  onError?: (error: string) => void
  className?: string
  disabled?: boolean
  accept?: string
  placeholder?: string
  label?: string
  helpText?: string
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function ImageUpload({
  value,
  onChange,
  onError,
  className = '',
  disabled = false,
  accept = 'image/*',
  placeholder = 'Click to upload or drag and drop',
  label,
  helpText,
}: ImageUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleError = (error: string) => {
    setError(error)
    setUploadState('error')
    if (onError) onError(error)
  }

  const handleFileSelect = async (file: File) => {
    // Reset state
    setError(null)
    setUploadState('uploading')
    setUploadProgress(0)

    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        throw new StorageError(validation.error!)
      }

      // Create local preview immediately
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Simulate progress (Firebase doesn't provide progress by default)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Upload to Firebase Storage
      const result = await uploadImage(file, 'article-covers')

      // Clear progress interval and set to 100%
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Update state
      setUploadState('success')

      // Clean up object URL and use Firebase URL
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(result.url)

      // Call onChange with the Firebase URL
      onChange(result.url)

      // Auto-clear success state after a delay
      setTimeout(() => {
        setUploadState('idle')
        setUploadProgress(0)
      }, 2000)

    } catch (err) {
      // Clean up object URL on error
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }

      if (err instanceof StorageError) {
        handleError(err.message)
      } else {
        handleError('Upload failed. Please try again.')
      }

      // Reset preview if upload failed
      setPreviewUrl(value || null)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleClick = () => {
    if (!disabled && uploadState !== 'uploading') {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      await deleteImage(value)
      onChange(undefined)
      setPreviewUrl(null)
      setError(null)
    } catch (err) {
      handleError('Failed to delete image. Please try again.')
    }
  }

  const handleReplace = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-neutral-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploadState === 'uploading' ? 'border-primary-500 bg-primary-50' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || uploadState === 'uploading'}
        />

        {/* Content */}
        <div className="p-6 text-center">
          {previewUrl ? (
            /* Image Preview */
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded border"
                />

                {/* Loading Overlay */}
                {uploadState === 'uploading' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto mb-2"></div>
                      <div className="text-sm">{uploadProgress}%</div>
                    </div>
                  </div>
                )}

                {/* Success Overlay */}
                {uploadState === 'success' && (
                  <div className="absolute inset-0 bg-green-500 bg-opacity-90 rounded flex items-center justify-center">
                    <div className="text-white text-center">
                      <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="text-sm">Uploaded!</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReplace()
                  }}
                  disabled={disabled || uploadState === 'uploading'}
                  className="btn btn-secondary btn-sm"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                  disabled={disabled || uploadState === 'uploading'}
                  className="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* Upload Placeholder */
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-neutral-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <div>
                <p className="text-sm text-neutral-600">{placeholder}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  PNG, JPG, WebP, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="mt-2 text-sm text-neutral-500">{helpText}</p>
      )}

      {/* URL Input (alternative to file upload) */}
      <div className="mt-4">
        <label htmlFor="image-url" className="block text-sm font-medium text-neutral-700 mb-2">
          Or paste image URL
        </label>
        <input
          id="image-url"
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder="https://example.com/image.jpg"
          className="input w-full"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
