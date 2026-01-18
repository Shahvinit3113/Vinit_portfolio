"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Briefcase, Trophy } from "lucide-react";
import AddExperienceForm from "./AddExperienceForm";
import EditExperienceForm from "./EditExperienceForm";
import DeleteExperienceModal from "./DeleteExperienceModal";

interface Experience {
    id: string;
    position: string;
    company: string;
    period: string;
    description: string;
    achievements?: string[];
    skills?: string[];
}

export default function ExperienceClient({ experience: initialData }: { experience: Experience[] }) {
    const [items, setItems] = useState<Experience[]>(initialData);
    const [showAdd, setShowAdd] = useState(false);
    const [editItem, setEditItem] = useState<Experience | null>(null);
    const [deleteItem, setDeleteItem] = useState<Experience | null>(null);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Experience</h2>
                    <p className="text-muted-foreground mt-1">Manage your work history and career timeline.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:opacity-90 transition"
                >
                    <Plus size={18} /> Add Experience
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="p-6 rounded-xl border border-border/50 bg-card/40 hover:bg-card/60 transition shadow-sm hover:shadow-md backdrop-blur-sm group relative">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 w-full">
                                <div className="p-3 bg-primary/10 rounded-xl h-fit shrink-0">
                                    <Briefcase className="text-primary" size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">{item.position}</h3>
                                            <div className="text-muted-foreground font-medium">{item.company}</div>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-md border">{item.period}</div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditItem(item)}
                                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteItem(item)}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {item.description && (
                                        <p className="mt-3 text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                                    )}

                                    {/* Achievements Section */}
                                    {item.achievements && item.achievements.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-border/40">
                                            <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2 text-foreground/80">
                                                <Trophy size={14} className="text-yellow-500" /> Key Achievements
                                            </h4>
                                            <ul className="space-y-1">
                                                {item.achievements.map((ach, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                                                        {ach}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Skills Section */}
                                    {item.skills && item.skills.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {item.skills.map((skill, i) => (
                                                <span key={i} className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/10">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-20 border border-dashed rounded-xl border-border/50 bg-muted/20">
                        <Briefcase className="mx-auto text-muted-foreground mb-4" size={48} />
                        <h3 className="text-lg font-medium">No experience added yet</h3>
                        <p className="text-muted-foreground">Click the "Add Experience" button to get started.</p>
                    </div>
                )}
            </div>

            {showAdd && (
                <AddExperienceForm
                    onClose={() => setShowAdd(false)}
                    onAdded={(newItem) => setItems([newItem, ...items])}
                />
            )}

            {editItem && (
                <EditExperienceForm
                    experience={editItem}
                    onClose={() => setEditItem(null)}
                    onUpdated={(updatedItem) =>
                        setItems(items.map((i) => (i.id === updatedItem.id ? updatedItem : i)))
                    }
                />
            )}

            {deleteItem && (
                <DeleteExperienceModal
                    experience={deleteItem}
                    onClose={() => setDeleteItem(null)}
                    onDeleted={(id) => setItems(items.filter((i) => i.id !== id))}
                />
            )}
        </div>
    );
}
