export default function TrustScoreRing({ score, size = 180 }) {
  const r = size * 0.42
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const cx = size / 2
  const cy = size / 2

  const color = score >= 80 ? '#00FF88' : score >= 60 ? '#FF9F00' : '#FF3366'
  const label = score >= 80 ? 'SECURE' : score >= 60 ? 'CAUTION' : 'CRITICAL'
  const bgLabel = score >= 80 ? 'bg-safe/10 border-safe/20 text-safe' : score >= 60 ? 'bg-warn/10 border-warn/20 text-warn' : 'bg-danger/10 border-danger/20 text-danger'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ display: 'block' }}>
          {/* Track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0F1E30" strokeWidth="8" />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 0.7s ease, stroke 0.7s ease',
              filter: `drop-shadow(0 0 10px ${color}80)`,
            }}
          />
        </svg>
        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-0.5">Live Score</span>
          <span className="font-display font-800 leading-none" style={{ fontSize: size * 0.22, color, textShadow: `0 0 20px ${color}60` }}>
            {score}
          </span>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full border text-xs font-mono font-500 ${bgLabel}`}>
        {label}
      </span>
    </div>
  )
}
