import { motion } from 'framer-motion'
import { SOW, SOWRevision } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ClockCounterClockwise, GitBranch } from '@phosphor-icons/react'

interface RecentChangesWidgetProps {
  sows: SOW[]
  maxItems?: number
}

interface RecentChange {
  sow: SOW
  revision: SOWRevision
}

export function RecentChangesWidget({ sows, maxItems = 5 }: RecentChangesWidgetProps) {
  const allRevisions: RecentChange[] = []

  sows.forEach(sow => {
    if (sow.revisionHistory && sow.revisionHistory.length > 0) {
      sow.revisionHistory.forEach(revision => {
        allRevisions.push({ sow, revision })
      })
    }
  })

  const sortedRevisions = allRevisions
    .sort((a, b) => b.revision.timestamp - a.revision.timestamp)
    .slice(0, maxItems)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (sortedRevisions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockCounterClockwise size={20} weight="duotone" />
            Recent Changes
          </CardTitle>
          <CardDescription>Track recent SOW modifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <GitBranch size={32} className="text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No recent changes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockCounterClockwise size={20} weight="duotone" />
          Recent Changes
        </CardTitle>
        <CardDescription>Latest SOW modifications across all projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedRevisions.map((item, index) => (
            <motion.div
              key={`${item.sow.id}-${item.revision.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-8 w-8 border-2 border-primary/20 mt-0.5">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(item.revision.changedByName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{item.sow.projectName}</p>
                  <Badge variant="outline" className="font-mono text-[10px] px-1 py-0">
                    v{item.revision.version}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                  {item.revision.changeDescription}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{item.revision.changedByName}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(item.revision.timestamp)}</span>
                  {item.revision.changes.length > 0 && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">
                        {item.revision.changes.length} {item.revision.changes.length === 1 ? 'change' : 'changes'}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
