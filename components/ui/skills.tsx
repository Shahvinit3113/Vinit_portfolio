'use client'

import { Code2, Palette, Database, Zap } from '@/components/icons'

const skillCategories = [
  {
    category: 'Frontend',
    icon: Palette,
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 95 },
      { name: 'TypeScript', level: 92 },
      { name: 'Tailwind CSS', level: 96 },
    ]
  },
  {
    category: 'Backend',
    icon: Database,
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 82 },
      { name: 'REST APIs', level: 90 },
    ]
  },
  {
    category: 'Development',
    icon: Code2,
    skills: [
      { name: 'Git & GitHub', level: 92 },
      { name: 'Testing', level: 85 },
      { name: 'Web Performance', level: 88 },
      { name: 'DevOps', level: 80 },
    ]
  },
  {
    category: 'Tools & More',
    icon: Zap,
    skills: [
      { name: 'Figma', level: 87 },
      { name: 'AWS', level: 83 },
      { name: 'Docker', level: 82 },
      { name: 'GraphQL', level: 84 },
    ]
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 space-y-4 fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Skills & Expertise</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon
            return (
              <div
                key={category.category}
                className="group p-6 rounded-xl border border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/70 transition-all duration-500 backdrop-blur-sm fade-in-up"
                style={{ animationDelay: `${categoryIndex * 100 + 200}ms` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{category.category}</h3>
                </div>

                <div className="space-y-5">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-foreground">{skill.name}</span>
                        <span className="text-xs font-semibold text-accent">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-progress"
                          style={{
                            width: `${skill.level}%`,
                            animationDelay: `${skillIndex * 100 + categoryIndex * 150}ms`,
                            animation: `scaleIn 0.8s ease-out ${skillIndex * 100 + categoryIndex * 150}ms both`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Skills */}
        <div className="mt-12 p-6 rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm fade-in-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-lg font-bold mb-4">Other Competencies</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-sm text-primary">Design</p>
              <p className="text-xs text-muted-foreground">UI/UX Design, Responsive Design, Design Systems</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm text-primary">Soft Skills</p>
              <p className="text-xs text-muted-foreground">Team Leadership, Problem Solving, Communication</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm text-primary">Methodologies</p>
              <p className="text-xs text-muted-foreground">Agile, Scrum, Clean Code, TDD</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
