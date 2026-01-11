import { useState } from 'react'
import { AppProvider, useApp } from '@/lib/app-context'
import { LoginPage } from '@/components/LoginPage'
import { XebiaDashboard } from '@/components/XebiaDashboard'
import { ServicesDashboard } from '@/components/ServicesDashboard'
import { SOWForm } from '@/components/SOWForm'
import { SOWList } from '@/components/SOWList'
import { SOWDetail } from '@/components/SOWDetail'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { SOW, User, ServicePlatform } from '@/lib/types'
import { House, FileText, Stack, SignOut } from '@phosphor-icons/react'

type View = 'dashboard' | 'services' | 'sows' | 'sow-form' | 'sow-form-automation' | 'sow-detail'

function AppContent() {
  const { currentUser, setCurrentUser, sows, setSows } = useApp()
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedSOW, setSelectedSOW] = useState<SOW | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<ServicePlatform | null>(null)

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg xebia-gradient shadow-md">
                  <div className="xebia-logo-x" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-primary">Xebia</h1>
                  <p className="text-xs text-muted-foreground -mt-0.5">SOW Generator</p>
                </div>
              </div>
            </div>
            <nav className="flex gap-1">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dashboard')}
                className="gap-2"
              >
                <House size={18} />
                Dashboard
              </Button>
              {isClient && (
                <Button
                  variant={currentView === 'services' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('services')}
                  className="gap-2"
                >
                  <Stack size={18} />
                  Services
                </Button>
              )}
              {isXebia && (
                <Button
                  variant={currentView === 'sows' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('sows')}
                  className="gap-2"
                >
                  <FileText size={18} />
                  All SOWs
                </Button>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser.role.replace('-', ' ')}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <SignOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
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
          <XebiaDashboard sows={sows} />
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