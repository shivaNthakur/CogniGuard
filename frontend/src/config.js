export const IS_DEMO = true

export const API_BASE = IS_DEMO
  ? null
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000')

export const WS_BASE = IS_DEMO
  ? null
  : (import.meta.env.VITE_WS_URL || 'ws://localhost:8000')
