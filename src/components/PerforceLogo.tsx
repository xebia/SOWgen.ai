interface PerforceLogoProps {
  size?: number
  className?: string
}

export function PerforceLogo({ size = 32, className = '' }: PerforceLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="256" height="256" fill="#404040" rx="24" />
      <path
        d="M128 40L200 88V168L128 216L56 168V88L128 40Z"
        fill="#00AEEF"
      />
      <path
        d="M128 80L168 104V152L128 176L88 152V104L128 80Z"
        fill="#FFFFFF"
      />
      <circle cx="128" cy="128" r="24" fill="#00AEEF" />
      <path
        d="M128 88L88 112V144L128 168V88Z"
        fill="#00AEEF"
        fillOpacity="0.6"
      />
    </svg>
  )
}
