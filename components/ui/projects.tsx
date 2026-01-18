'use client'

import axios from "axios"
import { useEffect, useState } from 'react'
import { ExternalLink, Github, ArrowUpRight } from '@/components/icons'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await axios.get("/api/projects")
        setProjects(data)
      } catch (error) {
        console.error("Failed to load projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <section className="py-24 text-center">
        <p className="text-muted-foreground text-sm">Loading Projects...</p>
      </section>
    )
  }

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-20 space-y-4 fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Featured Projects</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Showcasing my work across web development, design, and innovative technology solutions
          </p>
        </div>

        <div className="grid gap-12">
          {projects.map((project: any, index: number) => (
            <div
              key={project.id}
              className={`group grid md:grid-cols-2 gap-8 items-center fade-in-up ${
                index % 2 === 1 ? 'md:[&>:first-child]:order-2' : ''
              }`}
              style={{ animationDelay: `${index * 100 + 100}ms` }}
            >
              {/* IMAGE */}
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50 hover:border-primary/30 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                <div className="h-full flex items-center justify-center text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-500">
                  {project.image}
                </div>
              </div>

              {/* CONTENT */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{project.description}</p>
                </div>

                <p className="text-xs font-semibold text-accent">{project.stats}</p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-primary/20 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* LINKS */}
                <div className="flex gap-4 pt-2">
                  <a
                    href={project.links.github}
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-all duration-300 font-semibold group/link"
                  >
                    <Github size={16} />
                    Code
                    <ArrowUpRight size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                  </a>

                  <a
                    href={project.links.live}
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-all duration-300 font-semibold group/link"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                    <ArrowUpRight size={14} className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
