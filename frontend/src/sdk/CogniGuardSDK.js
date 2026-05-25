class CogniGuardSDK {
  constructor(sessionId, apiBase, isDemo = true) {
    this.sessionId = sessionId
    this.apiBase   = apiBase
    this.isDemo    = isDemo
    this.buffer    = []
    this.keyTimes  = {}
    this.active    = false
  }

  start() {
    this.active = true
    this._trackKeystrokes()
    this._trackMouse()
    this._trackScroll()
    this.flushTimer = setInterval(() => this._flush(), 3000)
    console.log('[CogniGuard SDK] Active — session:', this.sessionId)
  }

  stop() {
    this.active = false
    clearInterval(this.flushTimer)
    document.removeEventListener('keydown', this._kd)
    document.removeEventListener('keyup',   this._ku)
  }

  _trackKeystrokes() {
    this._kd = (e) => { this.keyTimes[e.code] = performance.now() }
    this._ku = (e) => {
      if (!this.keyTimes[e.code]) return
      const hold_ms   = performance.now() - this.keyTimes[e.code]
      const flight_ms = this._lastKeyUp ? (this.keyTimes[e.code] - this._lastKeyUp) : 0
      this._lastKeyUp = performance.now()
      this.buffer.push({ type: 'keystroke', hold_ms, flight_ms, pressure: 0.5, ts: Date.now() })
      delete this.keyTimes[e.code]
    }
    document.addEventListener('keydown', this._kd)
    document.addEventListener('keyup',   this._ku)
  }

  _trackMouse() {
    let lastX = 0, lastY = 0, lastT = 0
    document.addEventListener('mousemove', (e) => {
      const now = Date.now(), dt = now - lastT
      if (dt > 50) {
        this.buffer.push({ type: 'mouse', vx: (e.clientX - lastX) / dt, vy: (e.clientY - lastY) / dt, ts: now })
        lastX = e.clientX; lastY = e.clientY; lastT = now
      }
    })
  }

  _trackScroll() {
    document.addEventListener('scroll', () => {
      this.buffer.push({ type: 'scroll', delta_y: window.scrollY, ts: Date.now() })
    })
  }

  async _flush() {
    if (this.buffer.length === 0 || !this.sessionId) return
    const events = [...this.buffer]; this.buffer = []
    if (this.isDemo) { console.log('[SDK Demo] Would send', events.length, 'events'); return }
    try {
      await fetch(`${this.apiBase}/api/v1/telemetry/keystroke`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: this.sessionId, events })
      })
    } catch (e) { console.warn('[SDK] Flush failed:', e) }
  }
}

export default CogniGuardSDK