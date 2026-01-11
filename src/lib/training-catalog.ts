import { TrainingModule } from './types'

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'github-beginner-1',
    track: 'github',
    level: 'beginner',
    title: 'GitHub Fundamentals',
    description: 'Introduction to version control, repositories, commits, and basic workflows',
    durationHours: 4,
    agenda: [
      'Introduction to Git and GitHub',
      'Creating repositories and commits',
      'Basic branching strategies',
      'Pull requests and code review basics',
      'GitHub interface overview'
    ]
  },
  {
    id: 'github-intermediate-1',
    track: 'github',
    level: 'intermediate',
    title: 'Advanced Git Workflows',
    description: 'Branching strategies, code review processes, and team collaboration',
    durationHours: 6,
    agenda: [
      'Advanced branching strategies (GitFlow, trunk-based)',
      'Code review best practices',
      'Conflict resolution techniques',
      'GitHub Projects and issue tracking',
      'Team collaboration workflows'
    ]
  },
  {
    id: 'github-advanced-1',
    track: 'github',
    level: 'advanced',
    title: 'GitHub Enterprise & Copilot',
    description: 'Enterprise features, GitHub Copilot integration, and advanced automation',
    durationHours: 8,
    agenda: [
      'GitHub Enterprise administration',
      'GitHub Copilot deep-dive',
      'Advanced Actions workflows',
      'Security scanning and compliance',
      'Enterprise-scale repository management'
    ]
  },
  {
    id: 'github-actions-beginner',
    track: 'github',
    level: 'beginner',
    title: 'GitHub Actions Basics',
    description: 'Introduction to CI/CD with GitHub Actions',
    durationHours: 4,
    agenda: [
      'Understanding CI/CD concepts',
      'Creating your first workflow',
      'Working with actions marketplace',
      'Basic testing and deployment',
      'Workflow triggers and events'
    ]
  },
  {
    id: 'github-actions-advanced',
    track: 'github',
    level: 'advanced',
    title: 'Advanced GitHub Actions',
    description: 'Complex workflows, custom actions, and multi-cloud deployments',
    durationHours: 8,
    agenda: [
      'Creating custom actions',
      'Matrix strategies and reusable workflows',
      'Multi-cloud deployment strategies',
      'Secrets management and security',
      'Monitoring and optimization'
    ]
  },
  {
    id: 'ghas-intermediate',
    track: 'github',
    level: 'intermediate',
    title: 'GitHub Advanced Security (GHAS)',
    description: 'Security scanning, dependency management, and vulnerability detection',
    durationHours: 6,
    agenda: [
      'Code scanning setup',
      'Secret scanning configuration',
      'Dependabot alerts and updates',
      'Security policies and compliance',
      'Vulnerability remediation workflows'
    ]
  },
  {
    id: 'gitlab-beginner-1',
    track: 'gitlab',
    level: 'beginner',
    title: 'GitLab Fundamentals',
    description: 'Introduction to version control, GitLab interface, and basic workflows',
    durationHours: 4,
    agenda: [
      'Introduction to Git and GitLab',
      'Creating projects and commits',
      'Basic branching strategies',
      'Merge requests and code review basics',
      'GitLab interface overview'
    ]
  },
  {
    id: 'gitlab-intermediate-1',
    track: 'gitlab',
    level: 'intermediate',
    title: 'Advanced GitLab Workflows',
    description: 'Branching strategies, code review processes, and team collaboration',
    durationHours: 6,
    agenda: [
      'Advanced branching strategies',
      'Code review best practices',
      'Conflict resolution techniques',
      'GitLab Issues and project management',
      'Team collaboration workflows'
    ]
  },
  {
    id: 'gitlab-ci-beginner',
    track: 'gitlab',
    level: 'beginner',
    title: 'GitLab CI/CD Basics',
    description: 'Introduction to CI/CD with GitLab pipelines',
    durationHours: 4,
    agenda: [
      'Understanding CI/CD concepts',
      'Creating your first pipeline',
      'Working with .gitlab-ci.yml',
      'Basic testing and deployment',
      'Pipeline triggers and schedules'
    ]
  },
  {
    id: 'gitlab-ci-advanced',
    track: 'gitlab',
    level: 'advanced',
    title: 'Advanced GitLab CI/CD',
    description: 'Complex pipelines, Auto DevOps, and multi-environment deployments',
    durationHours: 8,
    agenda: [
      'Advanced pipeline configurations',
      'Auto DevOps and templates',
      'Multi-environment deployment strategies',
      'Docker and Kubernetes integration',
      'Pipeline optimization and best practices'
    ]
  },
  {
    id: 'gitlab-security-intermediate',
    track: 'gitlab',
    level: 'intermediate',
    title: 'GitLab Security & Compliance',
    description: 'Security scanning, dependency management, and compliance features',
    durationHours: 6,
    agenda: [
      'SAST and DAST configuration',
      'Dependency scanning setup',
      'Container scanning',
      'Security policies and compliance',
      'Vulnerability management'
    ]
  },
  {
    id: 'gitlab-advanced-1',
    track: 'gitlab',
    level: 'advanced',
    title: 'GitLab Enterprise Administration',
    description: 'Enterprise features, administration, and advanced automation',
    durationHours: 8,
    agenda: [
      'GitLab instance administration',
      'User and group management',
      'Advanced runner configuration',
      'Geo replication and disaster recovery',
      'Enterprise-scale project management'
    ]
  },
  {
    id: 'azure-beginner-1',
    track: 'azure',
    level: 'beginner',
    title: 'Azure DevOps Fundamentals',
    description: 'Introduction to Azure portal, services, and basic DevOps concepts',
    durationHours: 4,
    agenda: [
      'Azure portal navigation',
      'Core Azure services overview',
      'Resource groups and management',
      'Azure DevOps introduction',
      'Basic pipeline creation'
    ]
  },
  {
    id: 'azure-intermediate-1',
    track: 'azure',
    level: 'intermediate',
    title: 'Azure DevOps Integration',
    description: 'Integrating Azure services with GitHub and deployment strategies',
    durationHours: 6,
    agenda: [
      'Azure-GitHub integration',
      'Azure Pipelines vs GitHub Actions',
      'Azure App Service deployments',
      'Azure Container Registry',
      'Monitoring and diagnostics'
    ]
  },
  {
    id: 'azure-advanced-1',
    track: 'azure',
    level: 'advanced',
    title: 'Azure Multi-Cloud Strategy',
    description: 'Enterprise Azure architecture, security, and multi-cloud patterns',
    durationHours: 8,
    agenda: [
      'Azure landing zones',
      'Multi-cloud architecture patterns',
      'Azure security best practices',
      'Cost optimization strategies',
      'Disaster recovery and high availability'
    ]
  },
  {
    id: 'gcp-beginner-1',
    track: 'gcp',
    level: 'beginner',
    title: 'Google Cloud Platform Basics',
    description: 'Introduction to GCP console, core services, and resource management',
    durationHours: 4,
    agenda: [
      'GCP console navigation',
      'Core GCP services overview',
      'IAM basics',
      'Project and billing setup',
      'Compute Engine fundamentals'
    ]
  },
  {
    id: 'gcp-intermediate-1',
    track: 'gcp',
    level: 'intermediate',
    title: 'GCP DevOps & Automation',
    description: 'Cloud Build, deployment strategies, and infrastructure automation',
    durationHours: 6,
    agenda: [
      'Cloud Build integration',
      'GKE deployment strategies',
      'Infrastructure as Code with Terraform',
      'Cloud Functions and serverless',
      'Monitoring with Cloud Operations'
    ]
  },
  {
    id: 'gcp-advanced-1',
    track: 'gcp',
    level: 'advanced',
    title: 'Advanced GCP Networking',
    description: 'Enterprise networking, security, and advanced automation',
    durationHours: 8,
    agenda: [
      'VPC design and configuration',
      'Cloud Load Balancing strategies',
      'Security and compliance',
      'Multi-region deployments',
      'Advanced automation patterns'
    ]
  },
  {
    id: 'aws-beginner-1',
    track: 'aws',
    level: 'beginner',
    title: 'AWS Fundamentals',
    description: 'Introduction to AWS console, core services, and basic deployment',
    durationHours: 4,
    agenda: [
      'AWS console basics',
      'EC2 and compute services',
      'S3 and storage fundamentals',
      'IAM and access management',
      'Basic networking concepts'
    ]
  },
  {
    id: 'aws-intermediate-1',
    track: 'aws',
    level: 'intermediate',
    title: 'AWS CI/CD with GitHub',
    description: 'Deployment automation, CodePipeline, and GitHub integration',
    durationHours: 6,
    agenda: [
      'AWS CodePipeline and CodeBuild',
      'GitHub Actions to AWS',
      'ECS and containerized deployments',
      'Lambda and serverless applications',
      'CloudFormation basics'
    ]
  },
  {
    id: 'aws-advanced-1',
    track: 'aws',
    level: 'advanced',
    title: 'AWS Security & DevOps',
    description: 'Advanced security practices, automation, and enterprise patterns',
    durationHours: 8,
    agenda: [
      'AWS Well-Architected Framework',
      'Advanced security patterns',
      'Multi-account strategies',
      'Cost optimization and governance',
      'Enterprise CI/CD at scale'
    ]
  },
  {
    id: 'ai-beginner-1',
    track: 'ai-sap',
    level: 'beginner',
    title: 'AI in DevOps Workflows',
    description: 'Introduction to AI-assisted development and automation',
    durationHours: 4,
    agenda: [
      'AI tools overview',
      'GitHub Copilot fundamentals',
      'AI-assisted code review',
      'Automated testing with AI',
      'Best practices and limitations'
    ]
  },
  {
    id: 'ai-intermediate-1',
    track: 'ai-sap',
    level: 'intermediate',
    title: 'SAP Integration with GitHub',
    description: 'SAP system integration, deployment strategies, and automation',
    durationHours: 6,
    agenda: [
      'SAP system overview',
      'GitHub integration patterns',
      'SAP deployment automation',
      'Testing SAP applications',
      'Monitoring and observability'
    ]
  },
  {
    id: 'ai-advanced-1',
    track: 'ai-sap',
    level: 'advanced',
    title: 'AI Operations & SAP Automation',
    description: 'Advanced AI operations, MLOps, and enterprise SAP automation',
    durationHours: 8,
    agenda: [
      'MLOps fundamentals',
      'AI model deployment pipelines',
      'Enterprise SAP automation strategies',
      'Intelligent monitoring and alerting',
      'AI-driven optimization'
    ]
  }
]

export const getModulesByTrack = (track: string) => {
  return TRAINING_MODULES.filter(m => m.track === track)
}

export const getModulesByLevel = (level: string) => {
  return TRAINING_MODULES.filter(m => m.level === level)
}

export const getModuleById = (id: string) => {
  return TRAINING_MODULES.find(m => m.id === id)
}
