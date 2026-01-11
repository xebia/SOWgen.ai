import { SOW } from './types'
import { getModuleById } from './training-catalog'

export function exportSOWsToCSV(sows: SOW[], filename: string = 'sows-export.csv') {
  const headers = [
    'SOW ID',
    'Project Name',
    'Client Name',
    'Organization',
    'Status',
    'Created Date',
    'Submitted Date',
    'Approved Date',
    'Migration Included',
    'Migration Stages',
    'GitHub Migration Type',
    'Total Repositories',
    'Estimated Man Hours',
    'CI/CD Migration',
    'Training Included',
    'Training Modules',
    'Total Participants',
    'Approval Comments'
  ]

  const rows = sows.map(sow => {
    const migrationStage = sow.migrationStages.find(s => s.stage === 'repository-migration')
    const cicdStage = sow.migrationStages.find(s => s.stage === 'cicd-migration')
    
    const trainingModules = sow.selectedTrainings
      .map(st => {
        const module = getModuleById(st.moduleId)
        return module ? `${module.title} (${st.participantCount})` : ''
      })
      .filter(Boolean)
      .join('; ')
    
    const totalParticipants = sow.selectedTrainings.reduce((sum, st) => sum + st.participantCount, 0)
    
    const approvalComments = sow.approvalHistory
      .map(h => `[${h.approverName}] ${h.comment}`)
      .join('; ')

    return [
      sow.id,
      sow.projectName,
      sow.clientName,
      sow.clientOrganization,
      sow.status,
      new Date(sow.createdAt).toLocaleDateString(),
      sow.submittedAt ? new Date(sow.submittedAt).toLocaleDateString() : '',
      sow.approvedAt ? new Date(sow.approvedAt).toLocaleDateString() : '',
      sow.includeMigration ? 'Yes' : 'No',
      sow.migrationStages.map(s => s.stage.replace(/-/g, ' ')).join(', '),
      migrationStage?.githubMigrationType || '',
      migrationStage?.repositoryInventory?.totalRepositories || '',
      migrationStage?.estimatedManHours || '',
      cicdStage?.includeCICDMigration ? 'Yes' : 'No',
      sow.includeTraining ? 'Yes' : 'No',
      trainingModules,
      totalParticipants,
      approvalComments
    ]
  })

  const csvContent = [
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
