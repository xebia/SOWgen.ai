interface AzureLogoProps {
  size?: number
  className?: string
}

export function AzureLogo({ size = 32, className = '' }: AzureLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="azureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0089D6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#50E6FF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="256" height="256" fill="#FFFFFF" rx="24" />
      <path
        d="M98.304 104.896L133.44 40H178.88L110.976 168.512H166.72L76.16 216L98.304 104.896Z"
        fill="url(#azureGrad)"
      />
    </svg>
  )
}
