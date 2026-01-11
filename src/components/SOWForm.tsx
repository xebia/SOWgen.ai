import { useState, useEffect } from 'react'
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
import { X, Plus, GithubLogo, GitlabLogo, Sparkle, CloudArrowDown } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SOWFormProps {
  user: User
  onSave: (sow: SOW) => void
  onCancel: () => void
  automationMode?: boolean
}

const MIGRATION_STAGES: { value: MigrationStage; label: string; defaultWeeks: number }[] = [
  { value: 'initial-setup', label: 'Initial Setup', defaultWeeks: 2 },
  { value: 'repository-migration', label: 'Repository Migration', defaultWeeks: 3 },
  { value: 'cicd-migration', label: 'CI/CD Migration', defaultWeeks: 4 },
  { value: 'cicd-implementation', label: 'CI/CD Implementation', defaultWeeks: 5 },
  { value: 'training-sessions', label: 'Training Sessions', defaultWeeks: 2 },
]

export function SOWForm({ user, onSave, onCancel, automationMode = false }: SOWFormProps) {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [includeMigration, setIncludeMigration] = useState(false)
  const [includeTraining, setIncludeTraining] = useState(false)
  const [migrationStages, setMigrationStages] = useState<MigrationStageDetail[]>([])
  const [selectedTrainings, setSelectedTrainings] = useState<SelectedTraining[]>([])
  const [currentTab, setCurrentTab] = useState(automationMode ? 'scm-integration' : 'details')
  
  const [scmType, setScmType] = useState<'github' | 'gitlab' | 'bitbucket'>('github')
  const [repoUrl, setRepoUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [fetchedData, setFetchedData] = useState<any>(null)

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

  const handleFetchFromSCM = async () => {
    if (!repoUrl.trim()) {
      toast.error('Repository URL is required')
      return
    }

    setIsFetching(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData = {
        repoName: repoUrl.split('/').pop() || 'Project',
        description: 'Fetched from SCM repository - includes comprehensive CI/CD pipeline setup and deployment automation',
        branches: 15,
        commits: 342,
        contributors: 8,
        languages: ['TypeScript', 'Python', 'Go'],
        hasCI: true,
        estimatedComplexity: 'medium'
      }
      
      setFetchedData(mockData)
      setProjectName(mockData.repoName)
      setProjectDescription(mockData.description)
      setIncludeMigration(true)
      
      toast.success('Repository data fetched successfully!')
    } catch (error) {
      toast.error('Failed to fetch repository data')
    } finally {
      setIsFetching(false)
    }
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
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">Create Statement of Work</h2>
          {automationMode && (
            <Badge variant="secondary" className="gap-1.5">
              <Sparkle size={14} weight="fill" />
              Automation Mode
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {automationMode 
            ? 'Fetch project data from your SCM repository and fill in additional details'
            : 'Fill in the details for your project requirements'}
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className={automationMode ? 'grid w-full grid-cols-4' : 'grid w-full grid-cols-3'}>
          {automationMode && <TabsTrigger value="scm-integration">SCM Integration</TabsTrigger>}
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="migration">Migration Services</TabsTrigger>
          <TabsTrigger value="training">Training Modules</TabsTrigger>
        </TabsList>

        {automationMode && (
          <TabsContent value="scm-integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connect to Your Repository</CardTitle>
                <CardDescription>Fetch project data automatically from your source code management system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SCM Platform</Label>
                  <Select value={scmType} onValueChange={(value: any) => setScmType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github">
                        <div className="flex items-center gap-2">
                          <GithubLogo size={16} />
                          GitHub
                        </div>
                      </SelectItem>
                      <SelectItem value="gitlab">
                        <div className="flex items-center gap-2">
                          <GitlabLogo size={16} />
                          GitLab
                        </div>
                      </SelectItem>
                      <SelectItem value="bitbucket">Bitbucket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repo-url">Repository URL *</Label>
                  <Input
                    id="repo-url"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/organization/repository"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access-token">Access Token (Optional)</Label>
                  <Input
                    id="access-token"
                    type="password"
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                    placeholder="For private repositories"
                  />
                  <p className="text-xs text-muted-foreground">
                    Required only for private repositories. Your token is not stored.
                  </p>
                </div>

                <Button 
                  onClick={handleFetchFromSCM}
                  disabled={isFetching || !repoUrl.trim()}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isFetching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Fetching Data...
                    </>
                  ) : (
                    <>
                      <CloudArrowDown size={20} weight="duotone" />
                      Fetch Repository Data
                    </>
                  )}
                </Button>

                {fetchedData && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkle size={18} weight="fill" className="text-success" />
                        Data Fetched Successfully
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-muted-foreground">Repository:</span>
                          <p className="font-semibold">{fetchedData.repoName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Complexity:</span>
                          <p className="font-semibold capitalize">{fetchedData.estimatedComplexity}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Branches:</span>
                          <p className="font-semibold">{fetchedData.branches}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Contributors:</span>
                          <p className="font-semibold">{fetchedData.contributors}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Commits:</span>
                          <p className="font-semibold">{fetchedData.commits}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Has CI/CD:</span>
                          <p className="font-semibold">{fetchedData.hasCI ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Languages:</span>
                        <div className="flex gap-2 mt-1">
                          {fetchedData.languages.map((lang: string) => (
                            <Badge key={lang} variant="secondary" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs pt-2">
                        Project details have been pre-filled. You can review and modify them in the next tabs.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

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
