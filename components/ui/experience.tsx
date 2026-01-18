'use client'

import { Building2, Calendar, ArrowRight } from '@/components/icons'

const experiences = [
  {
    company: 'Tech Corp',
    position: 'Senior Frontend Engineer',
    period: '2022 - Present',
    description: 'Leading frontend development for enterprise applications. Mentoring junior developers and establishing best practices. Improved performance by 35%.',
    skills: ['React', 'TypeScript', 'Next.js', 'System Design'],
    achievements: [
      'Led redesign of core product interface',
      'Mentored 5+ junior developers',
      'Reduced load time by 35%'
    ]
  },
  {
    company: 'Digital Agency',
    position: 'Full Stack Developer',
    period: '2020 - 2022',
    description: 'Developed full-stack web applications for various clients. Improved performance and user experience across projects. Built and shipped 20+ projects.',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    achievements: [
      'Shipped 20+ client projects',
      'Maintained 99.9% uptime',
      'Increased client retention by 60%'
    ]
  },
  {
    company: 'StartUp Lab',
    position: 'Frontend Developer',
    period: '2019 - 2020',
    description: 'Built responsive UI components and features for SaaS products. Collaborated with designers and backend engineers to create seamless user experiences.',
    skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
    achievements: [
      'Built component library with 50+ components',
      'Improved SEO ranking by 45%',
      'Grew user base to 50K+'
    ]
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4 fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Experience</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            My professional journey building amazing products and leading teams
          </p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="group p-6 md:p-8 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-500 bg-card/40 backdrop-blur-sm fade-in-up"
              style={{ animationDelay: `${index * 100 + 300}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 size={20} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{exp.company}</h3>
                  </div>
                  <p className="text-lg text-primary font-semibold">{exp.position}</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                  <Calendar size={18} />
                  <span className="font-medium">{exp.period}</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{exp.description}</p>

              {/* Achievements */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3">Key Achievements</p>
                <ul className="grid md:grid-cols-3 gap-3">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight size={16} className="text-accent mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {exp.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-accent/20 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
