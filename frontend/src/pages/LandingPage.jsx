import { useNavigate } from 'react-router-dom'
import { Shield, Zap, Eye, Lock, ChevronRight, Activity, Users, AlertTriangle } from 'lucide-react'

const AGENTS = [
  { icon:'◈', name:'Identity Agent',  desc:'Keystrokes · Touch · Device biometrics',   color:'#00D4FF' },
  { icon:'◉', name:'Cognitive Agent', desc:'Hesitation · Navigation · Decision speed', color:'#00FF87' },
  { icon:'◆', name:'Financial Agent', desc:'Tx anomalies · Beneficiary trust graph',   color:'#FFB800' },
  { icon:'◑', name:'Threat Intel',    desc:'VPN · Emulator · Root · Bot detection',    color:'#FF3B5C' },
  { icon:'◎', name:'Emotional Agent', desc:'Panic · Coercion · Stress signals',        color:'#a78bfa' },
]

const STATS = [
  { icon: Activity,      val:'<50ms',  label:'Trust Score Latency' },
  { icon: Users,         val:'100%',   label:'Session Coverage' },
  { icon: AlertTriangle, val:'5',      label:'AI Security Agents' },
  { icon: Shield,        val:'0',      label:'False Negatives Target' },
]

export default function LandingPage() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-grid" style={{ background:'#050A14' }}>
  
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl" style={{ background:'rgba(5,10,20,0.9)' }}>
        <div className="flex items-center gap-3">
          <Shield className="text-cyan-400 w-7 h-7" style={{ filter:'drop-shadow(0 0 8px #00D4FF88)' }} />
          <span className="font-display font-bold text-xl text-white">CogniGuard</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => nav('/login')} className="btn-ghost text-sm px-5 py-2">Sign In</button>
          <button onClick={() => nav('/login')} className="btn-primary text-sm px-5 py-2">Get Started</button>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-8 pt-24 pb-20 text-center anim-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-mono"
          style={{ background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', color:'#00D4FF' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Cyber Security PSBs Hackathon 2026 · TEAM INCONSISTENT
        </div>
        <h1 className="font-display font-extrabold text-6xl text-white leading-tight mb-6"
          style={{ textShadow:'0 0 60px rgba(0,212,255,0.2)' }}>
          Stop Fraud.<br />
          <span style={{ color:'#00D4FF', textShadow:'0 0 40px rgba(0,212,255,0.6)' }}>Invisibly.</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          CogniGuard is a Zero Trust continuous behavioral authentication platform that validates every session in real time — no friction, no OTP dependency, no compromise.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => nav('/login')} className="btn-primary px-8 py-4 text-base flex items-center gap-2">
            Try Live Demo <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => nav('/login')} className="btn-ghost px-8 py-4 text-base">
            View SOC Dashboard
          </button>
        </div>
      </section>

   
      <section className="max-w-4xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="glass stat-card rounded-2xl p-6 text-center">
              <s.icon className="w-6 h-6 mx-auto mb-3 text-cyan-400" />
              <div className="font-display font-bold text-3xl text-white mb-1"
                style={{ textShadow:'0 0 20px rgba(0,212,255,0.4)' }}>{s.val}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-3">Multi-Agent AI Security Brain</h2>
          <p className="text-slate-400">5 specialized micro-agents → Unified Behavioral Trust Intelligence</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {AGENTS.map(a => (
            <div key={a.name} className="glass stat-card rounded-2xl p-5 text-center">
              <div className="text-3xl mb-3" style={{ color: a.color, filter:`drop-shadow(0 0 8px ${a.color}66)` }}>{a.icon}</div>
              <div className="font-semibold text-white text-sm mb-2">{a.name}</div>
              <div className="text-slate-500 text-xs leading-relaxed">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-3">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step:'01', title:'Invisible Collection', desc:'Lightweight SDK captures behavioral telemetry — keystrokes, mouse, touch, scroll — all non-PII, AES-256 encrypted.', color:'#00D4FF' },
            { step:'02', title:'Real-Time AI Scoring', desc:'Apache Kafka streams 50K+ events/sec through 5 AI agents. XGBoost + LSTM + Graph Neural Networks produce trust score in <50ms.', color:'#00FF87' },
            { step:'03', title:'Adaptive Action', desc:'Score 80+: seamless. 60-80: silent OTP. 40-60: step-up biometric. Below 40: session frozen instantly with SHAP explanation.', color:'#FFB800' },
          ].map(s => (
            <div key={s.step} className="glass rounded-2xl p-6">
              <div className="font-mono text-4xl font-bold mb-4 opacity-20" style={{ color: s.color }}>{s.step}</div>
              <h3 className="font-display font-semibold text-white text-lg mb-3">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-8 pb-24 text-center">
        <div className="glass rounded-3xl p-12" style={{ border:'1px solid rgba(0,212,255,0.15)' }}>
          <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to see it live?</h2>
          <p className="text-slate-400 mb-8">Login as user, analyst, or admin to experience all three perspectives of CogniGuard.</p>
          <button onClick={() => nav('/login')} className="btn-primary px-10 py-4 text-base">
            Enter Demo Portal
          </button>
          <p className="text-slate-600 text-xs mt-6 font-mono">user@demo.com · analyst@demo.com · admin@demo.com / demo123</p>
        </div>
      </section>

     
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-slate-600 text-sm font-mono">TEAM INCONSISTENT · CogniGuard · Cyber Security PSBs Hackathon 2026</p>
      </footer>
    </div>
  )
}