"use client";

import { Palette, Database, Code2, Zap } from "@/components/icons";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Map string → icon component
const iconMap: Record<string, any> = {
  Palette,
  Database,
  Code2,
  Zap,
};

function CategoryCard({ category, index }: { category: any, index: number }) {
  const Icon = iconMap[category.icon] || Palette;
  return (
    <div
      className="group p-6 rounded-xl border border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/70 transition-all duration-500 backdrop-blur-sm fade-in-up h-full"
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
          <Icon size={20} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold">{category.category}</h3>
      </div>

      <div className="space-y-5">
        {category.skills.map((skill: any, skillIndex: number) => (
          <div key={skill.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs">{skill.name}</span>
              <span className="text-xs font-semibold text-accent">{skill.level}%</span>
            </div>

            <div className="skill-bar">
              <div
                className="skill-progress"
                style={{
                  width: `${skill.level}%`,
                  animation: `scaleIn 0.8s ease-out`,
                  animationDelay: `${skillIndex * 100 + index * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsClient({ categories, competencies }: { categories: any[], competencies: any[] }) {
  return (
    <section id="skills" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20 space-y-4 fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Skills & Expertise
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </div>

        {categories.length > 4 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 }
            }}
            className="w-full pb-12"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id} className="!h-auto">
                <CategoryCard category={category} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        )}

        {/* Additional Skills / Competencies */}
        {competencies && competencies.length > 0 && (
          <div
            className="mt-12 p-6 rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm fade-in-up"
            style={{ animationDelay: "500ms" }}
          >
            <h3 className="text-lg font-bold mb-4">Other Competencies</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {competencies.map((params) => (
                <div key={params.id} className="space-y-1">
                  <p className="font-semibold text-sm text-primary">{params.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {params.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
