import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SOW, SOWRevision } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ClockCounterClockwise, ArrowRight, GitBranch, User } from '@phosphor-icons/react'

interface SOWVersionHistoryProps {
  sow: SOW
  trigger?: React.ReactNode
}

export function SOWVersionHistory({ sow, trigger }: SOWVersionHistoryProps) {
  const [open, setOpen] = useState(false)
  const [selectedRevision, setSelectedRevision] = useState<SOWRevision | null>(null)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const sortedRevisions = [...(sow.revisionHistory || [])].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <ClockCounterClockwise size={18} weight="duotone" />
            Version History
            {sow.currentVersion > 1 && (
              <Badge variant="secondary" className="ml-1">
                v{sow.currentVersion}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch size={24} weight="duotone" className="text-primary" />
            Version History
          </DialogTitle>
          <DialogDescription>
            Track all changes made to {sow.projectName} • Current version: v{sow.currentVersion}
          </DialogDescription>
        </DialogHeader>

        {sortedRevisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClockCounterClockwise size={48} className="text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No version history available</p>
            <p className="text-sm text-muted-foreground">Changes will appear here as the SOW is updated</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[60vh]">
            <ScrollArea className="md:col-span-1 pr-4">
              <div className="space-y-2">
                {sortedRevisions.map((revision, index) => {
                  const dateTime = formatDateTime(revision.timestamp)
                  const isLatest = index === 0
                  const isSelected = selectedRevision?.id === revision.id

                  return (
                    <motion.div
                      key={revision.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedRevision(revision)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={isLatest ? 'default' : 'outline'} className="text-xs">
                                v{revision.version}
                              </Badge>
                              {isLatest && (
                                <Badge variant="success" className="text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium mb-2 line-clamp-2">
                            {revision.changeDescription}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-primary/10">
                                {getInitials(revision.changedByName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{revision.changedByName}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {dateTime.date} • {dateTime.time}
                          </div>
                          {revision.changes.length > 0 && (
                            <Badge variant="secondary" className="text-xs mt-2">
                              {revision.changes.length} {revision.changes.length === 1 ? 'change' : 'changes'}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                {selectedRevision ? (
                  <motion.div
                    key={selectedRevision.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    <ScrollArea className="h-full pr-4">
                      <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <GitBranch size={24} weight="duotone" className="text-primary" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">Version {selectedRevision.version}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatDateTime(selectedRevision.timestamp).date} at{' '}
                                  {formatDateTime(selectedRevision.timestamp).time}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border-2 border-primary/20">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(selectedRevision.changedByName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{selectedRevision.changedByName}</p>
                              <p className="text-xs text-muted-foreground">{selectedRevision.changeDescription}</p>
                            </div>
                          </div>
                        </div>

                        {selectedRevision.changes.length > 0 && (
                          <Card>
                            <CardContent className="p-6">
                              <h4 className="font-semibold mb-4 flex items-center gap-2">
                                <span>Changes Made</span>
                                <Badge variant="secondary">{selectedRevision.changes.length}</Badge>
                              </h4>
                              <div className="space-y-4">
                                {selectedRevision.changes.map((change, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-4 rounded-lg border bg-muted/30"
                                  >
                                    <div className="flex items-center gap-2 mb-3">
                                      <Badge variant="outline" className="text-xs font-mono">
                                        {change.field}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium">Previous Value</p>
                                        <div className="p-3 rounded bg-destructive/5 border border-destructive/20">
                                          <p className="text-sm font-mono break-words">
                                            {typeof change.oldValue === 'object'
                                              ? JSON.stringify(change.oldValue, null, 2)
                                              : change.oldValue || '—'}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium">New Value</p>
                                        <div className="p-3 rounded bg-success/5 border border-success/20">
                                          <p className="text-sm font-mono break-words">
                                            {typeof change.newValue === 'object'
                                              ? JSON.stringify(change.newValue, null, 2)
                                              : change.newValue || '—'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {selectedRevision.changes.length === 0 && (
                          <Card>
                            <CardContent className="p-6 text-center">
                              <p className="text-muted-foreground">No detailed changes recorded for this version</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                This was likely an initial creation or status update
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </ScrollArea>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center p-8"
                  >
                    <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <ClockCounterClockwise size={48} className="text-primary/50" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Select a Version</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Choose a version from the list to view detailed changes and information
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
