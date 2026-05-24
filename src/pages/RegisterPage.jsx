import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [showCfm,   setShowCfm]   = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e?.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await register(name, email, password)
    setLoading(false)

    if (result.success) {
      navigate('/banking')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

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
          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="John Doe" required className="input-field" />
            </div>

            {/* Email */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required className="input-field" />
            </div>

            {/* Password */}
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" required className="input-field"
                  style={{ paddingRight:44 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono',
                textTransform:'uppercase', letterSpacing:1.5, marginBottom:8 }}>Confirm Password</label>
              <div style={{ position:'relative' }}>
                <input type={showCfm ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password" required className="input-field"
                  style={{ paddingRight:44 }} />
                <button type="button" onClick={() => setShowCfm(!showCfm)}
                  style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'#64748b', display:'flex' }}>
                  {showCfm ? <EyeOff size={16}/> : <Eye size={16}/>}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#475569' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#00D4FF', textDecoration:'none' }}>Sign in here</Link>
          </p>
        </div>

        <p style={{ textAlign:'center', marginTop:16, fontSize:11, color:'#334155', fontFamily:'JetBrains Mono' }}>
          TEAM INCONSISTENT · Cyber Security PSBs Hackathon 2026
        </p>
      </div>
    </div>
  )
}