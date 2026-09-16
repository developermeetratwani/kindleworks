import { useEffect, useRef, useState } from 'react'

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

    // Mouse coordinates & smoothing
    let mouseX = -500
    let mouseY = -500
    let curX = -500
    let curY = -500
    let isVisible = false
    let opacity = 0

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isVisible = true
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
      // Clear previous frame
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Smooth position lerp
      curX += (mouseX - curX) * 0.35
      curY += (mouseY - curY) * 0.35

      // Smooth visibility fade
      const targetOpacity = isVisible ? 1 : 0
      opacity += (targetOpacity - opacity) * 0.1

      // ── Draw Orange Glow Around Cursor ────────────────────────────
      if (opacity > 0.005 && curX > -200 && curY > -200) {
        // Outer ambient orange glow (~160px radius)
        const ambientRadius = 160
        const ambientGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, ambientRadius)
        ambientGrad.addColorStop(0, `rgba(${ACCENT_COLOR}, ${0.16 * opacity})`)
        ambientGrad.addColorStop(0.35, `rgba(${ACCENT_COLOR}, ${0.06 * opacity})`)
        ambientGrad.addColorStop(0.7, `rgba(${ACCENT_COLOR}, ${0.015 * opacity})`)
        ambientGrad.addColorStop(1, `rgba(${ACCENT_COLOR}, 0)`)

        ctx.fillStyle = ambientGrad
        ctx.beginPath()
        ctx.arc(curX, curY, ambientRadius, 0, Math.PI * 2)
        ctx.fill()

        // Inner focused aura (~45px radius)
        const innerRadius = 45
        const innerGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, innerRadius)
        innerGrad.addColorStop(0, `rgba(${ACCENT_COLOR}, ${0.24 * opacity})`)
        innerGrad.addColorStop(0.6, `rgba(${ACCENT_COLOR}, ${0.07 * opacity})`)
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
