import { useState, useEffect, useRef } from 'react'
import { Send, Mail, ArrowUpRight, MoveLeft, MoveRight, MoveUp, MoveDown } from 'lucide-react'

interface ContactPageProps {
    onBack?: () => void
}

export function ContactPage({ onBack }: ContactPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const [socialIndex, setSocialIndex] = useState<number | null>(null)

    const nameInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const submitBtnRef = useRef<HTMLButtonElement>(null)

    const socialRefs = [
        useRef<HTMLAnchorElement>(null),
        useRef<HTMLAnchorElement>(null),
        useRef<HTMLAnchorElement>(null),
        useRef<HTMLAnchorElement>(null)
    ]

    const formElements = [nameInputRef, emailInputRef, messageInputRef, submitBtnRef]
    const [formIndex, setFormIndex] = useState<number>(0)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitted:', formData)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                if (onBack) onBack()
                return
            }

            // Jika user sedang mengetik di input/textarea, jangan cegat tombol pengetikan (termasuk WASD & Panah)
            const target = e.target as HTMLElement
            const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

            if (isTyping) {
                return // Biarkan browser menangani input teks secara normal
            }

            // Navigasi Atas / Bawah untuk elemen Form saat fokus tidak berada di dalam teks input
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault()
                setSocialIndex(null)
                setFormIndex((prev) => {
                    const next = (prev + 1) % formElements.length
                    formElements[next].current?.focus()
                    return next
                })
            } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                e.preventDefault()
                setSocialIndex(null)
                setFormIndex((prev) => {
                    const next = (prev - 1 + formElements.length) % formElements.length
                    formElements[next].current?.focus()
                    return next
                })
            }

            // Navigasi Kiri / Kanan untuk Tombol Quick Link (Email, Github, IG, LinkedIn)
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault()
                setSocialIndex((prev) => {
                    const next = prev === null ? 0 : (prev + 1) % socialRefs.length
                    socialRefs[next].current?.focus()
                    return next
                })
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                e.preventDefault()
                setSocialIndex((prev) => {
                    const next = prev === null ? socialRefs.length - 1 : (prev - 1 + socialRefs.length) % socialRefs.length
                    socialRefs[next].current?.focus()
                    return next
                })
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [formIndex, socialIndex, onBack])

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-sky-950 font-sans text-white select-none">
            {/* Background Video / Image Frame */}
            <div className="absolute inset-0 z-0">
                <video
                    className="hidden h-full w-full object-cover md:block"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://persona-assets.perdafos.my.id/images/hero-bg-poster.jpg"
                    src="https://persona-assets.perdafos.my.id/video/contact.mp4"
                />
                <img
                    className="block h-full w-full object-cover md:hidden"
                    src="https://persona-assets.perdafos.my.id/images/hero-bg-poster.jpg"
                    alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-r from-sky-950/40 via-sky-900/30 to-black/70" />
            </div>

            {/* Main Container */}
            <div className="relative z-10 flex min-h-screen flex-col justify-between p-4 md:p-8">

                {/* TOP BAR / HEADER */}
                <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="-rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]">
                        <div className="bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white border border-white/30">
                            PORTFOLIO // YOGATAMA DAFA
                        </div>
                    </div>

                    <div className="rotate-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]">
                        <div className="bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-black">
                            MALANG · SISTEM INFORMASI JARINGAN APLIKASI
                        </div>
                    </div>
                </header>

                {/* MIDDLE SECTION */}
                <main className="my-auto flex flex-col items-end justify-end pt-6 pb-6">
                    <div className="w-full max-w-lg space-y-4">

                        {/* LARGE TITLE (CONTACT) */}
                        <div className="flex justify-end pr-2 md:pr-4">
                            <h1 className="flex items-center text-[clamp(2.2rem,4.5vw,4.2rem)] font-extrabold uppercase tracking-wider drop-shadow-[4px_4px_0px_rgba(0,0,0,0.85)]">
                                <span className="inline-block -rotate-6 bg-white px-2.5 py-0.5 text-black">C</span>
                                <span className="inline-block rotate-3 bg-black px-2.5 py-0.5 text-white">O</span>
                                <span className="inline-block -rotate-3 bg-white px-2.5 py-0.5 text-black">N</span>
                                <span className="inline-block rotate-6 bg-sky-600 px-2.5 py-0.5 text-white">T</span>
                                <span className="inline-block -rotate-2 bg-white px-2.5 py-0.5 text-black">A</span>
                                <span className="inline-block rotate-4 bg-black px-2.5 py-0.5 text-white">C</span>
                                <span className="inline-block -rotate-1 bg-white px-2.5 py-0.5 text-black">T</span>
                            </h1>
                        </div>

                        {/* QUICK LINK BUTTONS */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 pr-2 md:pr-4">
                            {/* EMAIL */}
                            <a
                                ref={socialRefs[0]}
                                href="mailto:yogatamadafa9@gmail.com"
                                onFocus={() => setSocialIndex(0)}
                                className={`group relative flex items-center gap-1.5 -skew-x-12 bg-black px-4 py-1.5 font-['Anton','Archivo_Black',sans-serif] text-sm tracking-wider text-white transition-all border border-white/40 shadow-[3px_3px_0px_rgba(0,0,0,0.9)] focus:outline-none ${
                                    socialIndex === 0 ? 'bg-sky-500 text-black scale-105' : 'hover:bg-sky-500 hover:text-black'
                                }`}
                            >
                                <span className="inline-block skew-x-12 flex items-center gap-1">
                                    EMAIL <Mail className="h-3.5 w-3.5" />
                                </span>
                            </a>

                            {/* GITHUB */}
                            <a
                                ref={socialRefs[1]}
                                href="https://github.com/Perdafos"
                                target="_blank"
                                rel="noreferrer"
                                onFocus={() => setSocialIndex(1)}
                                className={`group relative flex items-center gap-1.5 -skew-x-12 bg-black px-4 py-1.5 font-['Anton','Archivo_Black',sans-serif] text-sm tracking-wider text-white transition-all border border-white/40 shadow-[3px_3px_0px_rgba(0,0,0,0.9)] focus:outline-none ${
                                    socialIndex === 1 ? 'bg-sky-500 text-black scale-105' : 'hover:bg-sky-500 hover:text-black'
                                }`}
                            >
                                <span className="inline-block skew-x-12 flex items-center gap-1">
                                    GITHUB <ArrowUpRight className="h-3.5 w-3.5" />
                                </span>
                            </a>

                            {/* INSTAGRAM */}
                            <a
                                ref={socialRefs[2]}
                                href="https://instagram.com/dafa.tsx"
                                target="_blank"
                                rel="noreferrer"
                                onFocus={() => setSocialIndex(2)}
                                className={`group relative flex items-center gap-1.5 -skew-x-12 bg-black px-4 py-1.5 font-['Anton','Archivo_Black',sans-serif] text-sm tracking-wider text-white transition-all border border-white/40 shadow-[3px_3px_0px_rgba(0,0,0,0.9)] focus:outline-none ${
                                    socialIndex === 2 ? 'bg-sky-500 text-black scale-105' : 'hover:bg-sky-500 hover:text-black'
                                }`}
                            >
                                <span className="inline-block skew-x-12 flex items-center gap-1">
                                    INSTAGRAM <ArrowUpRight className="h-3.5 w-3.5" />
                                </span>
                            </a>

                            {/* LINKEDIN */}
                            <a
                                ref={socialRefs[3]}
                                href="https://www.linkedin.com/in/dafa-ghaitsa-yogatama/"
                                target="_blank"
                                rel="noreferrer"
                                onFocus={() => setSocialIndex(3)}
                                className={`group relative flex items-center gap-1.5 -skew-x-12 bg-black px-4 py-1.5 font-['Anton','Archivo_Black',sans-serif] text-sm tracking-wider text-white transition-all border border-white/40 shadow-[3px_3px_0px_rgba(0,0,0,0.9)] focus:outline-none ${
                                    socialIndex === 3 ? 'bg-sky-500 text-black scale-105' : 'hover:bg-sky-500 hover:text-black'
                                }`}
                            >
                                <span className="inline-block skew-x-12 flex items-center gap-1">
                                    LINKEDIN{' '}
                                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                    </svg>
                                </span>
                            </a>
                        </div>

                        {/* SEND MESSAGE FORM CARD */}
                        <div className="relative border-4 border-black bg-white p-5 text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)]">
                            <div className="mb-4 border-b-2 border-black pb-2">
                                <h2 className="font-['Anton','Archivo_Black',Impact,sans-serif] text-xl tracking-wider text-black uppercase">
                                    SEND ME A MESSAGE
                                </h2>
                                <div className="h-1 w-20 bg-sky-500" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-[0.7rem] font-bold tracking-widest text-neutral-800 uppercase">
                                        NAME
                                    </label>
                                    <input
                                        ref={nameInputRef}
                                        type="text"
                                        required
                                        value={formData.name}
                                        onFocus={() => {
                                            setFormIndex(0)
                                            setSocialIndex(null)
                                        }}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border-2 border-black bg-neutral-100 px-3 py-1.5 text-sm font-medium text-black transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="Nama Anda..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-[0.7rem] font-bold tracking-widest text-neutral-800 uppercase">
                                        YOUR EMAIL
                                    </label>
                                    <input
                                        ref={emailInputRef}
                                        type="email"
                                        required
                                        value={formData.email}
                                        onFocus={() => {
                                            setFormIndex(1)
                                            setSocialIndex(null)
                                        }}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border-2 border-black bg-neutral-100 px-3 py-1.5 text-sm font-medium text-black transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="email@domain.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[0.7rem] font-bold tracking-widest text-neutral-800 uppercase">
                                        MESSAGE
                                    </label>
                                    <textarea
                                        ref={messageInputRef}
                                        rows={3}
                                        required
                                        value={formData.message}
                                        onFocus={() => {
                                            setFormIndex(2)
                                            setSocialIndex(null)
                                        }}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full border-2 border-black bg-neutral-100 px-3 py-1.5 text-sm font-medium text-black transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                                        placeholder="Tulis pesan Anda..."
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        ref={submitBtnRef}
                                        type="submit"
                                        onFocus={() => {
                                            setFormIndex(3)
                                            setSocialIndex(null)
                                        }}
                                        className="group relative flex w-full items-center justify-center gap-2 border-2 border-black bg-sky-600 px-4 py-2 font-['Anton','Archivo_Black',sans-serif] tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-black hover:text-white focus:bg-black focus:text-white focus:outline-none active:translate-x-1 active:translate-y-1 active:shadow-none"
                                    >
                                        <span>SEND IT</span>
                                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </main>

                {/* FOOTER */}
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
        </div>
    )
}