import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#0A1628', border:'1px solid rgba(0,212,255,0.2)', borderRadius:8, padding:'8px 12px' }}>
      <p style={{ color:'#00D4FF', fontFamily:'JetBrains Mono', fontSize:13 }}>{Math.round(payload[0].value)}</p>
      <p style={{ color:'#64748b', fontSize:11 }}>{payload[0].payload.time}</p>
    </div>
  )
}
export default function ScoreTimeline({ history }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={history} margin={{ top:8, right:8, bottom:0, left:-20 }}>
        <XAxis dataKey="time" tick={{ fill:'#475569', fontSize:10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis domain={[0,100]} tick={{ fill:'#475569', fontSize:10 }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={80} stroke="rgba(0,255,135,0.2)" strokeDasharray="4 4" />
        <ReferenceLine y={40} stroke="rgba(255,59,92,0.2)" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="score" stroke="#00D4FF" strokeWidth={2} dot={false}
          style={{ filter:'drop-shadow(0 0 4px #00D4FF88)' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}