import { scoreColor } from '../../utils/scoreColors'
const AGENTS = [
  { key:'identity',  icon:'◈', label:'Identity Agent',  sub:'Keystrokes · Touch · Device' },
  { key:'cognitive', icon:'◉', label:'Cognitive Agent', sub:'Hesitation · Navigation' },
  { key:'financial', icon:'◆', label:'Financial Agent', sub:'Tx Anomalies · Beneficiaries' },
  { key:'threat',    icon:'◑', label:'Threat Intel',     sub:'VPN · Emulator · Root' },
  { key:'coercion',  icon:'◎', label:'Emotional Agent', sub:'Panic · Coercion · Stress' },
]
export default function AgentScoreBars({ agentScores }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {AGENTS.map(a => {
        const raw = agentScores?.[a.key]
        const score = typeof raw === 'number' ? (raw <= 1 ? Math.round((1 - raw) * 100) : raw) : 80
        const color = scoreColor(score)
        return (
          <div key={a.key}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color, fontSize:16 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize:13, color:'#e2e8f0', fontWeight:600 }}>{a.label}</div>
                  <div style={{ fontSize:11, color:'#64748b' }}>{a.sub}</div>
                </div>
              </div>
              <span style={{ fontFamily:'JetBrains Mono', fontSize:14, fontWeight:700, color, alignSelf:'center' }}>{score}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}