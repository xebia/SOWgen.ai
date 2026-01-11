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
  FileCode,
  Cube,
  CloudArrowUp,
  Article,
  Rocket,
  CaretRight,
  PencilSimple,
  GitBranch,
  Sparkle
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'

interface ServicesDashboardProps {
  user: User
  onCreateSOWManual?: () => void
  onCreateSOWAutomation?: () => void
}

const platformIcons: Record<ServicePlatform, any> = {
  github: GithubLogo,
  gitlab: GitlabLogo,
  aws: CloudArrowUp,
  azure: CloudArrowUp,
  gcp: CloudArrowUp,
  kubernetes: Cube,
  docker: Cube,
  terraform: FileCode
}

const platformColors: Record<ServicePlatform, string> = {
  github: 'oklch(0.3 0.05 250)',
  gitlab: 'oklch(0.45 0.15 25)',
  aws: 'oklch(0.35 0.08 45)',
  azure: 'oklch(0.45 0.15 230)',
  gcp: 'oklch(0.55 0.12 25)',
  kubernetes: 'oklch(0.40 0.12 240)',
  docker: 'oklch(0.45 0.12 220)',
  terraform: 'oklch(0.35 0.08 270)'
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
  aws: ['Launch Instance', 'View Costs', 'Check Logs'],
  azure: ['Deploy App', 'View Resources', 'Monitor'],
  gcp: ['Deploy Service', 'View Billing', 'Logs Explorer'],
  kubernetes: ['View Pods', 'Scale Deployment', 'Logs'],
  docker: ['Build Image', 'View Containers', 'Registry'],
  terraform: ['Plan', 'Apply', 'View State']
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
    if (serviceId === 'github' || serviceId === 'gitlab') {
      setSelectedService(serviceId)
      setShowSOWOptions(true)
    }
  }

  const handleBackToServices = () => {
    setShowSOWOptions(false)
    setSelectedService(null)
  }

  if (showSOWOptions && selectedService) {
    const Icon = platformIcons[selectedService]
    const serviceName = services.find(s => s.id === selectedService)?.name || selectedService
    
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={handleBackToServices}
              className="gap-2 mb-4 -ml-3"
            >
              <CaretRight size={18} className="rotate-180" />
              Back to Services
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `color-mix(in oklch, ${platformColors[selectedService]} 15%, transparent)` }}
              >
                <Icon size={24} weight="duotone" style={{ color: platformColors[selectedService] }} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">{serviceName}</h2>
            </div>
            <p className="text-muted-foreground">Choose how to generate your Statement of Work</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-primary/50 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PencilSimple size={28} weight="duotone" className="text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">Manual Entry</CardTitle>
                <CardDescription className="text-base">
                  Enter project details manually to generate your Statement of Work
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span>Complete control over all details</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span>Step-by-step guided form</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span>Perfect for new projects</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full gap-2 mt-4"
                  onClick={onCreateSOWManual}
                >
                  <PencilSimple size={20} weight="duotone" />
                  Create Manually
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-accent/50 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GitBranch size={28} weight="duotone" className="text-accent" />
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Sparkle size={14} weight="fill" />
                    Recommended
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2">Automation</CardTitle>
                <CardDescription className="text-base">
                  Connect to {serviceName} via REST API to automatically fetch repository data
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span>Real-time data from {serviceName}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span>Auto-detect CI/CD pipelines</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={18} weight="fill" className="text-success mt-0.5 flex-shrink-0" />
                    <span>Analyze complexity & languages</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full gap-2 mt-4"
                  onClick={onCreateSOWAutomation}
                >
                  <GitBranch size={20} weight="duotone" />
                  Use Automation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Services Dashboard</h2>
          <p className="text-muted-foreground">Select a service to generate your Statement of Work</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.slice(0, 4).map((service, idx) => {
          const Icon = platformIcons[service.id]
          const isClickable = service.id === 'github' || service.id === 'gitlab'
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className={`transition-all group ${
                  isClickable 
                    ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-primary' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => isClickable && handleServiceClick(service.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `color-mix(in oklch, ${platformColors[service.id]} 15%, transparent)` }}
                    >
                      <Icon size={24} weight="duotone" style={{ color: platformColors[service.id] }} />
                    </div>
                    {getHealthBadge(service.healthStatus)}
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Activity</span>
                    <span className="font-semibold">{service.activityCount}</span>
                  </div>
                  {service.lastActivity && (
                    <div className="text-xs text-muted-foreground">
                      Last: {formatDistanceToNow(service.lastActivity, { addSuffix: true })}
                    </div>
                  )}
                  {isClickable && (
                    <Button variant="ghost" size="sm" className="w-full gap-2 mt-2">
                      Generate SOW
                      <CaretRight size={16} />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="all-services">All Services</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activities.slice(0, 5).map((activity) => {
                  const Icon = platformIcons[activity.platform]
                  const StatusIcon = statusConfig[activity.status].icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `color-mix(in oklch, ${platformColors[activity.platform]} 15%, transparent)` }}
                      >
                        <Icon size={16} style={{ color: platformColors[activity.platform] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{activity.title}</p>
                          <StatusIcon size={14} weight="fill" className={statusConfig[activity.status].color} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['github', 'aws', 'kubernetes', 'terraform'].map((platform) => {
                  const Icon = platformIcons[platform as ServicePlatform]
                  const actions = quickActions[platform as ServicePlatform]
                  return (
                    <div key={platform} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon size={16} style={{ color: platformColors[platform as ServicePlatform] }} />
                        {services.find(s => s.id === platform)?.name}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {actions.map((action, idx) => (
                          <Button key={idx} variant="outline" size="sm" className="text-xs">
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Article size={48} className="mx-auto mb-3 opacity-50" />
                    No activities found
                  </div>
                ) : (
                  filteredActivities.map((activity) => {
                    const Icon = platformIcons[activity.platform]
                    const StatusIcon = statusConfig[activity.status].icon
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `color-mix(in oklch, ${platformColors[activity.platform]} 15%, transparent)` }}
                        >
                          <Icon size={20} style={{ color: platformColors[activity.platform] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{activity.title}</p>
                            <Badge variant="outline" className="text-xs">
                              {services.find(s => s.id === activity.platform)?.name}
                            </Badge>
                            <StatusIcon size={16} weight="fill" className={statusConfig[activity.status].color} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                            {activity.user && <span>by {activity.user}</span>}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <CaretRight size={18} />
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-services" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => {
              const Icon = platformIcons[service.id]
              const actions = quickActions[service.id]
              const isClickable = service.id === 'github' || service.id === 'gitlab'
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                >
                  <Card className={`transition-shadow ${isClickable ? 'hover:shadow-md' : 'opacity-60'}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `color-mix(in oklch, ${platformColors[service.id]} 15%, transparent)` }}
                        >
                          <Icon size={24} weight="duotone" style={{ color: platformColors[service.id] }} />
                        </div>
                        {getHealthBadge(service.healthStatus)}
                      </div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-sm">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Activity</span>
                          <span className="font-semibold">{service.activityCount}</span>
                        </div>
                        {service.lastActivity && (
                          <div className="text-xs text-muted-foreground">
                            Last active {formatDistanceToNow(service.lastActivity, { addSuffix: true })}
                          </div>
                        )}
                      </div>
                      {isClickable && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full gap-2"
                          onClick={() => handleServiceClick(service.id)}
                        >
                          Generate SOW
                          <CaretRight size={16} />
                        </Button>
                      )}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Quick Actions</p>
                        <div className="flex flex-wrap gap-2">
                          {actions.map((action, idx) => (
                            <Button key={idx} variant="outline" size="sm" className="text-xs h-8">
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
