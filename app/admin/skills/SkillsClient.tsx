"use client";

import { useState } from "react";
import AddCategoryForm from "./AddCategoryForm";
import AddSkillForm from "./AddSkillForm";
import EditSkillForm from "./EditSkillForm";
import DeleteCategoryModal from "./DeleteCategoryModal";
import DeleteSkillModal from "./DeleteSkillModal";
import { Pencil, Trash2 } from "lucide-react";

interface Skill {
    id: string;
    name: string;
    level: number;
    category_id: string;
}

interface Category {
    id: string;
    category: string;
    icon: string;
    skills: Skill[];
}

export default function SkillsClient({ categories: initialCategories }: { categories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [editSkill, setEditSkill] = useState<Skill | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null);
    const [addSkillToCategory, setAddSkillToCategory] = useState<Category | null>(null);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Manage Skills</h2>
                <AddCategoryForm
                    onAdded={(c: Category) => setCategories([...categories, { ...c, skills: [] }])}
                />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="p-5 rounded-xl border border-border/40 bg-card/60 shadow-sm hover:shadow-md transition-all hover:border-primary/40"
                    >
                        {/* Category Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-3xl">{cat.icon}</span>
                                <h3 className="text-xl font-semibold mt-2">{cat.category}</h3>
                            </div>
                            <button
                                onClick={() => setDeleteCategory(cat)}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition"
                            >
                                <Trash2 size={16} className="text-red-500" />
                            </button>
                        </div>

                        {/* Skills List */}
                        <div className="space-y-3">
                            {cat.skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                                >
                                    <div className="flex-1">
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        <span className="text-xs text-muted-foreground ml-2">
                                            {skill.level}%
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditSkill(skill)}
                                            className="p-1.5 rounded bg-primary/10 hover:bg-primary/20"
                                        >
                                            <Pencil size={14} className="text-primary" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteSkill(skill)}
                                            className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20"
                                        >
                                            <Trash2 size={14} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Skill Button */}
                        <button
                            onClick={() => setAddSkillToCategory(cat)}
                            className="mt-4 w-full py-2 text-sm rounded-lg border border-dashed border-primary/40 text-primary hover:bg-primary/10 transition"
                        >
                            + Add Skill
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Skill Modal */}
            {addSkillToCategory && (
                <AddSkillForm
                    category={addSkillToCategory}
                    onClose={() => setAddSkillToCategory(null)}
                    onAdded={(skill: Skill) => {
                        setCategories(
                            categories.map((c) =>
                                c.id === addSkillToCategory.id
                                    ? { ...c, skills: [...c.skills, skill] }
                                    : c
                            )
                        );
                        setAddSkillToCategory(null);
                    }}
                />
            )}

            {/* Edit Skill Modal */}
            {editSkill && (
                <EditSkillForm
                    skill={editSkill}
                    onClose={() => setEditSkill(null)}
                    onUpdated={(updated: Skill) => {
                        setCategories(
                            categories.map((c) => ({
                                ...c,
                                skills: c.skills.map((s) => (s.id === updated.id ? updated : s)),
                            }))
                        );
                        setEditSkill(null);
                    }}
                />
            )}

            {/* Delete Category Modal */}
            {deleteCategory && (
                <DeleteCategoryModal
                    category={deleteCategory}
                    onClose={() => setDeleteCategory(null)}
                    onDeleted={(id: string) => {
                        setCategories(categories.filter((c) => c.id !== id));
                        setDeleteCategory(null);
                    }}
                />
            )}

            {/* Delete Skill Modal */}
            {deleteSkill && (
                <DeleteSkillModal
                    skill={deleteSkill}
                    onClose={() => setDeleteSkill(null)}
                    onDeleted={(id: string) => {
                        setCategories(
                            categories.map((c) => ({
                                ...c,
                                skills: c.skills.filter((s) => s.id !== id),
                            }))
                        );
                        setDeleteSkill(null);
                    }}
                />
            )}
        </div>
    );
}
