import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <motion.div 
        className="absolute inset-0 xebia-dots-pattern opacity-15 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
      />
      <motion.header 
        className="border-b bg-card/98 backdrop-blur-lg sticky top-0 z-50 shadow-sm relative"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <XebiaLogo size={100} />
            </motion.div>
            <nav className="flex gap-0.5">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dashboard')}
                size="sm"
                className={`gap-1.5 h-8 px-3 text-xs transition-all duration-200 ${currentView === 'dashboard' ? 'bg-[oklch(0.52_0.20_295)] hover:bg-[oklch(0.48_0.20_295)] text-white' : ''}bg-pink-900 text-slate-50 bg-pink-900`}
              >
                <House size={16} weight={currentView === 'dashboard' ? 'fill' : 'regular'} />
                Dashboard
              </Button>
              {isClient && (
                <Button
                  variant={currentView === 'services' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('services')}
                  size="sm"
                  className={`gap-1.5 h-8 px-3 text-xs transition-all duration-200 ${currentView === 'services' ? 'bg-[oklch(0.52_0.20_295)] hover:bg-[oklch(0.48_0.20_295)] text-white' : ''}`}
                >
                  <Stack size={16} weight={currentView === 'services' ? 'fill' : 'regular'} />
                  Services
                </Button>
              )}
              {isXebia && (
                <Button
                  variant={currentView === 'sows' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('sows')}
                  size="sm"
                  className={`gap-1.5 h-8 px-3 text-xs transition-all duration-200 ${currentView === 'sows' ? 'bg-[oklch(0.52_0.20_295)] hover:bg-[oklch(0.48_0.20_295)] text-white' : ''}`}
                >
                  <FileText size={16} weight={currentView === 'sows' ? 'fill' : 'regular'} />
                  All SOWs
                </Button>
              )}
            </nav>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1.5 h-8 px-2 hover:bg-muted/50 transition-all duration-200">
                <Avatar className="h-6 w-6 border border-primary/20">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/15 to-accent/10 text-primary">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium hidden md:inline">{currentUser.name}</span>
                <CaretDown size={14} className="text-muted-foreground hidden md:inline" />
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
      </motion.header>
      <UserProfile open={showProfileDialog} onOpenChange={setShowProfileDialog} />
      <main className="container mx-auto px-6 py-8 relative">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && isClient && (
            <motion.div
              key="client-dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}

          {currentView === 'dashboard' && isXebia && (
            <motion.div
              key="xebia-dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}

          {currentView === 'services' && isClient && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}

          {currentView === 'sow-form' && (
            <motion.div
              key="sow-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SOWForm
                user={currentUser}
                onSave={handleSaveSOW}
                onCancel={() => {
                  setCurrentView('dashboard')
                  setSelectedPlatform(null)
                }}
                selectedPlatform={selectedPlatform}
              />
            </motion.div>
          )}

          {currentView === 'sow-form-automation' && (
            <motion.div
              key="sow-form-automation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          )}

          {currentView === 'sows' && isXebia && (
            <motion.div
              key="sows-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SOWList
                sows={sows}
                user={currentUser}
                onViewSOW={handleViewSOW}
              />
            </motion.div>
          )}

          {currentView === 'sow-detail' && selectedSOW && (
            <motion.div
              key="sow-detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <SOWDetail
                sow={selectedSOW}
                user={currentUser}
                onBack={() => setCurrentView(isXebia ? 'sows' : 'dashboard')}
                onUpdateSOW={handleUpdateSOW}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <motion.footer 
        className="border-t bg-card/50 backdrop-blur-sm mt-16 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 xebia-pattern opacity-30" />
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <XebiaLogo size={120} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering digital transformation through intelligent automation and cloud excellence
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="font-semibold mb-3 text-sm">Our Values</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <motion.li 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  Innovation at Scale
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  Client-Centric Excellence
                </motion.li>
                <motion.li 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  Continuous Learning
                </motion.li>
              </ul>
            </motion.div>
          </div>
          <motion.div 
            className="pt-6 border-t flex items-center justify-between text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p>© 2026 Xebia. All rights reserved.</p>
            <p className="font-medium text-primary">Building Tomorrow, Today</p>
          </motion.div>
        </div>
      </motion.footer>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App