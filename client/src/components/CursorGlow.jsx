import { useEffect, useRef, useState } from 'react'

const TRAIL_LIFETIME = 1000 // 1 second disappearance
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
    let lastAddedX = -500
    let lastAddedY = -500

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isVisible = true

      const now = performance.now()
      const dist = Math.hypot(mouseX - lastAddedX, mouseY - lastAddedY)

      // Sample points smoothly when mouse moves at least 4px
      if (dist >= 4) {
        trail.push({
          x: mouseX,
          y: mouseY,
          time: now,
        })
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

      // Smooth position lerp for active cursor glow
      curX += (mouseX - curX) * 0.35
      curY += (mouseY - curY) * 0.35

      // Smooth visibility fade
      const targetOpacity = isVisible ? 1 : 0
      opacity += (targetOpacity - opacity) * 0.1

      // ── 1. Clean Up Old Trail Points (> 3 seconds) ─────────────────
      while (trail.length > 0 && now - trail[0].time > TRAIL_LIFETIME) {
        trail.shift()
      }

      // Build points array including current live cursor point if visible
      const points = [...trail]
      if (isVisible && curX > 0 && curY > 0) {
        points.push({ x: curX, y: curY, time: now })
      }

      // ── 2. Draw Smooth Continuous Curve Ribbon (No Circles/Glitches) ──
      const len = points.length
      if (len >= 2) {
        // Draw in two passes for a soft glowing aura along the curve:
        // Pass 1: Soft wide ambient aura
        // Pass 2: Defined smooth core line

        const drawCurve = (isAura = false) => {
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          // Handle 2 points (straight segment)
          if (len === 2) {
            const age = now - points[0].time
            const life = Math.max(0, 1 - age / TRAIL_LIFETIME)
            const alpha = Math.pow(life, 1.4) * (isAura ? 0.08 : 0.2)
            const width = isAura ? (8 + life * 16) : (2.5 + life * 6)

            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)
            ctx.lineTo(points[1].x, points[1].y)
            ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${alpha})`
            ctx.lineWidth = width
            ctx.stroke()
            return
          }

          // Handle 3+ points with Midpoint Quadratic Bezier Splines
          // First segment
          const mid0_x = (points[0].x + points[1].x) / 2
          const mid0_y = (points[0].y + points[1].y) / 2
          const age0 = now - points[0].time
          const life0 = Math.max(0, 1 - age0 / TRAIL_LIFETIME)
          const alpha0 = Math.pow(life0, 1.4) * (isAura ? 0.08 : 0.2)
          const width0 = isAura ? (8 + life0 * 16) : (2.5 + life0 * 6)

          if (alpha0 > 0.002) {
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)
            ctx.lineTo(mid0_x, mid0_y)
            ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${alpha0})`
            ctx.lineWidth = width0
            ctx.stroke()
          }

          // Middle quadratic curved segments
          for (let i = 1; i < len - 1; i++) {
            const pPrev = points[i - 1]
            const pCur = points[i]
            const pNext = points[i + 1]

            const prevMidX = (pPrev.x + pCur.x) / 2
            const prevMidY = (pPrev.y + pCur.y) / 2
            const nextMidX = (pCur.x + pNext.x) / 2
            const nextMidY = (pCur.y + pNext.y) / 2

            const age = now - pCur.time
            const life = Math.max(0, 1 - age / TRAIL_LIFETIME) // 1 -> 0 over 3s
            const alpha = Math.pow(life, 1.4) * (isAura ? 0.08 : 0.2)
            const width = isAura ? (8 + life * 16) : (2.5 + life * 6)

            if (alpha <= 0.002) continue

            ctx.beginPath()
            ctx.moveTo(prevMidX, prevMidY)
            ctx.quadraticCurveTo(pCur.x, pCur.y, nextMidX, nextMidY)
            ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${alpha})`
            ctx.lineWidth = width
            ctx.stroke()
          }

          // Last segment to live cursor
          const lastMidX = (points[len - 2].x + points[len - 1].x) / 2
          const lastMidY = (points[len - 2].y + points[len - 1].y) / 2
          const ageLast = now - points[len - 1].time
          const lifeLast = Math.max(0, 1 - ageLast / TRAIL_LIFETIME)
          const alphaLast = Math.pow(lifeLast, 1.4) * (isAura ? 0.08 : 0.2)
          const widthLast = isAura ? (8 + lifeLast * 16) : (2.5 + lifeLast * 6)

          if (alphaLast > 0.002) {
            ctx.beginPath()
            ctx.moveTo(lastMidX, lastMidY)
            ctx.lineTo(points[len - 1].x, points[len - 1].y)
            ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${alphaLast})`
            ctx.lineWidth = widthLast
            ctx.stroke()
          }
        }

        // Pass 1: Soft wide glow
        drawCurve(true)
        // Pass 2: Clean smooth core curve
        drawCurve(false)
      }

      // ── 3. Draw Active Mouse Glow ──────────────────────────────────
      if (opacity > 0.01 && curX > -200 && curY > -200) {
        // Broad ambient orange glow (~150px radius)
        const ambientRadius = 150
        const ambientGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, ambientRadius)
        ambientGrad.addColorStop(0, `rgba(${ACCENT_COLOR}, ${0.15 * opacity})`)
        ambientGrad.addColorStop(0.35, `rgba(${ACCENT_COLOR}, ${0.06 * opacity})`)
        ambientGrad.addColorStop(0.7, `rgba(${ACCENT_COLOR}, ${0.015 * opacity})`)
        ambientGrad.addColorStop(1, `rgba(${ACCENT_COLOR}, 0)`)

        ctx.fillStyle = ambientGrad
        ctx.beginPath()
        ctx.arc(curX, curY, ambientRadius, 0, Math.PI * 2)
        ctx.fill()

        // Inner focused aura (~40px radius)
        const innerRadius = 40
        const innerGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, innerRadius)
        innerGrad.addColorStop(0, `rgba(${ACCENT_COLOR}, ${0.22 * opacity})`)
        innerGrad.addColorStop(0.6, `rgba(${ACCENT_COLOR}, ${0.06 * opacity})`)
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
