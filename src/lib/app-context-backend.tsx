import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, SOW } from '@/lib/types'
import { addRevisionToSOW } from './version-tracker'
import { authAPI, usersAPI, sowsAPI } from './api-client'

interface AppContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  sows: SOW[]
  setSows: (sows: SOW[] | ((prev: SOW[]) => SOW[])) => void
  users: User[]
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void
  loading: boolean
  useBackend: boolean
  refreshSows: () => Promise<void>
  refreshUsers: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Check if backend is enabled via environment variable
const BACKEND_ENABLED = import.meta.env.VITE_USE_BACKEND === 'true'

export function AppProvider({ children }: { children: ReactNode }) {
  // Legacy KV storage (for backward compatibility)
  const [kvCurrentUser, setKvCurrentUser] = useKV<User | null>('current-user', null)
  const [kvSows, setKvSows] = useKV<SOW[]>('sows', [])
  const [kvUsers, setKvUsers] = useKV<User[]>('users', [])

  // Backend API state
  const [apiCurrentUser, setApiCurrentUser] = useState<User | null>(null)
  const [apiSows, setApiSows] = useState<SOW[]>([])
  const [apiUsers, setApiUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  // Choose which storage to use
  const useBackend = BACKEND_ENABLED
  const currentUser = useBackend ? apiCurrentUser : kvCurrentUser ?? null
  const sows = useBackend ? apiSows : kvSows ?? []
  const users = useBackend ? apiUsers : kvUsers ?? []

  // Fetch data from backend when enabled
  useEffect(() => {
    if (useBackend) {
      loadUserFromToken()
    }
  }, [])

  const loadUserFromToken = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        setLoading(true)
        const user = await authAPI.getCurrentUser()
        setApiCurrentUser(user)
        await refreshSows()
        await refreshUsers()
      } catch (error) {
        console.error('Failed to load user from token:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setLoading(false)
      }
    }
  }

  const refreshSows = async () => {
    if (useBackend) {
      try {
        const sowsData = await sowsAPI.getAll()
        setApiSows(sowsData)
      } catch (error) {
        console.error('Failed to refresh SOWs:', error)
      }
    }
  }

  const refreshUsers = async () => {
    if (useBackend && apiCurrentUser?.role === 'xebia-admin') {
      try {
        const usersData = await usersAPI.getAll()
        setApiUsers(usersData)
      } catch (error) {
        console.error('Failed to refresh users:', error)
      }
    }
  }

  // Wrapper functions for setting state
  const setCurrentUser = (user: User | null) => {
    if (useBackend) {
      setApiCurrentUser(user)
      if (user) {
        localStorage.setItem('auth_token', 'set_by_login') // Will be set by login
      } else {
        localStorage.removeItem('auth_token')
      }
    } else {
      setKvCurrentUser(user)
    }
  }

  const setSows = (updater: SOW[] | ((prev: SOW[]) => SOW[])) => {
    if (useBackend) {
      if (typeof updater === 'function') {
        setApiSows(updater)
      } else {
        setApiSows(updater)
      }
      // Note: Backend updates should be done via API calls, not direct state updates
    } else {
      setKvSows(updater)
    }
  }

  const setUsers = (updater: User[] | ((prev: User[]) => User[])) => {
    if (useBackend) {
      if (typeof updater === 'function') {
        setApiUsers(updater)
      } else {
        setApiUsers(updater)
      }
      // Note: Backend updates should be done via API calls, not direct state updates
    } else {
      setKvUsers(updater)
    }
  }

  // Legacy compatibility: version migration for KV storage
  useEffect(() => {
    if (!useBackend && sows && sows.length > 0) {
      let needsUpdate = false
      const updatedSows = sows.map(sow => {
        if (sow.currentVersion === undefined || sow.revisionHistory === undefined) {
          needsUpdate = true
          return {
            ...sow,
            currentVersion: 1,
            revisionHistory: []
          }
        }
        return sow
      })

      if (needsUpdate) {
        setKvSows(updatedSows)
      }
    }
  }, [useBackend])

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        sows,
        setSows,
        users,
        setUsers,
        loading,
        useBackend,
        refreshSows,
        refreshUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
