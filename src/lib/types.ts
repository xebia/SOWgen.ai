export type UserRole = 'client' | 'xebia-admin' | 'approver'

export type SOWStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'changes-requested'

export type MigrationStage = 
  | 'initial-setup'
  | 'repository-migration'
  | 'cicd-migration'
  | 'cicd-implementation'
  | 'training-sessions'

export type GitHubMigrationType = 'github-classic' | 'github-emu' | 'ghes'

export type TrainingTrack = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops' | 'tfs' | 'azure' | 'gcp' | 'aws' | 'ai-sap'

export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organization?: string
  avatarUrl?: string
}

export interface RepositoryInventory {
  totalRepositories: number
  publicRepos: number
  privateRepos: number
  archivedRepos: number
  totalSizeGB: number
  languages: string[]
  hasLFS: boolean
  hasSubmodules: boolean
  averageRepoSizeMB: number
  usersToMigrate?: number
}

export interface MigrationStageDetail {
  stage: MigrationStage
  description: string
  technicalDetails: string
  timelineWeeks: number
  automated: boolean
  githubMigrationType?: GitHubMigrationType
  repositoryInventory?: RepositoryInventory
  estimatedManHours?: number
  includeCICDMigration?: boolean
  cicdPlatform?: string
  cicdDetails?: string
}

export interface TrainingModule {
  id: string
  track: TrainingTrack
  level: TrainingLevel
  title: string
  description: string
  durationHours: number
  agenda: string[]
}

export interface SelectedTraining {
  moduleId: string
  participantCount: number
}

export interface ApprovalComment {
  id: string
  approverId: string
  approverName: string
  comment: string
  timestamp: number
  action: 'comment' | 'approved' | 'rejected' | 'changes-requested'
}

export interface SOW {
  id: string
  clientId: string
  clientName: string
  clientOrganization: string
  projectName: string
  projectDescription: string
  status: SOWStatus
  createdAt: number
  updatedAt: number
  submittedAt?: number
  approvedAt?: number
  
  includeMigration: boolean
  migrationStages: MigrationStageDetail[]
  
  includeTraining: boolean
  selectedTrainings: SelectedTraining[]
  
  approvalHistory: ApprovalComment[]
  currentApproverId?: string
  
  estimatedValue?: number
  estimatedDuration?: number
}

export interface DashboardStats {
  totalSOWs: number
  approvedSOWs: number
  pendingSOWs: number
  rejectedSOWs: number
  approvalRate: number
  avgApprovalTimeDays: number
}

export type ServicePlatform = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops' | 'tfs' | 'svn' | 'perforce' | 'mercurial' | 'aws' | 'gcp' | 'azure' | 'terraform'

export type ActivityType = 'deployment' | 'commit' | 'pr' | 'issue' | 'build' | 'security' | 'infrastructure' | 'access'

export type ActivityStatus = 'success' | 'failed' | 'pending' | 'warning'

export interface ServiceActivity {
  id: string
  platform: ServicePlatform
  type: ActivityType
  title: string
  description: string
  status: ActivityStatus
  timestamp: number
  user?: string
  metadata?: Record<string, any>
}

export interface PlatformService {
  id: ServicePlatform
  name: string
  description: string
  enabled: boolean
  lastActivity?: number
  activityCount: number
  healthStatus: 'healthy' | 'warning' | 'error' | 'unknown'
}
