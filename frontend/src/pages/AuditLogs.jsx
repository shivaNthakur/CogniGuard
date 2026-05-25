import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import { MOCK_AUDIT_LOGS } from '../mock/mockData'
import { Download, Search, Filter } from 'lucide-react'

const ADMIN_LINKS = [
  { to:'/dashboard',   label:'SOC Dashboard' },
  { to:'/admin',       label:'Admin Home' },
  { to:'/admin/users', label:'Users' },
  { to:'/admin/system',label:'System' },
  { to:'/admin/audit', label:'Audit Logs' },
]

const ACTION_COLORS = {
  FREEZE_SESSION:   '#FF3B5C',
  RESOLVE_ALERT:    '#00FF87',
  CONFIG_CHANGE:    '#FFB800',
  STEP_UP_AUTH:     '#00D4FF',
  USER_DEACTIVATED: '#a78bfa',
}

const FULL_LOGS = [
  ...MOCK_AUDIT_LOGS,
  { id:'LOG-006', actor:'Priya Analyst', action:'FREEZE_SESSION',   target:'USR-8832', at:'3h ago',  details:'Automated freeze - VPN detected' },
  { id:'LOG-007', actor:'Admin User',    action:'CONFIG_CHANGE',    target:'SYSTEM',   at:'5h ago',  details:'Agent weights rebalanced' },
  { id:'LOG-008', actor:'Priya Analyst', action:'RESOLVE_ALERT',    target:'ALT-004',  at:'6h ago',  details:'False positive confirmed' },
  { id:'LOG-009', actor:'Priya Analyst', action:'STEP_UP_AUTH',     target:'USR-6610', at:'8h ago',  details:'Step-up biometric triggered' },
  { id:'LOG-010', actor:'Admin User',    action:'USER_DEACTIVATED', target:'USR-7721', at:'2d ago',  details:'Reported scam account deactivated' },
]

export default function AuditLogs() {
  const [search, setSearch] = useState('')
  const [actorFilter, setActorFilter] = useState('All')

  const actors = ['All', ...new Set(FULL_LOGS.map(l => l.actor))]
  const filtered = FULL_LOGS.filter(l => {
    if (actorFilter !== 'All' && l.actor !== actorFilter) return false
    if (search && !JSON.stringify(l).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen" style={{ background:'#050A14' }}>
      <Navbar links={ADMIN_LINKS} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-white">Audit Logs</h1>
            <p className="text-slate-400 text-sm mt-1">Complete record of all analyst and admin actions</p>
          </div>
          <button className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm"
            onClick={() => alert('CSV export — connect backend')}>
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..." className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            {actors.map(a => (
              <button key={a} onClick={() => setActorFilter(a)}
                className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                  actorFilter===a
                    ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-400'
                    : 'border-white/10 text-slate-500 hover:text-slate-300'
                }`}>{a}</button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-wider"
            style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(15,32,64,0.3)' }}>
            <span>Time</span><span>Actor</span><span>Action</span>
            <span>Target</span><span>Details</span>
          </div>
          {filtered.map((log, i) => {
            const color = ACTION_COLORS[log.action] || '#64748b'
            return (
              <div key={log.id}
                className="grid grid-cols-5 px-5 py-4 items-center text-sm transition-colors"
                style={{ borderBottom: i < filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(0,212,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <span className="text-xs font-mono text-slate-500">{log.at}</span>
                <span className="text-slate-300 font-semibold">{log.actor}</span>
                <span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{ color, background: color+'14', border:`1px solid ${color}30` }}>
                    {log.action}
                  </span>
                </span>
                <span className="font-mono text-xs text-slate-400">{log.target}</span>
                <span className="text-xs text-slate-400 truncate">{log.details}</span>
              </div>
            )
          })}
        </div>

        <p className="text-center text-slate-600 text-xs font-mono mt-6">
          Showing {filtered.length} of {FULL_LOGS.length} log entries · Connect backend for real-time logs
        </p>
      </div>
    </div>
  )
}