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
  bitbucket: [
    { type: 'commit', titleTemplate: 'Commits pushed', descTemplate: 'to develop branch in payment-service' },
    { type: 'pr', titleTemplate: 'Pull request #34 merged', descTemplate: 'Update API authentication flow' },
    { type: 'build', titleTemplate: 'Pipeline successful', descTemplate: 'Build and deploy completed' },
    { type: 'deployment', titleTemplate: 'Deployed to production', descTemplate: 'Release v2.1.0' }
  ],
  'azure-devops': [
    { type: 'commit', titleTemplate: 'Commits pushed', descTemplate: 'to main branch in project-backend' },
    { type: 'pr', titleTemplate: 'Pull request completed', descTemplate: 'Implement user authentication service' },
    { type: 'build', titleTemplate: 'Pipeline succeeded', descTemplate: 'Build and test completed successfully' },
    { type: 'deployment', titleTemplate: 'Release deployed', descTemplate: 'Release v3.2.1 to production' }
  ],
  svn: [
    { type: 'commit', titleTemplate: 'Commits checked in', descTemplate: 'to trunk in project-core' },
    { type: 'commit', titleTemplate: 'Branch created', descTemplate: 'Created release branch for v2.0' },
    { type: 'commit', titleTemplate: 'Tag created', descTemplate: 'Tagged stable release v1.9.5' },
    { type: 'build', titleTemplate: 'Build completed', descTemplate: 'Automated build successful' }
  ],
  aws: [
    { type: 'infrastructure', titleTemplate: 'EC2 instances scaled', descTemplate: 'Auto-scaling group adjusted capacity' },
    { type: 'deployment', titleTemplate: 'Lambda function deployed', descTemplate: 'Updated payment-processor function' },
    { type: 'security', titleTemplate: 'IAM policy updated', descTemplate: 'Enhanced security permissions' },
    { type: 'build', titleTemplate: 'CloudFormation stack updated', descTemplate: 'Infrastructure changes applied' }
  ],
  gcp: [
    { type: 'infrastructure', titleTemplate: 'GKE cluster updated', descTemplate: 'Kubernetes cluster scaled to 5 nodes' },
    { type: 'deployment', titleTemplate: 'Cloud Function deployed', descTemplate: 'Updated data-processor function' },
    { type: 'security', titleTemplate: 'IAM binding updated', descTemplate: 'Service account permissions modified' },
    { type: 'build', titleTemplate: 'Cloud Build completed', descTemplate: 'Container images built successfully' }
  ],
  azure: [
    { type: 'infrastructure', titleTemplate: 'VM scale set updated', descTemplate: 'Scaled to 8 instances' },
    { type: 'deployment', titleTemplate: 'App Service deployed', descTemplate: 'Web app v2.3.0 deployed' },
    { type: 'security', titleTemplate: 'Key Vault updated', descTemplate: 'Secrets rotation completed' },
    { type: 'build', titleTemplate: 'ARM template deployed', descTemplate: 'Infrastructure provisioned successfully' }
  ],
  terraform: [
    { type: 'infrastructure', titleTemplate: 'Terraform apply completed', descTemplate: '15 resources created' },
    { type: 'deployment', titleTemplate: 'State updated', descTemplate: 'Remote backend synchronized' },
    { type: 'security', titleTemplate: 'Plan validated', descTemplate: 'No security issues detected' },
    { type: 'build', titleTemplate: 'Modules updated', descTemplate: 'Infrastructure modules v3.1.0' }
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
  const platforms: ServicePlatform[] = ['github', 'gitlab', 'bitbucket', 'azure-devops', 'svn', 'aws', 'gcp', 'azure', 'terraform']
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
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'DevOps platform for the entire software lifecycle',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'bitbucket',
      name: 'Bitbucket',
      description: 'Git repository management and CI/CD with Pipelines',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'azure-devops',
      name: 'Azure DevOps',
      description: 'DevOps services for version control and CI/CD',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'svn',
      name: 'Subversion (SVN)',
      description: 'Centralized version control system for source code',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'Cloud computing and infrastructure services',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      description: 'Cloud services for computing, storage, and AI',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      description: 'Enterprise cloud platform and services',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    },
    {
      id: 'terraform',
      name: 'Terraform',
      description: 'Infrastructure as Code for multi-cloud provisioning',
      enabled: true,
      activityCount: 0,
      healthStatus: 'healthy'
    }
  ]
}
