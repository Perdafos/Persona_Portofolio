import { useEffect, useState, useRef } from 'react'
import { MoveDown, MoveLeft, MoveRight, MoveUp, Star, Loader2 } from 'lucide-react'

interface ProjectItem {
    id: number | string
    title: string
    description: string
    tag: string
    githubUrl: string
    stars: number
    isFeatured?: boolean
}

interface GithubRepo {
    id: number
    name: string
    description: string | null
    html_url: string
    stargazers_count: number
    language: string | null
}

export function ProjectsPage() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([])
    const [allRepositories, setAllRepositories] = useState<ProjectItem[]>([])
    const [loading, setLoading] = useState(true)

    const itemRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                const reposRes = await fetch('https://api.github.com/users/Perdafos/repos?sort=updated&per_page=100')
                const reposData: GithubRepo[] = await reposRes.json()

                const starredRes = await fetch('https://api.github.com/users/Perdafos/starred?per_page=100')
                const starredData: GithubRepo[] = await starredRes.json()

                const starredIds = new Set(starredData.map((repo) => repo.id))

                const repos: ProjectItem[] = reposData.map((repo) => ({
                    id: repo.id,
                    title: repo.name.toUpperCase().replace(/-/g, ' '),
                    description: repo.description || 'Tidak ada deskripsi untuk repositori ini.',
                    tag: (repo.language || 'REPO').toUpperCase(),
                    githubUrl: repo.html_url,
                    stars: repo.stargazers_count,
                    isFeatured: false,
                }))

                const featured: ProjectItem[] = starredData.map((repo) => ({
                    id: `f-${repo.id}`,
                    title: repo.name.toUpperCase().replace(/-/g, ' '),
                    description: repo.description || 'Tidak ada deskripsi untuk repositori ini.',
                    tag: (repo.language || 'FEATURED').toUpperCase(),
                    githubUrl: repo.html_url,
                    stars: repo.stargazers_count,
                    isFeatured: true,
                }))

                const filteredRepos = repos.filter((repo) => !starredIds.has(Number(repo.id)))

                setFeaturedProjects(featured)
                setAllRepositories(filteredRepos.length > 0 ? filteredRepos : repos)
            } catch (error) {
                console.error('Error fetching GitHub repos:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchGithubData()
    }, [])

    const allItems = [...featuredProjects, ...allRepositories]

    useEffect(() => {
        if (itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }
    }, [selectedIndex])

    useEffect(() => {
        if (allItems.length === 0) return

        const handleKeyDown = (e: KeyboardEvent) => {
            const total = allItems.length
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % total)
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + total) % total)
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 3 < total ? prev + 3 : prev))
            } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                e.preventDefault()
                setSelectedIndex((prev) => (prev - 3 >= 0 ? prev - 3 : prev))
            } else if (e.key === 'Enter') {
                e.preventDefault()
                if (allItems[selectedIndex]?.githubUrl) {
                    window.open(allItems[selectedIndex].githubUrl, '_blank')
                }
            } else if (e.key === 'Escape') {
                e.preventDefault()
                window.history.back()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedIndex, allItems])

    return (
        <main className="relative flex h-dvh w-full flex-col justify-between overflow-hidden bg-[#00a0e9] text-white font-['Anton','Archivo_Black',Impact,sans-serif]">
            <style>{`
                .stripe-wrap {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                }

                .p5-stripes-animated {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    transform: rotate(-18deg);
                    transform-origin: center;
                    background-image: repeating-linear-gradient(
                        90deg,
                        rgba(0, 50, 120, 0.45) 0px,
                        rgba(0, 50, 120, 0.45) 14px,
                        transparent 14px,
                        transparent 30px
                    );
                    animation: moveStripesRight 60s linear infinite;
                    will-change: background-position;
                }

                @keyframes moveStripesRight {
                    from { background-position: 0 0; }
                    to { background-position: 900px 0; }
                }

                .p5-halftone-static {
                    background-image: radial-gradient(rgba(0, 0, 0, 0.22) 20%, transparent 20%);
                    background-size: 8px 8px;
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Layer 1: Moving Stripes Layer */}
            <div className="stripe-wrap">
                <div className="p5-stripes-animated" />
            </div>

            {/* Layer 2: Static Halftone Layer */}
            <div className="p5-halftone-static absolute inset-0 z-0 opacity-40 pointer-events-none" />

            {/* Main Container UI */}
            <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-8">

                {/* HEADER SECTION */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="flex items-center text-[clamp(2.5rem,6vw,5rem)] uppercase tracking-wider text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
                            <span className="inline-block -rotate-6 bg-white px-3 py-0.5 text-black">P</span>
                            <span className="inline-block rotate-3 bg-black px-3 py-0.5 text-white">R</span>
                            <span className="inline-block -rotate-3 bg-white px-3 py-0.5 text-black">O</span>
                            <span className="inline-block rotate-6 bg-sky-600 px-3 py-0.5 text-white">J</span>
                            <span className="inline-block -rotate-2 bg-white px-3 py-0.5 text-black">E</span>
                            <span className="inline-block rotate-4 bg-black px-3 py-0.5 text-white">C</span>
                            <span className="inline-block -rotate-6 bg-white px-3 py-0.5 text-black">T</span>
                            <span className="inline-block rotate-2 bg-sky-600 px-3 py-0.5 text-white">S</span>
                        </h1>

                        <button
                            onClick={() => window.history.back()}
                            className="hidden sm:flex items-center gap-2 -skew-x-12 bg-black px-3 py-1 text-sm font-mono tracking-widest text-white shadow-[3px_3px_0_rgba(255,255,255,0.8)] transition hover:bg-white hover:text-black"
                        >
                            <span className="skew-x-12">ESC · BACK</span>
                        </button>
                    </div>

                    <div className="hidden lg:block -rotate-1 border-2 border-black bg-white px-3 py-1 font-mono text-xs font-bold text-black shadow-[4px_4px_0_rgba(0,0,0,0.6)]">
                        MALANG · SISTEM INFORMASI JARINGAN APLIKASI
                    </div>
                </header>

                {/* PROJECTS SECTION */}
                {loading ? (
                    <div className="my-auto flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                        <p className="font-mono text-sm tracking-widest text-white">FETCHING GITHUB REPOS...</p>
                    </div>
                ) : (
                    /* Ditambahkan px-4 pt-4 pb-6 agar skew & shadow tidak terpotong tepi layar */
                    <div className="no-scrollbar my-auto flex flex-col gap-6 overflow-y-auto px-4 pt-4 pb-6">

                        {/* FEATURED (STARRED) */}
                        {featuredProjects.length > 0 && (
                            <div>
                                <div className="mb-3 flex items-center gap-2 font-mono text-lg font-bold tracking-widest text-white [text-shadow:2px_2px_0_rgba(0,0,0,0.8)]">
                                    <span className="h-2.5 w-6 bg-white -skew-x-12 inline-block" />
                                    FEATURED PROJECTS
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {featuredProjects.map((item, index) => {
                                        const isSelected = selectedIndex === index
                                        return (
                                            <div
                                                key={item.id}
                                                ref={(el) => {
                                                    itemRefs.current[index] = el
                                                }}
                                                onClick={() => setSelectedIndex(index)}
                                                className={`group relative cursor-pointer transition-all duration-150 ${isSelected ? 'scale-[1.02] z-20' : 'hover:scale-[1.01]'
                                                    }`}
                                            >
                                                {/* Card Wrapper dengan Skew */}
                                                <div className="-skew-x-3">
                                                    <div className="absolute -top-3 right-4 z-20 flex items-center gap-1.5 bg-sky-400 px-2 py-0.5 font-mono text-[0.68rem] font-bold tracking-wider text-black border border-black shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                                        {item.tag}
                                                    </div>

                                                    <div
                                                        className={`relative flex min-h-[140px] flex-col justify-between border-2 border-black bg-black p-4 text-white shadow-[6px_6px_0_rgba(0,0,0,0.8)] ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#00a0e9]' : ''
                                                            }`}
                                                    >
                                                        <div>
                                                            <h3 className="flex items-center gap-2 text-xl tracking-wider text-white">
                                                                <span className="inline-block h-2 w-2 bg-sky-400" />
                                                                {item.title}
                                                            </h3>
                                                            <p className="mt-1 font-sans text-xs text-neutral-300 line-clamp-2">
                                                                {item.description}
                                                            </p>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between font-mono text-xs">
                                                            <span className="flex items-center gap-1 text-sky-400 font-bold uppercase tracking-widest">
                                                                <Star size={12} className="fill-sky-400" /> {item.stars}
                                                            </span>

                                                            <a
                                                                href={item.githubUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="group-hover:bg-sky-400 inline-flex items-center gap-1 -skew-x-12 border border-black bg-white px-3 py-1 font-sans text-xs font-black text-black transition-colors"
                                                            >
                                                                <span className="skew-x-12">VIEW ON GITHUB →</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ALL REPOSITORIES */}
                        <div>
                            <div className="mb-1 flex items-center gap-2 font-mono text-lg font-bold tracking-widest text-white [text-shadow:2px_2px_0_rgba(0,0,0,0.8)]">
                                <span className="h-2.5 w-6 bg-white -skew-x-12 inline-block" />
                                ALL REPOSITORIES
                            </div>
                            <p className="mb-3 font-mono text-xs text-white/80">
                                {allRepositories.length} REPOSITORIES · LIVE FROM GITHUB
                            </p>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {allRepositories.map((item, index) => {
                                    const actualIndex = featuredProjects.length + index
                                    const isSelected = selectedIndex === actualIndex

                                    return (
                                        <div
                                            key={item.id}
                                            ref={(el) => {
                                                itemRefs.current[actualIndex] = el
                                            }}
                                            onClick={() => setSelectedIndex(actualIndex)}
                                            className={`group relative cursor-pointer transition-all duration-150 ${isSelected ? 'scale-[1.02] z-20' : 'hover:scale-[1.01]'
                                                }`}
                                        >
                                            {/* Card Wrapper dengan Skew */}
                                            <div className="-skew-x-3">
                                                <div className="absolute -top-3 right-4 z-20 flex items-center gap-1.5 bg-black px-2 py-0.5 font-mono text-[0.68rem] font-bold tracking-wider text-white border border-white shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                                    {item.tag}
                                                </div>

                                                <div
                                                    className={`relative flex min-h-[140px] flex-col justify-between border-2 border-black bg-neutral-100 p-4 text-black shadow-[6px_6px_0_rgba(0,0,0,0.8)] ${isSelected ? 'ring-2 ring-black ring-offset-2 ring-offset-[#00a0e9] bg-white' : ''
                                                        }`}
                                                >
                                                    <div>
                                                        <h3 className="text-xl tracking-wider text-sky-600">
                                                            {item.title}
                                                        </h3>
                                                        <p className="mt-1 font-sans text-xs font-semibold text-neutral-700 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between font-mono text-xs">
                                                        <span className="flex items-center gap-1 font-bold">
                                                            ★ {item.stars}
                                                        </span>

                                                        <a
                                                            href={item.githubUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 -skew-x-12 bg-sky-500 px-3 py-1 font-sans text-xs font-black text-white transition-colors group-hover:bg-black"
                                                        >
                                                            <span className="skew-x-12">VIEW ON GITHUB →</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                )}

                {/* FOOTER NAV CONTROLS */}
                <footer className="flex items-center justify-between pt-2">
                    <div className="flex cursor-default select-none items-center gap-4 font-mono text-xs uppercase tracking-wider text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
                        <p className="m-0 flex items-center gap-1.5">
                            <span className="inline-flex -skew-x-12 bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                                <span className="skew-x-12 font-sans font-black flex"><MoveLeft size={12} /> <MoveRight size={12} /> <MoveUp size={12} /> <MoveDown size={12} /></span>
                            </span>
                            <span>SELECT</span>
                        </p>

                        <p className="m-0 flex items-center gap-1.5">
                            <span className="inline-flex -skew-x-12 bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                                <span className="inline-block skew-x-12 text-[0.68rem] font-black leading-none text-shadow-none">ENTER</span>
                            </span>
                            <span>CONFIRM</span>
                        </p>

                        <p className="m-0 flex items-center gap-1.5">
                            <span className="inline-flex -skew-x-12 bg-white px-2 py-0.5 font-bold text-black shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                                <span className="inline-block skew-x-12 text-[0.68rem] font-black leading-none text-shadow-none">ESC</span>
                            </span>
                            <span>BACK</span>
                        </p>
                    </div>
                </footer>

            </div>
        </main>
    )
}