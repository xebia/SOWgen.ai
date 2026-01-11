interface MercurialLogoProps {
  size?: number
  className?: string
}

export function MercurialLogo({ size = 32, className = '' }: MercurialLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="256" height="256" fill="#999999" rx="24" />
      <circle cx="128" cy="128" r="88" fill="#FFFFFF" />
      <path
        d="M128 60C89.34 60 58 91.34 58 130C58 168.66 89.34 200 128 200C166.66 200 198 168.66 198 130"
        stroke="#666666"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="128" cy="130" r="40" fill="#999999" />
      <path
        d="M108 100L128 60L148 100"
        stroke="#666666"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="128" cy="130" r="20" fill="#FFFFFF" />
    </svg>
  )
}
