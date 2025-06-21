export function Background() {
  return (
    <svg
      className="fixed inset-0 w-full h-full  pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dots"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" className="fill-neutral-300" /> {/* gris claro (tailwind gray-300) */}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  )
}
