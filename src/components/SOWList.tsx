import { SOW, User } from '@/lib/types'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { exportSOWAsPDF } from '@/lib/pdf-export'
import { exportSOWsToCSV } from '@/lib/csv-export'
import { MagnifyingGlass, FilePdf, Eye, FileCsv } from '@phosphor-icons/react'
import { GitHubLogo } from '@/components/GitHubLogo'
import { toast } from 'sonner'
import { useState } from 'react'
import { useApp } from '@/lib/app-context'

interface SOWListProps {
  sows: SOW[]
  user: User
  onViewSOW: (sow: SOW) => void
}

export function SOWList({ sows, user, onViewSOW }: SOWListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { users } = useApp()

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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
    const sowsToExport = filteredSows.length > 0 ? filteredSows : sows
    if (sowsToExport.length === 0) {
      toast.error('No SOWs to export')
      return
    }
    try {
      exportSOWsToCSV(sowsToExport, `all-sows-${Date.now()}.csv`)
      toast.success(`${sowsToExport.length} SOWs exported to CSV successfully`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export CSV')
    }
  }

  const filteredSows = sows.filter(sow => {
    const query = searchQuery.toLowerCase()
    return (
      sow.projectName.toLowerCase().includes(query) ||
      sow.clientOrganization.toLowerCase().includes(query) ||
      sow.clientName.toLowerCase().includes(query)
    )
  })

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
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 xebia-pattern opacity-50" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">All SOWs</h2>
            <p className="text-muted-foreground">Review and manage Statement of Work submissions</p>
          </div>
          {sows.length > 0 && (
            <Button onClick={handleExportAllToCSV} variant="outline" className="gap-2">
              <FileCsv size={20} weight="duotone" />
              Export to CSV
            </Button>
          )}
        </div>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 xebia-dots-pattern opacity-5" />
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SOW Submissions</CardTitle>
              <CardDescription>Total: {filteredSows.length} SOWs</CardDescription>
            </div>
            <div className="relative w-64">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search SOWs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          {filteredSows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No SOWs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSows.map((sow, index) => {
                  const client = getUserById(sow.clientId)
                  return (
                    <motion.tr 
                      key={sow.id} 
                      className="cursor-pointer hover:bg-muted/50 border-b transition-colors"
                      onClick={() => onViewSOW(sow)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'oklch(0.97 0.008 295 / 0.8)' }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-primary/20">
                            <AvatarImage src={client?.avatarUrl} alt={sow.clientName} />
                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                              {getInitials(sow.clientName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{sow.clientName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{sow.projectName}</TableCell>
                      <TableCell>{sow.clientOrganization}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {sow.includeMigration && <Badge variant="outline" className="text-xs">Migration</Badge>}
                          {sow.includeTraining && <Badge variant="outline" className="text-xs">Training</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(sow.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          v{sow.currentVersion || 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(sow.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onViewSOW(sow) }}>
                              <Eye size={18} />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="sm" onClick={(e) => handleExportPDF(e, sow)}>
                              <FilePdf size={18} weight="duotone" />
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
