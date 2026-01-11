export type UserRole = 'client' | 'xebia-admin' | 'approver'

export type SOWStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'changes-requested'

export type MigrationStage = 
  | 'initial-setup'
  | 'repository-migration'
  | 'cicd-migration'
  | 'cicd-implementation'
  | 'training-sessions'

export type TrainingTrack = 'github' | 'azure' | 'gcp' | 'aws' | 'ai-sap'

export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organization?: string
  avatarUrl?: string
}

export interface MigrationStageDetail {
  stage: MigrationStage
  description: string
  technicalDetails: string
  timelineWeeks: number
  automated: boolean
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
