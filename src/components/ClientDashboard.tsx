import { SOW, User } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Clock, CheckCircle } from '@phosphor-icons/react'

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
        <Button onClick={onCreateSOW} size="lg">
          <Plus className="mr-2" size={20} />
          Create New SOW
        </Button>
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
