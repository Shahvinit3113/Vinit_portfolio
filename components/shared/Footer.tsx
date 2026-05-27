'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, Instagram, ExternalLink, ArrowUpRight, FileText, Download } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => { });
  }, []);



  const name = settings.name || "Alex Dev";
  const title = settings.title || "Full Stack Developer";

  return (
    <footer id="contact" className="relative bg-gradient-to-t from-secondary/30 to-background border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Brand & CTA */}
          <div className="space-y-6">
            <div className="fade-in-up">
              <Link href="/" className="flex flex-col gap-1">
                <span className="text-2xl font-bold gradient-text">{name}</span>
                <span className="text-xs text-muted-foreground font-medium">{title}</span>
              </Link>
              <p className="text-muted-foreground mt-3 leading-relaxed text-sm">
                Crafting beautiful, functional web experiences with modern technologies and thoughtful design.
              </p>
            </div>

            <div className="fade-in-up" style={{ animationDelay: '100ms' }}>
              <p className="text-xs font-semibold text-foreground mb-2">Let's Work Together</p>
              <p className="text-muted-foreground text-xs mb-3">
                Have a project in mind? I'd love to hear about it.
              </p>
              <a href={settings.email ? `mailto:${settings.email}` : "#"} className="inline-flex items-center gap-2 text-primary hover:text-accent transition-all duration-300 font-semibold text-sm group">
                Send me a message
                <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="fade-in-up" style={{ animationDelay: '150ms' }}>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="#projects" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Projects</Link></li>
                <li><Link href="#skills" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Skills</Link></li>
                <li><Link href="#experience" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Experience</Link></li>
                <li><Link href="#blog" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Blog</Link></li>
              </ul>
            </div>

            <div className="fade-in-up" style={{ animationDelay: '200ms' }}>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Resources</h4>
              <ul className="space-y-2">
                <li><a href="/resume.pdf" download="Shah_Vinit_Resume.pdf" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-1"><Download size={10} /> Resume</a></li>
                {settings.github && <li><a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">GitHub</a></li>}
                {settings.devto && <li><a href={settings.devto} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Dev.to</a></li>}
                <li><Link href="/blogs" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Blog</Link></li>
              </ul>
            </div>

            <div className="fade-in-up" style={{ animationDelay: '250ms' }}>
              <h4 className="font-semibold text-foreground mb-3 text-sm">Social</h4>
              <ul className="space-y-2">
                {settings.github && <li><a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">GitHub</a></li>}
                {settings.linkedin && <li><a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">LinkedIn</a></li>}
                {settings.instagram && <li><a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Instagram</a></li>}
                {settings.email && <li><a href={`mailto:${settings.email}`} className="text-xs text-muted-foreground hover:text-primary transition-all duration-300">Email</a></li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 fade-in-up" style={{ animationDelay: '300ms' }}>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex gap-3">
            {settings.github && (
              <a href={settings.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg hover:bg-primary/10 text-primary transition-all duration-300 hover:scale-110">
                <Github size={16} />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg hover:bg-primary/10 text-primary transition-all duration-300 hover:scale-110">
                <Linkedin size={16} />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg hover:bg-primary/10 text-primary transition-all duration-300 hover:scale-110">
                <Instagram size={16} />
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="p-2.5 rounded-lg hover:bg-primary/10 text-primary transition-all duration-300 hover:scale-110">
                <Mail size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
