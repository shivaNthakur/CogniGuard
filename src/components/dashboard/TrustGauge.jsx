import { scoreColor, scoreLabel } from '../../utils/scoreColors'

export default function TrustGauge({ score, size = 160 }) {
  const r = 60, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <svg width={size} height={size} viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1s ease, stroke 0.5s' }} />
        <text x="70" y="62" textAnchor="middle" fill={color} fontSize="28" fontWeight="800" fontFamily="Sora">{Math.round(score)}</text>
        <text x="70" y="78" textAnchor="middle" fill="rgba(148,163,184,0.7)" fontSize="9" fontFamily="JetBrains Mono">TRUST SCORE</text>
        <text x="70" y="92" textAnchor="middle" fill={color} fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">{scoreLabel(score)}</text>
      </svg>
    </div>
  )
}