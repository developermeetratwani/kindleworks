import { useEffect, useRef, useState } from 'react'

const TRAIL_LIFETIME = 3000 // 3 seconds disappearance
const ACCENT_COLOR = '232, 93, 38' // KindleWorks brand orange (#e85d26)

export default function CursorGlow() {
  const canvasRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Enable only for desktop / pointer devices
    const checkDesktop = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches
      const isWideEnough = window.innerWidth >= 768
      setIsDesktop(hasFinePointer && isWideEnough)
    }

    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    if (!isDesktop) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId
    let dpr = window.devicePixelRatio || 1

    // Resize canvas
    const handleResize = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Trail points & mouse state
    const trail = []
    let mouseX = -500
    let mouseY = -500
    let curX = -500
    let curY = -500
    let isVisible = false
    let opacity = 0
    let lastPointTime = 0
    let lastAddedX = -500
    let lastAddedY = -500

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isVisible = true

      const now = performance.now()
      const dist = Math.hypot(mouseX - lastAddedX, mouseY - lastAddedY)

      // Add a trail point when moved enough or after a short interval
      if (dist > 6 || (now - lastPointTime > 60 && dist > 2)) {
        trail.push({
          x: mouseX,
          y: mouseY,
          time: now,
        })
        lastPointTime = now
        lastAddedX = mouseX
        lastAddedY = mouseY
      }
    }

    const handleMouseLeave = () => {
      isVisible = false
    }

    const handleMouseEnter = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isVisible = true
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Animation Loop
    const render = () => {
      const now = performance.now()

      // Clear previous frame
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Smooth position lerp
      curX += (mouseX - curX) * 0.3
      curY += (mouseY - curY) * 0.3

      // Smooth visibility fade
      const targetOpacity = isVisible ? 1 : 0
      opacity += (targetOpacity - opacity) * 0.1

      // ── 1. Draw Trail (Fades out smoothly over 3 seconds) ──────────
      // Remove points older than TRAIL_LIFETIME
      while (trail.length > 0 && now - trail[0].time > TRAIL_LIFETIME) {
        trail.shift()
      }

      if (trail.length > 1) {
        // Draw connecting smooth ribbon
        for (let i = 0; i < trail.length - 1; i++) {
          const p1 = trail[i]
          const p2 = trail[i + 1]
          const age = now - p1.time
          const life = Math.max(0, 1 - age / TRAIL_LIFETIME) // 1 -> 0 over 3s
          const easeFade = life * life // quadratic decay

          if (easeFade <= 0.001) continue

          const lineWidth = 4 + easeFade * 14 // Soft ribbon width
          const lineAlpha = easeFade * 0.12 // Light orange tint

          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${lineAlpha})`
          ctx.lineWidth = lineWidth
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }

        // Draw soft dispersing glow nodes along trail
        for (let i = 0; i < trail.length; i += 2) {
          const p = trail[i]
          const age = now - p.time
          const life = Math.max(0, 1 - age / TRAIL_LIFETIME)
          const easeFade = life * life

          if (easeFade <= 0.001) continue

          const radius = 12 + (1 - life) * 18 // Expands slightly as it dissipates
          const glowAlpha = easeFade * 0.08

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
          grad.addColorStop(0, `rgba(${ACCENT_COLOR}, ${glowAlpha})`)
          grad.addColorStop(0.6, `rgba(${ACCENT_COLOR}, ${glowAlpha * 0.35})`)
          grad.addColorStop(1, `rgba(${ACCENT_COLOR}, 0)`)

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ── 2. Draw Active Mouse Glow ──────────────────────────────────
      if (opacity > 0.01 && curX > -200 && curY > -200) {
        // Broad ambient orange glow (~160px radius)
        const ambientRadius = 160
        const ambientGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, ambientRadius)
        ambientGrad.addColorStop(0, `rgba(${ACCENT_COLOR}, ${0.16 * opacity})`)
        ambientGrad.addColorStop(0.35, `rgba(${ACCENT_COLOR}, ${0.07 * opacity})`)
        ambientGrad.addColorStop(0.7, `rgba(${ACCENT_COLOR}, ${0.02 * opacity})`)
        ambientGrad.addColorStop(1, `rgba(${ACCENT_COLOR}, 0)`)

        ctx.fillStyle = ambientGrad
        ctx.beginPath()
        ctx.arc(curX, curY, ambientRadius, 0, Math.PI * 2)
        ctx.fill()

        // Inner focused aura (~45px radius)
        const innerRadius = 45
        const innerGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, innerRadius)
        innerGrad.addColorStop(0, `rgba(${ACCENT_COLOR}, ${0.25 * opacity})`)
        innerGrad.addColorStop(0.6, `rgba(${ACCENT_COLOR}, ${0.08 * opacity})`)
        innerGrad.addColorStop(1, `rgba(${ACCENT_COLOR}, 0)`)

        ctx.fillStyle = innerGrad
        ctx.beginPath()
        ctx.arc(curX, curY, innerRadius, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
      }}
      aria-hidden="true"
    />
  )
}
