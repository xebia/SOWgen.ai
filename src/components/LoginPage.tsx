import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, UserRole } from '@/lib/types'
import { XebiaLogo } from '@/components/XebiaLogo'
import { ArrowRight, Sparkle, Lightning, Rocket } from '@phosphor-icons/react'

interface LoginPageProps {
  onLogin: (user: User) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [clientEmail, setClientEmail] = useState('')
  const [clientOrganization, setClientOrganization] = useState('')
  const [xebiaEmail, setXebiaEmail] = useState('')

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (clientEmail.trim() && clientOrganization.trim()) {
      const user: User = {
        id: `client-${Date.now()}`,
        name: clientEmail.split('@')[0] || 'Client User',
        email: clientEmail,
        role: 'client' as UserRole,
        organization: clientOrganization
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

  const highlights = [
    { icon: Lightning, title: 'Accelerate', text: 'Faster SOW generation' },
    { icon: Sparkle, title: 'Automate', text: 'Intelligent workflows' },
    { icon: Rocket, title: 'Scale', text: 'Enterprise solutions' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-primary/[0.02] to-accent/[0.03]">
      <div className="absolute inset-0 xebia-dots-pattern opacity-20" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative min-h-screen flex flex-col">
        <header className="absolute top-0 left-0 right-0 z-20 p-6 sm:p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <XebiaLogo size={140} />
            </motion.div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-20">
          <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center lg:text-left space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                    <Sparkle size={16} weight="fill" />
                    SOWGen Platform
                  </div>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                  Transform Your
                  <br />
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                    Project Workflow
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Streamline SOW creation with intelligent automation, seamless integrations, and enterprise-grade collaboration tools.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                {highlights.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                    className="flex flex-col items-center lg:items-start gap-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                      <item.icon size={28} weight="duotone" className="text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-tight">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="pt-4 text-sm text-muted-foreground"
              >
                <p className="italic">Trusted by enterprise teams worldwide</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md mx-auto"
            >
              <Card className="shadow-2xl border-2 border-primary/10 backdrop-blur-sm bg-card/98 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                
                <CardContent className="p-8 sm:p-10">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome</h2>
                    <p className="text-muted-foreground text-base">Sign in to continue to your workspace</p>
                  </div>

                  <Tabs defaultValue="client" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                      <TabsTrigger value="client" className="text-base">Client</TabsTrigger>
                      <TabsTrigger value="xebia" className="text-base">Xebia Team</TabsTrigger>
                    </TabsList>

                    <TabsContent value="client" className="mt-0">
                      <form onSubmit={handleClientLogin} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="client-email" className="text-sm font-semibold">
                            Email Address
                          </Label>
                          <Input
                            id="client-email"
                            type="email"
                            placeholder="you@company.com"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            className="h-12 text-base"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-organization" className="text-sm font-semibold">
                            Organization Name
                          </Label>
                          <Input
                            id="client-organization"
                            type="text"
                            placeholder="Acme Corporation"
                            value={clientOrganization}
                            onChange={(e) => setClientOrganization(e.target.value)}
                            className="h-12 text-base"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full h-13 text-base font-semibold gap-2 shadow-lg shadow-primary/20">
                          Continue to Dashboard
                          <ArrowRight size={20} weight="bold" />
                        </Button>
                        <p className="text-xs text-center text-muted-foreground pt-2">
                          Access services and create SOWs
                        </p>
                      </form>
                    </TabsContent>

                    <TabsContent value="xebia" className="mt-0">
                      <form onSubmit={handleXebiaLogin} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="xebia-email" className="text-sm font-semibold">
                            Xebia Email
                          </Label>
                          <Input
                            id="xebia-email"
                            type="email"
                            placeholder="you@xebia.com"
                            value={xebiaEmail}
                            onChange={(e) => setXebiaEmail(e.target.value)}
                            className="h-12 text-base"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full h-13 text-base font-semibold gap-2 shadow-lg shadow-primary/20">
                          Sign In to Admin
                          <ArrowRight size={20} weight="bold" />
                        </Button>
                        <p className="text-xs text-center text-muted-foreground pt-2">
                          Monitor and manage all SOWs
                        </p>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <footer className="relative z-10 pb-6 px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm text-muted-foreground"
          >
            © 2026 Xebia. Driving digital transformation.
          </motion.p>
        </footer>
      </div>
    </div>
  )
}
