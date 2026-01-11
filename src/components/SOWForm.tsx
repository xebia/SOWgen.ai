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
import { SOW, User, MigrationStageDetail, SelectedTraining, MigrationStage, GitHubMigrationType, RepositoryInventory, ServicePlatform } from '@/lib/types'
import { TRAINING_MODULES, getModuleById } from '@/lib/training-catalog'
import { X, Plus, GithubLogo, GitlabLogo, GitBranch, Sparkle, CloudArrowDown, CheckCircle, Info, Calculator, GraduationCap, Cloud } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { fetchRepositoryData, generateProjectDescription, type RepositoryData, type SCMPlatform } from '@/lib/scm-api'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MigrationPathDiagram } from '@/components/MigrationPathDiagram'
import { GitHubLogo } from '@/components/GitHubLogo'
import { PlatformLogo } from '@/components/PlatformLogo'

interface SOWFormProps {
  user: User
  onSave: (sow: SOW) => void
  onCancel: () => void
  automationMode?: boolean
  selectedPlatform?: ServicePlatform | null
}

const MIGRATION_STAGES: { value: MigrationStage; label: string; defaultWeeks: number }[] = [
  { value: 'initial-setup', label: 'Initial Setup', defaultWeeks: 2 },
  { value: 'repository-migration', label: 'Repository Migration', defaultWeeks: 3 },
  { value: 'cicd-migration', label: 'CI/CD Migration', defaultWeeks: 4 },
  { value: 'cicd-implementation', label: 'CI/CD Implementation', defaultWeeks: 5 },
  { value: 'training-sessions', label: 'Training Sessions', defaultWeeks: 2 },
]

export function SOWForm({ user, onSave, onCancel, automationMode = false, selectedPlatform = null }: SOWFormProps) {
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

  const [githubMigrationType, setGithubMigrationType] = useState<GitHubMigrationType | ''>('')
  const [repoInventory, setRepoInventory] = useState<RepositoryInventory>({
    totalRepositories: undefined as any,
    publicRepos: undefined as any,
    privateRepos: undefined as any,
    archivedRepos: undefined as any,
    totalSizeGB: undefined as any,
    languages: [],
    hasLFS: false,
    hasSubmodules: false,
    averageRepoSizeMB: undefined as any,
    usersToMigrate: undefined
  })
  const [includeCICD, setIncludeCICD] = useState(false)
  const [cicdPlatform, setCicdPlatform] = useState('')
  const [cicdDetails, setCicdDetails] = useState('')

  const calculateManHours = (inventory: RepositoryInventory, migrationType: GitHubMigrationType) => {
    let baseHoursPerRepo = 2
    
    if (migrationType === 'github-emu') {
      baseHoursPerRepo = 3
    } else if (migrationType === 'ghes') {
      baseHoursPerRepo = 4
    }
    
    let totalHours = inventory.totalRepositories * baseHoursPerRepo
    
    if (inventory.hasLFS) totalHours += inventory.totalRepositories * 0.5
    if (inventory.hasSubmodules) totalHours += inventory.totalRepositories * 0.3
    if (inventory.totalSizeGB > 100) totalHours += 20
    
    totalHours += inventory.languages.length * 2
    
    return Math.ceil(totalHours)
  }

  useEffect(() => {
    if (repoInventory.totalRepositories > 0 && githubMigrationType) {
      const manHours = calculateManHours(repoInventory, githubMigrationType as GitHubMigrationType)
      setMigrationStages(prev => {
        const repoMigrationStage = prev.find(s => s.stage === 'repository-migration')
        if (repoMigrationStage) {
          return prev.map(s => 
            s.stage === 'repository-migration' 
              ? { ...s, estimatedManHours: manHours, githubMigrationType: githubMigrationType as GitHubMigrationType, repositoryInventory: repoInventory }
              : s
          )
        } else {
          return [...prev, {
            stage: 'repository-migration',
            description: `Migrate ${repoInventory.totalRepositories} repositories to ${githubMigrationType.replace(/-/g, ' ').toUpperCase()}`,
            technicalDetails: `Type: ${githubMigrationType}, Size: ${repoInventory.totalSizeGB}GB, Languages: ${repoInventory.languages.join(', ')}`,
            timelineWeeks: Math.ceil(manHours / 40),
            automated: true,
            githubMigrationType: githubMigrationType as GitHubMigrationType,
            repositoryInventory: repoInventory,
            estimatedManHours: manHours
          }]
        }
      })
    }
  }, [repoInventory, githubMigrationType])

  useEffect(() => {
    if (repoInventory.usersToMigrate && repoInventory.usersToMigrate > 0) {
      setSelectedTrainings(prev => 
        prev.map(training => ({
          ...training,
          participantCount: repoInventory.usersToMigrate || training.participantCount
        }))
      )
    }
  }, [repoInventory.usersToMigrate])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentTab])

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
    const defaultParticipants = repoInventory.usersToMigrate || 1
    setSelectedTrainings(prev => [...prev, { moduleId, participantCount: defaultParticipants }])
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

    if (includeMigration && !githubMigrationType) {
      toast.error('GitHub migration type is required')
      return
    }

    if (includeMigration && repoInventory.totalRepositories === undefined) {
      toast.error('Total repositories is required')
      return
    }

    if (includeMigration && repoInventory.totalSizeGB === undefined) {
      toast.error('Total size is required')
      return
    }

    if (includeMigration && includeCICD && !cicdPlatform) {
      toast.error('Please select CI/CD platform')
      return
    }

    const finalMigrationStages = [...migrationStages]
    
    if (includeCICD && cicdPlatform) {
      const cicdStageExists = finalMigrationStages.some(s => s.stage === 'cicd-migration')
      if (!cicdStageExists) {
        finalMigrationStages.push({
          stage: 'cicd-migration',
          description: `Migrate CI/CD pipelines from ${cicdPlatform} to GitHub Actions`,
          technicalDetails: cicdDetails,
          timelineWeeks: 3,
          automated: false,
          includeCICDMigration: true,
          cicdPlatform: cicdPlatform,
          cicdDetails: cicdDetails
        })
      }
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
      migrationStages: finalMigrationStages,
      includeTraining,
      selectedTrainings,
      approvalHistory: []
    }

    onSave(sow)
    toast.success(isDraft ? 'SOW saved as draft' : 'SOW submitted for approval')
  }

  const getRelevantTrainingModules = () => {
    return {
      github: TRAINING_MODULES.filter(m => m.track === 'github'),
    }
  }

  const trackGroups = getRelevantTrainingModules()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/8 via-accent/8 to-primary/8 border-2 border-primary/15 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 xebia-pattern opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl font-bold tracking-tight">Create SOW</h2>
            {automationMode && (
              <Badge variant="secondary" className="gap-1.5 bg-accent/15 text-accent-foreground border-accent/30">
                <Sparkle size={14} weight="fill" />
                Automation Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mb-3 text-base">
            {automationMode 
              ? 'Fetch project data from your SCM repository and fill in additional details'
              : 'Fill in the details for your project requirements'}
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-3">
            <Sparkle size={16} weight="fill" />
            <span>Powered by Xebia's intelligent project analysis</span>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className={automationMode ? 'grid w-full grid-cols-3' : 'grid w-full grid-cols-2'}>
          {automationMode && <TabsTrigger value="scm-integration">SCM Integration</TabsTrigger>}
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="migration">Migration & Training</TabsTrigger>
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
                <div className="space-y-2">
                  <Label className="text-base font-semibold">SCM Platform</Label>
                  <div className="flex items-center gap-3 p-4 border-2 rounded-lg bg-muted/30">
                    <PlatformLogo platform="github" size={24} className="object-contain" />
                    <div>
                      <div className="font-semibold text-lg">GitHub</div>
                      <div className="text-sm text-muted-foreground">Connect to GitHub repositories</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repo-url" className="text-base font-semibold">Organization / Project URL *</Label>
                  <Input
                    id="repo-url"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="h-12 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full URL of your organization or project (e.g., https://github.com/facebook/react)
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
                      <p className="font-semibold text-foreground">How to generate a GitHub access token:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Go to GitHub Settings → Developer settings</li>
                        <li>Select Personal access tokens → Tokens (classic)</li>
                        <li>Click "Generate new token (classic)"</li>
                        <li>Select the <code className="bg-muted px-1 rounded">repo</code> scope for full access</li>
                        <li>Copy and paste the generated token above</li>
                      </ol>
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
                  className="w-full h-12 gap-2 text-base shadow-md hover:shadow-lg transition-all bg-foreground text-background hover:bg-foreground/90"
                  size="lg"
                >
                  {isFetching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      Connecting & Auto Importing...
                    </>
                  ) : (
                    <>
                      <CloudArrowDown size={24} weight="duotone" />
                      Connect & Auto Import
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

        <TabsContent value="migration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Migration Services</CardTitle>
              <CardDescription>Configure repository migration, CI/CD setup, and team training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!includeMigration ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Enable migration services in the Project Details tab to configure options</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <GitHubLogo size={24} className="object-contain" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">GitHub Migration Type *</h3>
                          <p className="text-sm text-muted-foreground">Select the target GitHub platform for migration</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Select value={githubMigrationType} onValueChange={(value: any) => setGithubMigrationType(value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select GitHub migration type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="github-classic">
                              <div className="flex items-center gap-2">
                                <GitHubLogo size={16} />
                                <span className="font-medium">GitHub Classic (Cloud)</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="github-emu">
                              <div className="flex items-center gap-2">
                                <PlatformLogo platform="github" size={16} className="object-contain" />
                                <span className="font-medium">GitHub EMU (Enterprise Managed Users)</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="ghes">
                              <div className="flex items-center gap-2">
                                <PlatformLogo platform="github" size={16} className="object-contain" />
                                <span className="font-medium">GitHub Enterprise Server (GHES)</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {!githubMigrationType && (
                          <p className="text-xs text-muted-foreground">
                            * This field is required
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="users-to-migrate" className="text-base font-semibold">Number of Users to Migrate</Label>
                        <Input
                          id="users-to-migrate"
                          type="number"
                          min="0"
                          value={repoInventory.usersToMigrate ?? ''}
                          onChange={e => setRepoInventory(prev => ({ ...prev, usersToMigrate: parseInt(e.target.value) || undefined }))}
                          placeholder="e.g., 50"
                          className="h-12"
                        />
                        <p className="text-xs text-muted-foreground">
                          Number of users that will be migrated to GitHub. <span className="font-semibold text-accent">This will be used as the default participant count for all training modules.</span>
                        </p>
                      </div>
                      
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">Migration Type Descriptions:</p>
                          <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                            <li><strong>GitHub Classic:</strong> Standard GitHub cloud platform with individual user accounts</li>
                            <li><strong>GitHub EMU:</strong> Enterprise platform with centrally managed user identities and enhanced security</li>
                            <li><strong>GHES:</strong> Self-hosted GitHub instance on your own infrastructure</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <MigrationPathDiagram 
                      sourcePlatform={selectedPlatform || scmType as ServicePlatform} 
                      className="my-6"
                    />

                    <div className="border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Calculator size={24} weight="duotone" className="text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Repository Inventory</h3>
                          <p className="text-sm text-muted-foreground">Provide details about repositories to be migrated</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="total-repos">Total Repositories *</Label>
                          <Input
                            id="total-repos"
                            type="number"
                            min="0"
                            value={repoInventory.totalRepositories ?? ''}
                            onChange={e => setRepoInventory(prev => ({ ...prev, totalRepositories: parseInt(e.target.value) || undefined as any }))}
                            placeholder="e.g., 100"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="public-repos">Public Repositories</Label>
                          <Input
                            id="public-repos"
                            type="number"
                            min="0"
                            value={repoInventory.publicRepos ?? ''}
                            onChange={e => setRepoInventory(prev => ({ ...prev, publicRepos: parseInt(e.target.value) || undefined as any }))}
                            placeholder="e.g., 20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="private-repos">Private Repositories</Label>
                          <Input
                            id="private-repos"
                            type="number"
                            min="0"
                            value={repoInventory.privateRepos ?? ''}
                            onChange={e => setRepoInventory(prev => ({ ...prev, privateRepos: parseInt(e.target.value) || undefined as any }))}
                            placeholder="e.g., 80"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="archived-repos">Archived Repositories</Label>
                          <Input
                            id="archived-repos"
                            type="number"
                            min="0"
                            value={repoInventory.archivedRepos ?? ''}
                            onChange={e => setRepoInventory(prev => ({ ...prev, archivedRepos: parseInt(e.target.value) || undefined as any }))}
                            placeholder="e.g., 10"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="total-size">Total Size (GB) *</Label>
                          <Input
                            id="total-size"
                            type="number"
                            min="0"
                            step="0.1"
                            value={repoInventory.totalSizeGB ?? ''}
                            onChange={e => setRepoInventory(prev => ({ ...prev, totalSizeGB: parseFloat(e.target.value) || undefined as any }))}
                            placeholder="e.g., 50.5"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="avg-repo-size">Avg Repository Size (MB)</Label>
                          <Input
                            id="avg-repo-size"
                            type="number"
                            min="0"
                            step="0.1"
                            value={repoInventory.averageRepoSizeMB ?? ''}
                            onChange={e => setRepoInventory(prev => ({ ...prev, averageRepoSizeMB: parseFloat(e.target.value) || undefined as any }))}
                            placeholder="e.g., 500"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="languages">Programming Languages (comma-separated)</Label>
                        <Input
                          id="languages"
                          value={repoInventory.languages.join(', ')}
                          onChange={e => setRepoInventory(prev => ({ 
                            ...prev, 
                            languages: e.target.value.split(',').map(l => l.trim()).filter(Boolean) 
                          }))}
                          placeholder="JavaScript, Python, Java, Go"
                        />
                      </div>
                      
                      <div className="flex gap-6 mt-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has-lfs"
                            checked={repoInventory.hasLFS}
                            onCheckedChange={(checked) => setRepoInventory(prev => ({ ...prev, hasLFS: checked as boolean }))}
                          />
                          <Label htmlFor="has-lfs" className="cursor-pointer">
                            Includes Git LFS
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has-submodules"
                            checked={repoInventory.hasSubmodules}
                            onCheckedChange={(checked) => setRepoInventory(prev => ({ ...prev, hasSubmodules: checked as boolean }))}
                          />
                          <Label htmlFor="has-submodules" className="cursor-pointer">
                            Includes Git Submodules
                          </Label>
                        </div>
                      </div>
                      
                      {repoInventory.totalRepositories > 0 && githubMigrationType && (
                        <Alert className="mt-4 bg-accent/5 border-accent/20">
                          <Calculator size={18} className="text-accent" />
                          <AlertDescription className="text-sm">
                            <strong className="text-foreground">Estimated Man Hours:</strong> {calculateManHours(repoInventory, githubMigrationType as GitHubMigrationType)} hours
                            <span className="text-muted-foreground ml-2">
                              ({Math.ceil(calculateManHours(repoInventory, githubMigrationType as GitHubMigrationType) / 40)} weeks @ 40 hrs/week)
                            </span>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <CheckCircle size={24} weight="duotone" className="text-success" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">CI/CD Migration</h3>
                            <p className="text-sm text-muted-foreground">Migrate existing CI/CD pipelines</p>
                          </div>
                        </div>
                        <Checkbox
                          id="include-cicd"
                          checked={includeCICD}
                          onCheckedChange={(checked) => setIncludeCICD(checked as boolean)}
                        />
                      </div>
                      
                      {includeCICD && (
                        <div className="space-y-4 pl-13">
                          <div className="space-y-2">
                            <Label htmlFor="cicd-platform">Current CI/CD Platform</Label>
                            <Select value={cicdPlatform} onValueChange={setCicdPlatform}>
                              <SelectTrigger id="cicd-platform">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jenkins">Jenkins</SelectItem>
                                <SelectItem value="gitlab-ci">GitLab CI</SelectItem>
                                <SelectItem value="circleci">CircleCI</SelectItem>
                                <SelectItem value="travis">Travis CI</SelectItem>
                                <SelectItem value="azure-devops">Azure DevOps</SelectItem>
                                <SelectItem value="teamcity">TeamCity</SelectItem>
                                <SelectItem value="bamboo">Bamboo</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cicd-details">CI/CD Details</Label>
                            <Textarea
                              id="cicd-details"
                              value={cicdDetails}
                              onChange={e => setCicdDetails(e.target.value)}
                              placeholder="Number of pipelines, complexity, deployment targets, etc."
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {includeTraining && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <GraduationCap size={24} weight="duotone" className="text-warning" />
                  </div>
                  <div>
                    <CardTitle>Training Modules</CardTitle>
                    <CardDescription>Select training programs for your team</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTrainings.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <Label className="text-base font-semibold">Selected Modules</Label>
                    {selectedTrainings.map(st => {
                      const module = getModuleById(st.moduleId)
                      if (!module) return null
                      return (
                        <div key={st.moduleId} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{module.title}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {module.track.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {module.level}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{module.durationHours}h duration</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm whitespace-nowrap">Participants:</Label>
                              <Input
                                type="number"
                                min="1"
                                value={st.participantCount}
                                onChange={e => handleUpdateParticipants(st.moduleId, parseInt(e.target.value))}
                                className="w-24"
                                placeholder={repoInventory.usersToMigrate ? `${repoInventory.usersToMigrate}` : '1'}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveTraining(st.moduleId)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X size={20} />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Label className="text-base font-semibold">Available Training Modules</Label>
                      {repoInventory.usersToMigrate && repoInventory.usersToMigrate > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Adding a module will use <span className="font-semibold text-primary">{repoInventory.usersToMigrate} participants</span> by default
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="gap-1.5 text-xs">
                      <Info size={12} />
                      GitHub Training
                    </Badge>
                  </div>
                  <Alert className="bg-accent/5 border-accent/20 mb-4">
                    <Info size={16} className="text-accent" />
                    <AlertDescription className="text-sm">
                      All training modules focus on GitHub platform and best practices, regardless of migration source platform.
                      {repoInventory.usersToMigrate && repoInventory.usersToMigrate > 0 && (
                        <span className="block mt-2 font-semibold text-primary">
                          Default participant count: {repoInventory.usersToMigrate} users (from migration users)
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                  {Object.entries(trackGroups).map(([track, modules]) => (
                    <div key={track} className="border rounded-lg p-4">
                      <h4 className="font-semibold capitalize mb-3">{track.replace('-', ' / ')} Training</h4>
                      <div className="space-y-2">
                        {modules.map(module => {
                          const isSelected = selectedTrainings.some(t => t.moduleId === module.id)
                          return (
                            <div key={module.id} className="flex items-center justify-between p-3 border rounded bg-muted/30 hover:bg-muted/50 transition-colors">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{module.title}</span>
                                  <Badge variant="outline" className="text-xs capitalize">{module.level}</Badge>
                                  <span className="text-sm text-muted-foreground">{module.durationHours}h</span>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleAddTraining(module.id)}
                                disabled={isSelected}
                                size="sm"
                                variant={isSelected ? "outline" : "default"}
                              >
                                {isSelected ? 'Added' : 'Add'}
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
