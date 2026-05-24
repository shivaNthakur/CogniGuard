import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import { MOCK_USERS } from '../mock/mockData'
import { Search, UserPlus, Shield, User, ShieldOff } from 'lucide-react'

const ADMIN_LINKS = [
  { to:'/dashboard',   label:'SOC Dashboard' },
  { to:'/admin',       label:'Admin Home' },
  { to:'/admin/users', label:'Users' },
  { to:'/admin/system',label:'System' },
  { to:'/admin/audit', label:'Audit Logs' },
]

const ROLE_COLORS = { user:'#00D4FF', analyst:'#FFB800', admin:'#FF3B5C' }
const STATUS_COLORS = { Active:'#00FF87', Frozen:'#FF3B5C', Inactive:'#64748b' }

export default function UserManagement() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [newUser, setNewUser] = useState({ name:'', email:'', role:'user' })

  const filtered = users.filter(u => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false
    if (search && !JSON.stringify(u).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id
      ? { ...u, status: u.status === 'Active' ? 'Frozen' : 'Active' } : u))
  }

  const addUser = () => {
    if (!newUser.name || !newUser.email) return
    setUsers(prev => [...prev, {
      ...newUser, id: `USR-${Date.now().toString().slice(-4)}`,
      status:'Active', created: new Date().toISOString().slice(0,10)
    }])
    setNewUser({ name:'', email:'', role:'user' })
    setShowAdd(false)
  }

  return (
    <div className="min-h-screen" style={{ background:'#050A14' }}>
      <Navbar links={ADMIN_LINKS} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-white">User Management</h1>
            <p className="text-slate-400 text-sm mt-1">{users.length} accounts · {users.filter(u=>u.status==='Active').length} active</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 px-5 py-3">
            <UserPlus className="w-4 h-4" /> Add Account
          </button>
        </div>

      
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(5,10,20,0.85)' }}>
            <div className="glass-dark rounded-2xl p-8 w-full max-w-md">
              <h3 className="font-display font-bold text-xl text-white mb-6">Create New Account</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Full Name</label>
                  <input value={newUser.name} onChange={e => setNewUser(p=>({...p,name:e.target.value}))}
                    placeholder="Full name" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Email</label>
                  <input value={newUser.email} onChange={e => setNewUser(p=>({...p,email:e.target.value}))}
                    placeholder="email@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">Role</label>
                  <select value={newUser.role} onChange={e => setNewUser(p=>({...p,role:e.target.value}))}
                    className="input-field">
                    <option value="user">Banking User</option>
                    <option value="analyst">SOC Analyst</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1">Cancel</button>
                  <button onClick={addUser} className="btn-primary flex-1">Create Account</button>
                </div>
              </div>
            </div>
          </div>
        )}

     
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, ID..."
              className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2">
            {['All','user','analyst','admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                  roleFilter===r
                    ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-400'
                    : 'border-white/10 text-slate-400 hover:text-slate-200'
                }`}>
                {r === 'All' ? 'All' : r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid gap-0">
            {/* Header */}
            <div className="grid grid-cols-6 px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wider"
              style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(15,32,64,0.3)' }}>
              <span>User ID</span><span>Name</span><span>Email</span>
              <span>Role</span><span>Status</span><span>Actions</span>
            </div>
            {filtered.map((u, i) => {
              const rc = ROLE_COLORS[u.role] || '#64748b'
              const sc = STATUS_COLORS[u.status] || '#64748b'
              return (
                <div key={u.id} className="grid grid-cols-6 px-5 py-4 items-center text-sm transition-colors"
                  style={{ borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(0,212,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <span className="font-mono text-slate-400 text-xs">{u.id}</span>
                  <span className="font-semibold text-white">{u.name}</span>
                  <span className="text-slate-400 text-xs">{u.email}</span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: rc }} />
                    <span className="text-xs font-mono capitalize" style={{ color: rc }}>{u.role}</span>
                  </span>
                  <span>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full"
                      style={{ color: sc, background: sc+'15', border:`1px solid ${sc}30` }}>{u.status}</span>
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(u.id)} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1"
                      style={{ borderColor: u.status==='Active' ? 'rgba(255,59,92,0.3)' : 'rgba(0,255,135,0.3)',
                               color: u.status==='Active' ? '#FF3B5C' : '#00FF87' }}>
                      {u.status==='Active' ? <><ShieldOff className="w-3 h-3"/>Freeze</> : <><Shield className="w-3 h-3"/>Activate</>}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}