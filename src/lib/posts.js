import { removePhoto, uploadPhoto } from './photos.js'
import { supabase } from './supabase.js'

export const PAGE_SIZE = 20

const POST_FIELDS = `
  id, category, body, location, image_path, created_at,
  author:profiles!posts_author_id_fkey ( handle, display_name )
`

// Newest first. Pass the last post you have as `before` to get the next page.
export async function fetchPosts({ authorId, category, before } = {}) {
  let query = supabase
    .from('posts')
    .select(POST_FIELDS)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(PAGE_SIZE)

  if (authorId) query = query.eq('author_id', authorId)
  if (category) query = query.eq('category', category)

  // Paging by (time, id) means new posts arriving never cause repeats or gaps.
  if (before) {
    const time = `"${before.created_at}"`
    query = query.or(`created_at.lt.${time},and(created_at.eq.${time},id.lt.${before.id})`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

// author_id and created_at are filled in by the database.
// `photo` is an already prepared JPEG; `userId` names the folder it goes in.
export async function createPost({ body, category, location, commentsEnabled, photo, userId }) {
  const imagePath = photo ? await uploadPhoto(photo, userId) : null

  const { error } = await supabase.from('posts').insert({
    body: body.trim(),
    category,
    location: location.trim(),
    comments_enabled: commentsEnabled,
    ...(imagePath && { image_path: imagePath }),
  })

  if (error) {
    // A database error code means the entry was definitely not saved, so the
    // file is not needed. Without one (a dropped connection) it may have saved.
    if (imagePath && error.code) await removePhoto(imagePath)
    throw error
  }
}

// Gives null when the post does not exist, was removed or is hidden.
export async function fetchPost(id) {
  const { data, error } = await supabase.from('posts').select(POST_FIELDS).eq('id', id).maybeSingle()
  // 22P02: the address holds something that is not a post id at all.
  if (error?.code === '22P02') return null
  if (error) throw error
  return data
}

export async function fetchProfile(handle) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, handle, display_name, bio, location, created_at')
    .eq('handle', handle)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function countPosts(authorId) {
  const { count, error } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', authorId)
  if (error) throw error
  return count
}
