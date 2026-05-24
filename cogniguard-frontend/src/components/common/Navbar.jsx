import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, LogOut } from 'lucide-react'

export default function Navbar({ links }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }
  return (
    <nav style={{ background:'rgba(5,10,20,0.95)', borderBottom:'1px solid rgba(0,212,255,0.08)',
      padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between',
      position:'sticky', top:0, zIndex:100, backdropFilter:'blur(16px)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:32 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Shield size={22} color="#00D4FF" />
          <span style={{ fontFamily:'Sora', fontWeight:700, color:'#fff', fontSize:16 }}>CogniGuard</span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <span style={{ fontSize:13, color:'#64748b' }}>{user?.name}</span>
        <button onClick={handleLogout} className="btn-ghost" style={{ padding:'6px 12px', display:'flex', alignItems:'center', gap:6 }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  )
}