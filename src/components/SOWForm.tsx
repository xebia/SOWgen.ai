import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { SOW, User, MigrationStageDetail, SelectedTraining, MigrationStage } from '@/lib/types'
import { TRAINING_MODULES, getModuleById } from '@/lib/training-catalog'
import { X, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SOWFormProps {
  user: User
  onSave: (sow: SOW) => void
  onCancel: () => void
}

const MIGRATION_STAGES: { value: MigrationStage; label: string; defaultWeeks: number }[] = [
  { value: 'initial-setup', label: 'Initial Setup', defaultWeeks: 2 },
  { value: 'repository-migration', label: 'Repository Migration', defaultWeeks: 3 },
  { value: 'cicd-migration', label: 'CI/CD Migration', defaultWeeks: 4 },
  { value: 'cicd-implementation', label: 'CI/CD Implementation', defaultWeeks: 5 },
  { value: 'training-sessions', label: 'Training Sessions', defaultWeeks: 2 },
]

export function SOWForm({ user, onSave, onCancel }: SOWFormProps) {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [includeMigration, setIncludeMigration] = useState(false)
  const [includeTraining, setIncludeTraining] = useState(false)
  const [migrationStages, setMigrationStages] = useState<MigrationStageDetail[]>([])
  const [selectedTrainings, setSelectedTrainings] = useState<SelectedTraining[]>([])
  const [currentTab, setCurrentTab] = useState('details')

  const handleAddMigrationStage = () => {
    setMigrationStages(prev => [...prev, {
      stage: 'initial-setup',
      description: '',
      technicalDetails: '',
      timelineWeeks: 2,
      automated: false
    }])
  }

  const handleRemoveMigrationStage = (index: number) => {
    setMigrationStages(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdateMigrationStage = (index: number, field: keyof MigrationStageDetail, value: any) => {
    setMigrationStages(prev => prev.map((stage, i) => 
      i === index ? { ...stage, [field]: value } : stage
    ))
  }

  const handleAddTraining = (moduleId: string) => {
    if (selectedTrainings.find(t => t.moduleId === moduleId)) {
      toast.error('Training module already added')
      return
    }
    setSelectedTrainings(prev => [...prev, { moduleId, participantCount: 1 }])
    toast.success('Training module added')
  }

  const handleRemoveTraining = (moduleId: string) => {
    setSelectedTrainings(prev => prev.filter(t => t.moduleId !== moduleId))
  }

  const handleUpdateParticipants = (moduleId: string, count: number) => {
    setSelectedTrainings(prev => prev.map(t => 
      t.moduleId === moduleId ? { ...t, participantCount: count } : t
    ))
  }

  const handleSubmit = (isDraft: boolean) => {
    if (!projectName.trim()) {
      toast.error('Project name is required')
      return
    }

    const sow: SOW = {
      id: `sow-${Date.now()}`,
      clientId: user.id,
      clientName: user.name,
      clientOrganization: user.organization || 'Unknown',
      projectName,
      projectDescription,
      status: isDraft ? 'draft' : 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      submittedAt: isDraft ? undefined : Date.now(),
      includeMigration,
      migrationStages,
      includeTraining,
      selectedTrainings,
      approvalHistory: []
    }

    onSave(sow)
    toast.success(isDraft ? 'SOW saved as draft' : 'SOW submitted for approval')
  }

  const trackGroups = {
    github: TRAINING_MODULES.filter(m => m.track === 'github'),
    azure: TRAINING_MODULES.filter(m => m.track === 'azure'),
    gcp: TRAINING_MODULES.filter(m => m.track === 'gcp'),
    aws: TRAINING_MODULES.filter(m => m.track === 'aws'),
    'ai-sap': TRAINING_MODULES.filter(m => m.track === 'ai-sap'),
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Create Statement of Work</h2>
        <p className="text-muted-foreground">Fill in the details for your project requirements</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="migration">Migration Services</TabsTrigger>
          <TabsTrigger value="training">Training Modules</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Provide core details about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="Enterprise Migration to GitHub"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  placeholder="Describe your project goals, current state, and expected outcomes..."
                  rows={5}
                />
              </div>

              <div className="space-y-3 pt-4">
                <Label>Services Required</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-migration"
                    checked={includeMigration}
                    onCheckedChange={(checked) => setIncludeMigration(checked as boolean)}
                  />
                  <label htmlFor="include-migration" className="text-sm cursor-pointer">
                    Include Migration Services
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-training"
                    checked={includeTraining}
                    onCheckedChange={(checked) => setIncludeTraining(checked as boolean)}
                  />
                  <label htmlFor="include-training" className="text-sm cursor-pointer">
                    Include Training Services
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Migration Stages</CardTitle>
              <CardDescription>Configure the migration process for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!includeMigration ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Enable migration services in the Project Details tab to configure stages</p>
                </div>
              ) : (
                <>
                  {migrationStages.map((stage, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <Label>Stage Type</Label>
                              <Select
                                value={stage.stage}
                                onValueChange={(value) => handleUpdateMigrationStage(index, 'stage', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {MIGRATION_STAGES.map(s => (
                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={stage.description}
                                onChange={e => handleUpdateMigrationStage(index, 'description', e.target.value)}
                                placeholder="Describe what will be done in this stage..."
                                rows={2}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Technical Details</Label>
                              <Textarea
                                value={stage.technicalDetails}
                                onChange={e => handleUpdateMigrationStage(index, 'technicalDetails', e.target.value)}
                                placeholder="Technical specifications, tools, or requirements..."
                                rows={2}
                              />
                            </div>

                            <div className="flex gap-4">
                              <div className="space-y-2 flex-1">
                                <Label>Timeline (weeks)</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={stage.timelineWeeks}
                                  onChange={e => handleUpdateMigrationStage(index, 'timelineWeeks', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="flex items-end">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`automated-${index}`}
                                    checked={stage.automated}
                                    onCheckedChange={(checked) => handleUpdateMigrationStage(index, 'automated', checked)}
                                  />
                                  <label htmlFor={`automated-${index}`} className="text-sm">
                                    Automated
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMigrationStage(index)}
                            className="ml-2"
                          >
                            <X size={20} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Button onClick={handleAddMigrationStage} variant="outline" className="w-full">
                    <Plus className="mr-2" size={20} />
                    Add Migration Stage
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          {!includeTraining ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Enable training services in the Project Details tab to select modules</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {selectedTrainings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Training Modules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedTrainings.map(st => {
                      const module = getModuleById(st.moduleId)
                      if (!module) return null
                      return (
                        <div key={st.moduleId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{module.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {module.track.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {module.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{module.durationHours}h duration</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Participants:</Label>
                              <Input
                                type="number"
                                min="1"
                                value={st.participantCount}
                                onChange={e => handleUpdateParticipants(st.moduleId, parseInt(e.target.value))}
                                className="w-20"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveTraining(st.moduleId)}
                            >
                              <X size={20} />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {Object.entries(trackGroups).map(([track, modules]) => (
                <Card key={track}>
                  <CardHeader>
                    <CardTitle className="capitalize">{track.replace('-', ' / ')} Training</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {modules.map(module => {
                      const isSelected = selectedTrainings.some(t => t.moduleId === module.id)
                      return (
                        <div key={module.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{module.title}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {module.level}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{module.durationHours}h</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                            <details className="text-sm">
                              <summary className="cursor-pointer text-accent hover:underline">View agenda</summary>
                              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                                {module.agenda.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </details>
                          </div>
                          <Button
                            onClick={() => handleAddTraining(module.id)}
                            disabled={isSelected}
                            size="sm"
                          >
                            {isSelected ? 'Added' : 'Add'}
                          </Button>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => handleSubmit(true)}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSubmit(false)}>
            Submit for Approval
          </Button>
        </div>
      </div>
    </div>
  )
}
