/**
 * @file Persona Portfolio Component
 * @author Dafa Ghaitsa (Perdafos)
 * @copyright (c) 2026 Dafa Ghaitsa. All rights reserved.
 * @license MIT - See LICENSE file in project root for full terms.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { HomePage } from './pages/home/HomePage'
import { ProjectsPage } from './pages/home/Projects'
import { SkillsPage } from './pages/home/Skills'
import About from './pages/home/About'
import { ContactPage } from './pages/home/ContactMe.tsx'
import TransitionOverlay from './components/TransitionOverlay'
import type { TransitionHandle } from './components/TransitionOverlay'
import DesktopScaler from './components/DesktopScaler'
import { PersonaAudioPlayer } from './components/PersonaAudioPlayer'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const seen = sessionStorage.getItem('persona_initial_seen') === '1'
  const [isLoading, setIsLoading] = useState(!seen)
  const overlayRef = useRef<TransitionHandle | null>(null)

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const runInitial = async () => {
      if (!seen) {
        if (overlayRef.current) {
          await overlayRef.current.playInitialLoad()
        }
        sessionStorage.setItem('persona_initial_seen', '1')
        setPathname(window.location.pathname)
      }
      setIsLoading(false)
    }

    void runInitial()
  }, [seen])

  const navigateTo = useCallback(async (path: string) => {
    if (window.location.pathname === path) return

    window.history.pushState({}, '', path)
    setPathname(path)

    if (overlayRef.current) {
      await overlayRef.current.playNavigation(path)
    }
  }, [])

  const renderContent = () => {
    if (pathname === '/projects') {
      return <ProjectsPage />
    }
    if (pathname === '/skills') {
      return <SkillsPage onBackHome={() => void navigateTo('/')} />
    }
    if (pathname === '/about') {
      return <About onBack={() => void navigateTo('/')} />
    }
    if (pathname === '/contact') {
      return <ContactPage onBack={() => void navigateTo('/')} />
    }
    return (
      <HomePage
        onOpenProjects={() => void navigateTo('/projects')}
        onOpenSkills={() => void navigateTo('/skills')}
        onOpenAbout={() => void navigateTo('/about')}
        onOpenContact={() => void navigateTo('/contact')}
      />
    )
  }

  return (
    <DesktopScaler>
      {renderContent()}
      <TransitionOverlay ref={overlayRef} />
      <PersonaAudioPlayer isLoading={isLoading} />
    </DesktopScaler>
  )
}

export default App