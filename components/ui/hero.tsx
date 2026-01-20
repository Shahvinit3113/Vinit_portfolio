'use client'

import { ArrowRight, Github, Linkedin, Mail, ExternalLink } from '@/components/icons'
import { Instagram, Sparkles, Download } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState(true);


  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => { });
  }, []);



  const name = settings.name || "Shah Vinit";
  const title = settings.title || "Full Stack Developer";
  const bio = settings.bio || "Crafting stunning, performant web applications with React, Next.js, and modern technologies. Turning ideas into reality.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
        {/* Profile Image - Shows first on mobile */}
        <div className="relative h-[280px] md:h-[400px] lg:h-[500px] scale-in order-1 md:order-2" style={{ animationDelay: '0.3s' }}>
          {/* Glow effect behind image */}
          <div className="absolute inset-4 md:inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-2xl md:rounded-3xl blur-2xl md:blur-3xl opacity-30" />

          {/* Main container */}
          <div className="relative h-full bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl md:rounded-3xl overflow-hidden border border-border/50 backdrop-blur-sm group hover:border-primary/30 transition-all duration-500">
            {settings.user_image ? (
              <>
                {/* Skeleton loader */}
                {imageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
                <img
                  src={settings.user_image}
                  alt={name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => setImageLoading(false)}
                />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                <div className="h-full flex flex-col items-center justify-center gap-4 md:gap-6 text-center p-6 md:p-8">
                  <div className="text-6xl md:text-8xl float-animation">🚀</div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 md:mb-2">Your Photo</p>
                    <p className="text-sm md:text-base text-muted-foreground">Upload in admin settings</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Decorative elements - hidden on mobile */}
          <div className="hidden md:block absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-2xl opacity-20 rotate-12" />
          <div className="hidden md:block absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-20 -rotate-12" />

          {/* Floating badges - hidden on mobile */}
          <div className="hidden md:block absolute -left-4 top-1/4 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-xl border border-border shadow-lg float-animation">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="hidden md:block absolute -right-4 bottom-1/3 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-xl border border-border shadow-lg float-animation" style={{ animationDelay: '0.5s' }}>
            <span className="text-2xl">💻</span>
          </div>
        </div>

        {/* Left Content */}
        <div className="space-y-6 md:space-y-8 fade-in-up order-2 md:order-1 text-center md:text-left" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-4 md:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full">
              <Sparkles size={14} className="text-primary" />
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {title}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="block text-foreground mb-1 md:mb-2">Hi, I'm</span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[size:200%_auto] animate-[gradient_3s_linear_infinite] bg-clip-text text-transparent">
                {name}
              </span>
            </h1>

            {/* Bio */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto md:mx-0">
              {bio}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              View My Work
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/resume.pdf"
              download="Shah_Vinit_Resume.pdf"
              className="group inline-flex items-center justify-center gap-2 bg-card border-2 border-border text-foreground px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <Download size={18} />
              Resume
            </a>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 pt-2 md:pt-4 justify-center md:justify-start">
            {settings.github && (
              <a href={settings.github} target="_blank" rel="noopener noreferrer" className="p-3 md:p-3.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <Github size={18} className="md:w-5 md:h-5" />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 md:p-3.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <Linkedin size={18} className="md:w-5 md:h-5" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-3 md:p-3.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <Instagram size={18} className="md:w-5 md:h-5" />
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="p-3 md:p-3.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <Mail size={18} className="md:w-5 md:h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-muted-foreground">Scroll</span>
        <div className="w-5 h-8 border-2 border-muted-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
