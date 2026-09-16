import { useEffect, useRef, useState } from 'react'

export default function ScrollTypewriter({
  text = '',
  className = '',
}) {
  const containerRef = useRef(null)
  const [typedLength, setTypedLength] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let animId

    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Start typing when element enters lower viewport (85% from top)
      const start = windowHeight * 0.85
      // Complete typing when element reaches upper-middle reading position (35% from top)
      const end = windowHeight * 0.35

      const rawProgress = (start - rect.top) / (start - end)
      const progress = Math.min(Math.max(rawProgress, 0), 1)

      const targetCount = Math.round(progress * text.length)
      setTypedLength(targetCount)
      setIsActive(progress > 0 && progress < 1)
    }

    const onScrollRaf = () => {
      cancelAnimationFrame(animId)
      animId = requestAnimationFrame(handleScroll)
    }

    handleScroll()
    window.addEventListener('scroll', onScrollRaf, { passive: true })
    window.addEventListener('resize', onScrollRaf, { passive: true })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', onScrollRaf)
      window.removeEventListener('resize', onScrollRaf)
    }
  }, [text])

  const typedText = text.slice(0, typedLength)
  const ghostText = text.slice(typedLength)

  return (
    <p ref={containerRef} className={`scroll-typewriter ${className}`}>
      <span className="scroll-typewriter__typed">{typedText}</span>
      {isActive && <span className="scroll-typewriter__cursor" />}
      <span className="scroll-typewriter__ghost" aria-hidden="true">
        {ghostText}
      </span>
    </p>
  )
}
