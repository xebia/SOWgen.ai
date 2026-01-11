import xebiaLogo from '@/assets/images/xebia-logo-png.webp'

interface XebiaLogoProps {
  size?: number
  className?: string
}

export function XebiaLogo({ size = 40, className = '' }: XebiaLogoProps) {
  return (
    <img 
      src={xebiaLogo} 
      alt="Xebia" 
      width={size} 
      height={size}
      className={className}
      style={{ width: size, height: 'auto' }}
    />
  )
}

export function XebiaLogoMark({ className = '' }: { className?: string }) {
  return (
    <img 
      src={xebiaLogo} 
      alt="Xebia" 
      className={className}
    />
  )
}
