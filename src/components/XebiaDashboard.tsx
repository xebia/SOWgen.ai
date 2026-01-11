import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SOW, DashboardStats } from '@/lib/types'
import { exportSOWsToCSV } from '@/lib/csv-export'
import { FileText, CheckCircle, Clock, XCircle, FileCsv } from '@phosphor-icons/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { toast } from 'sonner'
import { RecentChangesWidget } from '@/components/RecentChangesWidget'

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
        >
          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 xebia-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total SOWs</CardTitle>
              <FileText className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-3xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                {stats.totalSOWs}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="text-success" size={20} weight="fill" />
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-3xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              >
                {stats.approvedSOWs}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">{stats.approvalRate}% approval rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="text-warning" size={20} weight="fill" />
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-3xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
              >
                {stats.pendingSOWs}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="relative overflow-hidden group">
            <div className="absolute inset-0 xebia-dots-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Avg. Approval Time</CardTitle>
              <XCircle className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div 
                className="text-3xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              >
                {stats.avgApprovalTimeDays}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">Days</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 xebia-pattern opacity-5" />
          <CardHeader className="relative z-10">
            <CardTitle>SOW Status Distribution</CardTitle>
            <p className="text-xs text-muted-foreground">Real-time status tracking across all projects</p>
          </CardHeader>
          <CardContent className="h-[300px] relative z-10">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 xebia-dots-pattern opacity-5" />
          <CardHeader className="relative z-10">
            <CardTitle>Monthly SOW Creation</CardTitle>
            <p className="text-xs text-muted-foreground">Project activity trends over time</p>
          </CardHeader>
          <CardContent className="h-[300px] relative z-10">
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
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="relative overflow-hidden">
        <div className="absolute inset-0 xebia-grid-pattern opacity-5" />
        <CardHeader className="relative z-10">
          <CardTitle>SOWs by Client</CardTitle>
          <p className="text-xs text-muted-foreground">Client engagement distribution and partnership overview</p>
        </CardHeader>
        <CardContent className="h-[300px] relative z-10">
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <RecentChangesWidget sows={sows} maxItems={8} />
      </motion.div>
    </div>
  )
}
