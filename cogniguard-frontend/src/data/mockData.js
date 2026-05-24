export const AGENTS = [
  {
    id: 1,
    name: 'Identity Agent',
    shortName: 'ID',
    desc: 'Keystrokes · Touch · Device Biometrics',
    color: '#00E5FF',
    bgColor: 'bg-trust/10',
    borderColor: 'border-trust/30',
    textColor: 'text-trust',
  },
  {
    id: 2,
    name: 'Cognitive Agent',
    shortName: 'COG',
    desc: 'Hesitation · Navigation · Decision Confidence',
    color: '#A78BFA',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
  },
  {
    id: 3,
    name: 'Financial Agent',
    shortName: 'FIN',
    desc: 'Tx Anomalies · Beneficiaries · Spending',
    color: '#00FF88',
    bgColor: 'bg-safe/10',
    borderColor: 'border-safe/30',
    textColor: 'text-safe',
  },
  {
    id: 4,
    name: 'Threat Intel Agent',
    shortName: 'THR',
    desc: 'VPN · Emulator · Root · Spoofing · Bots',
    color: '#FF9F00',
    bgColor: 'bg-warn/10',
    borderColor: 'border-warn/30',
    textColor: 'text-warn',
  },
  {
    id: 5,
    name: 'Emotional Agent',
    shortName: 'EMO',
    desc: 'Panic · Coercion · Stress · Urgency',
    color: '#FF3366',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/30',
    textColor: 'text-danger',
  },
]

export const RECENT_ALERTS = [
  { id: 1, type: 'danger', msg: 'Coercion pattern detected — session flagged', time: '2s ago', agent: 'Emotional' },
  { id: 2, type: 'warn',   msg: 'VPN usage detected on new device', time: '18s ago', agent: 'Threat Intel' },
  { id: 3, type: 'warn',   msg: 'Unusual beneficiary added — high deviation', time: '1m ago', agent: 'Financial' },
  { id: 4, type: 'safe',   msg: 'Behavioral profile verified — session continued', time: '3m ago', agent: 'Identity' },
  { id: 5, type: 'danger', msg: 'Rapid transaction sequence — bot pattern', time: '5m ago', agent: 'Threat Intel' },
  { id: 6, type: 'safe',   msg: 'Step-up auth passed — normal navigation', time: '8m ago', agent: 'Cognitive' },
]

export const ACTIVE_SESSIONS = [
  { id: 'USR-4421', score: 94, channel: 'Mobile', location: 'Mumbai', status: 'secure' },
  { id: 'USR-8832', score: 58, channel: 'Web', location: 'Delhi', status: 'caution' },
  { id: 'USR-1190', score: 23, channel: 'UPI/NPCI', location: 'Pune', status: 'critical' },
  { id: 'USR-3374', score: 87, channel: 'Mobile', location: 'Bangalore', status: 'secure' },
  { id: 'USR-6610', score: 71, channel: 'Web', location: 'Chennai', status: 'caution' },
]

export function generateTrustHistory() {
  const now = Date.now()
  return Array.from({ length: 30 }, (_, i) => ({
    t: new Date(now - (29 - i) * 2000).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    score: Math.round(70 + Math.sin(i / 3) * 15 + Math.random() * 10),
  }))
}
