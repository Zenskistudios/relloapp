const PATHS = {
  board: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
  plus: 'M12 5v14M5 12h14',
  user: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c1-5 15-5 16 0',
  back: 'M15 5l-7 7 7 7',
  close: 'M6 6l12 12M18 6L6 18',
  share: 'M21 3L3 10.5l7 2.5 2.5 7zM10 13l11-10',
  camera: 'M4 8h4l2-3h4l2 3h4v11H4zM12 9.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z',
  refresh: 'M20 12a8 8 0 11-2.3-5.6M20 4v4h-4',
  pin: 'M12 21c-4-5-6-8-6-11a6 6 0 0112 0c0 3-2 6-6 11zM12 8a2 2 0 100 4 2 2 0 000-4z',
}

// Decorative only: the button or link around it supplies the name.
export default function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
