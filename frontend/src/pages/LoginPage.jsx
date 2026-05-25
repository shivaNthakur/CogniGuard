import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Eye, EyeOff, Zap } from 'lucide-react'

const CREDS = [
  { email:'user@demo.com',     role:'user',    label:'Banking User',   color:'#00D4FF', hint:'Goes to Banking Home' },
  { email:'analyst@demo.com',  role:'analyst', label:'SOC Analyst',    color:'#FFB800', hint:'Goes to Security Dashboard' },
  { email:'admin@demo.com',    role:'admin',   label:'System Admin',   color:'#FF3B5C', hint:'Goes to Admin Panel' },
]

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleLogin = async (e) => {
    e?.preventDefault()
    setError(''); setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      if (result.role === 'user')    navigate('/banking')
      if (result.role === 'analyst') navigate('/dashboard')
      if (result.role === 'admin')   navigate('/admin')
    } else {
      setError(result.error || 'Invalid credentials')
    }
  }

  const fillDemo = (cred) => { setEmail(cred.email); setPassword('demo123'); setError('') }

  return (
    <div className="bg-grid" style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>

      {/* Ambient glows */}
      <div style={{ position:'absolute', top:'20%', left:'15%', width:400, height:400,
        background:'radial-gradient(circle, rgba(0,212,255,0.08), transparent)',
        borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'20%', right:'15%', width:300, height:300,
        background:'radial-gradient(circle, rgba(255,59,92,0.06), transparent)',
        borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:420 }} className="anim-fade-up">
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <div style={{ position:'relative' }}>
              <Shield size={36} color="#00D4FF" style={{ filter:'drop-shadow(0 0 12px #00D4FF88)' }} />
            </div>
            <div style={{ textAlign:'left' }}>
              <h1 style={{ fontFamily:'Sora', fontSize:28, fontWeight:800, color:'#fff',
                textShadow:'0 0 24px rgba(0,212,255,0.5)', margin:0 }}>CogniGuard</h1>
              <p style={{ fontFamily:'JetBrains Mono', fontSize:10, color:'#00D4FF',
                letterSpacing:3, textTransform:'uppercase', margin:0 }}>Behavioral Auth</p>
            </div>
          </div>
          <p style={{ color:'#64748b', fontSize:13 }}>Zero Trust Continuous Security Platform</p>
        </div>

        {/* Card */}
        <div className="glass-dark" style={{ borderRadius:20, padding:32 }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required className="input-field" />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="demo123" required className="input-field" style={{ paddingRight:44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background:'rgba(255,59,92,0.08)', border:'1px solid rgba(255,59,92,0.25)',
                borderRadius:10, padding:'10px 14px', marginBottom:16 }}>
                <p style={{ color:'#FF3B5C', fontSize:13 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:'100%', fontSize:15 }}>
              {loading ? 'Authenticating...' : 'Secure Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <Zap size={12} color="#FFB800" />
              <span style={{ fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                textTransform:'uppercase', letterSpacing:1 }}>Demo Credentials</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {CREDS.map(c => (
                <button key={c.role} onClick={() => fillDemo(c)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'10px 14px', borderRadius:10, cursor:'pointer',
                    background: c.color + '0D', border: `1px dashed ${c.color}44`,
                    transition:'all 0.2s', textAlign:'left' }}
                  onMouseEnter={e => e.currentTarget.style.background = c.color + '1A'}
                  onMouseLeave={e => e.currentTarget.style.background = c.color + '0D'}>
                  <div>
                    <span style={{ fontSize:13, fontWeight:600, color: c.color }}>{c.label}</span>
                    <span style={{ fontSize:11, color:'#475569', display:'block' }}>{c.email} / demo123</span>
                  </div>
                  <span style={{ fontSize:10, color:'#475569' }}>{c.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#475569' }}>
            New user?{' '}
            <Link to="/register" style={{ color:'#00D4FF', textDecoration:'none' }}>Register here</Link>
          </p>
        </div>

        <p style={{ textAlign:'center', marginTop:16, fontSize:11, color:'#334155', fontFamily:'JetBrains Mono' }}>
          TEAM INCONSISTENT · Cyber Security PSBs Hackathon 2026
        </p>
      </div>
    </div>
  )
}