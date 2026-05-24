import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSession } from '../context/SessionContext'
import { useTrustScore } from '../hooks/useTrustScore'
import FreezeModal from '../components/common/FreezeModal'
import CogniGuardSDK from '../sdk/CogniGuardSDK'
import { IS_DEMO } from '../config'
import { MOCK_TRANSACTIONS } from '../mock/mockData'
import { formatCurrency } from '../utils/formatters'
import { Send, History, FileText, Wifi, Shield } from 'lucide-react'

export default function BankingHome() {
  const { user } = useAuth()
  const { sessionId } = useSession()
  const { score, frozen, explain } = useTrustScore(sessionId)
  const sdkRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionId) return
    const sdk = new CogniGuardSDK(sessionId, '', IS_DEMO)
    sdk.start(); sdkRef.current = sdk
    return () => sdk.stop()
  }, [sessionId])

  const QUICK = [
    { label:'Transfer Money', icon: Send,    to:'/banking/transfer', color:'#00D4FF' },
    { label:'Pay Bills',      icon: FileText, to:'/banking/transfer', color:'#00FF87' },
    { label:'My History',     icon: History,  to:'/banking/history',  color:'#FFB800' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#050A14' }}>
      {frozen && <FreezeModal explanation={explain} onVerify={() => alert('Identify using backend')} />}

      <div style={{ background:'rgba(5,10,20,0.97)', borderBottom:'1px solid rgba(0,212,255,0.08)',
        padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center',
        position:'sticky', top:0, zIndex:50, backdropFilter:'blur(16px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Shield size={22} color="#00D4FF" />
          <span style={{ fontFamily:'Sora', fontWeight:700, color:'#fff' }}>CogniGuard Bank</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(0,255,135,0.08)',
            padding:'4px 12px', borderRadius:20, border:'1px solid rgba(0,255,135,0.2)' }}>
            <Wifi size={12} color="#00FF87" />
            <span style={{ fontSize:11, color:'#00FF87', fontFamily:'JetBrains Mono' }}>Protected by CogniGuard</span>
          </div>
          <span style={{ fontSize:13, color:'#64748b' }}>{user?.name}</span>
        </div>
      </div>

      <div style={{ maxWidth:640, margin:'0 auto', padding:'32px 24px' }}>
      
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontFamily:'Sora', fontSize:24, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p style={{ color:'#64748b', fontSize:14 }}>Your account is secure. All systems normal.</p>
        </div>

        <div style={{ background:'linear-gradient(135deg, #0F2040, #0A1628)', border:'1px solid rgba(0,212,255,0.2)',
          borderRadius:20, padding:28, marginBottom:24, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120,
            background:'radial-gradient(circle, rgba(0,212,255,0.12), transparent)', borderRadius:'50%' }} />
          <p style={{ fontSize:12, color:'#64748b', fontFamily:'JetBrains Mono', textTransform:'uppercase',
            letterSpacing:1.5, marginBottom:8 }}>Total Balance</p>
          <h1 style={{ fontFamily:'Sora', fontSize:40, fontWeight:800, color:'#fff',
            textShadow:'0 0 30px rgba(0,212,255,0.3)', margin:'0 0 4px' }}>₹2,45,800</h1>
          <p style={{ fontSize:13, color:'#00FF87', margin:'0 0 20px' }}>+₹85,000 credited this month</p>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ fontSize:12, color:'#475569', fontFamily:'JetBrains Mono' }}>A/C: XXXX XXXX 4821</span>
            <span style={{ fontSize:12, color:'#475569' }}>·</span>
            <span style={{ fontSize:12, color:'#475569', fontFamily:'JetBrains Mono' }}>IFSC: COGN0001234</span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:28 }}>
          {QUICK.map(q => (
            <Link key={q.label} to={q.to} style={{ textDecoration:'none' }}>
              <div className="glass stat-card" style={{ borderRadius:14, padding:'18px 14px', textAlign:'center', cursor:'pointer' }}>
                <div style={{ width:44, height:44, borderRadius:12, display:'flex', alignItems:'center',
                  justifyContent:'center', margin:'0 auto 10px',
                  background: q.color+'18', border:`1px solid ${q.color}30` }}>
                  <q.icon size={20} color={q.color} />
                </div>
                <p style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>{q.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="glass" style={{ borderRadius:16, padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontFamily:'Sora', fontWeight:700, color:'#e2e8f0', fontSize:15 }}>Recent Transactions</h3>
            <Link to="/banking/history" style={{ color:'#00D4FF', fontSize:13, textDecoration:'none' }}>View all</Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {MOCK_TRANSACTIONS.slice(0, 5).map(t => (
              <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <p style={{ fontSize:14, color:'#e2e8f0', fontWeight:500, marginBottom:2 }}>{t.desc}</p>
                  <p style={{ fontSize:11, color:'#475569' }}>{t.date}</p>
                </div>
                <span style={{ fontFamily:'Sora', fontWeight:700, fontSize:15,
                  color: t.amount > 0 ? '#00FF87' : '#e2e8f0' }}>
                  {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}