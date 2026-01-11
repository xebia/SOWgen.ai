import { SOW, SOWRevision } from './types'

export function createSOWRevision(
  oldSOW: SOW | null,
  newSOW: SOW,
  changedBy: string,
  changedByName: string,
  changeDescription: string
): SOWRevision {
  const changes: SOWRevision['changes'] = []

  if (oldSOW) {
    if (oldSOW.projectName !== newSOW.projectName) {
      changes.push({
        field: 'Project Name',
        oldValue: oldSOW.projectName,
        newValue: newSOW.projectName
      })
    }

    if (oldSOW.projectDescription !== newSOW.projectDescription) {
      changes.push({
        field: 'Project Description',
        oldValue: oldSOW.projectDescription,
        newValue: newSOW.projectDescription
      })
    }

    if (oldSOW.status !== newSOW.status) {
      changes.push({
        field: 'Status',
        oldValue: oldSOW.status,
        newValue: newSOW.status
      })
    }

    if (oldSOW.includeMigration !== newSOW.includeMigration) {
      changes.push({
        field: 'Include Migration',
        oldValue: oldSOW.includeMigration ? 'Yes' : 'No',
        newValue: newSOW.includeMigration ? 'Yes' : 'No'
      })
    }

    if (oldSOW.includeTraining !== newSOW.includeTraining) {
      changes.push({
        field: 'Include Training',
        oldValue: oldSOW.includeTraining ? 'Yes' : 'No',
        newValue: newSOW.includeTraining ? 'Yes' : 'No'
      })
    }

    if (JSON.stringify(oldSOW.migrationStages) !== JSON.stringify(newSOW.migrationStages)) {
      changes.push({
        field: 'Migration Stages',
        oldValue: `${oldSOW.migrationStages.length} stages`,
        newValue: `${newSOW.migrationStages.length} stages`
      })
    }

    if (JSON.stringify(oldSOW.selectedTrainings) !== JSON.stringify(newSOW.selectedTrainings)) {
      changes.push({
        field: 'Training Modules',
        oldValue: `${oldSOW.selectedTrainings.length} modules`,
        newValue: `${newSOW.selectedTrainings.length} modules`
      })
    }

    if (oldSOW.clientOrganization !== newSOW.clientOrganization) {
      changes.push({
        field: 'Client Organization',
        oldValue: oldSOW.clientOrganization,
        newValue: newSOW.clientOrganization
      })
    }
  }

  const { revisionHistory, currentVersion, ...snapshot } = newSOW

  return {
    id: `revision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    version: oldSOW ? oldSOW.currentVersion + 1 : 1,
    timestamp: Date.now(),
    changedBy,
    changedByName,
    changeDescription: changeDescription || (changes.length > 0 ? `Updated ${changes.map(c => c.field).join(', ')}` : 'Initial version'),
    changes,
    snapshot
  }
}

export function addRevisionToSOW(
  sow: SOW,
  changedBy: string,
  changedByName: string,
  changeDescription: string,
  oldSOW?: SOW
): SOW {
  const revision = createSOWRevision(oldSOW || null, sow, changedBy, changedByName, changeDescription)
  
  return {
    ...sow,
    currentVersion: revision.version,
    revisionHistory: [...(sow.revisionHistory || []), revision]
  }
}

export function compareSOWVersions(oldVersion: SOW, newVersion: SOW): string[] {
  const differences: string[] = []

  if (oldVersion.projectName !== newVersion.projectName) {
    differences.push(`Project name changed from "${oldVersion.projectName}" to "${newVersion.projectName}"`)
  }

  if (oldVersion.projectDescription !== newVersion.projectDescription) {
    differences.push('Project description was updated')
  }

  if (oldVersion.status !== newVersion.status) {
    differences.push(`Status changed from ${oldVersion.status} to ${newVersion.status}`)
  }

  if (oldVersion.includeMigration !== newVersion.includeMigration) {
    differences.push(`Migration ${newVersion.includeMigration ? 'enabled' : 'disabled'}`)
  }

  if (oldVersion.includeTraining !== newVersion.includeTraining) {
    differences.push(`Training ${newVersion.includeTraining ? 'enabled' : 'disabled'}`)
  }

  if (oldVersion.migrationStages.length !== newVersion.migrationStages.length) {
    differences.push(`Migration stages changed from ${oldVersion.migrationStages.length} to ${newVersion.migrationStages.length}`)
  }

  if (oldVersion.selectedTrainings.length !== newVersion.selectedTrainings.length) {
    differences.push(`Training modules changed from ${oldVersion.selectedTrainings.length} to ${newVersion.selectedTrainings.length}`)
  }

  return differences
}
