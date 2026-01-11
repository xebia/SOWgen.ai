import { SOW, User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { exportSOWAsPDF } from '@/lib/pdf-export'
import { exportSOWsToCSV } from '@/lib/csv-export'
import { Plus, FileText, Clock, CheckCircle, FilePdf, FileCsv, DownloadSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ClientDashboardProps {
  sows: SOW[]
  user: User
  onCreateSOW: () => void
  onViewSOW: (sow: SOW) => void
}

export function ClientDashboard({ sows, user, onCreateSOW, onViewSOW }: ClientDashboardProps) {
  const mySows = sows.filter(s => s.clientId === user.id)
  const pendingCount = mySows.filter(s => s.status === 'pending').length
  const approvedCount = mySows.filter(s => s.status === 'approved').length

  const handleExportPDF = (e: React.MouseEvent, sow: SOW) => {
    e.stopPropagation()
    try {
      exportSOWAsPDF(sow)
      toast.success('PDF export initiated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export PDF')
    }
  }

  const handleExportAllToCSV = () => {
    if (mySows.length === 0) {
      toast.error('No SOWs to export')
      return
    }
    try {
      exportSOWsToCSV(mySows, `sows-${user.name.replace(/\s+/g, '-')}-${Date.now()}.csv`)
      toast.success('SOWs exported to CSV successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export CSV')
    }
  }

  const getStatusBadge = (status: SOW['status']) => {
    const variants: Record<SOW['status'], { variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'; label: string }> = {
      'draft': { variant: 'secondary', label: 'Draft' },
      'pending': { variant: 'warning', label: 'Pending Review' },
      'approved': { variant: 'success', label: 'Approved' },
      'rejected': { variant: 'destructive', label: 'Rejected' },
      'changes-requested': { variant: 'warning', label: 'Changes Requested' }
    }
    const config = variants[status]
    return <Badge variant={config.variant as any}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">My Dashboard</h2>
          <p className="text-muted-foreground">Manage your Statement of Work requests</p>
        </div>
        <div className="flex gap-3">
          {mySows.length > 0 && (
            <Button onClick={handleExportAllToCSV} variant="outline" className="gap-2">
              <FileCsv size={20} weight="duotone" />
              Export All to CSV
            </Button>
          )}
          <Button onClick={onCreateSOW} size="lg" className="gap-2">
            <Plus size={20} />
            Create New SOW
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SOWs</CardTitle>
            <FileText className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mySows.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="text-warning" size={20} weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="text-success" size={20} weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your SOWs</CardTitle>
          <CardDescription>Track the status of your Statement of Work submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {mySows.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No SOWs created yet</p>
              <Button onClick={onCreateSOW}>
                <Plus className="mr-2" size={20} />
                Create Your First SOW
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mySows.map(sow => (
                <div
                  key={sow.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onViewSOW(sow)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{sow.projectName}</h3>
                      {getStatusBadge(sow.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{sow.projectDescription}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Created {new Date(sow.createdAt).toLocaleDateString()}</span>
                      {sow.includeMigration && <span>• Migration</span>}
                      {sow.includeTraining && <span>• Training</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleExportPDF(e, sow)}
                    className="ml-4"
                  >
                    <FilePdf size={18} weight="duotone" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
