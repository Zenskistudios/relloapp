// Remembers which page to open after the round trip to Google.
const KEY = 'rello:return-to'

export function saveReturnTo(path) {
  try {
    sessionStorage.setItem(KEY, path)
  } catch {
    // Storage can be blocked; the person lands on the Journal instead.
  }
}

export function readReturnTo() {
  try {
    const path = sessionStorage.getItem(KEY)
    // Only paths inside this app.
    return path?.startsWith('/') && !path.startsWith('//') ? path : '/home'
  } catch {
    return '/home'
  }
}
