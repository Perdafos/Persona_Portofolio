import React, { useEffect, useState } from 'react'
import { RotateCcw, Smartphone, Monitor, Maximize } from 'lucide-react'

const BASE_WIDTH = 1366
const BASE_HEIGHT = 768

interface DesktopScalerProps {
  children: React.ReactNode
}

export default function DesktopScaler({ children }: DesktopScalerProps) {
  const [scale, setScale] = useState(1)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [dismissPrompt, setDismissPrompt] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight

      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = w < 1024
      const isMobileTablet = isSmallScreen || (isTouchDevice && w < 1180)

      setIsMobileOrTablet(isMobileTablet)

      // Deteksi mode portrait
      const portrait = h > w && isSmallScreen
      setIsPortrait(portrait)

      if (isMobileTablet) {
        // Hitung skala berbasis rasio aspek canvas 1366x768
        const scaleX = w / BASE_WIDTH
        const scaleY = h / BASE_HEIGHT
        
        // Gunakan Math.min agar seluruh UI 1366x768 muat presisi di dalam screen
        const currentScale = Math.min(scaleX, scaleY)
        setScale(currentScale)
      } else {
        setScale(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // Fungsi untuk memicu Fullscreen dan Mengunci Orientasi ke Landscape
  const handleFullscreenAndLandscape = async () => {
    try {
      // 1. Minta Fullscreen ke browser
      const docEl = document.documentElement as HTMLElement & {
        requestFullscreen?: () => Promise<void>
        webkitRequestFullscreen?: () => Promise<void>
        mozRequestFullScreen?: () => Promise<void>
        msRequestFullscreen?: () => Promise<void>
      }

      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen()
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen()
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen()
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen()
      }

      // 2. Kunci layar ke Landscape jika didukung browser HP (Chrome Android, Edge Mobile, dll.)
      if (screen.orientation && 'lock' in screen.orientation) {
        // Cast type agar TypeScript tidak menganggap error untuk screen.orientation.lock
        await (screen.orientation as unknown as { lock: (orientation: string) => Promise<void> }).lock('landscape')
      }
    } catch (err) {
      console.log('Fullscreen/Orientation Lock diproteksi atau tidak didukung:', err)
    } finally {
      // Tutup notice overlay
      setDismissPrompt(true)
    }
  }

  const showOrientationNotice = isMobileOrTablet && (isPortrait || !dismissPrompt)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black selection:bg-sky-500 selection:text-white">
      {/* Tampilan Desktop Normal */}
      {!isMobileOrTablet ? (
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>
      ) : (
        /* Tampilan Mobile/Tablet yang discale mengecil presisi */
        <div
          className="absolute left-1/2 top-1/2 flex items-center justify-center overflow-hidden"
          style={{
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
          }}
        >
          <div className="h-full w-full overflow-hidden">
            {children}
          </div>
        </div>
      )}

      {/* Overlay Peringatan Rotasi & Fullscreen */}
      {showOrientationNotice && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-6 text-white backdrop-blur-md font-['Anton','Archivo_Black',Impact,sans-serif]">
          {/* Background Decorative P5 */}
          <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-96 w-[150%] -rotate-12 bg-sky-500" />
            <div className="absolute top-1/2 -right-20 h-64 w-[150%] rotate-6 bg-white" />
          </div>

          <div className="relative z-10 max-w-sm text-center">
            {/* Animasi Rotasi & Fullscreen */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-sky-500/30" />
              <div className="relative flex items-center justify-center rounded-2xl bg-[#00a0e9] p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-white">
                <Smartphone className="h-12 w-12 text-white animate-bounce" />
                <RotateCcw className="absolute -right-2 -top-2 h-6 w-6 text-yellow-300 animate-spin" />
              </div>
            </div>

            <div className="mb-2 inline-block -rotate-2 border-2 border-black bg-white px-3 py-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black tracking-widest text-black uppercase">
                SYSTEM NOTICE // FULLSCREEN
              </span>
            </div>

            <h2 className="mb-3 text-2xl font-extrabold uppercase leading-tight tracking-wider text-white drop-shadow-[2px_2px_0px_rgba(0,160,233,1)]">
              MASUK MODE LANDSCAPE FULLSCREEN
            </h2>

            <p className="mb-6 text-sm font-sans font-medium text-neutral-300 leading-relaxed bg-black/60 border border-neutral-800 p-3 rounded-md">
              Untuk pengalaman visual maksimal tanpa terpotong address bar browser, tekan tombol di bawah untuk mengaktifkan mode landscape layar penuh.
            </p>

            <div className="flex flex-col gap-3">
              {/* TOMBOL UTAMA: Miringkan Layar & Fullscreen */}
              <button
                type="button"
                onClick={handleFullscreenAndLandscape}
                className="inline-flex items-center justify-center gap-2 rounded border-2 border-white bg-[#00a0e9] hover:bg-sky-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Maximize className="h-4 w-4" />
                <span>Miringkan Layar & Fullscreen</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[0.7rem] font-mono text-neutral-400 uppercase tracking-widest mt-1">
                <Monitor className="h-3.5 w-3.5 text-sky-400" />
                <span>DESKTOP EXPERIENCE READY</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}