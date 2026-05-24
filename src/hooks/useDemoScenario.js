export function useDemoScenario(setScore, setAction, setAgents, setExplain) {
  const triggerFraud = () => {
    const steps = [
      { delay: 0,    score: 85, agents: { financial: 0.12, coercion: 0.10 } },
      { delay: 1000, score: 68, agents: { financial: 0.45, coercion: 0.38 } },
      { delay: 2000, score: 47, agents: { financial: 0.72, coercion: 0.61 } },
      { delay: 3000, score: 31, agents: { financial: 0.88, coercion: 0.81 } },
      { delay: 4200, score: 23, agents: { financial: 0.88, coercion: 0.91 } },
    ]
    steps.forEach(({ delay, score, agents }) => {
      setTimeout(() => {
        setScore(score)
        setAction(score >= 80 ? 'ALLOW' : score >= 60 ? 'SOFT_OTP' : score >= 40 ? 'BIOMETRIC' : 'FREEZE')
        setAgents(agents)
        if (score < 40) {
          setExplain([
            { factor: 'New beneficiary - 4.1x amount deviation',     impact: '+24.1 risk', agent: 'financial' },
            { factor: 'Multiple coercion signals simultaneously',     impact: '+22.8 risk', agent: 'coercion' },
            { factor: 'After-hours transaction pattern',              impact: '+16.7 risk', agent: 'coercion' },
          ])
        }
      }, delay)
    })
  }
  return { triggerFraud }
}