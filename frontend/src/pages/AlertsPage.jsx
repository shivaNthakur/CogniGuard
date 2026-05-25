import { useState } from 'react'
import { AlertTriangle, XCircle, CheckCircle, Shield, Filter, Search, Bell, Clock, User, Cpu } from 'lucide-react'

const ALL_ALERTS = [
  { id: 1, severity: 'critical', type: 'Coercion Detected', msg: 'Emotional stress signatures indicate forced transaction — victim of social engineering', agent: 'Emotional', session: 'USR-1190', time: '2s ago', score: 21, action: 'Account Frozen' },
  { id: 2, severity: 'critical', type: 'Bot Signature', msg: 'Rapid automated transaction sequence detected — likely bot or script attack', agent: 'Threat Intel', session: 'USR-1190', time: '18s ago', score: 21, action: 'SOC Alert Raised' },
  { id: 3, severity: 'high', type: 'VPN / Proxy', msg: 'Session routed through unknown VPN on unrecognized device — first occurrence', agent: 'Threat Intel', session: 'USR-8832', time: '1m ago', score: 58, action: 'Step-up Auth' },
  { id: 4, severity: 'high', type: 'Beneficiary Anomaly', msg: 'New beneficiary added outside normal merchant graph — 4.1× amount deviation', agent: 'Financial', session: 'USR-8832', time: '2m ago', score: 58, action: 'Transaction Hold' },
  { id: 5, severity: 'medium', type: 'Hesitation Spike', msg: 'Navigation hesitation 3.2× above baseline — possible confusion or coercion', agent: 'Cognitive', session: 'USR-6610', time: '4m ago', score: 71, action: 'Silent OTP Sent' },
  { id: 6, severity: 'medium', type: 'Spending Deviation', msg: 'Transaction amount 2.8× salary-cycle average — monitored', agent: 'Financial', session: 'USR-6610', time: '6m ago', score: 71, action: 'Flagged' },
  { id: 7, severity: 'low', type: 'Device Change', msg: 'New browser fingerprint detected — returning user verification passed', agent: 'Identity', session: 'USR-3374', time: '9m ago', score: 87, action: 'Verified' },
  { id: 8, severity: 'resolved', type: 'Step-Up Passed', msg: 'Biometric step-up authentication successful — session resumed normally', agent: 'Identity', session: 'USR-4421', time: '12m ago', score: 94, action: 'Session Resumed' },
  { id: 9, severity: 'resolved', type: 'Normal Pattern', msg: 'Behavioral profile re-established after temporary deviation', agent: 'Cognitive', session: 'USR-3374', time: '18m ago', score: 87, action: 'Cleared' },
]

const SEVERITY_FILTERS = ['all', 'critical', 'high', 'medium', 'low', 'resolved']

const SEVERITY_CONFIG = {
  critical: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/5 border-danger/20', dot: '#FF3366', label: 'CRITICAL' },
  high:     { icon: AlertTriangle, color: 'text-warn', bg: 'bg-warn/5 border-warn/20', dot: '#FF9F00', label: 'HIGH' },
  medium:   { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/5 border-yellow-400/20', dot: '#FACC15', label: 'MEDIUM' },
  low:      { icon: Shield, color: 'text-trust', bg: 'bg-trust/5 border-trust/20', dot: '#00E5FF', label: 'LOW' },
  resolved: { icon: CheckCircle, color: 'text-safe', bg: 'bg-safe/5 border-safe/20', dot: '#00FF88', label: 'RESOLVED' },
}

const STATS = [
  { label: 'Critical', count: 2, color: 'text-danger', bg: 'bg-danger/10 border-danger/20' },
  { label: 'High', count: 2, color: 'text-warn', bg: 'bg-warn/10 border-warn/20' },
  { label: 'Medium', count: 2, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  { label: 'Resolved', count: 2, color: 'text-safe', bg: 'bg-safe/10 border-safe/20' },
]

export default function AlertsPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = ALL_ALERTS.filter(a =>
    (filter === 'all' || a.severity === filter) &&
    (search === '' || a.msg.toLowerCase().includes(search.toLowerCase()) || a.agent.toLowerCase().includes(search.toLowerCase()) || a.session.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-700 text-text-primary">Alerts Center</h1>
            <p className="text-text-secondary text-sm mt-0.5">Threat management and incident response</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-danger/20 bg-danger/5">
            <Bell className="w-4 h-4 text-danger animate-pulse-slow" />
            <span className="font-mono text-sm text-danger">4 ACTIVE THREATS</span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap mb-6">
          {STATS.map(({ label, count, color, bg }) => (
            <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${bg}`}>
              <span className={`font-display text-xl font-700 ${color}`}>{count}</span>
              <span className={`text-xs font-mono ${color}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-6">
          <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-panel/60">
            {SEVERITY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 capitalize
                  ${filter === f ? 'bg-trust/10 text-trust border border-trust/20' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-panel/60 flex-1 min-w-48 max-w-80">
            <Search className="w-3.5 h-3.5 text-text-dim flex-shrink-0" />
            <input
              className="bg-transparent text-xs font-mono text-text-primary placeholder-text-dim outline-none w-full"
              placeholder="Search alerts, agents, sessions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-text-dim">
            <Filter className="w-3.5 h-3.5" />
            <span>{filtered.length} alerts</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(alert => {
            const cfg = SEVERITY_CONFIG[alert.severity]
            const Icon = cfg.icon
            return (
              <div key={alert.id} className={`p-5 rounded-2xl border ${cfg.bg} backdrop-blur-sm transition-all duration-200 hover:shadow-panel group`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.dot + '15', border: `1px solid ${cfg.dot}30` }}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className={`font-mono text-[10px] font-700 px-2 py-0.5 rounded-full`} style={{ backgroundColor: cfg.dot + '15', color: cfg.dot }}>
                        {cfg.label}
                      </span>
                      <span className="font-display text-sm font-600 text-text-primary">{alert.type}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-3">{alert.msg}</p>

                    <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-text-dim">
                        <Cpu className="w-3 h-3" />
                        <span>{alert.agent} Agent</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-dim">
                        <User className="w-3 h-3" />
                        <span>{alert.session}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-dim">
                        <Clock className="w-3 h-3" />
                        <span>{alert.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: cfg.dot }}>
                        <Shield className="w-3 h-3" />
                        <span>Trust: {alert.score}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className={`px-3 py-1 rounded-lg text-[10px] font-mono font-600 ${cfg.color}`} style={{ backgroundColor: cfg.dot + '10', border: `1px solid ${cfg.dot}20` }}>
                      {alert.action}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <CheckCircle className="w-12 h-12 text-safe mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary font-display">No alerts matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
