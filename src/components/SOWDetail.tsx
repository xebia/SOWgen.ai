import { useState } from 'react'
import { SOW, User, SOWStatus } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { getModuleById } from '@/lib/training-catalog'
import { exportSOWAsPDF } from '@/lib/pdf-export'
import { ArrowLeft, CheckCircle, XCircle, ChatCircle, Clock, FilePdf } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SOWDetailProps {
  sow: SOW
  user: User
  onBack: () => void
  onUpdateSOW: (sow: SOW) => void
}

export function SOWDetail({ sow, user, onBack, onUpdateSOW }: SOWDetailProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canApprove = user.role === 'approver' || user.role === 'xebia-admin'
  const isPending = sow.status === 'pending'

  const handleAction = async (action: SOWStatus, actionLabel: string) => {
    if (action !== 'approved' && !comment.trim()) {
      toast.error('Please provide a comment')
      return
    }

    setIsSubmitting(true)
    
    const updatedSOW: SOW = {
      ...sow,
      status: action,
      updatedAt: Date.now(),
      approvedAt: action === 'approved' ? Date.now() : sow.approvedAt,
      approvalHistory: [
        ...sow.approvalHistory,
        {
          id: `comment-${Date.now()}`,
          approverId: user.id,
          approverName: user.name,
          comment: comment || `${actionLabel} by ${user.name}`,
          timestamp: Date.now(),
          action: action === 'approved' ? 'approved' : action === 'rejected' ? 'rejected' : 'changes-requested'
        }
      ]
    }

    onUpdateSOW(updatedSOW)
    setComment('')
    setIsSubmitting(false)
    toast.success(`SOW ${actionLabel.toLowerCase()}`)
  }

  const handleExportPDF = () => {
    try {
      exportSOWAsPDF(sow)
      toast.success('PDF export initiated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export PDF')
    }
  }

  const getStatusBadge = (status: SOW['status']) => {
    const variants: Record<SOW['status'], { variant: any; label: string }> = {
      'draft': { variant: 'secondary', label: 'Draft' },
      'pending': { variant: 'warning', label: 'Pending Review' },
      'approved': { variant: 'success', label: 'Approved' },
      'rejected': { variant: 'destructive', label: 'Rejected' },
      'changes-requested': { variant: 'warning', label: 'Changes Requested' }
    }
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{sow.projectName}</h2>
          <p className="text-muted-foreground">{sow.clientOrganization}</p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(sow.status)}
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <FilePdf size={18} weight="duotone" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Client</Label>
              <p className="font-medium">{sow.clientName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Organization</Label>
              <p className="font-medium">{sow.clientOrganization}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="mt-1">{sow.projectDescription || 'No description provided'}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p>{new Date(sow.createdAt).toLocaleDateString()}</p>
              </div>
              {sow.submittedAt && (
                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p>{new Date(sow.submittedAt).toLocaleDateString()}</p>
                </div>
              )}
              {sow.approvedAt && (
                <div>
                  <Label className="text-muted-foreground">Approved</Label>
                  <p>{new Date(sow.approvedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {sow.includeMigration && sow.migrationStages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Migration Stages</CardTitle>
              <CardDescription>{sow.migrationStages.length} stages configured</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sow.migrationStages.map((stage, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold capitalize">{stage.stage.replace('-', ' ')}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">{stage.timelineWeeks} weeks</Badge>
                      {stage.automated && <Badge variant="secondary">Automated</Badge>}
                    </div>
                  </div>
                  {stage.description && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm mt-1">{stage.description}</p>
                    </div>
                  )}
                  {stage.technicalDetails && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Technical Details</Label>
                      <p className="text-sm mt-1 font-mono text-xs bg-muted p-2 rounded">{stage.technicalDetails}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {sow.includeTraining && sow.selectedTrainings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Training Modules</CardTitle>
              <CardDescription>{sow.selectedTrainings.length} modules selected</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sow.selectedTrainings.map(st => {
                const module = getModuleById(st.moduleId)
                if (!module) return null
                return (
                  <div key={st.moduleId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{module.title}</h4>
                          <Badge variant="outline" className="text-xs capitalize">{module.level}</Badge>
                          <Badge variant="secondary" className="text-xs uppercase">{module.track}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium">{st.participantCount} participants</p>
                        <p className="text-xs text-muted-foreground">{module.durationHours}h duration</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {sow.approvalHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Approval History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sow.approvalHistory.map((history, index) => (
                  <div key={history.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex gap-3">
                      <div className="mt-1">
                        {history.action === 'approved' && <CheckCircle size={20} className="text-success" weight="fill" />}
                        {history.action === 'rejected' && <XCircle size={20} className="text-destructive" weight="fill" />}
                        {history.action === 'comment' && <ChatCircle size={20} className="text-muted-foreground" />}
                        {history.action === 'changes-requested' && <Clock size={20} className="text-warning" weight="fill" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{history.approverName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(history.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{history.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {canApprove && isPending && (
          <Card>
            <CardHeader>
              <CardTitle>Review SOW</CardTitle>
              <CardDescription>Provide feedback and approval decision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="approval-comment">Comments</Label>
                <Textarea
                  id="approval-comment"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add your review comments..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleAction('approved', 'Approved')}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2" size={20} weight="fill" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleAction('changes-requested', 'Changes Requested')}
                  disabled={isSubmitting}
                  variant="secondary"
                  className="flex-1"
                >
                  <Clock className="mr-2" size={20} />
                  Request Changes
                </Button>
                <Button
                  onClick={() => handleAction('rejected', 'Rejected')}
                  disabled={isSubmitting}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="mr-2" size={20} weight="fill" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
