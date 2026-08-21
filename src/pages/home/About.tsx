import { useEffect, useState } from 'react'
import { MoveDown, MoveLeft, MoveRight, MoveUp } from 'lucide-react'

type AboutProps = {
    onBack?: () => void
}

const BIO_PARAGRAPHS = [
    `Information Systems, Networks, and Applications (SIJA) student at SMKN 6 Malang, bridging server infrastructure with full-stack web development. Experienced in end-to-end application lifecycles UI design, database management, and cloud deployment. Committed to writing clean, secure code and constantly exploring new tools to engineer reliable digital products.`,
]

const FUN_FACT = [
    `Beyond lines of code and terminal screens, I keep my creative energy flowing through music as a passionate multi-instrumentalist. When I’m not behind a keyboard, you can usually find me on the basketball court, where I stay active and sharpen the same strategic teamwork I bring to tech projects. I also dive into video editing as a side hobby, finding a surprisingly familiar satisfaction in pacing, visual storytelling, and structuring content with the same eye for detail I use when writing clean code.`,
]

export default function About({ onBack }: AboutProps) {
    const [activeCardIndex, setActiveCardIndex] = useState(0)
    const [isSlapping, setIsSlapping] = useState(false)
    const [parallax, setParallax] = useState({ x: 0, y: 0 })

    const cardCount = 2

    const triggerSlap = () => {
        setIsSlapping(true)
        setTimeout(() => setIsSlapping(false), 150)
    }

    const handleBackAction = () => {
        if (onBack) {
            onBack()
        } else {
            window.history.back()
        }
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault()
                triggerSlap()
                setActiveCardIndex((prev) => (prev + 1) % cardCount)
            } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                e.preventDefault()
                triggerSlap()
                setActiveCardIndex((prev) => (prev - 1 + cardCount) % cardCount)
            } else if (e.key === 'Escape') {
                e.preventDefault()
                triggerSlap()
                handleBackAction()
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                triggerSlap()
            }
        }

        const handleMove = (e: MouseEvent) => {
            const relX = (e.clientX / window.innerWidth - 0.5) * 15
            const relY = (e.clientY / window.innerHeight - 0.5) * 15
            setParallax({ x: relX, y: relY })
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('mousemove', handleMove)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('mousemove', handleMove)
        }
    }, [onBack, cardCount])

    return (
        <div
            className={`p5-viewport relative flex h-screen w-screen flex-col justify-between overflow-hidden bg-[#080808] font-['Anton','Archivo_Black',Impact,sans-serif] text-white select-none p-3 sm:p-5 md:p-8 ${isSlapping ? 'animate-screen-slap' : ''
                }`}
        >
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
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatCharacter {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(6px) rotate(0.5deg); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .animate-screen-slap {
          animation: screenSlap 0.15s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-flash {
          animation: flashAnim 0.12s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spinSlow 40s linear infinite;
        }
        .animate-float-character {
          animation: floatCharacter 2.5s ease-in-out infinite;
        }
        .animate-slide-bg {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* KHUSUS LANDSCAPE MOBILE (max-height: 500px) */
        @media screen and (max-height: 500px) {
          .mobile-footer-hide-control {
            display: none !important;
          }

          .mobile-about-title {
            font-size: 1.8rem !important;
          }

          /* Wadah Utama Kiri yang Mengetengahkan Kartu Vertikal & Mencegah Crop */
          .mobile-left-content-wrap {
            width: 52vw !important;
            max-height: 62vh !important;
            overflow-y: auto !important;
            padding-top: 18px !important;
            padding-bottom: 12px !important;
            padding-right: 6px !important;
            margin-top: auto !important;
            margin-bottom: auto !important;
            z-index: 35 !important;
          }

          .mobile-cards-container {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            gap: 22px !important;
          }

          .mobile-card-item {
            padding: 8px 12px !important;
            border-width: 3px !important;
          }

          .mobile-card-title {
            font-size: 0.72rem !important;
            margin-top: -20px !important;
            padding: 1px 6px !important;
          }

          .mobile-card-text {
            font-size: 0.65rem !important;
            line-height: 1.25 !important;
          }

          .mobile-char-portrait {
            top: 10px !important;
            right: 10px !important;
            height: 85vh !important;
            width: 40vw !important;
          }

          .mobile-hide-deco {
            display: none !important;
          }
        }
      `}</style>

            {/* FLASH OVERLAY ON KEYPRESS */}
            {isSlapping && (
                <div className="animate-flash pointer-events-none absolute inset-0 z-50 bg-white" />
            )}

            {/* BACKGROUND LAYERS */}
            <div className="animate-slide-bg absolute inset-0 z-[1] bg-[repeating-linear-gradient(-45deg,#e60012,#e60012_35px,#8b0000_35px,#8b0000_70px)] [clip-path:polygon(0_0,100%_0,82%_100%,0_100%)]" />
            <div
                className="pointer-events-none absolute inset-0 z-[2] opacity-25 bg-[radial-gradient(#080808_2px,transparent_2px)] bg-[size:14px_14px] transition-transform duration-200 ease-out"
                style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
            />
            <div className="pointer-events-none absolute -bottom-[30px] -left-[20px] z-[2] whitespace-nowrap text-[clamp(8rem,20vw,18rem)] leading-[0.8] text-black/35 -rotate-8 mobile-hide-deco">
                TAKE YOUR TIME
            </div>

            {/* AMBIENT STAR */}
            <svg className="animate-spin-slow pointer-events-none absolute -top-[40px] -right-[40px] z-[3] h-[260px] w-[260px] opacity-35 mobile-hide-deco" viewBox="0 0 200 200" fill="none">
                <path d="M100 0L122.451 69.0983H195.106L136.327 111.803L158.779 180.902L100 138.197L41.2215 180.902L63.673 111.803L4.89435 69.0983H77.5486L100 0Z" fill="white" />
            </svg>

            {/* HEADER SECTION */}
            <header className="relative z-[40] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="mobile-about-title flex items-center text-[clamp(2.5rem,6vw,5rem)] uppercase tracking-wider text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
                        <span className="inline-block -rotate-6 bg-white px-3 py-0.5 text-black">A</span>
                        <span className="inline-block rotate-3 bg-black px-3 py-0.5 text-white">B</span>
                        <span className="inline-block -rotate-3 bg-white px-3 py-0.5 text-black">O</span>
                        <span className="inline-block rotate-6 bg-[#e60012] px-3 py-0.5 text-white">U</span>
                        <span className="inline-block -rotate-2 bg-white px-3 py-0.5 text-black">T</span>
                    </h1>

                    <button
                        onClick={handleBackAction}
                        className="hidden sm:flex items-center gap-2 -skew-x-12 bg-black px-3 py-1 font-mono text-sm tracking-widest text-white shadow-[3px_3px_0_rgba(255,255,255,0.8)] transition hover:bg-white hover:text-black cursor-pointer"
                    >
                        <span className="skew-x-12">ESC · BACK</span>
                    </button>
                </div>

                <div className="hidden lg:block -rotate-1 border-2 border-black bg-white px-3 py-1 font-mono text-xs font-bold text-black shadow-[4px_4px_0_rgba(0,0,0,0.6)]">
                    MALANG · SISTEM INFORMASI JARINGAN APLIKASI
                </div>
            </header>

            <div className="absolute top-[145px] right-[0vw] z-[13] -rotate-4 border-[3px] border-[#080808] bg-white px-[18px] py-[6px] text-[0.9rem] tracking-[0.05em] text-[#080808] shadow-[6px_6px_0_#e60012] max-lg:hidden">
                LOOKING COOL, DEVELOPER!
            </div>

            <div className="absolute top-[200px] right-[0vw] z-[12] flex -rotate-6 flex-col gap-[10px] max-lg:hidden">
                <div className="inline-flex -skew-x-[12deg] items-center gap-[12px] border-2 border-white bg-[#080808] px-[20px] py-[8px] text-[1.05rem] text-white whitespace-nowrap shadow-[6px_6px_0_#e60012]">
                    <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-white bg-[#e60012] text-[0.8rem] font-black text-white">△</span>
                    CODE: REACT / TS <span className="ml-[6px] font-['Segoe_UI',_sans-serif] text-[0.65rem] font-bold text-[#ccc]">作戦を指示する</span>
                </div>
                <div className="inline-flex -skew-x-[12deg] items-center gap-[12px] border-2 border-white bg-[#080808] px-[20px] py-[8px] text-[1.05rem] text-white whitespace-nowrap shadow-[6px_6px_0_#e60012]">
                    <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-white bg-[#e60012] text-[0.8rem] font-black text-white">□</span>
                    VIDEO: STORYTELLING <span className="ml-[6px] font-['Segoe_UI',_sans-serif] text-[0.65rem] font-bold text-[#ccc]">スキルを使う</span>
                </div>
                <div className="inline-flex -skew-x-[12deg] items-center gap-[12px] border-2 border-white bg-[#080808] px-[20px] py-[8px] text-[1.05rem] text-white whitespace-nowrap shadow-[6px_6px_0_#e60012]">
                    <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-white bg-[#e60012] text-[0.8rem] font-black text-white">◯</span>
                    TOOLS: AE / PREMIERE <span className="ml-[6px] font-['Segoe_UI',_sans-serif] text-[0.65rem] font-bold text-[#ccc]">アイテムを使う</span>
                </div>
            </div>

            {/* AREA DITENGAHKAN SECARA VERTIKAL */}
            <div className="mobile-left-content-wrap no-scrollbar my-auto flex flex-col justify-center">
                <div className="mobile-cards-container flex w-[min(35vw,480px)] flex-col gap-[35px] pl-2">
                    {/* Card 0: WHO I AM */}
                    <div
                        onClick={() => {
                            triggerSlap()
                            setActiveCardIndex(0)
                        }}
                        className={`mobile-card-item relative -rotate-[1.5deg] border-4 border-[#080808] bg-white p-[16px_20px] text-[#080808] transition-all duration-200 cursor-pointer ${activeCardIndex === 0
                            ? 'scale-105 shadow-[12px_12px_0_#e60012] z-10 opacity-100'
                            : 'opacity-85 shadow-[8px_8px_0_#080808] hover:opacity-100'
                            }`}
                    >
                        <div className="mobile-card-title -mt-[30px] mb-[8px] inline-block -rotate-3 -skew-x-8 bg-[#080808] px-[14px] py-[4px] text-[1.2rem] text-white shadow-[4px_4px_0_#e60012]">
                            <span className="text-[#e60012]">W</span>HO <span className="text-[#e60012]">I</span> AM
                        </div>
                        <div className="mobile-card-text font-['Inter',_'Segoe_UI',_sans-serif] text-[0.85rem] font-bold leading-[1.5] [&>p+p]:mt-[8px]">
                            {BIO_PARAGRAPHS.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>

                    {/* Card 1: MY FUN FACTS */}
                    <div
                        onClick={() => {
                            triggerSlap()
                            setActiveCardIndex(1)
                        }}
                        className={`mobile-card-item relative rotate-[1.5deg] border-4 border-[#080808] bg-white p-[16px_20px] text-[#080808] transition-all duration-200 cursor-pointer ${activeCardIndex === 1
                            ? 'scale-105 shadow-[12px_12px_0_#e60012] z-10 opacity-100'
                            : 'opacity-85 shadow-[8px_8px_0_#080808] hover:opacity-100'
                            }`}
                    >
                        <div className="mobile-card-title -mt-[30px] mb-[8px] inline-block -rotate-3 -skew-x-8 bg-[#080808] px-[14px] py-[4px] text-[1.2rem] text-white shadow-[4px_4px_0_#e60012]">
                            MY <span className="text-[#e60012]">F</span>UN FACTS
                        </div>
                        <div className="mobile-card-text font-['Inter',_'Segoe_UI',_sans-serif] text-[0.85rem] font-bold leading-[1.5] [&>p+p]:mt-[8px]">
                            {FUN_FACT.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FOTO KARAKTER PORTRAIT */}
            <div className="mobile-char-portrait animate-float-character absolute top-[60px] right-[30px] z-[8] h-[82vh] w-[46vw] max-lg:w-[42vw]">
                <div className="absolute inset-0 overflow-hidden border-4 border-white bg-[#080808] shadow-[-12px_12px_0_#e60012] [clip-path:polygon(20%_0,100%_0,80%_100%,0_100%)]">
                    <img
                        src="./assets/img/dafa.jpeg"
                        alt="Yogatama Dafa"
                        className="h-full w-full object-cover object-[80%_center] contrast-[1.12] grayscale-[0.05]"
                    />
                </div>
                <img src="/assets/img/icon.png" alt="" className="pointer-events-none absolute -bottom-[20%] -left-[30%] z-[9] flex h-[320px] w-[320px] -rotate-12 items-center justify-center mobile-hide-deco" />
            </div>

            {/* FOOTER NAV CONTROLS */}
            <footer className="relative z-50 flex items-center justify-between shrink-0 pt-2 pb-1 md:pb-2">
                <div className="flex cursor-default select-none items-center gap-4 md:gap-6 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-white/90 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)] md:text-[0.78rem]">
                    
                    <p className="mobile-footer-hide-control m-0 flex items-center gap-2">
                        <span className="inline-flex -skew-x-12 items-center justify-center bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                            <span className="inline-block skew-x-12 font-sans text-xs font-black leading-none text-shadow-none">
                                <span className="skew-x-12 font-sans font-black flex"><MoveLeft size={12} /> <MoveRight size={12} /> <MoveUp size={12} /> <MoveDown size={12} /></span>
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
    )
}