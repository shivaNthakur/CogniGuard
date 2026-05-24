import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
export default function NotFound() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-grid flex items-center justify-center text-center px-6"
      style={{ background:'#050A14' }}>
      <div className="anim-fade-up">
        <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-6 opacity-30" />
        <h1 className="font-display font-bold text-6xl text-white mb-4">404</h1>
        <p className="text-slate-400 text-lg mb-8">Page not found or access denied.</p>
        <button onClick={() => nav('/login')} className="btn-primary px-8 py-3">
          Back to Login
        </button>
      </div>
    </div>
  )
}