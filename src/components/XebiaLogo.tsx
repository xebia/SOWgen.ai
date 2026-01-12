import xebiaLogoSvg from '@/assets/images/xebia-logo-redesign.svg'

interface XebiaLogoProps {
  size?: number
  className?: string
  embedded?: boolean
}

// Shared embedded logo wrapper component with soft lighting effect
const EmbeddedLogoWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div 
    className={`relative ${className}`.trim()}
    style={{ 
      filter: 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.15))',
    }}
  >
    {children}
  </div>
)

export function XebiaLogo({ size = 40, className = '', embedded = false }: XebiaLogoProps) {
  const logoImg = (
    <img 
      src={xebiaLogoSvg} 
      alt="Xebia" 
      width={size}
      className={embedded ? 'transition-all duration-300' : className}
      style={{ width: size, height: 'auto' }}
    />
  )
  
  if (embedded) {
    return <EmbeddedLogoWrapper className={className}>{logoImg}</EmbeddedLogoWrapper>
  }
  
  return logoImg
}

export function XebiaLogoMark({ className = '', embedded = false }: { className?: string, embedded?: boolean }) {
  const logoImg = (
    <img 
      src={xebiaLogoSvg} 
      alt="Xebia" 
      width={120}
      className={embedded ? 'transition-all duration-300' : className}
      style={{ width: 120, height: 'auto' }}
    />
  )
  
  if (embedded) {
    return <EmbeddedLogoWrapper className={className}>{logoImg}</EmbeddedLogoWrapper>
  }
  
  return logoImg
}
