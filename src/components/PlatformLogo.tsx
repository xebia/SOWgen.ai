import { ServicePlatform } from '@/lib/types'
import githubLogo from '@/assets/images/github-logo-png_seeklogo-304612.png'
import gitlabLogo from '@/assets/images/gitlab.png'
import bitbucketLogo from '@/assets/images/Bitbucket.jpg'
import azureLogo from '@/assets/images/Azure.png'
import awsLogo from '@/assets/images/Amazon-Web-Services-AWS-Logo.png'
import gcpLogo from '@/assets/images/GCP.png'
import svnLogo from '@/assets/images/svn.jpg'
import terraformLogo from '@/assets/images/terraform.png'

interface PlatformLogoProps {
  platform: ServicePlatform
  size?: number
  className?: string
}

const platformLogos: Record<ServicePlatform, string> = {
  github: githubLogo,
  gitlab: gitlabLogo,
  bitbucket: bitbucketLogo,
  'azure-devops': azureLogo,
  tfs: azureLogo,
  svn: svnLogo,
  perforce: svnLogo,
  mercurial: svnLogo,
  aws: awsLogo,
  gcp: gcpLogo,
  azure: azureLogo,
  terraform: terraformLogo
}

const platformNames: Record<ServicePlatform, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  bitbucket: 'Bitbucket',
  'azure-devops': 'Azure DevOps',
  tfs: 'Team Foundation Server',
  svn: 'Subversion',
  perforce: 'Perforce',
  mercurial: 'Mercurial',
  aws: 'AWS',
  gcp: 'Google Cloud Platform',
  azure: 'Microsoft Azure',
  terraform: 'Terraform'
}

export function PlatformLogo({ platform, size = 32, className = '' }: PlatformLogoProps) {
  const logoSrc = platformLogos[platform]
  const altText = platformNames[platform]

  return (
    <img
      src={logoSrc}
      alt={altText}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
