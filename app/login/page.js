'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const cardRef = useRef(null)
  const canvasRef = useRef(null)

  const [splashDone, setSplashDone]   = useState(false)
  const [tab, setTab]                 = useState('login')
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetCode, setResetCode]     = useState('')
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [resetStep, setResetStep]     = useState(1)
  const [tabAnim, setTabAnim]         = useState(false)

  // ── Splash screen ────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2000)
    return () => clearTimeout(t)
  }, [])

  // ── Particle background ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.5,
        o:  Math.random() * 0.4 + 0.1,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(108,99,255,${p.o})`
        ctx.fill()
      })
      // Draw connecting lines
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(108,99,255,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  // ── 3D tilt effect ───────────────────────────────────────
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    function onMove(e) {
      const rect = card.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width  / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      card.style.transform = `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale(1.01)`
    }
    function onLeave() {
      card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
      card.style.transition = 'transform 0.5s ease'
    }
    function onEnter() { card.style.transition = 'transform 0.1s ease' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    card.addEventListener('mouseenter', onEnter)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
      card.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  function switchTab(t) {
    setTabAnim(true)
    setTimeout(() => {
      setTab(t); setError(''); setSuccess(''); setResetStep(1); setTabAnim(false)
    }, 150)
  }

  async function handleLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const res  = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json(); setLoading(false)
    if (!res.ok) { setError(data.error); return }
    sessionStorage.setItem('user', JSON.stringify(data.user))
    router.push('/dashboard')
  }

  async function handleRegister(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const res  = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json(); setLoading(false)
    if (!res.ok) { setError(data.error); return }
    sessionStorage.setItem('user', JSON.stringify(data.user))
    router.push('/dashboard')
  }

  async function handleResetRequest(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const res  = await fetch('/api/auth/reset', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json(); setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setSuccess(`Your reset code is: ${data.resetCode}`)
    setResetStep(2)
  }

  async function handleResetConfirm(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const res  = await fetch('/api/auth/reset', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetCode, newPassword }),
    })
    const data = await res.json(); setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setSuccess('Password changed! Redirecting to login…')
    setTimeout(() => switchTab('login'), 2000)
  }

  return (
    <>
      {/* ── Splash ── */}
      <div className={`${styles.splash} ${splashDone ? styles.hide : ''}`}>
        <div className={styles.splashLogo}>
          <div className={styles.splashDot}>M</div>
          <span className={styles.splashName}>MyApp</span>
        </div>
        <div className={styles.splashBar}>
          <div className={styles.splashBarFill} />
        </div>
        <p className={styles.splashText}>Initializing</p>
      </div>

      {/* ── Main page ── */}
      <div className={styles.page}>
        <canvas ref={canvasRef} className={styles.particles} />
        <div className={styles.grid} />
        <div className={styles.orb + ' ' + styles.orb1} />
        <div className={styles.orb + ' ' + styles.orb2} />
        <div className={styles.orb + ' ' + styles.orb3} />

        <div className={styles.cardWrapper} ref={cardRef}>
          <div className={styles.card}>

            {/* Logo */}
            <div className={styles.logo}>
              <div className={styles.dot}>M</div>
              <span className={styles.logoName}>MyApp</span>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button className={`${styles.tabBtn} ${tab === 'login'    ? styles.activeTab : ''}`} onClick={() => switchTab('login')}>Sign in</button>
              <button className={`${styles.tabBtn} ${tab === 'register' ? styles.activeTab : ''}`} onClick={() => switchTab('register')}>Register</button>
              <button className={`${styles.tabBtn} ${tab === 'reset'    ? styles.activeTab : ''}`} onClick={() => switchTab('reset')}>Reset</button>
            </div>

            {/* Form content with fade transition */}
            <div style={{ opacity: tabAnim ? 0 : 1, transform: tabAnim ? 'translateY(8px)' : 'translateY(0)', transition: 'all 0.15s ease' }}>

              {/* ── LOGIN ── */}
              {tab === 'login' && (
                <form onSubmit={handleLogin}>
                  <p className={styles.subtitle}>Welcome back — sign in to continue</p>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Password</label>
                    <input className={styles.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  {error   && <div className={styles.error}>⚠ {error}</div>}
                  {success && <div className={styles.successMsg}>✓ {success}</div>}
                  <button className={styles.btn} type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in →'}
                  </button>
                </form>
              )}

              {/* ── REGISTER ── */}
              {tab === 'register' && (
                <form onSubmit={handleRegister}>
                  <p className={styles.subtitle}>Create your account — it's free</p>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input className={styles.input} type="text" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Password</label>
                    <input className={styles.input} type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  {error   && <div className={styles.error}>⚠ {error}</div>}
                  {success && <div className={styles.successMsg}>✓ {success}</div>}
                  <button className={styles.btn} type="submit" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account →'}
                  </button>
                </form>
              )}

              {/* ── RESET ── */}
              {tab === 'reset' && (
                <form onSubmit={resetStep === 1 ? handleResetRequest : handleResetConfirm}>
                  <p className={styles.subtitle}>
                    {resetStep === 1 ? 'Enter your email to receive a reset code' : 'Enter the code and your new password'}
                  </p>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={resetStep === 2} />
                  </div>
                  {resetStep === 2 && <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Reset Code</label>
                      <input className={styles.input} type="text" placeholder="6-digit code" value={resetCode} onChange={e => setResetCode(e.target.value)} required />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>New Password</label>
                      <input className={styles.input} type="password" placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                  </>}
                  {error   && <div className={styles.error}>⚠ {error}</div>}
                  {success && <div className={styles.successMsg}>✓ {success}</div>}
                  <button className={styles.btn} type="submit" disabled={loading}>
                    {loading ? 'Please wait…' : resetStep === 1 ? 'Send reset code →' : 'Change password →'}
                  </button>
                  {resetStep === 2 && (
                    <button type="button" className={styles.backBtn} onClick={() => { setResetStep(1); setSuccess(''); setError('') }}>← Back</button>
                  )}
                </form>
              )}

            </div>

            <div className={styles.cardFooter}>
              Secured with bcrypt encryption · MySQL backend
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
