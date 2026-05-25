export const scoreColor = (s) =>
  s >= 80 ? '#00FF87' : s >= 60 ? '#00D4FF' : s >= 40 ? '#FFB800' : '#FF3B5C'

export const scoreLabel = (s) =>
  s >= 80 ? 'SECURE' : s >= 60 ? 'MEDIUM' : s >= 40 ? 'HIGH RISK' : 'CRITICAL'

export const scoreClass = (s) =>
  s >= 80 ? 'score-green' : s >= 60 ? 'score-cyan' : s >= 40 ? 'score-amber' : 'score-red'

export const actionColor = (a) => ({
  ALLOW: '#00FF87', SOFT_OTP: '#00D4FF', BIOMETRIC: '#FFB800', FREEZE: '#FF3B5C'
}[a] || '#64748b')

export const severityColor = (s) => ({
  CRITICAL: '#FF3B5C', HIGH: '#FFB800', MEDIUM: '#00D4FF', LOW: '#00FF87'
}[s] || '#64748b')

export const severityClass = (s) => ({
  CRITICAL: 'sev-critical', HIGH: 'sev-high', MEDIUM: 'sev-medium', LOW: 'sev-low'
}[s] || 'sev-low')