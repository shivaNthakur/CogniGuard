import { actionColor } from '../../utils/scoreColors'
const ACTION_LABELS = { ALLOW:'Allow', SOFT_OTP:'Silent OTP', BIOMETRIC:'Step-up', FREEZE:'FREEZE' }
export default function StatusBadge({ action, small }) {
  const color = actionColor(action)
  const sz = small ? { fontSize: 10, padding: '2px 8px' } : { fontSize: 12, padding: '4px 12px' }
  return (
    <span style={{ ...sz, color, background: color + '18', border: `1px solid ${color}44`,
      borderRadius: 20, fontFamily: 'JetBrains Mono', fontWeight: 700, letterSpacing: 1 }}>
      {ACTION_LABELS[action] || action}
    </span>
  )
}