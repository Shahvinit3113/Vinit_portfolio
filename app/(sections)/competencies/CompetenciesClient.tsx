"use client";

import { CheckCircle2 } from "lucide-react";

export default function CompetenciesClient({ items }: { items: any[] }) {
    if (!items || items.length === 0) return null;

    return (
        <section id="competencies" className="py-24 bg-card/30 border-y border-border/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12 fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Other Competencies</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-up" style={{ animationDelay: "200ms" }}>
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="text-primary" size={20} />
                            </div>
                            <span className="font-medium text-lg text-foreground/90">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
