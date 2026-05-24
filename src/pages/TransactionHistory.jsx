import { useNavigate } from 'react-router-dom'
import { MOCK_TRANSACTIONS } from '../mock/mockData'
import { formatCurrency, formatDate } from '../utils/formatters'
import { ChevronLeft, Download } from 'lucide-react'

export default function TransactionHistory() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight:'100vh', background:'#050A14' }}>
      <div style={{ background:'rgba(5,10,20,0.97)', borderBottom:'1px solid rgba(0,212,255,0.08)',
        padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, zIndex:50, backdropFilter:'blur(16px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={() => navigate('/banking')} style={{ background:'none', border:'none',
            cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:4 }}>
            <ChevronLeft size={18}/><span style={{ fontSize:13 }}>Back</span>
          </button>
          <h2 style={{ fontFamily:'Sora', fontWeight:700, color:'#fff', fontSize:16 }}>Transaction History</h2>
        </div>
        <button className="btn-ghost" style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, padding:'6px 14px' }}>
          <Download size={13}/> Statement
        </button>
      </div>
      <div style={{ maxWidth:640, margin:'0 auto', padding:'28px 24px' }}>
        <div className="glass" style={{ borderRadius:16, overflow:'hidden' }}>
          {MOCK_TRANSACTIONS.map((t, i) => (
            <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'16px 20px', borderBottom: i < MOCK_TRANSACTIONS.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(0,212,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:10, display:'flex', alignItems:'center',
                  justifyContent:'center', background: t.amount > 0 ? 'rgba(0,255,135,0.1)' : 'rgba(0,212,255,0.08)',
                  border:`1px solid ${t.amount > 0 ? 'rgba(0,255,135,0.2)' : 'rgba(0,212,255,0.1)'}` }}>
                  <span style={{ fontSize:16 }}>{t.amount > 0 ? '↓' : '↑'}</span>
                </div>
                <div>
                  <p style={{ fontSize:14, color:'#e2e8f0', fontWeight:500, marginBottom:2 }}>{t.desc}</p>
                  <p style={{ fontSize:11, color:'#475569', fontFamily:'JetBrains Mono' }}>{t.date} · {t.id}</p>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontFamily:'Sora', fontWeight:700, fontSize:15,
                  color: t.amount > 0 ? '#00FF87' : '#e2e8f0' }}>
                  {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                </p>
                <p style={{ fontSize:11, color:'#00FF87' }}>{t.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}