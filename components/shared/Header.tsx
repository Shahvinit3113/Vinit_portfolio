'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from '@/components/icons'

const NAV_ITEMS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '#blog' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Track active section
      const sections = ['projects', 'skills', 'experience', 'blog', 'contact']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => { })
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      const offset = 80 // Header height
      const y = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const name = settings.name || "Alex Dev"
  const title = settings.title || "Full Stack Developer"

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled
      ? 'bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/50'
      : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col gap-0 group">
          <span className="text-lg font-bold gradient-text group-hover:opacity-80 transition-opacity">{name}</span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">{title}</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${activeSection === item.href.replace('#', '')
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {item.label}
              {activeSection === item.href.replace('#', '') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, '#contact')}
            className="ml-3 px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 font-medium text-sm"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2.5 hover:bg-muted rounded-xl transition-all duration-300"
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-5">
            <span className={`absolute left-0 block w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'top-2 rotate-45' : 'top-1'}`} />
            <span className={`absolute left-0 top-2 block w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
            <span className={`absolute left-0 block w-5 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? 'top-2 -rotate-45' : 'top-3'}`} />
          </div>
        </button>

        {/* Mobile Menu */}
        <div className={`absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 md:hidden transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="flex flex-col p-6 gap-2">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`py-3 px-4 text-sm font-medium rounded-xl transition-all duration-300 ${activeSection === item.href.replace('#', '')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="mt-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm text-center transition-all duration-300 hover:opacity-90"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
