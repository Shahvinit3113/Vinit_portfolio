"use client";

import { Building2, Calendar, ArrowRight } from "@/components/icons";

export default function ExperienceClient({ experiences }: { experiences: any[] }) {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-20 space-y-4 fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Experience
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            My professional journey building amazing products and leading teams
          </p>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}  // ← FIXED (use UUID, not index)
              className="group p-6 md:p-8 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-500 bg-card/40 backdrop-blur-sm fade-in-up"
              style={{ animationDelay: `${index * 100 + 300}ms` }}
            >
              {/* Top Row */}
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

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {exp.description}
              </p>

              {/* Achievements */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3">Key Achievements</p>
                <ul className="grid md:grid-cols-3 gap-3">
                  {exp.achievements.map((achievement: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight size={16} className="text-accent mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill: string) => (
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
  );
}
