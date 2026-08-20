import React, { useEffect, useState } from 'react'
import { RotateCcw, Smartphone, Monitor } from 'lucide-react'

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

      // Deteksi perangkat mobile / tablet (layar kecil < 1024px atau touch device dengan lebar < 1180px)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = w < 1024
      const isMobileTablet = isSmallScreen || (isTouchDevice && w < 1180)

      setIsMobileOrTablet(isMobileTablet)

      // Mode portrait (h > w) pada layar mobile/tablet
      const portrait = h > w && isSmallScreen
      setIsPortrait(portrait)

      if (isMobileTablet) {
        // Hitung skala rasio terhadap desktop 1366x768 untuk mobile/tablet
        const scaleX = w / BASE_WIDTH
        const scaleY = h / BASE_HEIGHT
        // Skala agar muat presisi di layar mobile/tablet
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

  const showOrientationNotice = isMobileOrTablet && isPortrait && !dismissPrompt

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black selection:bg-sky-500 selection:text-white">
      {/* Tampilan Desktop Normal (Full Screen Fluid 100% tanpa kotak hitam) */}
      {!isMobileOrTablet ? (
        <div className="h-full w-full overflow-hidden">
          {children}
        </div>
      ) : (
        /* Tampilan Mobile/Tablet yang discale mengecil agar persis Desktop */
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
          <div className="h-full w-full overflow-hidden shadow-2xl">
            {children}
          </div>
        </div>
      )}

      {/* Overlay Peringatan Rotasi ke Landscape jika di HP/Tablet Portrait (Warna Biru Persona) */}
      {showOrientationNotice && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 p-6 text-white backdrop-blur-md font-['Anton','Archivo_Black',Impact,sans-serif]">
          {/* Decorative P5 Blue Background Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-96 w-[150%] -rotate-12 bg-sky-500" />
            <div className="absolute top-1/2 -right-20 h-64 w-[150%] rotate-6 bg-white" />
          </div>

          <div className="relative z-10 max-w-sm text-center">
            {/* Animasi Rotasi HP */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-sky-500/30" />
              <div className="relative flex items-center justify-center rounded-2xl bg-[#00a0e9] p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-white">
                <Smartphone className="h-12 w-12 text-white animate-bounce" />
                <RotateCcw className="absolute -right-2 -top-2 h-6 w-6 text-yellow-300 animate-spin" />
              </div>
            </div>

            {/* Header Persona Style */}
            <div className="mb-2 inline-block -rotate-2 border-2 border-black bg-white px-3 py-1 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <span className="text-sm font-black tracking-widest text-black uppercase">
                SYSTEM NOTICE // ROTATE DEVICE
              </span>
            </div>

            <h2 className="mb-3 text-2xl font-extrabold uppercase leading-tight tracking-wider text-white drop-shadow-[2px_2px_0px_rgba(0,160,233,1)]">
              PUTAR PERANGKAT KE MODE LANDSCAPE
            </h2>

            <p className="mb-6 text-sm font-sans font-medium text-neutral-300 leading-relaxed bg-black/60 border border-neutral-800 p-3 rounded-md">
              Tampilan portfolio didesain penuh sesuai pengalaman desktop Persona 5. 
              <span className="block mt-1 font-semibold text-sky-400">
                Silakan miringkan layar HP / Tablet Anda ke landscape untuk tampilan otomatis mengecil & pas.
              </span>
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest">
                <Monitor className="h-4 w-4 text-sky-400" />
                <span>DESKTOP MODE READY</span>
              </div>

              <button
                type="button"
                onClick={() => setDismissPrompt(true)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded border-2 border-white bg-[#00a0e9] hover:bg-sky-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Tetap Lanjutkan (Preview)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
