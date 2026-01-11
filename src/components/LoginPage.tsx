import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, UserRole } from '@/lib/types'
import { ArrowRight, Sparkle, CloudArrowUp, Code, ShieldCheck } from '@phosphor-icons/react'

interface LoginPageProps {
  onLogin: (user: User) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [clientEmail, setClientEmail] = useState('')
  const [xebiaEmail, setXebiaEmail] = useState('')

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (clientEmail.trim()) {
      const user: User = {
        id: `client-${Date.now()}`,
        name: clientEmail.split('@')[0] || 'Client User',
        email: clientEmail,
        role: 'client' as UserRole,
        organization: clientEmail.split('@')[1] || 'External Organization'
      }
      onLogin(user)
    }
  }

  const handleXebiaLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (xebiaEmail.trim()) {
      const user: User = {
        id: `xebia-${Date.now()}`,
        name: xebiaEmail.split('@')[0] || 'Xebia User',
        email: xebiaEmail,
        role: 'xebia-admin' as UserRole,
        organization: 'Xebia'
      }
      onLogin(user)
    }
  }

  const handleDemoLogin = (role: UserRole, name: string, org: string) => {
    const user: User = {
      id: `demo-${role}-${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@${org.toLowerCase()}.com`,
      role,
      organization: org
    }
    onLogin(user)
  }

  const features = [
    { icon: CloudArrowUp, title: 'Multi-Cloud', text: 'AWS, Azure, GCP' },
    { icon: Code, title: 'DevOps', text: 'GitHub, GitLab, CI/CD' },
    { icon: ShieldCheck, title: 'Security', text: 'Enterprise-grade' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 xebia-grid-pattern opacity-30" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left space-y-6"
          >
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
              <div className="w-14 h-14 rounded-xl xebia-gradient shadow-lg">
                <div className="xebia-logo-x" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-primary">Xebia</h1>
                <p className="text-sm text-muted-foreground -mt-0.5">SOW Generator</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Statement of Work <br />
                <span className="text-primary">Made Simple</span>
              </h2>
              <p className="text-base font-medium text-accent/80 tracking-wide uppercase">
                Empowering Digital Excellence
              </p>
            </div>
            
            <p className="text-lg sm:text-xl text-foreground/70 max-w-xl">
              Your unified platform for cloud services, DevOps excellence, and intelligent Statement of Work management
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                  className="space-y-2"
                >
                  <div className="w-12 h-12 mx-auto lg:mx-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-primary/20">
                    <feature.icon size={24} weight="duotone" className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-2xl border-2 backdrop-blur-sm bg-card/95">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                  <p className="text-muted-foreground">Sign in to access your services dashboard</p>
                </div>

                <Tabs defaultValue="demo" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="demo">Demo</TabsTrigger>
                    <TabsTrigger value="client">Client</TabsTrigger>
                    <TabsTrigger value="xebia">Xebia</TabsTrigger>
                  </TabsList>

                  <TabsContent value="demo" className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">Quick access for demonstration</p>
                    <Button
                      onClick={() => handleDemoLogin('client', 'Sarah Johnson', 'TechCorp')}
                      variant="outline"
                      className="w-full justify-between h-auto p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Sarah Johnson</div>
                        <div className="text-xs text-muted-foreground">Client • TechCorp</div>
                      </div>
                      <ArrowRight size={20} />
                    </Button>
                    <Button
                      onClick={() => handleDemoLogin('xebia-admin', 'Alex Chen', 'Xebia')}
                      variant="outline"
                      className="w-full justify-between h-auto p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Alex Chen</div>
                        <div className="text-xs text-muted-foreground">Admin • Xebia</div>
                      </div>
                      <ArrowRight size={20} />
                    </Button>
                    <Button
                      onClick={() => handleDemoLogin('approver', 'Morgan Taylor', 'Xebia')}
                      variant="outline"
                      className="w-full justify-between h-auto p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Morgan Taylor</div>
                        <div className="text-xs text-muted-foreground">Approver • Xebia</div>
                      </div>
                      <ArrowRight size={20} />
                    </Button>
                  </TabsContent>

                  <TabsContent value="client">
                    <form onSubmit={handleClientLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="client-email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="client-email"
                          type="email"
                          placeholder="you@company.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 text-base gap-2">
                        Continue
                        <ArrowRight size={20} weight="bold" />
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="xebia">
                    <form onSubmit={handleXebiaLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="xebia-email" className="text-sm font-medium">
                          Xebia Email
                        </Label>
                        <Input
                          id="xebia-email"
                          type="email"
                          placeholder="you@xebia.com"
                          value={xebiaEmail}
                          onChange={(e) => setXebiaEmail(e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 text-base gap-2">
                        Sign In
                        <ArrowRight size={20} weight="bold" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
