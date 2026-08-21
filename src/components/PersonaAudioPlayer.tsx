import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Disc, ChevronRight, ChevronLeft, Music } from 'lucide-react'

// Base CDN URL untuk Cloudflare R2
const R2_SONGS_BASE_URL = 'https://persona-assets.perdafos.my.id/songs'

const getSongUrl = (fileName: string) => {
  return `${R2_SONGS_BASE_URL}/${encodeURIComponent(fileName)}`
}

export interface Song {
  id: number
  title: string
  artist: string
  game: string
  file: string
  category: 'P5' | 'P4' | 'P3' | 'PQ'
}

export const SONGS_DATA: Song[] = [
  {
    id: 1,
    title: 'BACKSIDE OF THE TV',
    artist: 'Lotus Juice Remix',
    game: 'Persona 4 Dancing All Night',
    file: 'Backside of the TV - Lotus Juice Remix - Persona 4 Dancing All Night - PSC (128k).mp3',
    category: 'P4',
  },
  {
    id: 2,
    title: 'BURN MY DREAD -RELOAD-',
    artist: 'Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: 'Burn My Dread -Reload- - Azumi Takahashi - Topic (128k).mp3',
    category: 'P3',
  },
  {
    id: 3,
    title: 'CHANGING SEASONS -RELOAD-',
    artist: 'Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: 'Changing Seasons -Reload- - Azumi Takahashi - Topic (128k).mp3',
    category: 'P3',
  },
  {
    id: 4,
    title: 'COLOR YOUR NIGHT',
    artist: 'Lotus Juice & Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: 'Color Your Night - Lotus Juice - Topic (128k).mp3',
    category: 'P3',
  },
  {
    id: 5,
    title: 'COLORS FLYING HIGH',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5 Royal',
    file: 'Colors Flying High Full (Cleanest-outdated) - Persona 5 Royal OST - Some random name (128k).mp3',
    category: 'P5',
  },
  {
    id: 6,
    title: 'DISCONNECTED',
    artist: 'Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: 'Disconnected - Azumi Takahashi - Topic (128k).mp3',
    category: 'P3',
  },
  {
    id: 7,
    title: "DON'T",
    artist: 'Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: "Don't - Azumi Takahashi - Topic (128k).mp3",
    category: 'P3',
  },
  {
    id: 8,
    title: 'FULL MOON FULL LIFE',
    artist: 'Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: 'Full Moon Full Life - Azumi Takahashi - Topic (128k).mp3',
    category: 'P3',
  },
  {
    id: 9,
    title: 'JOY (P3R VER.)',
    artist: 'ATLUS Sound Team',
    game: 'Persona 3 Reload',
    file: 'Joy (P3R ver.) - ATLUS Sound Team - Topic (128k).mp3',
    category: 'P3',
  },
  {
    id: 10,
    title: 'LAST SURPRISE',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5',
    file: 'Last Surprise With Lyrics Persona 5 - Captain comics (128k).mp3',
    category: 'P5',
  },
  {
    id: 11,
    title: 'LIGHT THE FIRE UP IN THE NIGHT',
    artist: 'ATLUS Sound Team',
    game: 'Persona Q',
    file: 'Light the Fire Up in the Night -Dual Mix- - theultimateonejpsx (128k).mp3',
    category: 'PQ',
  },
  {
    id: 12,
    title: 'P4D SOUNDTRACK ADVANCED MEDLEY',
    artist: 'ATLUS Sound Team',
    game: 'Persona 4 Dancing All Night',
    file: 'PERSONA4 DANCING ALL NIGHT SOUNDTRACK ADVANCED CD - Zaratras A O-Kamijou (128k).mp3',
    category: 'P4',
  },
  {
    id: 13,
    title: 'MEMORIES OF YOU (KIMI NO KIOKU)',
    artist: 'Yumi Kawamura',
    game: 'Persona 3',
    file: 'Persona 3 - Kimi no Kioku Memories of You [ENG SUB] - iiRbored (128k).mp3',
    category: 'P3',
  },
  {
    id: 14,
    title: 'JOY (ORIGINAL VER.)',
    artist: 'Shoji Meguro',
    game: 'Persona 3',
    file: 'Persona 3 OST - Joy - MrKaiser891 (128k).mp3',
    category: 'P3',
  },
  {
    id: 15,
    title: 'MASS DESTRUCTION',
    artist: 'Lotus Juice & Yumi Kawamura',
    game: 'Persona 3',
    file: 'Persona 3 OST - Mass Destruction - Bosquez88 (128k).mp3',
    category: 'P3',
  },
  {
    id: 16,
    title: "WHEN THE MOON'S REACHING OUT STARS",
    artist: 'Yumi Kawamura',
    game: 'Persona 3',
    file: "Persona 3 OST - When The Moon's Reaching Out Stars - MrKaiser891 (128k).mp3",
    category: 'P3',
  },
  {
    id: 17,
    title: 'A WAY OF LIFE',
    artist: 'Mayumi Fujita',
    game: 'Persona 3 Portable',
    file: 'Persona 3 Portable OST - A Way of Life (With Lyrics) - minakosenpai (128k).mp3',
    category: 'P3',
  },
  {
    id: 18,
    title: 'WANT TO BE CLOSE (REINCARNATION)',
    artist: 'Yumi Kawamura',
    game: 'Persona 3',
    file: 'Persona 3 Reincarnation - Want To Be Close - Neku Sakuraba (128k).mp3',
    category: 'P3',
  },
  {
    id: 19,
    title: "WHEN THE MOON'S REACHING OUT (REINCARNATION)",
    artist: 'Yumi Kawamura',
    game: 'Persona 3',
    file: "Persona 3 Reincarnation - When the Moon's Reaching out the stars - Neku Sakuraba (128k).mp3",
    category: 'P3',
  },
  {
    id: 20,
    title: "IT'S GOING DOWN NOW",
    artist: 'Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: "Persona 3 Reload - It's Going Down Now (with Lyrics) - tilinmaster777gameplays (128k).mp3",
    category: 'P3',
  },
  {
    id: 21,
    title: 'BURN MY DREAD (SPRING OF BIRTH VER.)',
    artist: 'Yumi Kawamura',
    game: 'Persona 3 The Movie',
    file: 'Persona 3 The Movie #1 - Burn My Dread -Spring of Birth ver.- - blagoblag (128k).mp3',
    category: 'P3',
  },
  {
    id: 22,
    title: 'HEARTBEAT, HEARTBREAK',
    artist: 'Shiho Hirata',
    game: 'Persona 4',
    file: 'Persona 4 - Heartbeat, Heartbreak - Veysel Aytekin (128k).mp3',
    category: 'P4',
  },
  {
    id: 23,
    title: 'REACH OUT TO THE TRUTH (REINCARNATION)',
    artist: 'Shiho Hirata',
    game: 'Persona 4',
    file: 'Persona 4 -Reincarnation- Reach Out To The Truth - GreenTurtle112 (128k).mp3',
    category: 'P4',
  },
  {
    id: 24,
    title: 'DANCE! (P4D OPENING)',
    artist: 'Lyn & Lotus Juice',
    game: 'Persona 4 Dancing All Night',
    file: 'Persona 4 Dancing All Night Opening Theme - IGN (128k).mp3',
    category: 'P4',
  },
  {
    id: 25,
    title: 'SHADOW WORLD',
    artist: 'Shiho Hirata',
    game: 'Persona 4 Golden',
    file: 'Persona 4 Golden - Shadow World (Full) - NERORO (128k).mp3',
    category: 'P4',
  },
  {
    id: 26,
    title: 'TIME TO MAKE HISTORY',
    artist: 'Shiho Hirata',
    game: 'Persona 4 Golden',
    file: 'Persona 4 Golden - Time to Make History REAL Lyrics - Keeduh (128k).mp3',
    category: 'P4',
  },
  {
    id: 27,
    title: 'LIFE WILL CHANGE',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5',
    file: 'Persona 5 - Life Will Change (中英歌詞) - Eve.Y Translate (128k).mp3',
    category: 'P5',
  },
  {
    id: 28,
    title: 'SWEAR TO MY BONES',
    artist: 'Shoji Meguro',
    game: 'Persona 5',
    file: 'Persona 5 - Swear to my bones [Extended] - THEONLYOCS (128k).mp3',
    category: 'P5',
  },
  {
    id: 29,
    title: 'WAKE UP, GET UP, GET OUT THERE',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5',
    file: 'Persona 5 - Wake up, Get up, Get out there - sub español & sub english - Ryu Pureflame (128k).mp3',
    category: 'P5',
  },
  {
    id: 30,
    title: 'HOSHI TO BOKURA TO (TOFUBEATS REMIX)',
    artist: 'tofubeats',
    game: 'Persona 5 Dancing Star Night',
    file: 'Persona 5 Dancing Star Night - Hoshi To Bokura To (星と僕らと) TOFUBEATS remix - Dan z (128k).mp3',
    category: 'P5',
  },
  {
    id: 31,
    title: 'GROOVY (P5D OPENING)',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5 Dancing Star Night',
    file: 'Persona 5 Dancing Star Night- GROOVY (Lyric Video) - DismArchus (128k).mp3',
    category: 'P5',
  },
  {
    id: 32,
    title: 'LIFE WILL CHANGE (INSTRUMENTAL)',
    artist: 'Shoji Meguro',
    game: 'Persona 5',
    file: 'Persona 5 OST - Life Will Change - Instrumental ver Extended - Billy (128k).mp3',
    category: 'P5',
  },
  {
    id: 33,
    title: 'PHANTOM',
    artist: 'Shoji Meguro',
    game: 'Persona 5',
    file: 'Persona 5 OST - Phantom [Extended] - AbsurdOrpheus (128k).mp3',
    category: 'P5',
  },
  {
    id: 34,
    title: 'PRICE',
    artist: 'Shoji Meguro',
    game: 'Persona 5',
    file: 'Persona 5 OST - Price [Extended] - AbsurdOrpheus (128k).mp3',
    category: 'P5',
  },
  {
    id: 35,
    title: 'BREAK IN TO BREAK OUT',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5 The Animation',
    file: 'Persona 5 the Animation Break In To Break Out by Lyn (English and Spanish subtitles) - Yokchan (128k).mp3',
    category: 'P5',
  },
  {
    id: 36,
    title: 'MAZE OF LIFE',
    artist: 'Yumi Kawamura & Shihoko Hirata',
    game: 'Persona Q',
    file: 'Persona Q Maze of Life (Full) - vayanui8 (128k).mp3',
    category: 'PQ',
  },
  {
    id: 37,
    title: 'PURSUING MY TRUE SELF',
    artist: 'Shiho Hirata',
    game: 'Persona 4',
    file: 'Pursuing My True Self (FULL w lyrics) - Adhitya Alkautsar (128k).mp3',
    category: 'P4',
  },
  {
    id: 38,
    title: 'PURSUING MY TRUE SELF (SHINICHI OSAWA REMIX)',
    artist: 'Shinichi Osawa',
    game: 'Persona 4 Dancing All Night',
    file: 'Pursuing My True Self - Shinichi Osawa Remix - Persona 4 Dancing All Night - PSC (128k).mp3',
    category: 'P4',
  },
  {
    id: 39,
    title: 'ROAD LESS TAKEN',
    artist: 'Lyn, Lotus Juice & Yumi Kawamura',
    game: 'Persona Q2',
    file: 'ROAD LESS TAKEN - Persona Q2 New Cinema Labyrinth - PSC (128k).mp3',
    category: 'PQ',
  },
  {
    id: 40,
    title: 'SHADOW LOOP',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5 The Phantom X',
    file: 'Shadow Loop - Persona 5 The Phantom X - PSC (128k).mp3',
    category: 'P5',
  },
  {
    id: 41,
    title: 'FEEL THE VIBE!',
    artist: 'Lotus Juice',
    game: 'Persona 4 Dancing All Night',
    file: 'So Baby Go For It, Feel the Vibe! - Persona 4 Dancing All Night - PSC (128k).mp3',
    category: 'P4',
  },
  {
    id: 42,
    title: 'TAKE OVER',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5 Royal',
    file: 'Take Over (Battle Theme) - Persona 5 Royal - Mayonaka Network (128k).mp3',
    category: 'P5',
  },
  {
    id: 43,
    title: 'TIME TO MAKE HISTORY (SPECIAL MIX)',
    artist: 'Shiho Hirata',
    game: 'Persona 4 Golden Animation',
    file: 'Time To Make History -special mix- - ペルソナ4 ザ・ゴールデン アニメーション 特製アレンジCD - EarthSquid (128k).mp3',
    category: 'P4',
  },
  {
    id: 44,
    title: "WHEN THE MOON'S REACHING OUT STARS -RELOAD-",
    artist: 'Azumi Takahashi',
    game: 'Persona 3 Reload',
    file: "When The Moon's Reaching Out Stars -Reload- - Azumi Takahashi - Topic (128k).mp3",
    category: 'P3',
  },
  {
    id: 45,
    title: 'YOU ARE STRONGER',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5 Strikers',
    file: 'You Are Stronger (FULL) - Persona 5 Scramble The Phantom Strikers - Barney Bagon (128k).mp3',
    category: 'P5',
  },
  {
    id: 46,
    title: 'MEMORIES OF YOU (ENGLISH COVER)',
    artist: 'Sapphire',
    game: 'Persona 3',
    file: '[Persona 3] Memories of You (English Cover by Sapphire) - Sapphire (128k).mp3',
    category: 'P3',
  },
  {
    id: 47,
    title: 'SIGNS OF LOVE',
    artist: 'Shiho Hirata',
    game: 'Persona 4',
    file: '[Persona 4 OST] 06 - Signs Of Love - DemonDaysxOST (128k).mp3',
    category: 'P4',
  },
  {
    id: 48,
    title: 'YOUR AFFECTION',
    artist: 'Shiho Hirata',
    game: 'Persona 4',
    file: '[Persona 4 OST] 08 - Your Affection - DemonDaysxOST (128k).mp3',
    category: 'P4',
  },
  {
    id: 49,
    title: 'TARTARUS_0D06 (P3R VER.)',
    artist: 'ATLUS Sound Team',
    game: 'Persona 3 Reload',
    file: 'tartarus_0d06 (P3R ver.) - ATLUS Sound Team - Topic (128k).mp3',
    category: 'P3',
  },
  {
    id: 50,
    title: 'COUNTER STRIKE',
    artist: 'Lyn Inaizumi',
    game: 'Persona 5 Strikers',
    file: '【Counter Strike】PERSONA5 SCRAMBLE The Phantom Strikers Original Soundtrack - Feminin Games (128k).mp3',
    category: 'P5',
  },
]

interface PersonaAudioPlayerProps {
  isLoading?: boolean
}

export function PersonaAudioPlayer({ isLoading = false }: PersonaAudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * SONGS_DATA.length)
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [pathname, setPathname] = useState(window.location.pathname)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasAttemptedPlayRef = useRef(false)
  const touchStartYRef = useRef<number | null>(null)

  const currentSong = SONGS_DATA[currentIndex]

  // Track route changes to dynamically toggle theme color
  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname)

    window.addEventListener('popstate', handleLocationChange)

    const origPushState = window.history.pushState
    window.history.pushState = function (...args) {
      origPushState.apply(this, args)
      handleLocationChange()
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.history.pushState = origPushState
    }
  }, [])

  const isBlueTheme = pathname === '/' || pathname === '/projects' || pathname === '/contact'
  const themeHex = isBlueTheme ? '#00A6E8' : '#e60012'

  // Initialize audio object on page mount
  useEffect(() => {
    const audio = new Audio()
    audio.volume = 0.8
    audioRef.current = audio

    const initialSong = SONGS_DATA[currentIndex]
    audio.src = getSongUrl(initialSong.file)

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % SONGS_DATA.length)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
    }
  }, [])

  // Start autoplay when loading completes
  useEffect(() => {
    if (isLoading) return
    if (hasAttemptedPlayRef.current) return

    const audio = audioRef.current
    if (!audio) return

    hasAttemptedPlayRef.current = true

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.log('Autoplay blocked by browser policy. Enabling play on first user interaction.', err)
          const enablePlay = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {})
            window.removeEventListener('click', enablePlay)
            window.removeEventListener('keydown', enablePlay)
            window.removeEventListener('touchstart', enablePlay)
          }
          window.addEventListener('click', enablePlay)
          window.addEventListener('keydown', enablePlay)
          window.addEventListener('touchstart', enablePlay)
        })
    }
  }, [isLoading])

  // Change track when currentIndex changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const song = SONGS_DATA[currentIndex]
    audio.src = getSongUrl(song.file)
    audio.currentTime = 0

    if (isPlaying) {
      void audio.play().catch((err) => console.log(err))
    }
  }, [currentIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      void audio.play().then(() => setIsPlaying(true)).catch((err) => console.log(err))
    }
  }

  const handleNextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % SONGS_DATA.length)
    setIsPlaying(true)
  }

  const handlePrevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + SONGS_DATA.length) % SONGS_DATA.length)
    setIsPlaying(true)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const next = !isMuted
    audioRef.current.muted = next
    setIsMuted(next)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setCurrentTime(val)
    if (audioRef.current) audioRef.current.currentTime = val
  }

  // Wheel scroll event for desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      handleNextTrack()
    } else if (e.deltaY < 0) {
      handlePrevTrack()
    }
  }

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return

    const touchEndY = e.changedTouches[0].clientY
    const deltaY = touchStartYRef.current - touchEndY

    if (Math.abs(deltaY) > 30) {
      if (deltaY > 0) {
        handleNextTrack()
      } else {
        handlePrevTrack()
      }
    }

    touchStartYRef.current = null
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const getThreeSongs = () => {
    const total = SONGS_DATA.length
    const prevIndex = (currentIndex - 1 + total) % total
    const nextIndex = (currentIndex + 1) % total

    return [
      { song: SONGS_DATA[prevIndex], position: 'top', actualIndex: prevIndex, offset: -1 },
      { song: SONGS_DATA[currentIndex], position: 'middle', actualIndex: currentIndex, offset: 0 },
      { song: SONGS_DATA[nextIndex], position: 'bottom', actualIndex: nextIndex, offset: 1 },
    ]
  }

  const threeSongs = getThreeSongs()

  if (isLoading) {
    return null
  }

  return (
    <>
      <style>{`
        @keyframes pulseEqualizer {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        @keyframes spinDisc {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes battleSlideIn {
          0% { transform: translateX(80px) rotate(4deg); opacity: 0; }
          100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        .animate-battle-in {
          animation: battleSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-disc-spin {
          animation: spinDisc 7s linear infinite;
        }
      `}</style>

      {/* COLLAPSED FLOATING TRIGGER BUTTON */}
      {isCollapsed && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="group relative flex h-14 w-14 cursor-pointer items-center justify-center -skew-x-12 border-2 border-white bg-[#080808] text-white transition hover:scale-110 active:scale-95"
            style={{ boxShadow: `4px 4px 0 ${themeHex}` }}
            title="Open Persona Music Menu"
          >
            <span className="skew-x-12 flex items-center justify-center">
              <Music size={24} style={{ color: themeHex }} />
            </span>
          </button>
        </div>
      )}

      {/* RIGHT-SIDE PERSONA 5 BATTLE COMMAND SONG MENU */}
      {!isCollapsed && (
        <div
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed right-3 md:right-8 top-1/2 -translate-y-1/2 z-[9999] flex flex-col items-end gap-3 select-none animate-battle-in touch-pan-y"
        >
          {/* TOP HELPER CONTROLS / COLLAPSE / MUTE BADGE */}
          <div className="flex items-center gap-2 pr-2 mb-1">
            <button
              type="button"
              onClick={toggleMute}
              className="flex items-center gap-1 -skew-x-12 border border-black bg-black px-2 py-0.5 text-[0.65rem] font-mono text-white hover:bg-white hover:text-black cursor-pointer"
              style={{ boxShadow: `2px 2px 0 ${themeHex}` }}
            >
              <span className="skew-x-12 flex items-center gap-1">
                {isMuted ? <VolumeX size={12} style={{ color: themeHex }} /> : <Volume2 size={12} />}
                <span>{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="flex h-6 w-6 items-center justify-center -skew-x-12 border border-black text-white shadow-[2px_2px_0_#fff] hover:bg-white hover:text-black cursor-pointer"
              style={{ backgroundColor: themeHex }}
              title="Minimize Menu"
            >
              <span className="skew-x-12 font-black text-xs">✕</span>
            </button>
          </div>

          {/* 3 PERSONA BATTLE COMMAND MENU BADGES */}
          <div className="flex flex-col items-end gap-3.5 max-w-[340px] sm:max-w-[400px]">

            {/* BADGE 1: TOP (PREVIOUS TRACK) */}
            {(() => {
              const item = threeSongs[0]
              return (
                <div
                  key={`top-${item.song.id}`}
                  onClick={() => {
                    handlePrevTrack()
                  }}
                  className="group relative cursor-pointer transition-all duration-200 hover:-translate-x-2 -rotate-[6deg] origin-right"
                >
                  <div
                    className="absolute -inset-1 -skew-x-[14deg] shadow-[4px_4px_0_#000] transition group-hover:scale-105"
                    style={{ backgroundColor: themeHex }}
                  />

                  <div className="relative flex items-center justify-between gap-3 -skew-x-[14deg] border-2 border-white bg-[#080808] p-2 sm:p-2.5 text-white">
                    <div className="skew-x-[14deg] flex items-center gap-2.5">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white text-xs font-black text-white shadow-[2px_2px_0_#000]"
                        style={{ backgroundColor: themeHex }}
                      >
                        △
                      </span>
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-['Anton','Archivo_Black',Impact] text-sm sm:text-base uppercase tracking-wider text-white truncate max-w-[170px] sm:max-w-[210px] drop-shadow-[2px_2px_0_#000]">
                            {item.song.title}
                          </span>
                        </div>
                        <p className="font-['Segoe_UI',sans-serif] text-[0.62rem] font-bold text-neutral-300 tracking-tight">
                          スキルを使う <span className="text-neutral-400">· {item.song.artist}</span>
                        </p>
                      </div>
                    </div>

                    <span className="skew-x-[14deg] border border-white/40 bg-black/60 px-1.5 py-0.5 font-mono text-[0.58rem] text-neutral-300 uppercase">
                      PREV
                    </span>
                  </div>
                </div>
              )
            })()}

            {/* BADGE 2: MIDDLE (ACTIVE TRACK) */}
            {(() => {
              const item = threeSongs[1]
              return (
                <div
                  key={`middle-${item.song.id}`}
                  className="group relative cursor-pointer transition-all duration-200 -translate-x-3 sm:-translate-x-6 rotate-[-1deg] origin-right scale-105 z-20"
                >
                  <div
                    className="absolute -inset-1.5 -skew-x-[14deg] shadow-[6px_6px_0_#000] animate-pulse"
                    style={{ backgroundColor: themeHex }}
                  />

                  <div className="relative flex flex-col gap-1.5 -skew-x-[14deg] border-3 border-white bg-[#080808] p-2.5 sm:p-3 text-white shadow-[8px_8px_0_rgba(0,0,0,0.8)]">

                    <div className="skew-x-[14deg] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0" onClick={togglePlay}>
                        <div
                          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white shadow-[3px_3px_0_#000]"
                          style={{ color: themeHex }}
                        >
                          <div className={`absolute inset-0 rounded-full border border-black/20 ${isPlaying ? 'animate-disc-spin' : ''}`}>
                            <Disc size={28} className="opacity-30" />
                          </div>
                          <span className="font-black text-sm relative z-10">
                            {isPlaying ? (
                              <div className="flex items-end gap-0.5 h-3">
                                <span className="w-0.5 animate-[pulseEqualizer_0.5s_infinite]" style={{ backgroundColor: themeHex }} />
                                <span className="w-0.5 bg-black animate-[pulseEqualizer_0.7s_infinite_0.1s]" />
                                <span className="w-0.5 animate-[pulseEqualizer_0.4s_infinite_0.2s]" style={{ backgroundColor: themeHex }} />
                              </div>
                            ) : (
                              '◯'
                            )}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-block px-1 py-0.2 text-[0.55rem] font-black uppercase text-white"
                              style={{ backgroundColor: themeHex }}
                            >
                              {currentSong.category}
                            </span>
                            <span className="truncate font-['Anton','Archivo_Black',Impact] text-base sm:text-lg uppercase tracking-wider text-white drop-shadow-[2px_2px_0_#000] max-w-[160px] sm:max-w-[210px]">
                              {currentSong.title}
                            </span>
                          </div>
                          <p className="font-['Segoe_UI',sans-serif] text-[0.65rem] font-bold text-yellow-300 tracking-tight">
                            作戦を指示する <span className="text-white font-mono">· {currentSong.artist}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={togglePlay}
                        className="skew-x-[0deg] flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-white text-black transition cursor-pointer"
                        style={{ boxShadow: `2px 2px 0 ${themeHex}` }}
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                      </button>
                    </div>

                    <div className="skew-x-[14deg] space-y-1 pt-1 border-t border-white/20">
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="h-1.5 w-full cursor-pointer appearance-none bg-neutral-800"
                        style={{ accentColor: themeHex }}
                      />
                      <div className="flex items-center justify-between text-[0.58rem] font-mono text-neutral-300">
                        <span>{formatTime(currentTime)}</span>
                        {/* Teks petunjuk hanya ditampilkan pada ukuran desktop (md ke atas) */}
                        <span className="hidden md:inline text-yellow-400 font-bold uppercase">SCROLL MOUSE ↕ CHANGE SONG</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                  </div>
                </div>
              )
            })()}

            {/* BADGE 3: BOTTOM (NEXT TRACK) */}
            {(() => {
              const item = threeSongs[2]
              return (
                <div
                  key={`bottom-${item.song.id}`}
                  onClick={() => {
                    handleNextTrack()
                  }}
                  className="group relative cursor-pointer transition-all duration-200 hover:-translate-x-2 rotate-[5deg] origin-right"
                >
                  <div
                    className="absolute -inset-1 -skew-x-[14deg] shadow-[4px_4px_0_#000] transition group-hover:scale-105"
                    style={{ backgroundColor: themeHex }}
                  />

                  <div className="relative flex items-center justify-between gap-3 -skew-x-[14deg] border-2 border-white bg-[#080808] p-2 sm:p-2.5 text-white">
                    <div className="skew-x-[14deg] flex items-center gap-2.5">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white bg-black text-xs font-black text-white"
                        style={{ boxShadow: `2px 2px 0 ${themeHex}` }}
                      >
                        ✕
                      </span>
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-['Anton','Archivo_Black',Impact] text-sm sm:text-base uppercase tracking-wider text-white truncate max-w-[170px] sm:max-w-[210px] drop-shadow-[2px_2px_0_#000]">
                            {item.song.title}
                          </span>
                        </div>
                        <p className="font-['Segoe_UI',sans-serif] text-[0.62rem] font-bold text-neutral-300 tracking-tight">
                          防御する <span className="text-neutral-400">· {item.song.artist}</span>
                        </p>
                      </div>
                    </div>

                    <span className="skew-x-[14deg] border border-white/40 bg-black/60 px-1.5 py-0.5 font-mono text-[0.58rem] text-neutral-300 uppercase">
                      NEXT
                    </span>
                  </div>
                </div>
              )
            })()}

          </div>

          {/* NAV CONTROLS */}
          <div className="flex items-center gap-2 pr-2 mt-1">
            <button
              type="button"
              onClick={handlePrevTrack}
              className="flex items-center gap-1 -skew-x-12 border border-black bg-white px-2 py-0.5 text-[0.62rem] font-bold text-black transition cursor-pointer"
              style={{ boxShadow: `2px 2px 0 ${themeHex}` }}
            >
              <span className="skew-x-12 flex items-center gap-1">
                <ChevronLeft size={12} /> PREV
              </span>
            </button>

            <button
              type="button"
              onClick={handleNextTrack}
              className="flex items-center gap-1 -skew-x-12 border border-black bg-white px-2 py-0.5 text-[0.62rem] font-bold text-black transition cursor-pointer"
              style={{ boxShadow: `2px 2px 0 ${themeHex}` }}
            >
              <span className="skew-x-12 flex items-center gap-1">
                NEXT <ChevronRight size={12} />
              </span>
            </button>
          </div>

        </div>
      )}
    </>
  )
}