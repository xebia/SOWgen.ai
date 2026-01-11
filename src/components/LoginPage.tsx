import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, UserRole } from '@/lib/types'

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tight mb-3">SOWGen</h1>
          <p className="text-muted-foreground text-lg">Statement of Work Generation Platform</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="demo" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="demo">Demo Access</TabsTrigger>
                <TabsTrigger value="client">Client Login</TabsTrigger>
                <TabsTrigger value="xebia">Xebia Staff</TabsTrigger>
              </TabsList>

              <TabsContent value="demo" className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Quick access for demonstration purposes</p>
                  <div className="grid gap-3">
                    <Button
                      onClick={() => handleDemoLogin('client', 'Sarah Johnson', 'TechCorp')}
                      variant="outline"
                      className="justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Client - Sarah Johnson</div>
                        <div className="text-sm text-muted-foreground">TechCorp</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => handleDemoLogin('xebia-admin', 'Alex Chen', 'Xebia')}
                      variant="outline"
                      className="justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Xebia Admin - Alex Chen</div>
                        <div className="text-sm text-muted-foreground">Internal Staff</div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => handleDemoLogin('approver', 'Morgan Taylor', 'Xebia')}
                      variant="outline"
                      className="justify-start h-auto p-4"
                    >
                      <div className="text-left">
                        <div className="font-semibold">Approver - Morgan Taylor</div>
                        <div className="text-sm text-muted-foreground">SOW Reviewer</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="client">
                <form onSubmit={handleClientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email Address</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="you@company.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In as Client
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="xebia">
                <form onSubmit={handleXebiaLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="xebia-email">Xebia Email</Label>
                    <Input
                      id="xebia-email"
                      type="email"
                      placeholder="you@xebia.com"
                      value={xebiaEmail}
                      onChange={(e) => setXebiaEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In as Staff
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
