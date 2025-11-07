import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
  StorageReference,
} from 'firebase/storage'
import { getFirebaseStorage } from './firebase'

export class StorageError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'StorageError'
  }
}

// Image validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
    }
  }

  // Check file extension (additional validation)
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  return { isValid: true }
}

/**
 * Generate a unique filename for uploaded images
 */
function generateUniqueFilename(originalName: string, prefix: string = ''): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  const extension = originalName.toLowerCase().substring(originalName.lastIndexOf('.'))
  const prefixWithSlash = prefix ? `${prefix}/` : ''
  return `${prefixWithSlash}${timestamp}-${randomId}${extension}`
}

/**
 * Upload an image file to Firebase Storage and return the public URL
 */
export async function uploadImage(
  file: File,
  path: string = 'images',
  userId?: string
): Promise<{ url: string; ref: StorageReference }> {
  try {
    // Validate the file first
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      throw new StorageError(validation.error!)
    }

    // Get current user if not provided
    if (!userId) {
      const { getAuth } = await import('firebase/auth')
      const auth = getAuth()
      if (!auth.currentUser) {
        throw new StorageError('User must be authenticated to upload images', 'auth/requires-auth')
      }
      userId = auth.currentUser.uid
    }

    const storage = getFirebaseStorage()
    const filename = generateUniqueFilename(file.name, '') // No prefix since we build path manually
    const fullPath = `${path}/${userId}/${filename}`
    const storageRef = ref(storage, fullPath)

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file)

    // Get the download URL
    const url = await getDownloadURL(snapshot.ref)

    return { url, ref: snapshot.ref }
  } catch (error: any) {
    if (error instanceof StorageError) {
      throw error
    }

    // Handle Firebase errors
    if (error.code === 'storage/unauthorized') {
      throw new StorageError('You do not have permission to upload images', error.code)
    } else if (error.code === 'storage/canceled') {
      throw new StorageError('Upload was canceled', error.code)
    } else if (error.code === 'storage/quota-exceeded') {
      throw new StorageError('Storage quota exceeded', error.code)
    } else {
      throw new StorageError(`Upload failed: ${error.message}`, error.code)
    }
  }
}

/**
 * Delete an image from Firebase Storage
 */
export async function deleteImage(urlOrPath: string): Promise<void> {
  try {
    const storage = getFirebaseStorage()

    // If it's a full URL, extract the path
    let path: string
    if (urlOrPath.startsWith('http')) {
      // Extract path from Firebase Storage URL
      // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media
      const url = new URL(urlOrPath)
      path = decodeURIComponent(url.pathname.split('/o/')[1])
    } else {
      path = urlOrPath
    }

    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      // Image doesn't exist, which is fine for our use case
      console.warn('Image not found for deletion:', urlOrPath)
      return
    }

    throw new StorageError(`Failed to delete image: ${error.message}`, error.code)
  }
}

/**
 * Get image metadata (useful for checking if image exists)
 */
export async function getImageMetadata(path: string): Promise<any> {
  try {
    const storage = getFirebaseStorage()
    const storageRef = ref(storage, path)

    // This will throw if the image doesn't exist
    await getDownloadURL(storageRef)

    return {
      exists: true,
      path,
    }
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      return { exists: false, path }
    }
    throw new StorageError(`Failed to get image metadata: ${error.message}`, error.code)
  }
}

/**
 * Generate optimized image URLs with Firebase Storage transformations
 * Note: This requires Firebase Extensions or a CDN setup
 */
export function getOptimizedImageUrl(url: string, options: {
  width?: number
  height?: number
  quality?: number
} = {}): string {
  // Basic implementation - in a real app, you'd use Firebase Extensions
  // or a CDN like Cloudinary/Imgix for image transformations

  if (!url || !options.width && !options.height && !options.quality) {
    return url
  }

  // For now, just return the original URL
  // You could integrate with Firebase Extensions or external CDN here
  return url
}
