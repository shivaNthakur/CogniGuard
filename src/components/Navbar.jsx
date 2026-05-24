import { Shield, Activity, Bell, LayoutDashboard } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'monitor', label: 'Session Monitor', icon: Activity },
  { id: 'alerts', label: 'Alerts', icon: Bell },
]

export default function Navbar({ page, navigate }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-panel/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate('landing')} className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-trust/10 border border-trust/30 group-hover:border-trust/60 transition-all duration-300" />
            <Shield className="absolute inset-1.5 w-5 h-5 text-trust" />
          </div>
          <span className="font-display font-700 text-lg tracking-wide text-text-primary">
            Cogni<span className="text-gradient-trust">Guard</span>
          </span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all duration-200
                ${page === id
                  ? 'bg-trust/10 text-trust border border-trust/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-safe/20 bg-safe/5">
          <span className="w-2 h-2 rounded-full bg-safe animate-pulse-slow" />
          <span className="text-xs font-mono text-safe">SYSTEM ACTIVE</span>
        </div>
      </div>
    </nav>
  )
}
