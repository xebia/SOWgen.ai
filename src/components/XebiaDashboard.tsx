import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SOW, DashboardStats } from '@/lib/types'
import { exportSOWsToCSV } from '@/lib/csv-export'
import { FileText, CheckCircle, Clock, XCircle, FileCsv } from '@phosphor-icons/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { toast } from 'sonner'

interface XebiaDashboardProps {
  sows: SOW[]
}

export function XebiaDashboard({ sows }: XebiaDashboardProps) {
  const handleExportAllToCSV = () => {
    if (sows.length === 0) {
      toast.error('No SOWs to export')
      return
    }
    try {
      exportSOWsToCSV(sows, `xebia-sows-${Date.now()}.csv`)
      toast.success(`${sows.length} SOWs exported to CSV successfully`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export CSV')
    }
  }

  const stats: DashboardStats = useMemo(() => {
    const total = sows.length
    const approved = sows.filter(s => s.status === 'approved').length
    const pending = sows.filter(s => s.status === 'pending').length
    const rejected = sows.filter(s => s.status === 'rejected').length
    
    const approvalRate = total > 0 ? (approved / total) * 100 : 0
    
    const approvedWithTimes = sows.filter(s => s.status === 'approved' && s.submittedAt && s.approvedAt)
    const avgTime = approvedWithTimes.length > 0
      ? approvedWithTimes.reduce((sum, s) => {
          const days = ((s.approvedAt! - s.submittedAt!) / (1000 * 60 * 60 * 24))
          return sum + days
        }, 0) / approvedWithTimes.length
      : 0
    
    return {
      totalSOWs: total,
      approvedSOWs: approved,
      pendingSOWs: pending,
      rejectedSOWs: rejected,
      approvalRate: Math.round(approvalRate),
      avgApprovalTimeDays: Math.round(avgTime * 10) / 10
    }
  }, [sows])

  const statusData = [
    { name: 'Approved', value: stats.approvedSOWs, color: 'oklch(0.65 0.15 145)' },
    { name: 'Pending', value: stats.pendingSOWs, color: 'oklch(0.75 0.13 75)' },
    { name: 'Rejected', value: stats.rejectedSOWs, color: 'oklch(0.60 0.20 25)' },
  ]

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, idx) => {
      const count = sows.filter(s => {
        const sowMonth = new Date(s.createdAt).getMonth()
        return sowMonth === idx
      }).length
      return { month, count }
    })
  }, [sows])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Overview of all SOW activities</p>
        </div>
        {sows.length > 0 && (
          <Button onClick={handleExportAllToCSV} variant="outline" className="gap-2">
            <FileCsv size={20} weight="duotone" />
            Export All SOWs to CSV
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SOWs</CardTitle>
            <FileText className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSOWs}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="text-success" size={20} weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.approvedSOWs}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.approvalRate}% approval rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="text-warning" size={20} weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingSOWs}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Approval Time</CardTitle>
            <XCircle className="text-muted-foreground" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgApprovalTimeDays}</div>
            <p className="text-xs text-muted-foreground mt-1">Days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SOW Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.totalSOWs > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No SOWs yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly SOW Creation</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.005 240)" />
                <XAxis dataKey="month" stroke="oklch(0.45 0.02 240)" />
                <YAxis stroke="oklch(0.45 0.02 240)" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="oklch(0.65 0.15 210)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SOWs by Client</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(
              sows.reduce((acc, sow) => {
                acc[sow.clientOrganization] = (acc[sow.clientOrganization] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).map(([name, count]) => ({ name, count }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.005 240)" />
              <XAxis dataKey="name" stroke="oklch(0.45 0.02 240)" />
              <YAxis stroke="oklch(0.45 0.02 240)" />
              <Tooltip />
              <Bar dataKey="count" fill="oklch(0.25 0.08 250)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
