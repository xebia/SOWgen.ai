import { useState, useEffect } from 'react'
import { AppProvider, useApp } from '@/lib/app-context'
import { LoginPage } from '@/components/LoginPage'
import { XebiaDashboard } from '@/components/XebiaDashboard'
import { ServicesDashboard } from '@/components/ServicesDashboard'
import { SOWForm } from '@/components/SOWForm'
import { SOWList } from '@/components/SOWList'
import { SOWDetail } from '@/components/SOWDetail'
import { XebiaLogo } from '@/components/XebiaLogo'
import { UserProfile } from '@/components/UserProfile'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SOW, User, ServicePlatform } from '@/lib/types'
import { House, FileText, Stack, SignOut, Sparkle, User as UserIcon, CaretDown } from '@phosphor-icons/react'

type View = 'dashboard' | 'services' | 'sows' | 'sow-form' | 'sow-form-automation' | 'sow-detail'

function AppContent() {
  const { currentUser, setCurrentUser, sows, setSows } = useApp()
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedSOW, setSelectedSOW] = useState<SOW | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<ServicePlatform | null>(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView('dashboard')
    setSelectedSOW(null)
    setSelectedPlatform(null)
  }

  const handleSaveSOW = (sow: SOW) => {
    setSows((prev) => {
      const existing = prev.find(s => s.id === sow.id)
      if (existing) {
        return prev.map(s => s.id === sow.id ? sow : s)
      }
      return [...prev, sow]
    })
    setCurrentView('dashboard')
    setSelectedPlatform(null)
  }

  const handleViewSOW = (sow: SOW) => {
    setSelectedSOW(sow)
    setCurrentView('sow-detail')
  }

  const handleUpdateSOW = (sow: SOW) => {
    setSows((prev) => prev.map(s => s.id === sow.id ? sow : s))
    setSelectedSOW(sow)
  }

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    )
  }

  const isClient = currentUser.role === 'client'
  const isXebia = currentUser.role === 'xebia-admin' || currentUser.role === 'approver'

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 xebia-dots-pattern opacity-15 pointer-events-none" />
      <header className="border-b bg-card/95 backdrop-blur-md sticky top-0 z-10 shadow-sm relative">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <XebiaLogo size={120} />
              </div>
            </div>
            <nav className="flex gap-1">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dashboard')}
                className="gap-2 transition-all duration-200"
              >
                <House size={18} weight={currentView === 'dashboard' ? 'fill' : 'regular'} />
                Dashboard
              </Button>
              {isClient && (
                <Button
                  variant={currentView === 'services' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('services')}
                  className="gap-2 transition-all duration-200"
                >
                  <Stack size={18} weight={currentView === 'services' ? 'fill' : 'regular'} />
                  Services
                </Button>
              )}
              {isXebia && (
                <Button
                  variant={currentView === 'sows' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('sows')}
                  className="gap-2 transition-all duration-200"
                >
                  <FileText size={18} weight={currentView === 'sows' ? 'fill' : 'regular'} />
                  All SOWs
                </Button>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto py-1.5 px-2 hover:bg-muted/50 transition-all duration-200">
                  <Avatar className="h-9 w-9 border-2 border-primary/20 ring-2 ring-primary/10">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary/15 to-accent/10 text-primary">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="font-medium text-sm">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{currentUser.role.replace('-', ' ')}</p>
                  </div>
                  <CaretDown size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowProfileDialog(true)} className="cursor-pointer gap-2">
                  <UserIcon size={16} />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                  <SignOut size={16} />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <UserProfile open={showProfileDialog} onOpenChange={setShowProfileDialog} />

      <main className="container mx-auto px-6 py-8 relative">
        {currentView === 'dashboard' && isClient && (
          <ServicesDashboard 
            user={currentUser} 
            onCreateSOWManual={(platform) => {
              setSelectedPlatform(platform)
              setCurrentView('sow-form')
            }}
            onCreateSOWAutomation={(platform) => {
              setSelectedPlatform(platform)
              setCurrentView('sow-form-automation')
            }}
          />
        )}

        {currentView === 'dashboard' && isXebia && (
          <>
            <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-primary/8 via-accent/8 to-primary/8 border-2 border-primary/15 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 xebia-pattern opacity-40" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2 tracking-tight">Xebia Dashboard</h2>
                <p className="text-muted-foreground mb-4 text-base">Monitor, analyze, and optimize your Statement of Work pipeline</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkle size={18} weight="fill" />
                  <span>Driving excellence through data-driven insights</span>
                </div>
              </div>
            </div>
            <XebiaDashboard sows={sows} />
          </>
        )}

        {currentView === 'services' && isClient && (
          <ServicesDashboard 
            user={currentUser}
            onCreateSOWManual={(platform) => {
              setSelectedPlatform(platform)
              setCurrentView('sow-form')
            }}
            onCreateSOWAutomation={(platform) => {
              setSelectedPlatform(platform)
              setCurrentView('sow-form-automation')
            }}
          />
        )}

        {currentView === 'sow-form' && (
          <SOWForm
            user={currentUser}
            onSave={handleSaveSOW}
            onCancel={() => {
              setCurrentView('dashboard')
              setSelectedPlatform(null)
            }}
            selectedPlatform={selectedPlatform}
          />
        )}

        {currentView === 'sow-form-automation' && (
          <SOWForm
            user={currentUser}
            onSave={handleSaveSOW}
            onCancel={() => {
              setCurrentView('dashboard')
              setSelectedPlatform(null)
            }}
            automationMode={true}
            selectedPlatform={selectedPlatform}
          />
        )}

        {currentView === 'sows' && isXebia && (
          <SOWList
            sows={sows}
            user={currentUser}
            onViewSOW={handleViewSOW}
          />
        )}

        {currentView === 'sow-detail' && selectedSOW && (
          <SOWDetail
            sow={selectedSOW}
            user={currentUser}
            onBack={() => setCurrentView(isXebia ? 'sows' : 'dashboard')}
            onUpdateSOW={handleUpdateSOW}
          />
        )}
      </main>

      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16 relative overflow-hidden">
        <div className="absolute inset-0 xebia-pattern opacity-30" />
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XebiaLogo size={100} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering digital transformation through intelligent automation and cloud excellence
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Our Values</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  Innovation at Scale
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  Client-Centric Excellence
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  Continuous Learning
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 Xebia. All rights reserved.</p>
            <p className="font-medium text-primary">Building Tomorrow, Today</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App