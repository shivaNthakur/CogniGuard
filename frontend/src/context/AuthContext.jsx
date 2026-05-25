import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'user@demo.com':     { role: 'user',     name: 'Rahul Sharma',  id: 'USR-4421', password: 'demo123' },
  'analyst@demo.com':  { role: 'analyst',  name: 'Priya Analyst', id: 'ANA-001',  password: 'demo123' },
  'admin@demo.com':    { role: 'admin',    name: 'Admin User',    id: 'ADM-001',  password: 'demo123' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cg_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = async (email, password) => {
    const found = DEMO_USERS[email]
    if (found && password === found.password) {
      const u = { id: found.id, role: found.role, name: found.name, email }
      setUser(u)
      localStorage.setItem('cg_user', JSON.stringify(u))
      return { success: true, role: found.role }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cg_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)