import githubLogoImg from '@/assets/images/github-logo-png_seeklogo-304612.png'

interface GitHubLogoProps {
  size?: number
  className?: string
}

export function GitHubLogo({ size = 32, className = '' }: GitHubLogoProps) {
  return (
    <img 
      src={githubLogoImg} 
      alt="GitHub" 
      width={size} 
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  )
}
