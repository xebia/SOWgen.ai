import xebiaLogo from '@/assets/images/xebia-logo-png.webp'

interface XebiaLogoProps {
  size?: number
  className?: string
  embedded?: boolean
}

// Shared embedded logo wrapper component
const EmbeddedLogoWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div 
    className={`relative ${className}`.trim()}
    style={{ 
      filter: 'contrast(1.35) saturate(1.3) brightness(0.97)',
    }}
  >
    {children}
  </div>
)

export function XebiaLogo({ size = 40, className = '', embedded = false }: XebiaLogoProps) {
  const logoImg = (
    <img 
      src={xebiaLogo} 
      alt="Xebia" 
      width={size}
      className={embedded ? 'mix-blend-multiply opacity-[0.88]' : className}
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
      src={xebiaLogo} 
      alt="Xebia" 
      className={embedded ? 'mix-blend-multiply opacity-[0.88]' : className}
    />
  )
  
  if (embedded) {
    return <EmbeddedLogoWrapper className={className}>{logoImg}</EmbeddedLogoWrapper>
  }
  
  return logoImg
}
