// `value` must match the category check in supabase/schema.sql.
// `id` goes in the address bar, `chip` is the short filter label and
// `did` finishes the sentence "Ada Obi …" on a post.
export const TOPICS = [
  { value: 'Safety / Crime', id: 'safety', chip: 'Safety', did: 'reported a safety issue' },
  { value: 'Traffic / Roads', id: 'traffic', chip: 'Traffic', did: 'posted a traffic update' },
  { value: 'Power / Water', id: 'power', chip: 'Power & water', did: 'posted about power or water' },
  { value: 'Weather / Flood', id: 'weather', chip: 'Weather & flood', did: 'posted a weather update' },
  { value: 'Community Notice', id: 'notice', chip: 'Notices', did: 'shared a notice' },
  { value: 'Other', id: 'other', chip: 'Other', did: 'posted' },
]

export const CATEGORIES = TOPICS.map((topic) => topic.value)

export function topicFor(category) {
  return TOPICS.find((topic) => topic.value === category) ?? TOPICS.at(-1)
}
