import { supabase } from './supabase.js'

const BUCKET = 'post-photos'
const MAX_UPLOAD_BYTES = 1024 * 1024 // the bucket refuses anything bigger
export const MAX_INPUT_MB = 20

// Redraws a chosen photo as a smaller JPEG. This saves data, and it also drops
// the hidden details a camera stores inside the file, including GPS location.
export async function preparePhoto(file) {
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()

    // Start sharp, then shrink until the file is small enough.
    for (const longestSide of [1600, 1200, 900]) {
      const scale = Math.min(1, longestSide / Math.max(image.naturalWidth, image.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      const context = canvas.getContext('2d')
      // JPEG has no transparency, so see-through areas become white, not black.
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      for (const quality of [0.82, 0.65]) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
        if (blob && blob.size <= MAX_UPLOAD_BYTES) return blob
      }
    }
    throw new Error('The photo could not be made small enough.')
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function uploadPhoto(blob, userId) {
  const path = `${userId}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage
    .from(BUCKET)
    // Every upload gets a new name, so browsers can keep it for a year.
    .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
  if (error) throw error
  return path
}

export async function removePhoto(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) console.error('Could not remove an unused photo:', error.message)
}

export function photoUrl(path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
