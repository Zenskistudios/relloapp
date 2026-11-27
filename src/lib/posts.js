import { supabase } from './supabase.js'

export const PAGE_SIZE = 20

const POST_FIELDS = `
  id, category, body, location, created_at,
  author:profiles!posts_author_id_fkey ( handle, display_name )
`

// Newest first. Pass the last post you have as `before` to get the next page.
export async function fetchPosts({ authorId, before } = {}) {
  let query = supabase
    .from('posts')
    .select(POST_FIELDS)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(PAGE_SIZE)

  if (authorId) query = query.eq('author_id', authorId)

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
export async function createPost({ body, category, location, commentsEnabled }) {
  const { error } = await supabase.from('posts').insert({
    body: body.trim(),
    category,
    location: location.trim(),
    comments_enabled: commentsEnabled,
  })
  if (error) throw error
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
