import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { gsap } from 'gsap'

export type TransitionHandle = {
  playNavigation: (path: string) => Promise<void>
  playInitialLoad: () => Promise<void>
}

type Props = {
  // Optional list of video elements / image URLs to wait for during initial load.
  // If not provided, the component will still wait for document.fonts.ready
  // and any <video> elements it finds with data-preload="true".
  videoSelectors?: string[]
  imageUrls?: string[]
  minLoadingDuration?: number // ms, default 1200
}

// Each panel now has its own explicit skew + render order, instead of a
// formula derived purely from index. Blue is rendered LAST (on top) with a
// noticeably larger skew so its diagonal cut is clearly visible slicing
// across the other two panels, matching the reference look.
const PANELS = [
  { color: '#000000', skew: 5 }, // black: base layer, subtle diagonal
  { color: '#FFFFFF', skew: 9 }, // white: mid layer, medium diagonal
  { color: '#00A6E8', skew: 18 }, // blue: front layer, pronounced diagonal
]

// Utility to create a diagonal clip-path polygon that ALWAYS fully covers
// the panel's box, regardless of skew value. Top edge points stay <= 0%
// and bottom edge points stay >= 100% on both sides — only the amount of
// "overhang" differs (left vs right), which is what creates the diagonal
// look without ever exposing a gap at the corners.
const clipPolygon = (skew = 14) => {
  return `polygon(0% ${-skew}%, 100% ${0}%, 100% ${100}%, 0% ${100 + skew}%)`
}

export const TransitionOverlay = forwardRef<TransitionHandle, Props>((props, ref) => {
  const { videoSelectors = ['video[data-preload="true"]'], imageUrls = [], minLoadingDuration = 1200 } = props

  const containerRef = useRef<HTMLDivElement | null>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])
  const loadingTextRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<GSAPTimeline | null>(null)
  const loopTlRef = useRef<GSAPTimeline | null>(null)

  const [animating, setAnimating] = useState(false)
  const [showLoadingText, setShowLoadingText] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const skipRequestedRef = useRef(false)

  useImperativeHandle(ref, () => ({
    playNavigation: async (path: string) => {
      return playTransition({
        mode: 'navigate',
        targetPath: path,
        onMidpoint: () => {
          if (window.location.pathname !== path) {
            window.history.pushState({}, '', path)
          }
        },
      })
    },
    playInitialLoad: async () => {
      return playTransition({ mode: 'loading' })
    },
  }))

  // Escape key: skip loop / fast-forward
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (animating && e.key === 'Escape') {
        skipRequestedRef.current = true
        if (tlRef.current) tlRef.current.progress(1)
      }
      if (animating) {
        e.stopImmediatePropagation()
        if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault()
        }
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [animating])

  // Builds a promise that resolves when all target assets are ready
  const waitForAssets = (): Promise<void> => {
    skipRequestedRef.current = false
    const tasks: Promise<void>[] = []

    // fonts
    if (document.fonts && document.fonts.ready) {
      tasks.push(document.fonts.ready.then(() => undefined))
    }

    // videos
    videoSelectors.forEach((sel) => {
      document.querySelectorAll<HTMLVideoElement>(sel).forEach((video) => {
        if (video.readyState >= 3) return // HAVE_FUTURE_DATA or more, already ready
        tasks.push(
          new Promise<void>((resolve) => {
            const done = () => {
              video.removeEventListener('canplaythrough', done)
              video.removeEventListener('loadeddata', done)
              video.removeEventListener('error', done)
              resolve()
            }
            video.addEventListener('canplaythrough', done, { once: true })
            video.addEventListener('loadeddata', done, { once: true })
            video.addEventListener('error', done, { once: true })
          })
        )
      })
    })

    // images
    imageUrls.forEach((src) => {
      tasks.push(
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = src
        })
      )
    })

    // Track fake incremental progress so the UI has something to show
    // even if we can't measure real byte-level progress.
    const total = Math.max(tasks.length, 1)
    let completed = 0
    setProgress(0)

    const trackedTasks = tasks.map((t) =>
      t.then(() => {
        completed += 1
        setProgress(Math.round((completed / total) * 100))
      })
    )

    // Also let Escape short-circuit everything
    const skipPromise = new Promise<void>((resolve) => {
      const check = () => {
        if (skipRequestedRef.current) {
          setProgress(100)
          resolve()
          return
        }
        requestAnimationFrame(check)
      }
      check()
    })

    return Promise.race([Promise.all(trackedTasks).then(() => setProgress(100)), skipPromise]).then(() => undefined)
  }

  const startLoopingAnimation = () => {
    if (!panelsRef.current.length) return

    const loopTl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } })
    loopTlRef.current = loopTl

    // Panels gently pulse in sequence (subtle shift + slight scale), giving
    // a "breathing" look instead of sitting completely static.
    panelsRef.current.forEach((panel, i) => {
      loopTl.to(
        panel,
        {
          scaleX: 1.015,
          scaleY: 1.01,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
        },
        i * 0.12
      )
    })

    // Loading text pulses in parallel
    if (loadingTextRef.current) {
      gsap.to(loadingTextRef.current, {
        opacity: 0.55,
        scale: 0.97,
        duration: 0.6,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
  }

  const stopLoopingAnimation = () => {
    if (loopTlRef.current) {
      loopTlRef.current.kill()
      loopTlRef.current = null
    }
    if (loadingTextRef.current) {
      gsap.killTweensOf(loadingTextRef.current)
      gsap.set(loadingTextRef.current, { opacity: 1, scale: 1 })
    }
    panelsRef.current.forEach((panel) => {
      gsap.set(panel, { scaleX: 1, scaleY: 1 })
    })
  }

  const playTransition = ({ mode, targetPath, onMidpoint }: { mode: 'loading' | 'navigate'; targetPath?: string; onMidpoint?: () => void }) => {
    return new Promise<void>((resolve) => {
      if (!containerRef.current) return resolve()
      const panels = panelsRef.current.slice(0, PANELS.length)

      const currentPath = window.location.pathname
      const destPath = targetPath || currentPath

      // Use Red (#E60012) for /skills, /about or when navigating from them, otherwise default blue
      const isRedRoute = destPath === '/skills' || destPath === '/about' || currentPath === '/skills' || currentPath === '/about'
      const accentColor = isRedRoute ? '#E60012' : '#00A6E8'

      if (panels[2]) {
        panels[2].style.background = accentColor
      }

      panels.forEach((p) => {
        gsap.set(p, { xPercent: -140, opacity: 1, rotation: 0.01, force3D: true })
      })

      setIsVisible(true)
      setAnimating(true)

      const closeDuration = 0.32
      const openDuration = 0.32
      const stagger = 0.06
      const navigateHold = 0.25

      const tl = gsap.timeline({
        onComplete: () => {
          setAnimating(false)
          setShowLoadingText(false)
          setIsVisible(false)
          tlRef.current = null
          resolve()
        },
      })

      tlRef.current = tl

      // 1) Close panels: white -> blue -> black, staggered
      tl.to(
        panels,
        {
          xPercent: 0,
          opacity: 1,
          duration: closeDuration,
          ease: 'power3.out',
          stagger: { each: stagger, from: 'start' },
        },
        0
      )

      // 2) Midpoint: screen fully covered
      tl.add(async () => {
        if (onMidpoint) {
          try {
            onMidpoint()
          } catch (err) {
            console.error(err)
          }
        }

        if (mode === 'loading') {
          setShowLoadingText(true)
          if (loadingTextRef.current) {
            gsap.fromTo(
              loadingTextRef.current,
              { scale: 0.9, y: -6 },
              { scale: 1, y: 0, duration: 0.25, ease: 'elastic.out(1, 0.6)' }
            )
          }

          // Pause the master timeline, run a real looping animation while
          // we wait for actual assets to be ready, then resume to open.
          tl.pause()
          startLoopingAnimation()

          const start = performance.now()
          await waitForAssets()
          const elapsed = performance.now() - start
          const remaining = Math.max(0, minLoadingDuration - elapsed)
          if (remaining > 0) {
            await new Promise((res) => setTimeout(res, remaining))
          }

          stopLoopingAnimation()
          tl.resume()
        }
      }, `>+${closeDuration - 0.02}`)

      // 3) Hold (navigate mode only — loading mode uses real waitForAssets above)
      if (mode === 'navigate') {
        tl.to({}, { duration: navigateHold })
      }

      // 4) Open panels reverse order: black -> blue -> white
      tl.to([...panels].reverse(), {
        xPercent: 140,
        opacity: 0,
        duration: openDuration,
        ease: 'power3.in',
        stagger: { each: stagger, from: 'start' },
      })

      tl.set(panels, { xPercent: -140, opacity: 0 })
    })
  }

  return (
    <div
      ref={containerRef}
      aria-hidden={!isVisible && !showLoadingText}
      className="pointer-events-none fixed inset-0 z-50 flex items-stretch justify-start overflow-hidden"
      style={{
        pointerEvents: isVisible && (animating || showLoadingText) ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {PANELS.map(({ color, skew }, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) panelsRef.current[i] = el
          }}
          className="transition-panel"
          style={{
            background: color,
            position: 'fixed',
            // Slightly overscan beyond the viewport on every side so that,
            // combined with the fixed clip-path above, there is never a
            // sub-pixel seam/gap at the screen edges during the slide
            // in/out animation.
            inset: '-2% -2%',
            clipPath: clipPolygon(skew),
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {showLoadingText && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4">
          <div
            ref={loadingTextRef}
            style={{
              color: '#FFFFFF',
              fontFamily: "'Anton','Archivo_Black', Impact, 'Segoe UI', sans-serif",
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              letterSpacing: '0.08em',
              textAlign: 'center',
              textTransform: 'uppercase',
              WebkitTextStroke: '1px rgba(0,0,0,0.75)',
            }}
            aria-live="polite"
          >
            YOGATAMA DAFA
          </div>

          <div
            style={{
              width: 'min(280px, 60vw)',
              height: 6,
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: '#000000',
                transition: 'width 0.15s ease-out',
              }}
            />
          </div>

          <div
            style={{
              color: '#FFFFFF',
              fontFamily: "'Anton','Archivo_Black', Impact, sans-serif",
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              WebkitTextStroke: '0.5px rgba(0,0,0,0.6)',
            }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  )
})

export default TransitionOverlay