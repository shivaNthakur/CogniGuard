import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import { Save, Info } from 'lucide-react'

const ADMIN_LINKS = [
  { to:'/dashboard',   label:'SOC Dashboard' },
  { to:'/admin',       label:'Admin Home' },
  { to:'/admin/users', label:'Users' },
  { to:'/admin/system',label:'System' },
  { to:'/admin/audit', label:'Audit Logs' },
]

const AGENTS = [
  { key:'identity',  label:'Identity Agent',  default:25, color:'#00D4FF' },
  { key:'cognitive', label:'Cognitive Agent', default:20, color:'#00FF87' },
  { key:'financial', label:'Financial Agent', default:25, color:'#FFB800' },
  { key:'threat',    label:'Threat Intel',    default:15, color:'#FF3B5C' },
  { key:'coercion',  label:'Emotional Agent', default:15, color:'#a78bfa' },
]

export default function SystemConfig() {
  const [freeze,   setFreeze]   = useState(40)
  const [timeout,  setTimeout2] = useState(30)
  const [weights,  setWeights]  = useState({ identity:25, cognitive:20, financial:25, threat:15, coercion:15 })
  const [saved,    setSaved]    = useState(false)
  const [model,    setModel]    = useState('v2.4.1-prod')

  const totalWeight = Object.values(weights).reduce((a,b) => a+b, 0)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="min-h-screen" style={{ background:'#050A14' }}>
      <Navbar links={ADMIN_LINKS} />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-white">System Configuration</h1>
            <p className="text-slate-400 text-sm mt-1">Thresholds · Agent weights · Session settings</p>
          </div>
          <button onClick={save} className="btn-primary flex items-center gap-2 px-5 py-3">
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

  
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-display font-semibold text-white mb-1">FREEZE Threshold</h3>
          <p className="text-slate-500 text-sm mb-5">Sessions with trust score below this value are instantly frozen.</p>
          <div className="flex items-center gap-5">
            <input type="range" min={10} max={60} value={freeze} onChange={e => setFreeze(+e.target.value)}
              className="flex-1 accent-red-400" />
            <div className="w-16 h-12 rounded-xl flex items-center justify-center font-display font-bold text-xl"
              style={{ background:'rgba(255,59,92,0.15)', border:'1px solid rgba(255,59,92,0.3)', color:'#FF3B5C' }}>
              {freeze}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Info className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-400">Default: 40. Lower = more aggressive freezing. Recommended: 35–45.</p>
          </div>
        </div>

     
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-white mb-1">Agent Weight Distribution</h3>
              <p className="text-slate-500 text-sm">How much each agent influences the final trust score.</p>
            </div>
            <div className={`text-sm font-mono font-bold px-3 py-1.5 rounded-xl ${
              totalWeight===100 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
            }`}>Total: {totalWeight}%</div>
          </div>
          <div className="flex flex-col gap-5">
            {AGENTS.map(a => (
              <div key={a.key}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-300">{a.label}</span>
                  <span className="text-sm font-mono font-bold" style={{ color: a.color }}>{weights[a.key]}%</span>
                </div>
                <input type="range" min={5} max={50} value={weights[a.key]}
                  onChange={e => setWeights(p => ({ ...p, [a.key]: +e.target.value }))}
                  className="w-full" style={{ accentColor: a.color }} />
              </div>
            ))}
          </div>
        </div>

    
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-display font-semibold text-white mb-5">Session Settings</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">
                Session Timeout (min)
              </label>
              <input type="number" value={timeout} onChange={e => setTimeout2(+e.target.value)}
                className="input-field text-sm" min={5} max={120} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-mono uppercase tracking-wider mb-2">
                Model Version
              </label>
              <input value={model} onChange={e => setModel(e.target.value)}
                className="input-field text-sm" />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-white">Email Notifications</h3>
              <p className="text-slate-500 text-sm mt-1">Alert SOC team via email on CRITICAL events</p>
            </div>
            <div className="text-xs text-amber-400 font-mono px-3 py-1.5 rounded-xl"
              style={{ background:'rgba(255,184,0,0.08)', border:'1px solid rgba(255,184,0,0.2)' }}>
              Backend connection required
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}