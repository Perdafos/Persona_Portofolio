import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { gsap } from 'gsap'

export type TransitionHandle = {
  playNavigation: (path: string) => Promise<void>
  playInitialLoad: () => Promise<void>
}

type Props = {
  videoSelectors?: string[]
  imageUrls?: string[]
  minLoadingDuration?: number // ms, default 1000
}

const PANELS = [
  { color: '#000000', skew: 5 },  // black: base layer
  { color: '#FFFFFF', skew: 9 },  // white: mid layer
  { color: '#00A6E8', skew: 18 }, // blue: front layer
]

const clipPolygon = (skew = 14) => {
  return `polygon(0% ${-skew}%, 100% ${0}%, 100% ${100}%, 0% ${100 + skew}%)`
}

export const TransitionOverlay = forwardRef<TransitionHandle, Props>((props, ref) => {
  const { videoSelectors = ['video[data-preload="true"]'], imageUrls = [], minLoadingDuration = 1000 } = props

  const containerRef = useRef<HTMLDivElement | null>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])
  const loadingTextRef = useRef<HTMLDivElement | null>(null)
  const tlRef = useRef<GSAPTimeline | null>(null)
  const pulseTweenRef = useRef<gsap.core.Tween | null>(null)

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

  const waitForAssets = (): Promise<void> => {
    skipRequestedRef.current = false
    const tasks: Promise<void>[] = []

    if (document.fonts && document.fonts.ready) {
      tasks.push(document.fonts.ready.then(() => undefined))
    }

    videoSelectors.forEach((sel) => {
      document.querySelectorAll<HTMLVideoElement>(sel).forEach((video) => {
        if (video.readyState >= 3) return
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

    const total = Math.max(tasks.length, 1)
    let completed = 0
    setProgress(0)

    const trackedTasks = tasks.map((t) =>
      t.then(() => {
        completed += 1
        setProgress(Math.round((completed / total) * 100))
      })
    )

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
    // Hanya pulsing pudar opacity pada teks katakana (tanpa membesarkan/memutarkan panel)
    if (loadingTextRef.current) {
      pulseTweenRef.current = gsap.fromTo(
        loadingTextRef.current,
        { opacity: 1 },
        {
          opacity: 0.35,
          duration: 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }
      )
    }
  }

  const stopLoopingAnimation = () => {
    if (pulseTweenRef.current) {
      pulseTweenRef.current.kill()
      pulseTweenRef.current = null
    }
    if (loadingTextRef.current) {
      gsap.killTweensOf(loadingTextRef.current)
      gsap.set(loadingTextRef.current, { opacity: 1 })
    }
  }

  const playTransition = ({ mode, targetPath, onMidpoint }: { mode: 'loading' | 'navigate'; targetPath?: string; onMidpoint?: () => void }) => {
    return new Promise<void>((resolve) => {
      if (!containerRef.current) return resolve()
      const panels = panelsRef.current.slice(0, PANELS.length)

      const currentPath = window.location.pathname
      const destPath = targetPath || currentPath

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

      const closeDuration = 0.26
      const openDuration = 0.32
      const stagger = 0.045
      const navigateHold = 0.2

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

      // 1. Panel menutup rapat
      tl.to(
        panels,
        {
          xPercent: 0,
          opacity: 1,
          duration: closeDuration,
          ease: 'power4.out',
          stagger: { each: stagger, from: 'start' },
        },
        0
      )

      // 2. Midpoint saat tertutup
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

          requestAnimationFrame(() => {
            if (loadingTextRef.current) {
              gsap.fromTo(
                loadingTextRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.15, ease: 'power2.out' }
              )
            }
            startLoopingAnimation()
          })

          tl.pause()

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
      }, closeDuration)

      if (mode === 'navigate') {
        tl.to({}, { duration: navigateHold })
      }

      // 3. Panel bergeser keluar membawa teks loading di dalamnya
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
      className="pointer-events-none fixed inset-0 z-50 flex items-stretch justify-start overflow-hidden select-none"
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
            inset: '-2% -2%',
            clipPath: clipPolygon(skew),
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
          }}
        >
          {i === 2 && showLoadingText && (
            <div
              ref={loadingTextRef}
              className="absolute bottom-8 left-16 md:left-12 z-[60] flex flex-col items-start gap-1.5 font-['Anton','Archivo_Black',Impact,sans-serif]"
              aria-live="polite"
            >
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                  lineHeight: 1,
                  letterSpacing: '0.12em',
                  textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
                  WebkitTextStroke: '1px rgba(0,0,0,0.8)',
                }}
              >
                読み込み中
              </div>

              <div className="flex items-center gap-2.5 font-mono text-[0.7rem] md:text-xs font-bold tracking-widest text-white/90 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="bg-black/80 border border-white/40 px-2 py-0.5 -skew-x-12">
                  <span className="inline-block skew-x-12 text-yellow-300">SYSTEM LOADING...</span>
                </span>
                <span>{progress}%</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
})

export default TransitionOverlay