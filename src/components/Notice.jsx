// A centred message for empty, loading and error states.
export default function Notice({ title, children }) {
  return (
    <div className="empty-state" role="status">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export function SetupNotice() {
  return (
    <Notice title="Connect Supabase to continue">
      <p>
        Add your project URL and publishable key to <code>.env.local</code>, then restart the app.
        The steps are in the README.
      </p>
    </Notice>
  )
}
