import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import { MOCK_AUDIT_LOGS } from '../mock/mockData'
import { Shield, Users, Settings, FileText, Activity, CheckCircle, AlertTriangle, Database, Cpu, Server } from 'lucide-react'

const ADMIN_LINKS = [
  { to:'/dashboard',   label:'SOC Dashboard' },
  { to:'/monitor',     label:'Session Monitor' },
  { to:'/alerts',      label:'Alerts' },
  { to:'/admin',       label:'Admin Home' },
  { to:'/admin/users', label:'Users' },
  { to:'/admin/system',label:'System' },
  { to:'/admin/audit', label:'Audit Logs' },
]

const SERVICES = [
  { name:'Kafka Event Stream', status:'Healthy', uptime:'99.9%', color:'#00FF87', icon: Activity },
  { name:'AI Risk Engine',     status:'Healthy', uptime:'99.7%', color:'#00FF87', icon: Cpu },
  { name:'Redis Session Store',status:'Healthy', uptime:'100%', color:'#00FF87', icon: Database },
  { name:'PostgreSQL DB',      status:'Healthy', uptime:'99.8%', color:'#00FF87', icon: Server },
  { name:'WebSocket Gateway',  status:'Healthy', uptime:'99.6%', color:'#00FF87', icon: Shield },
]

export default function AdminPanel() {
  const { user } = useAuth()
  const nav = useNavigate()
  return (
    <div className="min-h-screen" style={{ background:'#050A14' }}>
      <Navbar links={ADMIN_LINKS} />
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl text-white">Admin Control Panel</h1>
          <p className="text-slate-400 text-sm mt-1">System health · User management · Configuration · Audit trail</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label:'Total Users',      val:'4',  color:'#00D4FF', icon: Users },
            { label:'Total Analysts',   val:'1',  color:'#FFB800', icon: Shield },
            { label:'Sessions Today',   val:'47', color:'#00FF87', icon: Activity },
            { label:'Active Threats',   val:'3',  color:'#FF3B5C', icon: AlertTriangle },
          ].map(s => (
            <div key={s.label} className="glass stat-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: s.color+'18', border:`1px solid ${s.color}28` }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <div className="font-display font-bold text-3xl text-white mb-1"
                style={{ textShadow:`0 0 16px ${s.color}44` }}>{s.val}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 glass rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white mb-5">System Services Health</h3>
            <div className="flex flex-col gap-3">
              {SERVICES.map(s => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background:'rgba(15,32,64,0.4)', border:'1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background:'rgba(0,255,135,0.1)', border:'1px solid rgba(0,255,135,0.2)' }}>
                      <s.icon className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm text-slate-300">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500">{s.uptime} uptime</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400 font-mono">{s.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold text-white mb-5">Admin Sections</h3>
            <div className="flex flex-col gap-3">
              {[
                { label:'User Management', sub:'Create, deactivate, reset', to:'/admin/users',  icon: Users,     color:'#00D4FF' },
                { label:'System Config',   sub:'Thresholds, agent weights', to:'/admin/system', icon: Settings,  color:'#FFB800' },
                { label:'Audit Logs',      sub:'All analyst actions',       to:'/admin/audit',  icon: FileText,  color:'#00FF87' },
              ].map(item => (
                <button key={item.label} onClick={() => nav(item.to)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left w-full transition-all duration-200"
                  style={{ background:'rgba(15,32,64,0.4)', border:`1px solid ${item.color}18` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = item.color+'44'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = item.color+'18'}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: item.color+'15', border:`1px solid ${item.color}28` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

       
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-white">Recent Analyst Actions</h3>
            <button onClick={() => nav('/admin/audit')} className="btn-ghost text-xs px-3 py-1.5">Full Audit Log</button>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_AUDIT_LOGS.map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background:'rgba(15,32,64,0.3)', border:'1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex items-center gap-10">
                  <span className="text-xs font-mono text-slate-500 w-24 flex-shrink-0">{log.at}</span>
                  <span className="text-sm font-semibold text-slate-300 w-32 flex-shrink-0">{log.actor}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{ color:'#FFB800', background:'rgba(255,184,0,0.1)', border:'1px solid rgba(255,184,0,0.25)' }}>
                    {log.action}
                  </span>
                  <span className="text-xs text-slate-400">{log.details}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">{log.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}