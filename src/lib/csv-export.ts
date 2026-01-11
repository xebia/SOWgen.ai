import { SOW } from './types'
import { getModuleById } from './training-catalog'

export function exportSOWsToCSV(sows: SOW[], filename: string = 'sows-export.csv') {
  const headerInfo = [
    'Xebia SOWGen Platform - Statement of Work Export',
    `Generated on: ${new Date().toLocaleString()}`,
    '© 2026 Xebia. All rights reserved.',
    '',
    ''
  ]

  const headers = [
    'SOW ID',
    'Project Name',
    'Project Description',
    'Client Name',
    'Organization',
    'Status',
    'Created Date',
    'Submitted Date',
    'Approved Date',
    'Days to Approval',
    'Migration Included',
    'Migration Stages',
    'GitHub Migration Type',
    'Total Repositories',
    'Public Repos',
    'Private Repos',
    'Total Size (GB)',
    'Users to Migrate',
    'Estimated Man Hours',
    'Has Git LFS',
    'Has Submodules',
    'CI/CD Migration',
    'CI/CD Platform',
    'Training Included',
    'Training Modules',
    'Total Participants',
    'Total Training Hours',
    'Estimated Value',
    'Estimated Duration (weeks)',
    'Number of Approval Comments',
    'Last Updated Date',
    'Approval Comments'
  ]

  const rows = sows.map(sow => {
    const migrationStage = sow.migrationStages.find(s => s.stage === 'repository-migration')
    const cicdStage = sow.migrationStages.find(s => s.stage === 'cicd-migration')
    
    const trainingModules = sow.selectedTrainings
      .map(st => {
        const module = getModuleById(st.moduleId)
        return module ? `${module.title} (${st.participantCount} participants)` : ''
      })
      .filter(Boolean)
      .join('; ')
    
    const totalParticipants = sow.selectedTrainings.reduce((sum, st) => sum + st.participantCount, 0)
    
    const totalTrainingHours = sow.selectedTrainings.reduce((sum, st) => {
      const module = getModuleById(st.moduleId)
      return sum + (module ? module.durationHours : 0)
    }, 0)
    
    const approvalComments = sow.approvalHistory
      .map(h => `[${new Date(h.timestamp).toLocaleDateString()} - ${h.approverName}] ${h.comment}`)
      .join(' | ')
    
    const daysToApproval = (sow.submittedAt && sow.approvedAt) 
      ? Math.round((sow.approvedAt - sow.submittedAt) / (1000 * 60 * 60 * 24))
      : ''

    const totalEstimatedWeeks = sow.migrationStages.reduce((sum, stage) => sum + stage.timelineWeeks, 0)

    return [
      sow.id,
      sow.projectName,
      sow.projectDescription || '',
      sow.clientName,
      sow.clientOrganization,
      sow.status,
      new Date(sow.createdAt).toLocaleDateString(),
      sow.submittedAt ? new Date(sow.submittedAt).toLocaleDateString() : '',
      sow.approvedAt ? new Date(sow.approvedAt).toLocaleDateString() : '',
      daysToApproval,
      sow.includeMigration ? 'Yes' : 'No',
      sow.migrationStages.map(s => s.stage.replace(/-/g, ' ')).join(', '),
      migrationStage?.githubMigrationType?.replace(/-/g, ' ').toUpperCase() || '',
      migrationStage?.repositoryInventory?.totalRepositories || '',
      migrationStage?.repositoryInventory?.publicRepos || '',
      migrationStage?.repositoryInventory?.privateRepos || '',
      migrationStage?.repositoryInventory?.totalSizeGB || '',
      migrationStage?.repositoryInventory?.usersToMigrate || '',
      migrationStage?.estimatedManHours || '',
      migrationStage?.repositoryInventory?.hasLFS ? 'Yes' : 'No',
      migrationStage?.repositoryInventory?.hasSubmodules ? 'Yes' : 'No',
      cicdStage?.includeCICDMigration ? 'Yes' : 'No',
      cicdStage?.cicdPlatform || '',
      sow.includeTraining ? 'Yes' : 'No',
      trainingModules,
      totalParticipants,
      totalTrainingHours,
      sow.estimatedValue || '',
      totalEstimatedWeeks || sow.estimatedDuration || '',
      sow.approvalHistory.length,
      new Date(sow.updatedAt).toLocaleDateString(),
      approvalComments
    ]
  })

  const csvContent = [
    ...headerInfo,
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
