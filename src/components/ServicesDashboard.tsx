import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, ServicePlatform, ServiceActivity, PlatformService, ActivityStatus } from '@/lib/types'
import { getPlatformServices, generateAllPlatformActivities } from '@/lib/service-data'
import {
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Clock,
  Warning,
  GithubLogo,
  GitlabLogo,
  GitBranch,
  Article,
  Rocket,
  CaretRight,
  PencilSimple,
  Sparkle,
  Info
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { MigrationPathDiagram } from '@/components/MigrationPathDiagram'

interface ServicesDashboardProps {
  user: User
  onCreateSOWManual?: (platform: ServicePlatform) => void
  onCreateSOWAutomation?: (platform: ServicePlatform) => void
}

const platformIcons: Record<ServicePlatform, any> = {
  github: GithubLogo,
  gitlab: GitlabLogo,
  bitbucket: GitBranch,
  'azure-devops': GitBranch
}

const platformColors: Record<ServicePlatform, string> = {
  github: 'oklch(0.32 0.08 270)',
  gitlab: 'oklch(0.52 0.18 30)',
  bitbucket: 'oklch(0.42 0.16 250)',
  'azure-devops': 'oklch(0.48 0.18 240)'
}

const statusConfig: Record<ActivityStatus, { icon: any; color: string; label: string }> = {
  success: { icon: CheckCircle, color: 'text-success', label: 'Success' },
  failed: { icon: XCircle, color: 'text-destructive', label: 'Failed' },
  pending: { icon: Clock, color: 'text-warning', label: 'Pending' },
  warning: { icon: Warning, color: 'text-warning', label: 'Warning' }
}

const quickActions: Record<ServicePlatform, string[]> = {
  github: ['View Repositories', 'Create PR', 'Run Workflow'],
  gitlab: ['View Projects', 'Create MR', 'Run Pipeline'],
  bitbucket: ['View Repositories', 'Create PR', 'Run Pipeline'],
  'azure-devops': ['View Repositories', 'Create PR', 'Run Pipeline']
}

export function ServicesDashboard({ user, onCreateSOWManual, onCreateSOWAutomation }: ServicesDashboardProps) {
  const [services] = useState<PlatformService[]>(getPlatformServices())
  const [activities] = useState<ServiceActivity[]>(generateAllPlatformActivities(15))
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedService, setSelectedService] = useState<ServicePlatform | null>(null)
  const [showSOWOptions, setShowSOWOptions] = useState(false)

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = 
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesPlatform = filterPlatform === 'all' || activity.platform === filterPlatform
      const matchesStatus = filterStatus === 'all' || activity.status === filterStatus
      
      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [activities, searchQuery, filterPlatform, filterStatus])

  const getHealthBadge = (status: PlatformService['healthStatus']) => {
    const config = {
      healthy: { variant: 'success' as const, label: 'Healthy' },
      warning: { variant: 'warning' as const, label: 'Warning' },
      error: { variant: 'destructive' as const, label: 'Error' },
      unknown: { variant: 'secondary' as const, label: 'Unknown' }
    }
    const { variant, label } = config[status]
    return <Badge variant={variant}>{label}</Badge>
  }

  const handleServiceClick = (serviceId: ServicePlatform) => {
    setSelectedService(serviceId)
    setShowSOWOptions(true)
  }

  const handleBackToServices = () => {
    setShowSOWOptions(false)
    setSelectedService(null)
  }

  if (showSOWOptions && selectedService) {
    const Icon = platformIcons[selectedService]
    const serviceName = services.find(s => s.id === selectedService)?.name || selectedService
    
    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={handleBackToServices}
              className="gap-2 mb-4 -ml-3 hover:bg-primary/5"
            >
              <CaretRight size={18} className="rotate-180" />
              Back to Platforms
            </Button>
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border"
                style={{ backgroundColor: `color-mix(in oklch, ${platformColors[selectedService]} 10%, transparent)` }}
              >
                <Icon size={28} weight="duotone" style={{ color: platformColors[selectedService] }} />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{serviceName}</h2>
                <p className="text-sm text-muted-foreground mt-1">Statement of Work Generation</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Choose your preferred method to create a comprehensive Statement of Work for your {serviceName} project
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/60 group relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-500" />
              <CardHeader className="relative pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary/10">
                  <PencilSimple size={32} weight="duotone" className="text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2 tracking-tight">Manual Entry</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Craft your Statement of Work by entering project details through our guided form interface
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-5">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Complete control over every detail and specification</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Intuitive step-by-step guided workflow</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Ideal for greenfield projects and custom requirements</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Save drafts and iterate at your own pace</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full gap-2 mt-6 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => onCreateSOWManual?.(selectedService)}
                >
                  <PencilSimple size={20} weight="duotone" />
                  Start Manual Entry
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] border-2 border-accent/40 hover:border-accent/70 group relative overflow-hidden h-full ring-2 ring-accent/20 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/4 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 xebia-dots-pattern opacity-[0.15]" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/15 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-500 animate-pulse-soft" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
              <CardHeader className="relative pb-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md border-2 border-accent/30 ring-2 ring-accent/10">
                    <GitBranch size={32} weight="duotone" className="text-accent" />
                  </div>
                  <Badge className="gap-1.5 bg-accent/90 text-white border-accent shadow-md hover:bg-accent animate-pulse-soft">
                    <Sparkle size={14} weight="fill" />
                    Recommended
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2 tracking-tight">Automated Import</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Connect directly to your {serviceName} repository via REST API and auto-populate project data
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-5">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Real-time data fetched directly from {serviceName}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Automatic detection of CI/CD pipelines and workflows</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Intelligent analysis of codebase complexity and languages</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle size={14} weight="fill" className="text-success" />
                    </div>
                    <span className="text-foreground/80">Drastically reduces data entry time and errors</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full gap-2 mt-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white border-0 font-semibold text-base h-12"
                  onClick={() => onCreateSOWAutomation?.(selectedService)}
                >
                  <GitBranch size={22} weight="duotone" />
                  Connect & Auto-Import
                  <Sparkle size={18} weight="fill" className="ml-auto animate-pulse-soft" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <MigrationPathDiagram 
          sourcePlatform={selectedService} 
          className="max-w-5xl"
        />

        <Card className="max-w-5xl bg-muted/30 border-muted">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info size={20} className="text-muted-foreground" />
              Integration Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Automated Import</strong> uses the official {serviceName} REST API to securely fetch repository metadata including:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Repository structure, branches, and commit history</li>
              <li>Programming languages and technology stack</li>
              <li>CI/CD configuration and workflow definitions</li>
              <li>Contributor count and collaboration metrics</li>
              <li>Open issues, pull requests, and project activity</li>
            </ul>
            <p className="pt-2">
              Your access token is only used for the API request and is never stored. Private repositories require a valid token with appropriate read permissions.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">SCM Platforms</h2>
          <p className="text-muted-foreground">Select a source code management platform to generate your Statement of Work</p>
          <div className="flex items-center gap-2 mt-3 text-sm font-medium text-accent">
            <Sparkle size={14} weight="fill" />
            <span>Powered by Xebia's intelligent automation</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl">
        {services.map((service, idx) => {
          const Icon = platformIcons[service.id]
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/60 border-2 group relative overflow-hidden h-full"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 xebia-dots-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"
                  style={{ backgroundColor: `color-mix(in oklch, ${platformColors[service.id]} 8%, transparent)` }}
                />
                <CardHeader className="pb-4 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm border"
                      style={{ 
                        backgroundColor: `color-mix(in oklch, ${platformColors[service.id]} 10%, transparent)`,
                        borderColor: `color-mix(in oklch, ${platformColors[service.id]} 15%, transparent)`
                      }}
                    >
                      <Icon size={32} weight="duotone" style={{ color: platformColors[service.id] }} />
                    </div>
                    {getHealthBadge(service.healthStatus)}
                  </div>
                  <CardTitle className="text-2xl mb-2 tracking-tight">{service.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Activity Count</span>
                      <p className="text-2xl font-bold">{service.activityCount}</p>
                    </div>
                    {service.lastActivity && (
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Last Active</span>
                        <p className="text-sm font-semibold">{formatDistanceToNow(service.lastActivity, { addSuffix: true })}</p>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="lg" className="w-full gap-2 mt-4 group-hover:bg-primary/5">
                    Generate SOW
                    <CaretRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="max-w-4xl bg-gradient-to-br from-muted/50 to-muted/30 border-muted relative overflow-hidden">
        <div className="absolute inset-0 xebia-pattern opacity-20" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-xl flex items-center gap-2">
            <Rocket size={24} weight="duotone" className="text-accent" />
            Why Use Automated SCM Integration?
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Leveraging Xebia's expertise in DevOps and cloud transformation
          </p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-success" />
              Accuracy & Speed
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Eliminate manual data entry errors by connecting directly to your repository. Fetch accurate metrics, CI/CD configurations, and codebase statistics in seconds.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-success" />
              Comprehensive Analysis
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get instant insights into project complexity, technology stack, team size, and development activity to create more accurate project proposals.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-success" />
              Secure & Private
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your access tokens are never stored and only used for API requests. All data fetching happens securely through official platform APIs with read-only access.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-success" />
              Always Up-to-Date
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time data ensures your Statement of Work reflects the current state of your project, including the latest commits, branches, and workflow configurations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
