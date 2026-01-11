import { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, SOW } from '@/lib/types'

interface AppContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  sows: SOW[]
  setSows: (sows: SOW[] | ((prev: SOW[]) => SOW[])) => void
  users: User[]
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useKV<User | null>('current-user', null)
  const [sows, setSows] = useKV<SOW[]>('sows', [])
  const [users, setUsers] = useKV<User[]>('users', [])

  return (
    <AppContext.Provider
      value={{
        currentUser: currentUser ?? null,
        setCurrentUser,
        sows: sows ?? [],
        setSows,
        users: users ?? [],
        setUsers,
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
