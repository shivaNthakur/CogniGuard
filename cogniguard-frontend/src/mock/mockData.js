export const MOCK_SESSIONS = [
  { id: 'USR-4421', channel: 'Mobile Banking', city: 'Mumbai',    score: 94, action: 'ALLOW',
    agent_scores: { identity:0.06, cognitive:0.08, financial:0.04, threat:0.03, coercion:0.05 } },
  { id: 'USR-8832', channel: 'Web Banking',    city: 'Delhi',     score: 58, action: 'SOFT_OTP',
    agent_scores: { identity:0.15, cognitive:0.12, financial:0.55, threat:0.62, coercion:0.18 } },
  { id: 'USR-1190', channel: 'UPI/NPCI',       city: 'Pune',      score: 23, action: 'FREEZE',
    agent_scores: { identity:0.72, cognitive:0.68, financial:0.89, threat:0.91, coercion:0.94 } },
  { id: 'USR-3374', channel: 'Other Digital',  city: 'Bangalore', score: 87, action: 'ALLOW',
    agent_scores: { identity:0.08, cognitive:0.10, financial:0.07, threat:0.05, coercion:0.06 } },
  { id: 'USR-6610', channel: 'Mobile Banking', city: 'Chennai',   score: 71, action: 'ALLOW',
    agent_scores: { identity:0.18, cognitive:0.22, financial:0.30, threat:0.12, coercion:0.14 } },
]

export const MOCK_ALERTS = [
  { id: 'ALT-001', severity: 'CRITICAL', title: 'Coercion Detected',
    description: 'Emotional stress signatures indicate forced transaction attempt',
    agent: 'Emotional Agent', session_id: 'USR-1190', trust_score: 21,
    action_taken: 'Account Frozen', triggered_at: '2s ago', resolved: false,
    top_factors: [
      { factor: 'Multiple coercion signals simultaneously', impact: '+31.2 risk', agent: 'coercion' },
      { factor: 'New beneficiary - 4.1x amount deviation',  impact: '+24.8 risk', agent: 'financial' },
    ]},
  { id: 'ALT-002', severity: 'HIGH', title: 'VPN / Proxy Detected',
    description: 'Session routed through unknown VPN on unrecognized device',
    agent: 'Threat Intel Agent', session_id: 'USR-8832', trust_score: 58,
    action_taken: 'Step-up Auth', triggered_at: '1m ago', resolved: false, top_factors: [] },
  { id: 'ALT-003', severity: 'HIGH', title: 'Unusual Transaction Amount',
    description: 'Transfer 4.1x above user historical average to new beneficiary',
    agent: 'Financial Agent', session_id: 'USR-8832', trust_score: 61,
    action_taken: 'Step-up Auth', triggered_at: '3m ago', resolved: false, top_factors: [] },
  { id: 'ALT-004', severity: 'MEDIUM', title: 'Navigation Anomaly',
    description: 'Hesitation pattern on confirmation screen - possible coercion indicator',
    agent: 'Cognitive Agent', session_id: 'USR-6610', trust_score: 71,
    action_taken: 'Silent OTP', triggered_at: '8m ago', resolved: false, top_factors: [] },
  { id: 'ALT-005', severity: 'LOW', title: 'New Device Login',
    description: 'User logged in from previously unseen browser fingerprint',
    agent: 'Identity Agent', session_id: 'USR-3374', trust_score: 87,
    action_taken: 'Allow', triggered_at: '22m ago', resolved: true, top_factors: [] },
]

export const MOCK_AGENT_SCORES = {
  identity:  { score: 90, label: 'Identity Agent',  sub: 'Keystrokes · Touch · Device' },
  cognitive: { score: 80, label: 'Cognitive Agent', sub: 'Hesitation · Navigation' },
  financial: { score: 82, label: 'Financial Agent', sub: 'Tx Anomalies · Beneficiaries' },
  threat:    { score: 83, label: 'Threat Intel',     sub: 'VPN · Emulator · Root' },
  coercion:  { score: 93, label: 'Emotional Agent', sub: 'Panic · Coercion · Stress' },
}

export const MOCK_TRUST_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  time: new Date(Date.now() - (29 - i) * 30000).toLocaleTimeString(),
  score: Math.round(75 + Math.sin(i * 0.4) * 12 + (Math.random() * 5 - 2.5)),
}))

export const MOCK_USERS = [
  { id: 'USR-4421', name: 'Rahul Sharma',  email: 'rahul@demo.com',   role: 'user',    status: 'Active', created: '2025-01-10' },
  { id: 'USR-8832', name: 'Priya Nair',    email: 'priya@demo.com',   role: 'user',    status: 'Active', created: '2025-02-14' },
  { id: 'USR-1190', name: 'Amit Verma',    email: 'amit@demo.com',    role: 'user',    status: 'Frozen', created: '2024-11-02' },
  { id: 'USR-3374', name: 'Kavya Reddy',   email: 'kavya@demo.com',   role: 'user',    status: 'Active', created: '2025-03-01' },
  { id: 'ANA-001',  name: 'Priya Analyst', email: 'analyst@demo.com', role: 'analyst', status: 'Active', created: '2024-09-15' },
  { id: 'ADM-001',  name: 'Admin User',    email: 'admin@demo.com',   role: 'admin',   status: 'Active', created: '2024-08-01' },
]

export const MOCK_AUDIT_LOGS = [
  { id: 'LOG-001', actor: 'Priya Analyst', action: 'FREEZE_SESSION',   target: 'USR-1190', at: '2m ago',  details: 'Manual freeze - coercion signals' },
  { id: 'LOG-002', actor: 'Priya Analyst', action: 'RESOLVE_ALERT',    target: 'ALT-003',  at: '10m ago', details: 'Resolved high-risk alert' },
  { id: 'LOG-003', actor: 'Admin User',    action: 'CONFIG_CHANGE',    target: 'SYSTEM',   at: '1h ago',  details: 'FREEZE threshold changed 35->40' },
  { id: 'LOG-004', actor: 'Priya Analyst', action: 'STEP_UP_AUTH',     target: 'USR-8832', at: '2h ago',  details: 'Step-up auth triggered' },
  { id: 'LOG-005', actor: 'Admin User',    action: 'USER_DEACTIVATED', target: 'USR-9900', at: '1d ago',  details: 'Inactive account deactivated' },
]

export const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', type: 'Debit',  desc: 'UPI - Swiggy',          amount: -450,   date: '2025-05-23', status: 'Success' },
  { id: 'TXN-002', type: 'Credit', desc: 'Salary - TechCorp Ltd', amount: 85000,  date: '2025-05-01', status: 'Success' },
  { id: 'TXN-003', type: 'Debit',  desc: 'NEFT - Rent Payment',   amount: -18000, date: '2025-04-30', status: 'Success' },
  { id: 'TXN-004', type: 'Debit',  desc: 'Amazon Pay',            amount: -2399,  date: '2025-04-28', status: 'Success' },
  { id: 'TXN-005', type: 'Debit',  desc: 'Electricity Bill',      amount: -1200,  date: '2025-04-25', status: 'Success' },
  { id: 'TXN-006', type: 'Credit', desc: 'Refund - Flipkart',     amount: 899,    date: '2025-04-22', status: 'Success' },
  { id: 'TXN-007', type: 'Debit',  desc: 'Netflix Subscription',  amount: -649,   date: '2025-04-15', status: 'Success' },
]

export const MOCK_BENEFICIARIES = [
  { id: 'BEN-001', name: 'Rohan Mehta',    account: '****4821', bank: 'HDFC'  },
  { id: 'BEN-002', name: 'Sneha Kulkarni', account: '****7734', bank: 'SBI'   },
  { id: 'BEN-003', name: 'Family Home',    account: '****1192', bank: 'ICICI' },
]