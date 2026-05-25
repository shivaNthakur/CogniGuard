import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { useTrustScore } from '../hooks/useTrustScore'
import { useDemoScenario } from '../hooks/useDemoScenario'
import FreezeModal from '../components/common/FreezeModal'
import { MOCK_BENEFICIARIES } from '../mock/mockData'
import { formatCurrency } from '../utils/formatters'
import { AlertTriangle, ChevronLeft, Zap, CheckCircle } from 'lucide-react'

export default function TransferPage() {
  const { sessionId } = useSession()
  const { score, action, frozen, explain, setScore, setAction, setAgents, setExplain } = useTrustScore(sessionId)
  const { triggerFraud } = useDemoScenario(setScore, setAction, setAgents, setExplain)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ beneficiary:'', amount:'', reason:'', newName:'', newAcc:'', newIfsc:'', addNew:false })
  const [done, setDone] = useState(false)

  const handle = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleConfirm = () => {
    if (action === 'FREEZE') return
    setDone(true)
    setTimeout(() => { setDone(false); navigate('/banking') }, 2500)
  }

  if (done) return (
    <div style={{ minHeight:'100vh', background:'#050A14', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <CheckCircle size={64} color="#00FF87" style={{ margin:'0 auto 16px', display:'block', filter:'drop-shadow(0 0 16px #00FF8788)' }} />
        <h2 style={{ fontFamily:'Sora', fontSize:24, fontWeight:700, color:'#fff' }}>Transfer Successful!</h2>
        <p style={{ color:'#64748b' }}>Redirecting to home...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#050A14' }}>
      {frozen && <FreezeModal explanation={explain} onVerify={() => alert('Verify identity — connect backend')} />}

      <div style={{ background:'rgba(5,10,20,0.97)', borderBottom:'1px solid rgba(0,212,255,0.08)',
        padding:'16px 24px', display:'flex', alignItems:'center', gap:16,
        position:'sticky', top:0, zIndex:50, backdropFilter:'blur(16px)' }}>
        <button onClick={() => navigate('/banking')} style={{ background:'none', border:'none',
          cursor:'pointer', color:'#64748b', display:'flex', alignItems:'center', gap:4 }}>
          <ChevronLeft size={18}/><span style={{ fontSize:13 }}>Back</span>
        </button>
        <h2 style={{ fontFamily:'Sora', fontWeight:700, color:'#fff', fontSize:16 }}>Transfer Money</h2>
      </div>

      <div style={{ maxWidth:500, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ background:'rgba(255,184,0,0.08)', border:'1px dashed rgba(255,184,0,0.3)',
          borderRadius:12, padding:'12px 16px', marginBottom:24, display:'flex',
          alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Zap size={16} color="#FFB800" />
            <span style={{ fontSize:13, color:'#FFB800', fontWeight:600 }}>Demo: Simulate Fraud Scenario</span>
          </div>
          <button onClick={triggerFraud} className="btn-ghost"
            style={{ padding:'6px 14px', fontSize:12, borderColor:'rgba(255,184,0,0.4)', color:'#FFB800' }}>
            Trigger
          </button>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:24, alignItems:'center',
          padding:'12px 16px', borderRadius:12, background:'rgba(15,32,64,0.5)',
          border:`1px solid ${score >= 60 ? 'rgba(0,212,255,0.15)' : 'rgba(255,59,92,0.2)'}` }}>
          <div style={{ width:40, height:40, borderRadius:8, display:'flex', alignItems:'center',
            justifyContent:'center', fontFamily:'JetBrains Mono', fontWeight:700, fontSize:14,
            background: (score >= 80 ? '#00FF87' : score >= 60 ? '#00D4FF' : score >= 40 ? '#FFB800' : '#FF3B5C') + '18',
            color: score >= 80 ? '#00FF87' : score >= 60 ? '#00D4FF' : score >= 40 ? '#FFB800' : '#FF3B5C' }}>
            {Math.round(score)}
          </div>
          <div>
            <p style={{ fontSize:13, color:'#e2e8f0', fontWeight:600, margin:0 }}>
              {score >= 60 ? 'Session Verified' : 'Elevated Risk Detected'}
            </p>
            <p style={{ fontSize:11, color:'#64748b', margin:0, fontFamily:'JetBrains Mono' }}>Action: {action}</p>
          </div>
        </div>

        <div className="glass" style={{ borderRadius:16, padding:24 }}>
          {step === 1 && (
            <div>
              <h3 style={{ fontFamily:'Sora', fontWeight:700, color:'#e2e8f0', marginBottom:20 }}>Transfer Details</h3>

              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                  textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Select Beneficiary</label>
                <select value={form.beneficiary} onChange={e => handle('beneficiary', e.target.value)}
                  className="input-field">
                  <option value="">-- Select --</option>
                  {MOCK_BENEFICIARIES.map(b => <option key={b.id} value={b.id}>{b.name} ({b.bank})</option>)}
                  <option value="new">+ Add New Account</option>
                </select>
              </div>

              {form.beneficiary === 'new' && (
                <div style={{ background:'rgba(0,212,255,0.05)', border:'1px solid rgba(0,212,255,0.15)',
                  borderRadius:12, padding:16, marginBottom:16 }}>
                  <p style={{ fontSize:12, color:'#00D4FF', marginBottom:12 }}>New Beneficiary Details</p>
                  <input placeholder="Account holder name" value={form.newName} onChange={e => handle('newName', e.target.value)} className="input-field" style={{ marginBottom:10 }} />
                  <input placeholder="Account number" value={form.newAcc} onChange={e => handle('newAcc', e.target.value)} className="input-field" style={{ marginBottom:10 }} />
                  <input placeholder="IFSC code" value={form.newIfsc} onChange={e => handle('newIfsc', e.target.value)} className="input-field" />
                </div>
              )}

              
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                  textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Amount (₹)</label>
                <input type="number" placeholder="0" value={form.amount}
                  onChange={e => handle('amount', e.target.value)} className="input-field" />
                {form.amount > 20000 && (
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                    <AlertTriangle size={12} color="#FFB800" />
                    <span style={{ fontSize:11, color:'#FFB800' }}>High-value transaction — additional verification may apply</span>
                  </div>
                )}
              </div>

             
              <div style={{ marginBottom:24 }}>
                <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                  textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Transfer Reason</label>
                <select value={form.reason} onChange={e => handle('reason', e.target.value)} className="input-field">
                  <option value="">-- Select reason --</option>
                  <option>Family / Personal</option>
                  <option>Rent Payment</option>
                  <option>Business Payment</option>
                  <option>Investment</option>
                  <option>Other</option>
                </select>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary" style={{ width:'100%' }}
                disabled={!form.beneficiary || !form.amount}>
                Review Transfer
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontFamily:'Sora', fontWeight:700, color:'#e2e8f0', marginBottom:20 }}>Confirm Transfer</h3>
              <div style={{ background:'rgba(15,32,64,0.5)', borderRadius:12, padding:20, marginBottom:20 }}>
                {[
                  ['To', form.beneficiary === 'new' ? form.newName : MOCK_BENEFICIARIES.find(b=>b.id===form.beneficiary)?.name],
                  ['Amount', formatCurrency(form.amount)],
                  ['Reason', form.reason || 'Not specified'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between',
                    padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color:'#64748b', fontSize:13 }}>{k}</span>
                    <span style={{ color:'#e2e8f0', fontSize:13, fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:12 }}>
                <button onClick={() => setStep(1)} className="btn-ghost" style={{ flex:1 }}>Back</button>
                <button onClick={handleConfirm} className="btn-primary" style={{ flex:2 }}>Confirm Transfer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}