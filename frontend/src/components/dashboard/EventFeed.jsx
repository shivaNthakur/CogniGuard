const EVENTS = [
  { ts:'09:42:01', type:'KEYSTROKE',  desc:'Normal typing pattern — 98% match',        color:'#00FF87' },
  { ts:'09:42:14', type:'NAVIGATION', desc:'Direct path to transfer — no hesitation',   color:'#00FF87' },
  { ts:'09:42:31', type:'AMOUNT',     desc:'Amount entered: 95,000 (4.1x avg)',         color:'#FFB800' },
  { ts:'09:42:38', type:'BENEFICIARY',desc:'New beneficiary added',                     color:'#FFB800' },
  { ts:'09:42:55', type:'COERCION',   desc:'Elevated stress indicators detected',       color:'#FF3B5C' },
  { ts:'09:43:01', type:'CONFIRM',    desc:'Confirm button — abnormal hesitation 8.2s', color:'#FF3B5C' },
]
export default function EventFeed({ events = EVENTS }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      {events.map((e, i) => (
        <div key={i} style={{ display:'flex', gap:12, padding:'8px 0',
          borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ fontFamily:'JetBrains Mono', fontSize:11, color:'#475569', flexShrink:0 }}>{e.ts}</span>
          <span style={{ fontFamily:'JetBrains Mono', fontSize:10, padding:'2px 8px', borderRadius:20, height:'fit-content',
            color: e.color, background: e.color+'18', border:`1px solid ${e.color}30`, flexShrink:0 }}>{e.type}</span>
          <span style={{ fontSize:12, color:'#94a3b8' }}>{e.desc}</span>
        </div>
      ))}
    </div>
  )
}