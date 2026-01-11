import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GithubLogo, GitlabLogo, GitBranch, Cloud, ArrowRight, CheckCircle, Database, GitCommit, Robot, GraduationCap, MagnifyingGlass, ShieldCheck, FolderOpen, GearSix, Wrench, Chalkboard, BookOpen } from '@phosphor-icons/react'
import { GitHubLogo } from '@/components/GitHubLogo'
import { PlatformLogo } from '@/components/PlatformLogo'
import type { ServicePlatform } from '@/lib/types'

interface MigrationPathDiagramProps {
  sourcePlatform: ServicePlatform
  className?: string
}

const platformConfig: Record<ServicePlatform, { name: string; icon: any; color: string; bgColor: string }> = {
  github: {
    name: 'GitHub',
    icon: GithubLogo,
    color: 'oklch(0.35 0.18 295)',
    bgColor: 'oklch(0.35 0.18 295 / 0.1)'
  },
  gitlab: {
    name: 'GitLab',
    icon: GitlabLogo,
    color: 'oklch(0.50 0.14 295)',
    bgColor: 'oklch(0.50 0.14 295 / 0.1)'
  },
  bitbucket: {
    name: 'Bitbucket',
    icon: GitBranch,
    color: 'oklch(0.42 0.16 295)',
    bgColor: 'oklch(0.42 0.16 295 / 0.1)'
  },
  'azure-devops': {
    name: 'Azure DevOps',
    icon: Cloud,
    color: 'oklch(0.48 0.18 295)',
    bgColor: 'oklch(0.48 0.18 295 / 0.1)'
  },
  tfs: {
    name: 'Team Foundation Server',
    icon: Cloud,
    color: 'oklch(0.43 0.17 295)',
    bgColor: 'oklch(0.43 0.17 295 / 0.1)'
  },
  svn: {
    name: 'Subversion (SVN)',
    icon: GitBranch,
    color: 'oklch(0.52 0.20 295)',
    bgColor: 'oklch(0.52 0.20 295 / 0.1)'
  },
  perforce: {
    name: 'Perforce Helix Core',
    icon: GitBranch,
    color: 'oklch(0.38 0.17 295)',
    bgColor: 'oklch(0.38 0.17 295 / 0.1)'
  },
  mercurial: {
    name: 'Mercurial',
    icon: GitBranch,
    color: 'oklch(0.45 0.19 295)',
    bgColor: 'oklch(0.45 0.19 295 / 0.1)'
  },
  aws: {
    name: 'Amazon Web Services',
    icon: Cloud,
    color: 'oklch(0.45 0.16 295)',
    bgColor: 'oklch(0.45 0.16 295 / 0.1)'
  },
  gcp: {
    name: 'Google Cloud Platform',
    icon: Cloud,
    color: 'oklch(0.38 0.18 295)',
    bgColor: 'oklch(0.38 0.18 295 / 0.1)'
  },
  azure: {
    name: 'Microsoft Azure',
    icon: Cloud,
    color: 'oklch(0.40 0.17 295)',
    bgColor: 'oklch(0.40 0.17 295 / 0.1)'
  },
  terraform: {
    name: 'Terraform',
    icon: Database,
    color: 'oklch(0.48 0.16 295)',
    bgColor: 'oklch(0.48 0.16 295 / 0.1)'
  }
}

const migrationSteps = [
  {
    id: 'discovery',
    icon: MagnifyingGlass,
    title: 'Discovery & Analysis',
    description: 'Repository assessment and planning'
  },
  {
    id: 'setup',
    icon: ShieldCheck,
    title: 'Initial Setup',
    description: 'SAML SSO and security configuration'
  },
  {
    id: 'repo-migration',
    icon: FolderOpen,
    title: 'Repo Migration',
    description: 'Code and history transfer'
  },
  {
    id: 'cicd-migration',
    icon: GearSix,
    title: 'CI/CD Migration',
    description: 'Pipeline conversion and testing'
  },
  {
    id: 'cicd-implementation',
    icon: Wrench,
    title: 'CI/CD Implementation',
    description: 'Full automation deployment'
  },
  {
    id: 'training',
    icon: Chalkboard,
    title: 'Team Training',
    description: 'Platform onboarding sessions'
  },
  {
    id: 'support',
    icon: BookOpen,
    title: 'Support & Documentation',
    description: 'Ongoing assistance and guides'
  }
]

export function MigrationPathDiagram({ sourcePlatform, className = '' }: MigrationPathDiagramProps) {
  const source = platformConfig[sourcePlatform]
  const target = platformConfig.github
  const SourceIcon = source.icon

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Migration Path</h3>
        <p className="text-sm text-muted-foreground">
          End-to-end journey from {source.name} to {target.name}
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-4 md:gap-6 relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Card className="border-2 shadow-lg" style={{ borderColor: source.color }}>
              <CardContent className="p-6 text-center">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-md p-3"
                  style={{ backgroundColor: source.bgColor }}
                >
                  <PlatformLogo platform={sourcePlatform} size={56} className="object-contain" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">{source.name}</h4>
                  <Badge variant="secondary" className="text-xs">Source Platform</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex-1 relative min-w-0">
            <div className="hidden md:block">
              <svg className="w-full h-24" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: source.color, stopOpacity: 0.6 }} />
                    <stop offset="100%" style={{ stopColor: target.color, stopOpacity: 0.6 }} />
                  </linearGradient>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill={target.color} />
                  </marker>
                </defs>
                <motion.path
                  d="M 0 50 Q 25 20, 50 50 T 100 50"
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
                />
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <Badge className="whitespace-nowrap px-3 py-1 shadow-lg bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                    <ArrowRight size={14} weight="bold" className="mr-1.5" />
                    Xebia Migration
                  </Badge>
                </motion.div>
              </div>
            </div>

            <div className="md:hidden flex items-center justify-center py-4">
              <ArrowRight size={32} weight="bold" className="text-primary" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Card className="border-2 shadow-lg" style={{ borderColor: target.color }}>
              <CardContent className="p-6 text-center">
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-md p-3"
                  style={{ backgroundColor: target.bgColor }}
                >
                  <PlatformLogo platform="github" size={56} className="object-contain" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">{target.name}</h4>
                  <Badge className="text-xs bg-success/15 text-success hover:bg-success/25">Target Platform</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-muted/40 to-muted/20 border-muted">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-success" />
              Project Deliverables
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Migrating to</span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/10">
                <PlatformLogo platform="github" size={16} className="object-contain" />
                <span className="font-medium text-foreground">GitHub</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
              {migrationSteps.map((step, index) => {
                const StepIcon = step.icon
                const isNotLast = index < migrationSteps.length - 1
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="relative"
                  >
                    <div className="relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-background shadow-md z-10">
                        <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                      </div>
                      <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-primary/20 bg-background relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardContent className="p-5 space-y-3 relative z-10">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center shadow-sm">
                            <StepIcon size={24} weight="duotone" className="text-primary" />
                          </div>
                          <h5 className="font-bold text-sm leading-tight">{step.title}</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    {isNotLast && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index + 0.2 }}
                        className="hidden xl:block absolute top-1/2 -right-4 -translate-y-1/2 z-20"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-background shadow-md backdrop-blur-sm">
                          <ArrowRight size={16} weight="bold" className="text-primary" />
                        </div>
                      </motion.div>
                    )}
                    {isNotLast && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index + 0.2 }}
                        className="xl:hidden flex justify-center my-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-background shadow-md">
                          <ArrowRight size={16} weight="bold" className="text-primary rotate-90" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle size={18} weight="fill" className="text-accent" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h5 className="font-semibold text-sm">Seamless Migration Process to</h5>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-background border border-primary/20">
                  <PlatformLogo platform="github" size={14} className="object-contain" />
                  <span className="text-xs font-semibold">GitHub</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Xebia's proven methodology ensures zero data loss, minimal downtime, and complete team alignment throughout the migration journey to GitHub's enterprise platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
