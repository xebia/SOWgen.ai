import { ServicePlatform, ServiceActivity, PlatformService, ActivityType, ActivityStatus } from './types'

const activityTemplates: Record<ServicePlatform, Array<{ type: ActivityType; titleTemplate: string; descTemplate: string }>> = {
  github: [
    { type: 'commit', titleTemplate: 'Pushed 3 commits', descTemplate: 'to main branch in project-alpha' },
    { type: 'pr', titleTemplate: 'Merged Pull Request #142', descTemplate: 'Feature: Add authentication middleware' },
    { type: 'build', titleTemplate: 'Build Pipeline Completed', descTemplate: 'Deploy to production - v2.4.1' },
    { type: 'security', titleTemplate: 'Security scan completed', descTemplate: 'No vulnerabilities found' },
    { type: 'issue', titleTemplate: 'Issue #89 closed', descTemplate: 'Fixed login timeout bug' }
  ],
  gitlab: [
    { type: 'commit', titleTemplate: 'New commits pushed', descTemplate: 'to feature/payment-integration' },
    { type: 'pr', titleTemplate: 'Merge request !56 approved', descTemplate: 'Refactor database schema' },
    { type: 'build', titleTemplate: 'CI Pipeline passed', descTemplate: 'All tests successful in staging' },
    { type: 'deployment', titleTemplate: 'Deployed to staging', descTemplate: 'Release v1.8.3' }
  ],
  aws: [
    { type: 'deployment', titleTemplate: 'EC2 instance launched', descTemplate: 'i-0abc123 in us-east-1' },
    { type: 'infrastructure', titleTemplate: 'S3 bucket created', descTemplate: 'company-backups-prod' },
    { type: 'security', titleTemplate: 'IAM role updated', descTemplate: 'Added CloudWatch permissions' },
    { type: 'infrastructure', titleTemplate: 'Auto-scaling triggered', descTemplate: 'Scaled from 2 to 5 instances' },
    { type: 'deployment', titleTemplate: 'Lambda function updated', descTemplate: 'payment-processor v2.1' }
  ],
  azure: [
    { type: 'deployment', titleTemplate: 'App Service deployed', descTemplate: 'api-gateway to production slot' },
    { type: 'infrastructure', titleTemplate: 'Resource group created', descTemplate: 'rg-project-prod-eastus' },
    { type: 'security', titleTemplate: 'Key Vault access granted', descTemplate: 'New service principal added' },
    { type: 'deployment', titleTemplate: 'AKS cluster scaled', descTemplate: 'Node pool increased to 6 nodes' }
  ],
  gcp: [
    { type: 'deployment', titleTemplate: 'Cloud Run service deployed', descTemplate: 'api-service revision 42' },
    { type: 'infrastructure', titleTemplate: 'GKE cluster upgraded', descTemplate: 'Kubernetes v1.28.0' },
    { type: 'security', titleTemplate: 'IAM policy updated', descTemplate: 'Storage admin role assigned' },
    { type: 'build', titleTemplate: 'Cloud Build completed', descTemplate: 'frontend-app trigger successful' }
  ],
  kubernetes: [
    { type: 'deployment', titleTemplate: 'Deployment scaled', descTemplate: 'frontend-app: 3 → 6 replicas' },
    { type: 'deployment', titleTemplate: 'Pod restarted', descTemplate: 'backend-api-7d9f8b in namespace prod' },
    { type: 'infrastructure', titleTemplate: 'ConfigMap updated', descTemplate: 'app-config in production' },
    { type: 'security', titleTemplate: 'Network policy applied', descTemplate: 'Restricted ingress to prod namespace' }
  ],
  docker: [
    { type: 'build', titleTemplate: 'Image built', descTemplate: 'company/api:v2.4.1 pushed to registry' },
    { type: 'deployment', titleTemplate: 'Container started', descTemplate: 'postgres-primary on node-01' },
    { type: 'infrastructure', titleTemplate: 'Volume mounted', descTemplate: 'data-volume to app-server' },
    { type: 'security', titleTemplate: 'Image scanned', descTemplate: 'Vulnerability scan completed' }
  ],
  terraform: [
    { type: 'infrastructure', titleTemplate: 'Plan executed', descTemplate: '12 resources to be added' },
    { type: 'infrastructure', titleTemplate: 'Apply completed', descTemplate: 'Successfully created VPC and subnets' },
    { type: 'infrastructure', titleTemplate: 'State locked', descTemplate: 'by user@xebia.com' },
    { type: 'infrastructure', titleTemplate: 'Resource destroyed', descTemplate: 'Removed staging environment' }
  ]
}

const statusWeights: Record<ActivityStatus, number> = {
  success: 0.7,
  pending: 0.15,
  warning: 0.1,
  failed: 0.05
}

function getRandomStatus(): ActivityStatus {
  const random = Math.random()
  let cumulative = 0
  
  for (const [status, weight] of Object.entries(statusWeights)) {
    cumulative += weight
    if (random <= cumulative) {
      return status as ActivityStatus
    }
  }
  
  return 'success'
}

function getRandomUser(): string {
  const users = [
    'sarah.johnson',
    'mike.chen',
    'alex.rodriguez',
    'emily.watson',
    'david.kim',
    'lisa.anderson'
  ]
  return users[Math.floor(Math.random() * users.length)]
}

export function generateMockActivities(platform: ServicePlatform, count: number = 10): ServiceActivity[] {
  const templates = activityTemplates[platform]
  const activities: ServiceActivity[] = []
  
  for (let i = 0; i < count; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)]
    const timestamp = Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    
    activities.push({
      id: `${platform}-${i}-${Date.now()}`,
      platform,
      type: template.type,
      title: template.titleTemplate,
      description: template.descTemplate,
      status: getRandomStatus(),
      timestamp,
      user: getRandomUser()
    })
  }
  
  return activities.sort((a, b) => b.timestamp - a.timestamp)
}

export function generateAllPlatformActivities(countPerPlatform: number = 10): ServiceActivity[] {
  const platforms: ServicePlatform[] = ['github', 'gitlab', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform']
  const allActivities: ServiceActivity[] = []
  
  platforms.forEach(platform => {
    allActivities.push(...generateMockActivities(platform, countPerPlatform))
  })
  
  return allActivities.sort((a, b) => b.timestamp - a.timestamp)
}

export function getPlatformServices(): PlatformService[] {
  return [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Source control, CI/CD, and collaboration platform',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 15,
      activityCount: 142,
      healthStatus: 'healthy'
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'DevOps platform for the entire software lifecycle',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 45,
      activityCount: 89,
      healthStatus: 'healthy'
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'Cloud infrastructure and services',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 8,
      activityCount: 256,
      healthStatus: 'healthy'
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      description: 'Cloud computing platform and services',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 22,
      activityCount: 198,
      healthStatus: 'warning'
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      description: 'Suite of cloud computing services',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 120,
      activityCount: 134,
      healthStatus: 'healthy'
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      description: 'Container orchestration platform',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 5,
      activityCount: 312,
      healthStatus: 'healthy'
    },
    {
      id: 'docker',
      name: 'Docker',
      description: 'Container platform and registry',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 35,
      activityCount: 178,
      healthStatus: 'healthy'
    },
    {
      id: 'terraform',
      name: 'Terraform',
      description: 'Infrastructure as code platform',
      enabled: true,
      lastActivity: Date.now() - 1000 * 60 * 90,
      activityCount: 67,
      healthStatus: 'healthy'
    }
  ]
}
