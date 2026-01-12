import xebiaLogo from '@/assets/images/xebia-logo-png.webp'

interface XebiaLogoProps {
  size?: number
  className?: string
  embedded?: boolean
}

export function XebiaLogo({ size = 40, className = '', embedded = false }: XebiaLogoProps) {
  if (embedded) {
    return (
      <div 
        className={`relative ${className}`.trim()}
        style={{ 
          width: size, 
          height: 'auto',
          filter: 'contrast(1.25) saturate(1.2)',
        }}
      >
        <img 
          src={xebiaLogo} 
          alt="Xebia" 
          width={size} 
          height={size}
          className="mix-blend-darken opacity-95"
          style={{ width: size, height: 'auto' }}
        />
      </div>
    )
  }
  
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

export function XebiaLogoMark({ className = '', embedded = false }: { className?: string, embedded?: boolean }) {
  if (embedded) {
    return (
      <div 
        className={`relative ${className}`.trim()}
        style={{ 
          filter: 'contrast(1.25) saturate(1.2)',
        }}
      >
        <img 
          src={xebiaLogo} 
          alt="Xebia" 
          className="mix-blend-darken opacity-95"
        />
      </div>
    )
  }
  
  return (
    <img 
      src={xebiaLogo} 
      alt="Xebia" 
      className={className}
    />
  )
}
