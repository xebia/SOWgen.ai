import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Info,
  Cloud,
  GoogleLogo,
  WindowsLogo,
  Cube
} from '@phosphor-icons/react'
import { GitHubLogo } from '@/components/GitHubLogo'
import { MigrationPathDiagram } from '@/components/MigrationPathDiagram'
import { PlatformLogo } from '@/components/PlatformLogo'
interface ServicesDashboardProps {
  user: User
  onCreateSOWManual?: (platform: ServicePlatform) => void
  onCreateSOWAutomation?: (platform: ServicePlatform) => void
}

const platformIcons: Record<ServicePlatform, any> = {
  github: GithubLogo,
  gitlab: GitlabLogo,
  bitbucket: GitBranch,
  'azure-devops': GitBranch,
  tfs: WindowsLogo,
  svn: GitBranch,
  perforce: GitBranch,
  mercurial: GitBranch,
  aws: Cloud,
  gcp: GoogleLogo,
  azure: WindowsLogo,
  terraform: Cube
}

const platformColors: Record<ServicePlatform, string> = {
  github: 'oklch(0.35 0.18 295)',
  gitlab: 'oklch(0.50 0.14 295)',
  bitbucket: 'oklch(0.42 0.16 295)',
  'azure-devops': 'oklch(0.48 0.18 295)',
  tfs: 'oklch(0.43 0.17 295)',
  svn: 'oklch(0.52 0.20 295)',
  perforce: 'oklch(0.38 0.17 295)',
  mercurial: 'oklch(0.45 0.19 295)',
  aws: 'oklch(0.45 0.16 295)',
  gcp: 'oklch(0.38 0.18 295)',
  azure: 'oklch(0.40 0.17 295)',
  terraform: 'oklch(0.48 0.16 295)'
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
  'azure-devops': ['View Repositories', 'Create PR', 'Run Pipeline'],
  tfs: ['View Source Control', 'Check In Changes', 'Create Branch'],
  svn: ['View Repositories', 'Commit Changes', 'Create Branch'],
  perforce: ['View Depots', 'Submit Changelist', 'Create Branch'],
  mercurial: ['View Repositories', 'Push Changes', 'Create Branch'],
  aws: ['View EC2 Instances', 'Deploy Lambda', 'Check CloudWatch'],
  gcp: ['View GKE Clusters', 'Deploy Function', 'Check Logs'],
  azure: ['View Resources', 'Deploy App Service', 'Check Monitor'],
  terraform: ['Apply Configuration', 'View State', 'Validate Plan']
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
        <div className="sticky top-[73px] z-20 bg-background/95 backdrop-blur-md border-b pb-4 -mx-6 px-6 -mt-8 pt-4 mb-6 shadow-sm">
          <Button 
            variant="ghost" 
            onClick={handleBackToServices}
            className="gap-2 mb-3 -ml-3 hover:bg-primary/5"
          >
            <CaretRight size={18} className="rotate-180" />
            Back to Platforms
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border relative overflow-hidden p-2"
              style={{ backgroundColor: `color-mix(in oklch, ${platformColors[selectedService]} 10%, transparent)` }}
            >
              <PlatformLogo platform={selectedService} size={32} className="object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{serviceName}</h2>
              <p className="text-xs text-muted-foreground">Choose your SOW generation method</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <Card 
              className="cursor-pointer transition-all duration-500 border-2 hover:border-primary/60 group relative overflow-hidden h-full"
              style={{
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px -12px oklch(0.35 0.18 295 / 0.25), 0 10px 20px -8px oklch(0.35 0.18 295 / 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/3 rounded-full blur-2xl transform -translate-x-16 translate-y-16 opacity-0 group-hover:opacity-80 group-hover:scale-125 transition-all duration-700 delay-100" />
              <CardHeader className="relative pb-4">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 shadow-sm border border-primary/10 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.15,
                    rotate: [0, -8, 8, 0],
                    transition: { duration: 0.6, ease: "easeInOut" }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <PencilSimple size={32} weight="duotone" className="text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <CardTitle className="text-2xl mb-2 tracking-tight">Manual Entry</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Craft your SOW by entering project details through our guided form interface
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
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    size="lg" 
                    className="w-full gap-2 mt-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group/btn"
                    onClick={() => onCreateSOWManual?.(selectedService)}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <PencilSimple size={20} weight="duotone" className="relative z-10" />
                    <span className="relative z-10">Start Manual Entry</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.03 }}
          >
            <Card 
              className="cursor-pointer transition-all duration-500 border-2 border-accent/40 hover:border-accent/70 group relative overflow-hidden h-full ring-2 ring-accent/20 shadow-lg"
              style={{
                boxShadow: '0 10px 20px -5px oklch(0.52 0.20 295 / 0.15), 0 4px 6px -2px oklch(0.52 0.20 295 / 0.1)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 25px 50px -12px oklch(0.52 0.20 295 / 0.35), 0 15px 30px -10px oklch(0.52 0.20 295 / 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 20px -5px oklch(0.52 0.20 295 / 0.15), 0 4px 6px -2px oklch(0.52 0.20 295 / 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-accent/4 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 xebia-dots-pattern opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/15 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:scale-175 transition-all duration-700 animate-pulse-soft" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16 opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 delay-150" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:blur-3xl group-hover:scale-125 transition-all duration-700" />
              
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, oklch(0.52 0.20 295 / 0.12), transparent 70%)'
                }}
              />
              
              <CardHeader className="relative pb-4">
                <div className="flex items-center justify-between mb-5">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shadow-md border-2 border-accent/30 ring-2 ring-accent/10 relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.7, ease: "easeInOut" }
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100"
                    />
                    <GitBranch size={32} weight="duotone" className="text-accent relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <Badge className="gap-1.5 bg-accent/90 text-white border-accent shadow-md hover:bg-accent animate-pulse-soft group-hover:scale-110 transition-transform duration-300">
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    size="lg" 
                    className="w-full gap-2 mt-6 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white border-0 font-semibold text-base h-12 relative overflow-hidden group/btn"
                    onClick={() => onCreateSOWAutomation?.(selectedService)}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 animate-pulse-soft" />
                    <GitBranch size={22} weight="duotone" className="relative z-10" />
                    <span className="relative z-10">Connect & Auto-Import</span>
                    <Sparkle size={18} weight="fill" className="ml-auto animate-pulse-soft relative z-10 group-hover/btn:rotate-180 transition-transform duration-500" />
                  </Button>
                </motion.div>
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
      <div className="sticky top-[73px] z-20 bg-background/95 backdrop-blur-md border-b pb-4 -mx-6 px-6 -mt-8 pt-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Platform Services</h2>
            <p className="text-sm text-muted-foreground">Select a platform to generate your SOW</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
            <Sparkle size={12} weight="fill" />
            <span>Powered by Xebia</span>
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
              className="min-h-[400px]"
            >
              <Card
                className="cursor-pointer transition-all duration-500 hover:border-primary/60 border-2 group relative overflow-hidden h-full"
                style={{
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px -12px ${platformColors[service.id]}40, 0 10px 20px -8px ${platformColors[service.id]}30`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 xebia-dots-pattern opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transform translate-x-16 -translate-y-16 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"
                  style={{ backgroundColor: `color-mix(in oklch, ${platformColors[service.id]} 12%, transparent)` }}
                />
                
                <div 
                  className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl transform -translate-x-12 translate-y-12 opacity-0 group-hover:opacity-80 group-hover:scale-125 transition-all duration-700 delay-75"
                  style={{ backgroundColor: `color-mix(in oklch, ${platformColors[service.id]} 8%, transparent)` }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${platformColors[service.id]}08, transparent 70%)`
                  }}
                />
                
                <CardHeader className="pb-4 relative">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border relative overflow-hidden p-2"
                      style={{ 
                        backgroundColor: `color-mix(in oklch, ${platformColors[service.id]} 10%, transparent)`,
                        borderColor: `color-mix(in oklch, ${platformColors[service.id]} 15%, transparent)`
                      }}
                      whileHover={{ 
                        scale: 1.15,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5, ease: "easeInOut" }
                      }}
                    >
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at center, ${platformColors[service.id]}20, transparent 70%)`
                        }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PlatformLogo platform={service.id} size={44} className="object-contain relative z-10" />
                      </motion.div>
                    </motion.div>
                  </div>
                  <CardTitle className="text-2xl mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">{service.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="space-y-2 mb-3">
                    {quickActions[service.id].slice(0, 3).map((action, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <div 
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: platformColors[service.id] }}
                        />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="lg" 
                      className="w-full gap-2 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative z-10">Generate SOW</span>
                      <CaretRight size={18} className="group-hover:translate-x-2 transition-transform duration-300 relative z-10" weight="bold" />
                    </Button>
                  </motion.div>
                </CardContent>
                
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to right, transparent, ${platformColors[service.id]}00, ${platformColors[service.id]}, ${platformColors[service.id]}00, transparent)`
                  }}
                />
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
            Why Use Automated Platform Integration?
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
              Eliminate manual data entry errors by connecting directly to your platform. Fetch accurate metrics, configurations, and statistics in seconds.
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
