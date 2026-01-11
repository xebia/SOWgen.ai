interface TfsLogoProps {
  size?: number
  className?: string
}

export function TfsLogo({ size = 32, className = '' }: TfsLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="256" height="256" fill="#68217A" rx="24" />
      <path
        d="M128 48L60 88V168L128 208L196 168V88L128 48Z"
        fill="#FFFFFF"
        fillOpacity="0.9"
      />
      <path
        d="M128 88L92 108V148L128 168L164 148V108L128 88Z"
        fill="#68217A"
      />
      <path
        d="M108 118H148V138H108V118Z"
        fill="#FFFFFF"
      />
      <path
        d="M118 108H138V148H118V108Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}
