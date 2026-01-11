import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
import { X, Plus, GithubLogo, GitlabLogo, Sparkle, CloudArrowDown, CheckCircle, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { fetchRepositoryData, generateProjectDescription, type RepositoryData, type SCMPlatform } from '@/lib/scm-api'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  
  const [scmType, setScmType] = useState<SCMPlatform>('github')
  const [repoUrl, setRepoUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [fetchedData, setFetchedData] = useState<RepositoryData | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

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
    setFetchError(null)
    
    try {
      const data = await fetchRepositoryData(repoUrl, scmType, accessToken || undefined)
      
      setFetchedData(data)
      setProjectName(data.repoName)
      setProjectDescription(generateProjectDescription(data))
      setIncludeMigration(data.hasCI)
      
      toast.success('Repository data fetched successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch repository data'
      setFetchError(errorMessage)
      toast.error(errorMessage)
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
          <TabsContent value="scm-integration" className="space-y-6">
            <Card className="border-accent/20 bg-gradient-to-br from-accent/[0.02] to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CloudArrowDown size={24} weight="duotone" className="text-accent" />
                  </div>
                  <div>
                    <CardTitle>Connect to Your Repository</CardTitle>
                    <CardDescription>Automatically fetch and analyze project data from your SCM platform</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">SCM Platform</Label>
                    <Select value={scmType} onValueChange={(value: any) => setScmType(value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="github">
                          <div className="flex items-center gap-3 py-1">
                            <GithubLogo size={20} weight="duotone" />
                            <div>
                              <div className="font-semibold">GitHub</div>
                              <div className="text-xs text-muted-foreground">Connect to GitHub repositories</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="gitlab">
                          <div className="flex items-center gap-3 py-1">
                            <GitlabLogo size={20} weight="duotone" />
                            <div>
                              <div className="font-semibold">GitLab</div>
                              <div className="text-xs text-muted-foreground">Connect to GitLab projects</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="bitbucket" disabled>
                          <div className="flex items-center gap-3 py-1 opacity-50">
                            <GitlabLogo size={20} />
                            <div>
                              <div className="font-semibold">Bitbucket</div>
                              <div className="text-xs text-muted-foreground">Coming soon</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card className="bg-muted/50 border-muted">
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground space-y-1.5">
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                          <Info size={14} />
                          Platform Details
                        </p>
                        {scmType === 'github' && (
                          <>
                            <p>• Uses GitHub REST API v3</p>
                            <p>• Supports public & private repos</p>
                            <p>• Detects GitHub Actions workflows</p>
                          </>
                        )}
                        {scmType === 'gitlab' && (
                          <>
                            <p>• Uses GitLab API v4</p>
                            <p>• Supports public & private projects</p>
                            <p>• Detects GitLab CI/CD pipelines</p>
                          </>
                        )}
                        {scmType === 'bitbucket' && (
                          <p>• Integration coming soon</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repo-url" className="text-base font-semibold">Repository URL *</Label>
                  <Input
                    id="repo-url"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder={scmType === 'github' ? 'https://github.com/owner/repository' : 'https://gitlab.com/owner/project'}
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full URL of your repository (e.g., {scmType === 'github' ? 'https://github.com/facebook/react' : 'https://gitlab.com/gitlab-org/gitlab'})
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="access-token" className="text-base font-semibold">Access Token (Optional)</Label>
                    <Badge variant="outline" className="text-xs">Private repos only</Badge>
                  </div>
                  <Input
                    id="access-token"
                    type="password"
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="h-12 font-mono text-sm"
                  />
                  <Alert className="bg-muted/50 border-muted">
                    <Info size={16} />
                    <AlertDescription className="text-xs space-y-2">
                      <p className="font-semibold text-foreground">How to generate an access token:</p>
                      {scmType === 'github' && (
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Go to GitHub Settings → Developer settings</li>
                          <li>Select Personal access tokens → Tokens (classic)</li>
                          <li>Click "Generate new token (classic)"</li>
                          <li>Select the <code className="bg-muted px-1 rounded">repo</code> scope for full access</li>
                          <li>Copy and paste the generated token above</li>
                        </ol>
                      )}
                      {scmType === 'gitlab' && (
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Go to GitLab User Settings → Access Tokens</li>
                          <li>Click "Add new token"</li>
                          <li>Select the <code className="bg-muted px-1 rounded">read_api</code> scope</li>
                          <li>Click "Create personal access token"</li>
                          <li>Copy and paste the generated token above</li>
                        </ol>
                      )}
                      <p className="text-warning font-medium mt-2">🔒 Your token is never stored and only used for this request</p>
                    </AlertDescription>
                  </Alert>
                </div>

                {fetchError && (
                  <Alert variant="destructive">
                    <Info size={16} />
                    <AlertDescription className="font-medium">{fetchError}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleFetchFromSCM}
                  disabled={isFetching || !repoUrl.trim()}
                  className="w-full h-12 gap-2 text-base shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  {isFetching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Fetching Repository Data...
                    </>
                  ) : (
                    <>
                      <CloudArrowDown size={24} weight="duotone" />
                      Fetch & Analyze Repository
                    </>
                  )}
                </Button>

                {fetchedData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-success/30 bg-gradient-to-br from-success/[0.03] to-transparent shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle size={22} weight="fill" className="text-success" />
                          Repository Data Successfully Fetched
                        </CardTitle>
                        <CardDescription>The following data has been extracted from your repository</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Repository</span>
                            <p className="font-semibold text-lg">{fetchedData.fullName}</p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Visibility</span>
                            <Badge variant={fetchedData.visibility === 'public' ? 'secondary' : 'default'} className="capitalize text-sm">
                              {fetchedData.visibility}
                            </Badge>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Complexity</span>
                            <Badge 
                              variant={fetchedData.estimatedComplexity === 'high' ? 'destructive' : fetchedData.estimatedComplexity === 'medium' ? 'default' : 'secondary'} 
                              className="capitalize text-sm"
                            >
                              {fetchedData.estimatedComplexity}
                            </Badge>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Default Branch</span>
                            <p className="font-mono text-sm font-semibold">{fetchedData.defaultBranch}</p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Branches</span>
                            <p className="font-semibold text-lg">{fetchedData.branches}</p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contributors</span>
                            <p className="font-semibold text-lg">{fetchedData.contributors}</p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Commits</span>
                            <p className="font-semibold text-lg">{fetchedData.commits}+</p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CI/CD Detected</span>
                            <Badge variant={fetchedData.hasCI ? 'default' : 'outline'} className="text-sm">
                              {fetchedData.hasCI ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          {fetchedData.stars > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stars</span>
                              <p className="font-semibold text-lg">{fetchedData.stars.toLocaleString()}</p>
                            </div>
                          )}
                          {fetchedData.forks > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Forks</span>
                              <p className="font-semibold text-lg">{fetchedData.forks.toLocaleString()}</p>
                            </div>
                          )}
                          {fetchedData.openIssues > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Open Issues</span>
                              <p className="font-semibold text-lg">{fetchedData.openIssues}</p>
                            </div>
                          )}
                          {fetchedData.openPRs > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Open PRs</span>
                              <p className="font-semibold text-lg">{fetchedData.openPRs}</p>
                            </div>
                          )}
                        </div>
                        
                        {fetchedData.languages.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Programming Languages</span>
                            <div className="flex flex-wrap gap-2">
                              {fetchedData.languages.map((lang: string) => (
                                <Badge key={lang} variant="secondary" className="text-sm px-3 py-1">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {fetchedData.topics.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Topics & Tags</span>
                            <div className="flex flex-wrap gap-2">
                              {fetchedData.topics.map((topic: string) => (
                                <Badge key={topic} variant="outline" className="text-sm px-3 py-1">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {fetchedData.license && (
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">License</span>
                            <Badge variant="secondary" className="text-sm px-3 py-1">{fetchedData.license}</Badge>
                          </div>
                        )}
                        
                        <Alert className="bg-accent/5 border-accent/20">
                          <Sparkle size={18} weight="fill" className="text-accent" />
                          <AlertDescription className="text-sm">
                            <strong className="text-foreground">Next Steps:</strong> Your project details have been automatically populated. 
                            Continue to the next tabs to review the information and configure migration services or training modules.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </motion.div>
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
