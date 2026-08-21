import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { MoveDown, MoveLeft, MoveRight, MoveUp } from 'lucide-react'

export type SkillItem = {
    name: string
    score: number
}

export type SkillCategory = {
    title: string
    skills: SkillItem[]
}

interface SkillsPageProps {
    data?: SkillCategory[]
    onBackHome?: () => void
}

export const defaultSkillsData: SkillCategory[] = [
    {
        title: 'LANGUAGES & FRONTEND',
        skills: [
            { name: 'TypeScript / JavaScript', score: 88 },
            { name: 'PHP', score: 85 },
            { name: 'React', score: 85 },
            { name: 'Tailwind CSS', score: 88 },
            { name: 'HTML & CSS', score: 90 },
        ],
    },
    {
        title: 'BACKEND & FRAMEWORKS',
        skills: [
            { name: 'Laravel Framework', score: 85 },
            { name: 'Node.js / Express', score: 78 },
            { name: 'REST API & MySQL', score: 82 },
            { name: 'Supabase / Cloud DB', score: 75 },
        ],
    },
    {
        title: 'TOOLS & ECOSYSTEM',
        skills: [
            { name: 'Git & GitHub Workflow', score: 85 },
            { name: 'Vite / Webpack Build Tools', score: 80 },
            { name: 'Vercel / Cloud Deployment', score: 82 },
            { name: 'VS Code & DevTools', score: 90 },
        ],
    },
]

export function SkillsPage({ data = defaultSkillsData, onBackHome }: SkillsPageProps) {
    const [selectedCategory, setSelectedCategory] = useState(0)
    const rootRef = useRef<HTMLElement | null>(null)
    const categoryRefs = useRef<Array<HTMLDivElement | null>>([])
    const skillFillRefs = useRef<Array<Array<HTMLDivElement | null>>>([])
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const handleBackAction = () => {
        if (onBackHome) {
            onBackHome()
        } else {
            window.history.back()
        }
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                handleBackAction()
                return
            }

            if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
                event.preventDefault()
                setSelectedCategory((prev) => (prev + 1) % data.length)
            } else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
                event.preventDefault()
                setSelectedCategory((prev) => (prev - 1 + data.length) % data.length)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [data.length, onBackHome])

    useEffect(() => {
        const ctx = gsap.context(() => {
            categoryRefs.current.forEach((element, index) => {
                if (!element) return

                gsap.fromTo(
                    element,
                    { autoAlpha: 0, x: -32 },
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 0.62,
                        delay: index * 0.15,
                        ease: 'power2.out',
                    }
                )
            })

            skillFillRefs.current.flat().forEach((element, index) => {
                if (!element) return

                const score = Number(element.dataset.score ?? 0)

                gsap.fromTo(
                    element,
                    { width: '0%' },
                    {
                        width: `${score}%`,
                        duration: 0.72,
                        ease: 'power2.out',
                        delay: 0.35 + index * 0.08,
                    }
                )
            })
        }, rootRef)

        return () => ctx.revert()
    }, [data])

    useEffect(() => {
        if (categoryRefs.current[selectedCategory]) {
            categoryRefs.current[selectedCategory]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }
    }, [selectedCategory])

    const setCategoryRef = (index: number) => (node: HTMLDivElement | null) => {
        categoryRefs.current[index] = node
    }

    const setSkillRef = (categoryIndex: number, skillIndex: number) => (node: HTMLDivElement | null) => {
        const group = skillFillRefs.current[categoryIndex] ?? []
        group[skillIndex] = node
        skillFillRefs.current[categoryIndex] = group
    }

    return (
        <main
            ref={rootRef}
            className="skills-page relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-black text-white font-['Anton','Archivo_Black',Impact,sans-serif]"
            aria-label="Skill page"
        >
            <style>{`
        .skills-page::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 10;
          background-image: radial-gradient(rgba(255,255,255,0.12) 1.3px, transparent 1.8px);
          background-position: 0 0;
          background-size: 16px 16px;
          opacity: 0.38;
          pointer-events: none;
        }

        .skills-track {
          position: relative;
          height: 0.75rem;
          overflow: hidden;
          border: 1.5px solid rgba(255, 255, 255, 0.8);
          background: rgba(0, 0, 0, 0.6);
          background-image: repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.2) 0,
            rgba(255, 255, 255, 0.2) 6px,
            rgba(255, 255, 255, 0.05) 6px,
            rgba(255, 255, 255, 0.05) 14px
          );
          box-shadow: inset 0 0 4px rgba(0,0,0,0.8);
        }

        .skill-fill {
          position: absolute;
          inset: 0 auto 0 0;
          width: 0%;
          overflow: hidden;
          background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,1) 65%, rgba(255,255,255,0.85));
          transform: skewX(-18deg);
          transform-origin: left center;
          box-shadow: 0 0 18px rgba(255,255,255,0.5);
        }

        .skill-fill::after {
          content: '';
          position: absolute;
          top: -0.2rem;
          right: -0.7rem;
          width: 1.2rem;
          height: calc(100% + 0.5rem);
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0.02));
          transform: skewX(18deg);
          opacity: 0.9;
        }

        .skill-category {
          opacity: 0;
          transform: translateX(-32px);
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media screen and (max-height: 500px) {
          .mobile-footer-hide-control {
            display: none !important;
          }
        }
      `}</style>

            {/* FULLSCREEN BACKGROUND VIDEO */}
            <video
                ref={videoRef}
                className="absolute inset-0 z-0 hidden h-full w-full object-cover will-change-transform md:block"
                autoPlay
                muted
                loop
                playsInline
                poster="https://persona-assets.perdafos.my.id/video/hero-bg-poster.jpg"
                src="https://persona-assets.perdafos.my.id/video/joker.mp4"
            />
            <img
                className="absolute inset-0 z-0 block h-full w-full object-cover md:hidden"
                src="https://persona-assets.perdafos.my.id/video/hero-bg-poster.jpg"
                alt=""
                aria-hidden="true"
            />

            {/* DARK OVERLAY */}
            <div
                className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/40"
                aria-hidden="true"
            />

            {/* FOREGROUND CONTENT */}
            <div className="relative z-20 flex h-full flex-col justify-between p-4 md:p-8">
                {/* HEADER SECTION */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="flex items-center text-[clamp(2.5rem,6vw,5rem)] uppercase tracking-wider text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
                            <span className="inline-block -rotate-6 bg-white px-3 py-0.5 text-black">S</span>
                            <span className="inline-block rotate-3 bg-black px-3 py-0.5 text-white">K</span>
                            <span className="inline-block -rotate-3 bg-white px-3 py-0.5 text-black">I</span>
                            <span className="inline-block rotate-6 bg-red-600 px-3 py-0.5 text-white">L</span>
                            <span className="inline-block -rotate-2 bg-white px-3 py-0.5 text-black">L</span>
                            <span className="inline-block rotate-4 bg-black px-3 py-0.5 text-white">S</span>
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

                {/* CONTENT SECTION */}
                <section className="no-scrollbar my-auto flex-1 overflow-y-auto px-2 py-4">
                    <div className="w-full max-w-[820px]">
                        <div className="flex flex-col gap-6">
                            {data.map((category, categoryIndex) => {
                                const isSelected = selectedCategory === categoryIndex

                                return (
                                    <div
                                        key={category.title}
                                        ref={setCategoryRef(categoryIndex)}
                                        onClick={() => setSelectedCategory(categoryIndex)}
                                        className="skill-category cursor-pointer transition-transform duration-150"
                                    >
                                        {/* CATEGORY TITLE BADGE */}
                                        <div
                                            className={`inline-block border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_rgba(0,0,0,0.8)] transition-all duration-200 ${
                                                isSelected
                                                    ? 'translate-x-1 -rotate-1 bg-red-600 text-white border-white'
                                                    : 'bg-white text-black hover:bg-neutral-200'
                                            }`}
                                        >
                                            {category.title}
                                        </div>

                                        <div className="mt-3.5 space-y-3.5">
                                            {category.skills.map((skill, skillIndex) => (
                                                <div key={skill.name} className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-3 font-mono text-[0.7rem] font-black uppercase tracking-[0.14em] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.9)] md:text-xs">
                                                        <span className="truncate text-left">{skill.name}</span>
                                                        <span className="tabular-nums text-right">{skill.score}</span>
                                                    </div>

                                                    <div className="skills-track">
                                                        <div
                                                            ref={setSkillRef(categoryIndex, skillIndex)}
                                                            data-score={skill.score}
                                                            className="skill-fill"
                                                            style={{ width: '0%' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* FOOTER NAV CONTROLS */}
                <footer className="flex items-center justify-between shrink-0 pt-2 pb-1 md:pb-2">
                    <div className="flex cursor-default select-none items-center gap-4 md:gap-6 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-white/90 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)] md:text-[0.78rem]">
                        <p className="mobile-footer-hide-control m-0 flex items-center gap-2">
                            <span className="inline-flex -skew-x-12 items-center justify-center bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                                <span className="inline-block skew-x-12 font-sans text-xs font-black leading-none text-shadow-none">
                                    <span className="skew-x-12 font-sans font-black flex">
                                        <MoveLeft size={12} /> <MoveRight size={12} /> <MoveUp size={12} /> <MoveDown size={12} />
                                    </span>
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
        </main>
    )
}