import { SOW } from './types'
import { getModuleById } from './training-catalog'

export function generatePrintableHTML(sow: SOW): string {
  const migrationStagesHTML = sow.includeMigration && sow.migrationStages.length > 0 
    ? `
      <div class="section">
        <h2>Migration Stages</h2>
        <p class="section-subtitle">${sow.migrationStages.length} stages configured</p>
        ${sow.migrationStages.map((stage, index) => `
          <div class="stage-block">
            <div class="stage-header">
              <h3>${index + 1}. ${stage.stage.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
              <div class="stage-meta">
                <span class="badge">${stage.timelineWeeks} weeks</span>
                ${stage.automated ? '<span class="badge badge-automated">Automated</span>' : ''}
                ${stage.estimatedManHours ? `<span class="badge">${stage.estimatedManHours}h</span>` : ''}
              </div>
            </div>
            ${stage.githubMigrationType ? `
              <div class="field">
                <label>GitHub Migration Type</label>
                <p>${stage.githubMigrationType.replace(/-/g, ' ').toUpperCase()}</p>
              </div>
            ` : ''}
            ${stage.repositoryInventory ? `
              <div class="field">
                <label>Repository Inventory</label>
                <div class="inventory-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12pt; margin-top: 8pt;">
                  <div>
                    <span class="text-muted" style="display: block;">Total Repositories</span>
                    <strong>${stage.repositoryInventory.totalRepositories}</strong>
                  </div>
                  <div>
                    <span class="text-muted" style="display: block;">Public</span>
                    <strong>${stage.repositoryInventory.publicRepos}</strong>
                  </div>
                  <div>
                    <span class="text-muted" style="display: block;">Private</span>
                    <strong>${stage.repositoryInventory.privateRepos}</strong>
                  </div>
                  <div>
                    <span class="text-muted" style="display: block;">Total Size</span>
                    <strong>${stage.repositoryInventory.totalSizeGB} GB</strong>
                  </div>
                  ${stage.repositoryInventory.usersToMigrate ? `
                    <div>
                      <span class="text-muted" style="display: block;">Users to Migrate</span>
                      <strong>${stage.repositoryInventory.usersToMigrate}</strong>
                    </div>
                  ` : ''}
                  ${stage.repositoryInventory.languages.length > 0 ? `
                    <div style="grid-column: span 3;">
                      <span class="text-muted" style="display: block;">Languages</span>
                      <strong>${stage.repositoryInventory.languages.join(', ')}</strong>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}
            ${stage.description ? `
              <div class="field">
                <label>Description</label>
                <p>${stage.description}</p>
              </div>
            ` : ''}
            ${stage.technicalDetails ? `
              <div class="field">
                <label>Technical Details</label>
                <pre>${stage.technicalDetails}</pre>
              </div>
            ` : ''}
            ${stage.includeCICDMigration && stage.cicdPlatform ? `
              <div class="field">
                <label>CI/CD Migration</label>
                <p>From <strong>${stage.cicdPlatform}</strong> to <strong>GitHub Actions</strong></p>
                ${stage.cicdDetails ? `<p class="text-muted">${stage.cicdDetails}</p>` : ''}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    ` 
    : ''

  const trainingModulesHTML = sow.includeTraining && sow.selectedTrainings.length > 0
    ? `
      <div class="section">
        <h2>Training Modules</h2>
        <p class="section-subtitle">${sow.selectedTrainings.length} modules selected</p>
        ${sow.selectedTrainings.map(st => {
          const module = getModuleById(st.moduleId)
          if (!module) return ''
          return `
            <div class="training-block">
              <div class="training-header">
                <div>
                  <h3>${module.title}</h3>
                  <div class="training-badges">
                    <span class="badge">${module.level}</span>
                    <span class="badge badge-track">${module.track.toUpperCase()}</span>
                  </div>
                </div>
                <div class="training-meta">
                  <p><strong>${st.participantCount}</strong> participants</p>
                  <p class="text-muted">${module.durationHours}h duration</p>
                </div>
              </div>
              <p class="text-muted">${module.description}</p>
              ${module.agenda && module.agenda.length > 0 ? `
                <div class="field">
                  <label>Agenda</label>
                  <ul>
                    ${module.agenda.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `
        }).join('')}
      </div>
    `
    : ''

  const approvalHistoryHTML = sow.approvalHistory.length > 0
    ? `
      <div class="section">
        <h2>Approval History</h2>
        ${sow.approvalHistory.map(history => `
          <div class="approval-entry">
            <div class="approval-header">
              <span class="approval-action ${history.action}">${history.action.replace(/-/g, ' ').toUpperCase()}</span>
              <span class="text-muted">${new Date(history.timestamp).toLocaleString()}</span>
            </div>
            <p><strong>${history.approverName}</strong></p>
            <p>${history.comment}</p>
          </div>
        `).join('')}
      </div>
    `
    : ''

  const totalTrainingHours = sow.selectedTrainings.reduce((sum, st) => {
    const module = getModuleById(st.moduleId)
    return sum + (module ? module.durationHours : 0)
  }, 0)

  const totalMigrationWeeks = sow.migrationStages.reduce((sum, stage) => sum + stage.timelineWeeks, 0)

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>SOW - ${sow.projectName}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          font-size: 11pt;
        }

        h1, h2, h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          color: #1a1a1a;
        }

        h1 {
          font-size: 28pt;
          margin-bottom: 8pt;
          letter-spacing: -0.02em;
        }

        h2 {
          font-size: 18pt;
          margin-top: 24pt;
          margin-bottom: 12pt;
          padding-bottom: 8pt;
          border-bottom: 2px solid #e5e5e5;
          letter-spacing: -0.01em;
        }

        h3 {
          font-size: 14pt;
          margin-bottom: 8pt;
        }

        .header {
          margin-bottom: 32pt;
          padding-bottom: 16pt;
          border-bottom: 3px solid oklch(0.25 0.08 250);
        }

        .status-badge {
          display: inline-block;
          padding: 4pt 12pt;
          border-radius: 4pt;
          font-size: 9pt;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
        }

        .status-approved { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        .status-draft { background: #f3f4f6; color: #374151; }
        .status-changes-requested { background: #fef3c7; color: #92400e; }

        .section {
          margin-bottom: 24pt;
          page-break-inside: avoid;
        }

        .section-subtitle {
          color: #6b7280;
          font-size: 10pt;
          margin-bottom: 12pt;
        }

        .field {
          margin-bottom: 12pt;
        }

        label {
          display: block;
          font-size: 9pt;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
          margin-bottom: 4pt;
        }

        .field p {
          color: #1a1a1a;
        }

        .metadata {
          display: flex;
          gap: 24pt;
          margin-bottom: 24pt;
          padding: 12pt;
          background: #f9fafb;
          border-radius: 6pt;
        }

        .metadata-item {
          flex: 1;
        }

        .stage-block, .training-block {
          border: 1px solid #e5e5e5;
          border-radius: 6pt;
          padding: 12pt;
          margin-bottom: 12pt;
          page-break-inside: avoid;
        }

        .stage-header, .training-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12pt;
        }

        .stage-meta, .training-meta {
          text-align: right;
        }

        .badge {
          display: inline-block;
          padding: 2pt 8pt;
          background: #f3f4f6;
          border: 1px solid #e5e5e5;
          border-radius: 4pt;
          font-size: 9pt;
          margin-left: 6pt;
        }

        .badge-automated {
          background: #dbeafe;
          border-color: #93c5fd;
          color: #1e40af;
        }

        .badge-track {
          background: #e0e7ff;
          border-color: #c7d2fe;
          color: #3730a3;
        }

        .training-badges {
          margin-top: 4pt;
        }

        .training-meta p {
          font-size: 10pt;
        }

        pre {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9pt;
          background: #f9fafb;
          padding: 8pt;
          border-radius: 4pt;
          border: 1px solid #e5e5e5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        ul {
          margin-left: 16pt;
          margin-top: 6pt;
        }

        li {
          margin-bottom: 4pt;
        }

        .text-muted {
          color: #6b7280;
          font-size: 10pt;
        }

        .approval-entry {
          padding: 12pt;
          background: #f9fafb;
          border-left: 3px solid #e5e5e5;
          margin-bottom: 12pt;
          page-break-inside: avoid;
        }

        .approval-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6pt;
        }

        .approval-action {
          font-size: 9pt;
          font-weight: 600;
          padding: 2pt 8pt;
          border-radius: 4pt;
        }

        .approval-action.approved {
          background: #dcfce7;
          color: #166534;
        }

        .approval-action.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .approval-action.changes-requested {
          background: #fef3c7;
          color: #92400e;
        }

        .approval-action.comment {
          background: #f3f4f6;
          color: #374151;
        }

        .summary-box {
          background: oklch(0.96 0.005 240);
          border: 2px solid oklch(0.90 0.005 240);
          border-radius: 6pt;
          padding: 16pt;
          margin-bottom: 24pt;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16pt;
        }

        .summary-item strong {
          color: oklch(0.25 0.08 250);
          font-size: 20pt;
        }

        .footer {
          margin-top: 32pt;
          padding-top: 16pt;
          border-top: 2px solid #e5e5e5;
          font-size: 9pt;
          color: #6b7280;
          text-align: center;
        }

        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .page-break {
            page-break-before: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${sow.projectName}</h1>
        <p style="font-size: 12pt; color: #6b7280; margin-bottom: 12pt;">${sow.clientOrganization}</p>
        <span class="status-badge status-${sow.status}">${sow.status.replace(/-/g, ' ')}</span>
      </div>

      <div class="summary-box">
        <h2 style="margin-top: 0; border: none; padding: 0;">Executive Summary</h2>
        <div class="summary-grid">
          ${sow.includeMigration && totalMigrationWeeks > 0 ? `
            <div class="summary-item">
              <label>Total Migration Timeline</label>
              <p><strong>${totalMigrationWeeks}</strong> weeks</p>
            </div>
          ` : ''}
          ${sow.includeTraining && totalTrainingHours > 0 ? `
            <div class="summary-item">
              <label>Total Training Hours</label>
              <p><strong>${totalTrainingHours}</strong> hours</p>
            </div>
          ` : ''}
          ${sow.estimatedValue ? `
            <div class="summary-item">
              <label>Estimated Value</label>
              <p><strong>$${sow.estimatedValue.toLocaleString()}</strong></p>
            </div>
          ` : ''}
          ${sow.estimatedDuration ? `
            <div class="summary-item">
              <label>Estimated Duration</label>
              <p><strong>${sow.estimatedDuration}</strong> weeks</p>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="section">
        <h2>Project Details</h2>
        <div class="metadata">
          <div class="metadata-item">
            <label>Client Name</label>
            <p>${sow.clientName}</p>
          </div>
          <div class="metadata-item">
            <label>Organization</label>
            <p>${sow.clientOrganization}</p>
          </div>
        </div>
        <div class="field">
          <label>Project Description</label>
          <p>${sow.projectDescription || 'No description provided'}</p>
        </div>
        <div class="metadata">
          <div class="metadata-item">
            <label>Created</label>
            <p>${new Date(sow.createdAt).toLocaleDateString()}</p>
          </div>
          ${sow.submittedAt ? `
            <div class="metadata-item">
              <label>Submitted</label>
              <p>${new Date(sow.submittedAt).toLocaleDateString()}</p>
            </div>
          ` : ''}
          ${sow.approvedAt ? `
            <div class="metadata-item">
              <label>Approved</label>
              <p>${new Date(sow.approvedAt).toLocaleDateString()}</p>
            </div>
          ` : ''}
        </div>
      </div>

      ${migrationStagesHTML}
      ${trainingModulesHTML}
      ${approvalHistoryHTML}

      <div class="footer">
        <p>Generated on ${new Date().toLocaleString()} | SOW ID: ${sow.id}</p>
        <p>© ${new Date().getFullYear()} Xebia. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

export function exportSOWAsPDF(sow: SOW) {
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    throw new Error('Failed to open print window. Please check popup blocker settings.')
  }

  const htmlContent = generatePrintableHTML(sow)
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 250)
  }
}
