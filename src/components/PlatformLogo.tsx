import { ServicePlatform } from '@/lib/types'
import githubLogo from '@/assets/images/github-logo-png_seeklogo-304612.png'
import gitlabLogo from '@/assets/images/gitlab.png'
import bitbucketLogo from '@/assets/images/Bitbucket.jpg'
import azureDevOpsLogo from '@/assets/images/Azure.png'
import awsLogo from '@/assets/images/Amazon-Web-Services-AWS-Logo.png'
import gcpLogo from '@/assets/images/GCP.png'
import svnLogo from '@/assets/images/svn.jpg'
import terraformLogo from '@/assets/images/terraform.png'
import tfsImageLogo from '@/assets/images/tfs.jpg'
import perforceImageLogo from '@/assets/images/Perforce.png'
import azureImageLogo from '@/assets/images/Microsoft_Azure.svg.png'
import { TfsLogo } from './TfsLogo'
import { PerforceLogo } from './PerforceLogo'
import { MercurialLogo } from './MercurialLogo'
import { AzureLogo } from './AzureLogo'

interface PlatformLogoProps {
  platform: ServicePlatform
  size?: number
  className?: string
}

const platformLogos: Record<ServicePlatform, string | null> = {
  github: githubLogo,
  gitlab: gitlabLogo,
  bitbucket: bitbucketLogo,
  'azure-devops': azureDevOpsLogo,
  tfs: tfsImageLogo,
  svn: svnLogo,
  perforce: perforceImageLogo,
  mercurial: null,
  aws: awsLogo,
  gcp: gcpLogo,
  azure: azureImageLogo,
  terraform: terraformLogo
}

const platformNames: Record<ServicePlatform, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  bitbucket: 'Bitbucket',
  'azure-devops': 'Azure DevOps',
  tfs: 'Team Foundation Server',
  svn: 'Subversion',
  perforce: 'Perforce Helix Core',
  mercurial: 'Mercurial',
  aws: 'AWS',
  gcp: 'Google Cloud Platform',
  azure: 'Microsoft Azure',
  terraform: 'Terraform'
}

export function PlatformLogo({ platform, size = 32, className = '' }: PlatformLogoProps) {
  const logoSrc = platformLogos[platform]
  const altText = platformNames[platform]

  if (platform === 'mercurial') {
    return <MercurialLogo size={size} className={className} />
  }

  if (!logoSrc) {
    return <div className={`${className} flex items-center justify-center bg-muted rounded`} style={{ width: size, height: size }}>
      <span className="text-xs font-bold text-muted-foreground">{platform.slice(0, 2).toUpperCase()}</span>
    </div>
  }

  return (
    <img
      src={logoSrc}
      alt={altText}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
