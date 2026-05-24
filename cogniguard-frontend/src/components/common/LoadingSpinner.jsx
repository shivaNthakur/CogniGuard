export default function LoadingSpinner({ size = 32 }) {
  return (
    <div style={{ width: size, height: size, border: '2px solid rgba(0,212,255,0.12)',
      borderTop: '2px solid #00D4FF', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite' }} />
  )
}