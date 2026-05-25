export default function ShapCards({ factors }) {
  if (!factors?.length) return null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {factors.map((f, i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'10px 14px', background:'rgba(255,59,92,0.06)', borderRadius:10,
          border:'1px solid rgba(255,59,92,0.15)' }}>
          <span style={{ fontSize:13, color:'#cbd5e1' }}>{f.factor}</span>
          <span style={{ fontSize:13, color:'#FF3B5C', fontFamily:'JetBrains Mono', fontWeight:700, marginLeft:12 }}>{f.impact}</span>
        </div>
      ))}
    </div>
  )
}