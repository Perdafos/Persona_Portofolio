import { useEffect, useRef, useState } from 'react'
import { MoveRight, MoveLeft } from 'lucide-react'

interface HomePageProps {
  onOpenProjects: () => void
  onOpenSkills: () => void
  onOpenAbout: () => void
  onOpenContact: () => void
}

function PersonaActiveBanner() {
  return (
    <svg
      className="animate-banner-slide pointer-events-none absolute -inset-x-6 -inset-y-2 z-0 h-[calc(100%+1rem)] w-[calc(100%+3.5rem)] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.85)]"
      viewBox="0 0 520 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M 5 40 L 45 22 L 35 12 L 160 2 L 140 18 L 460 22 L 510 30 L 480 55 L 515 50 L 470 88 L 70 78 L 45 88 L 5 52 L 25 45 Z"
        fill="white"
      />
      <path
        d="M 12 40 L 47 25 L 142 20 L 455 25 L 465 82 L 68 73 L 42 82 L 10 50 Z"
        fill="black"
        stroke="white"
        strokeWidth="2.5"
      />
      <path
        d="M 32 15 L 155 5 L 138 20 L 45 23 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M 420 72 L 510 35 L 480 58 Z"
        fill="white"
        stroke="black"
        strokeWidth="2"
      />
      <path
        d="M 0 42 L 20 38 L 13 48 L 25 44 L 15 56 Z"
        fill="white"
        stroke="black"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function HomePage({ onOpenProjects, onOpenSkills, onOpenAbout, onOpenContact }: HomePageProps) {
  const [activeMenuIndex, setActiveMenuIndex] = useState(0)
  const [isSlapping, setIsSlapping] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const menuCount = 4

  const triggerHoverEffect = (index: number) => {
    if (activeMenuIndex !== index) {
      setActiveMenuIndex(index)
      setIsSlapping(true)
      setTimeout(() => setIsSlapping(false), 150)
    }
  }

  const handleBackAction = () => {
    triggerHoverEffect(0)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        const nextIndex = (activeMenuIndex + 1) % menuCount
        triggerHoverEffect(nextIndex)
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        const prevIndex = (activeMenuIndex - 1 + menuCount) % menuCount
        triggerHoverEffect(prevIndex)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsSlapping(true)
        setTimeout(() => setIsSlapping(false), 150)
        if (activeMenuIndex === 0) {
          onOpenProjects()
        } else if (activeMenuIndex === 1) {
          onOpenSkills()
        } else if (activeMenuIndex === 2) {
          onOpenAbout()
        } else if (activeMenuIndex === 3) {
          onOpenContact()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleBackAction()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeMenuIndex, onOpenProjects, onOpenSkills, onOpenAbout, onOpenContact])

  return (
    <main className="h-dvh w-full overflow-hidden bg-black">
      <style>{`
      
        @keyframes screenSlap {
          0% { transform: scale(1) translate(0, 0) rotate(0deg); }
          30% { transform: scale(1.015) translate(-4px, 3px) rotate(-0.5deg); }
          70% { transform: scale(0.995) translate(3px, -2px) rotate(0.3deg); }
          100% { transform: scale(1) translate(0, 0) rotate(0deg); }
        }
        @keyframes flashAnim {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes slideFromLeft {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-screen-slap {
          animation: screenSlap 0.15s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-flash {
          animation: flashAnim 0.12s ease-out forwards;
        }
        .animate-banner-slide {
          animation: slideFromLeft 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Penyesuaian khusus Landscape Mobile */
        @media screen and (max-height: 500px) {
          .mobile-footer-hide-control {
            display: none !important;
          }
        }
      `}</style>

      <section
        className={`relative h-screen min-h-svh w-full overflow-hidden transition-transform ${
          isSlapping ? 'animate-screen-slap' : ''
        }`}
      >
        {isSlapping && (
          <div className="animate-flash pointer-events-none absolute inset-0 z-50 bg-white" />
        )}

        <video
          ref={videoRef}
          className="absolute inset-0 z-0 hidden h-full w-full object-cover will-change-transform md:block"
          autoPlay
          muted
          loop
          playsInline
          poster="https://persona-assets.perdafos.my.id/video/hero-bg-poster.jpg"
          src="https://persona-assets.perdafos.my.id/video/hero-bg.mp4"
        />
        <img
          className="absolute inset-0 z-0 block h-full w-full object-cover md:hidden"
          src="https://persona-assets.perdafos.my.id/video/hero-bg-poster.jpg"
          alt=""
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/10 to-black/50"
          aria-hidden="true"
        />

        <div className="relative z-20 flex h-full flex-col justify-between p-3 sm:p-5 md:p-6 pb-6 sm:pb-8 text-white">

          {/* HEADER TOP */}
          <div className="hidden lg:flex lg:flex-row lg:items-start lg:justify-between shrink-0">
            <div className="-rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              <div className="w-fit border border-white/35 bg-black px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-white">
                PORTFOLIO // YOGATAMA DAFA
              </div>
            </div>
            <div className="rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              <div className="w-fit bg-white px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-black">
                MALANG · SISTEM INFORMASI JARINGAN APLIKASI
              </div>
            </div>
          </div>

          <div className="flex flex-1 items-end min-h-0 py-1 md:py-2">
            <div className="max-w-[760px]">

              {/* JUDUL UTAMA */}
              <h1
                className="mb-2 flex flex-col gap-1 leading-[0.82] md:mb-2.5"
                aria-label="YOGATAMA DAFA"
              >
                <span className="flex w-fit items-center bg-white px-3 py-1 font-['Anton','Archivo_Black',Impact,'Segoe_UI',sans-serif] text-[clamp(2.2rem,4.8vw,4.8rem)] leading-[0.8] tracking-[0.06em] text-black shadow-[4px_4px_0_rgba(0,0,0,0.45)] origin-left -rotate-2">
                  <span>YO</span>
                  <span className="mx-[0.02em] inline-block rotate-6 scale-110 bg-sky-600 px-1.5 text-white shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
                    G
                  </span>
                  <span>ATA</span>
                  <span className="mx-[0.02em] inline-block -rotate-4 scale-110 bg-black px-1.5 text-white shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
                    M
                  </span>
                  <span>A</span>
                </span>

                <span className="w-fit bg-white px-3 py-1 font-['Anton','Archivo_Black',Impact,'Segoe_UI',sans-serif] text-[clamp(2.2rem,4.8vw,4.8rem)] leading-[0.8] tracking-[0.06em] text-black shadow-[4px_4px_0_rgba(0,0,0,0.45)] translate-x-2 rotate-[1.1deg]">
                  DAFA
                </span>
              </h1>

              {/* DESKRIPSI BIO */}
              <p className="m-0 max-w-2xl border border-white/80 bg-black/75 p-2.5 text-[clamp(0.78rem,1vw,0.92rem)] leading-relaxed text-neutral-100 [text-shadow:0_2px_5px_rgba(0,0,0,0.6)] md:p-3 hidden lg:block">
                Information Systems, Networks, and Applications (SIJA) student at SMKN 6 Malang, bridging server infrastructure with full-stack web development. Experienced in end-to-end application lifecycles UI design, database management, and cloud deployment. Committed to writing clean, secure code and constantly exploring new tools to engineer reliable digital products.
              </p>

              {/* NAV MENU */}
              <nav aria-label="Hero navigation">
                <ul className="mt-2.5 flex list-none flex-col gap-2 p-0 md:mt-3.5 md:gap-2.5">

                  {/* PROJECTS */}
                  {(() => {
                    const isActive = activeMenuIndex === 0
                    return (
                      <li>
                        <button
                          type="button"
                          className="group relative inline-flex cursor-pointer items-center border-none bg-transparent p-0 font-['Anton','Archivo_Black',Impact,'Segoe_UI',sans-serif] text-[clamp(1.5rem,3.2vw,2.4rem)] font-bold uppercase leading-none tracking-[0.08em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                          onMouseEnter={() => triggerHoverEffect(0)}
                          onFocus={() => triggerHoverEffect(0)}
                          onClick={() => {
                            triggerHoverEffect(0)
                            onOpenProjects()
                          }}
                        >
                          {isActive && <PersonaActiveBanner />}

                          <div className={`relative z-10 flex items-center gap-3 py-2.5 transition-all duration-150 ${isActive ? 'pl-8 pr-12' : 'px-3'}`}>
                            <span className="flex items-center">
                              <span className={`inline-block transition-transform duration-150 ${isActive ? '-rotate-3 scale-110 bg-sky-600 px-1' : 'group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-sky-600 group-hover:px-1'}`}>P</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-6 scale-105 bg-white px-1 text-black' : 'group-hover:rotate-6 group-hover:scale-105 group-hover:bg-white group-hover:px-1 group-hover:text-black'}`}>R</span>
                              <span className="inline-block transition-transform duration-150 group-hover:-rotate-2">O</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-4 scale-110 bg-black px-1' : 'group-hover:rotate-4 group-hover:scale-110 group-hover:bg-black group-hover:px-1'}`}>J</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? '-rotate-6 scale-105 bg-white px-1 text-black' : 'group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-white group-hover:px-1 group-hover:text-black'}`}>E</span>
                              <span className="inline-block transition-transform duration-150 group-hover:rotate-3">C</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? '-rotate-4 scale-110 bg-sky-600 px-1' : 'group-hover:-rotate-4 group-hover:scale-110 group-hover:bg-sky-600 group-hover:px-1'}`}>T</span>
                              <span className="inline-block transition-transform duration-150 group-hover:rotate-2">S</span>
                            </span>

                            <span
                              className={`transition duration-150 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                              aria-hidden="true"
                            >
                              ▸
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  })()}

                  {/* SKILLS */}
                  {(() => {
                    const isActive = activeMenuIndex === 1
                    return (
                      <li>
                        <button
                          type="button"
                          className="group relative inline-flex cursor-pointer items-center border-none bg-transparent p-0 font-['Anton','Archivo_Black',Impact,'Segoe_UI',sans-serif] text-[clamp(1.5rem,3.2vw,2.4rem)] font-bold uppercase leading-none tracking-[0.08em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
                          onMouseEnter={() => triggerHoverEffect(1)}
                          onFocus={() => triggerHoverEffect(1)}
                          onClick={() => {
                            triggerHoverEffect(1)
                            onOpenSkills()
                          }}
                        >
                          {isActive && <PersonaActiveBanner />}

                          <div className={`relative z-10 flex items-center gap-3 py-2.5 transition-all duration-150 ${isActive ? 'pl-8 pr-12' : 'px-3'}`}>
                            <span className="flex items-center">
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-6 scale-110 bg-white px-1 text-black' : 'group-hover:rotate-6 group-hover:scale-110 group-hover:bg-white group-hover:px-1 group-hover:text-black'}`}>S</span>
                              <span className="inline-block transition-transform duration-150 group-hover:-rotate-3">K</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-4 scale-110 bg-red-600 px-1' : 'group-hover:rotate-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:px-1'}`}>I</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? '-rotate-4 bg-black px-1' : 'group-hover:-rotate-4 group-hover:bg-black group-hover:px-1'}`}>L</span>
                              <span className="inline-block transition-transform duration-150 group-hover:rotate-2">L</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? '-rotate-6 scale-110 bg-white px-1 text-black' : 'group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-white group-hover:px-1 group-hover:text-black'}`}>S</span>
                            </span>

                            <span
                              className={`transition duration-150 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                              aria-hidden="true"
                            >
                              ▸
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  })()}

                  {/* ABOUT */}
                  {(() => {
                    const isActive = activeMenuIndex === 2
                    return (
                      <li>
                        <button
                          type="button"
                          className="group relative inline-flex cursor-pointer items-center border-none bg-transparent p-0 font-['Anton','Archivo_Black',Impact,'Segoe_UI',sans-serif] text-[clamp(1.5rem,3.2vw,2.4rem)] font-bold uppercase leading-none tracking-[0.08em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600"
                          onMouseEnter={() => triggerHoverEffect(2)}
                          onFocus={() => triggerHoverEffect(2)}
                          onClick={() => {
                            triggerHoverEffect(2)
                            onOpenAbout()
                          }}
                        >
                          {isActive && <PersonaActiveBanner />}

                          <div className={`relative z-10 flex items-center gap-3 py-2.5 transition-all duration-150 ${isActive ? 'pl-8 pr-12' : 'px-3'}`}>
                            <span className="flex items-center">
                              <span className={`inline-block transition-transform duration-150 ${isActive ? '-rotate-4 scale-110 bg-red-600 px-1' : 'group-hover:-rotate-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:px-1'}`}>A</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-6 scale-105 bg-white px-1 text-black' : 'group-hover:rotate-6 group-hover:scale-105 group-hover:bg-white group-hover:px-1 group-hover:text-black'}`}>B</span>
                              <span className="inline-block transition-transform duration-150 group-hover:-rotate-2">O</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-4 scale-110 bg-black px-1' : 'group-hover:rotate-4 group-hover:scale-110 group-hover:bg-black group-hover:px-1'}`}>U</span>
                              <span className="inline-block transition-transform duration-150 group-hover:-rotate-3">T</span>
                            </span>

                            <span
                              className={`transition duration-150 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                              aria-hidden="true"
                            >
                              ▸
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  })()}

                  {/* CONTACT */}
                  {(() => {
                    const isActive = activeMenuIndex === 3
                    return (
                      <li>
                        <button
                          type="button"
                          className="group relative inline-flex cursor-pointer items-center border-none bg-transparent p-0 font-['Anton','Archivo_Black',Impact,'Segoe_UI',sans-serif] text-[clamp(1.5rem,3.2vw,2.4rem)] font-bold uppercase leading-none tracking-[0.08em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                          onMouseEnter={() => triggerHoverEffect(3)}
                          onFocus={() => triggerHoverEffect(3)}
                          onClick={() => {
                            triggerHoverEffect(3)
                            onOpenContact()
                          }}
                        >
                          {isActive && <PersonaActiveBanner />}

                          <div className={`relative z-10 flex items-center gap-3 py-2.5 transition-all duration-150 ${isActive ? 'pl-8 pr-12' : 'px-3'}`}>
                            <span className="flex items-center">
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-6 scale-105 bg-white px-1 text-black' : 'group-hover:rotate-6 group-hover:scale-105 group-hover:bg-white group-hover:px-1 group-hover:text-black'}`}>C</span>
                              <span className="inline-block transition-transform duration-150 group-hover:-rotate-3">O</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-4 scale-110 bg-sky-600 px-1' : 'group-hover:rotate-4 group-hover:scale-110 group-hover:bg-sky-600 group-hover:px-1'}`}>N</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? '-rotate-4 bg-black px-1' : 'group-hover:-rotate-4 group-hover:bg-black group-hover:px-1'}`}>T</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-3 scale-105 bg-white px-1 text-black' : 'group-hover:rotate-3 group-hover:scale-105 group-hover:bg-white group-hover:px-1 group-hover:text-black'}`}>A</span>
                              <span className="inline-block transition-transform duration-150 group-hover:-rotate-2">C</span>
                              <span className={`inline-block transition-transform duration-150 ${isActive ? 'rotate-6 scale-110 bg-sky-600 px-1' : 'group-hover:rotate-6 group-hover:scale-110 group-hover:bg-sky-600 group-hover:px-1'}`}>T</span>
                            </span>

                            <span
                              className={`transition duration-150 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
                              aria-hidden="true"
                            >
                              ▸
                            </span>
                          </div>
                        </button>
                      </li>
                    )
                  })()}

                </ul>
              </nav>
            </div>
          </div>

          {/* FOOTER CONTROLS */}
          <footer className="flex items-center justify-between shrink-0 pt-2 pb-1 md:pb-2">
            <div className="flex cursor-default select-none items-center gap-4 md:gap-6 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-white/90 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)] md:text-[0.78rem]">
              
              <p className="mobile-footer-hide-control m-0 flex items-center gap-2">
                <span className="inline-flex -skew-x-12 items-center justify-center bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                  <span className="inline-block skew-x-12 font-sans text-xs font-black leading-none text-shadow-none">
                    <span className="skew-x-12 font-sans font-black flex"><MoveLeft size={12} /> <MoveRight size={12} /></span>
                  </span>
                </span>
                <span>SELECT</span>
              </p>

              <p className="mobile-footer-hide-control m-0 flex items-center gap-2">
                <span className="inline-flex -skew-x-12 items-center justify-center bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                  <span className="inline-block skew-x-12 text-[0.68rem] font-black leading-none text-shadow-none">ENTER</span>
                </span>
                <span>CONFIRM</span>
              </p>

              <button
                type="button"
                onClick={handleBackAction}
                className="m-0 flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-white transition-transform active:scale-95"
              >
                <span className="inline-flex -skew-x-12 items-center justify-center bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                  <span className="inline-block skew-x-12 text-[0.68rem] font-black leading-none text-shadow-none">ESC</span>
                </span>
                <span>BACK</span>
              </button>

            </div>
          </footer>

        </div>
      </section>
    </main>
  )
}