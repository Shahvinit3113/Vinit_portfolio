"use client";

import { useState } from "react";
import axios from "axios";
import { X, Plus, Trash2 } from "lucide-react";

export default function AddExperienceForm({ onClose, onAdded }: { onClose: () => void, onAdded: (exp: any) => void }) {
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");
    const [period, setPeriod] = useState("");
    const [description, setDescription] = useState("");
    const [achievements, setAchievements] = useState<string[]>([]);
    const [newAchievement, setNewAchievement] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [loading, setLoading] = useState(false);

    const addAchievement = () => {
        if (!newAchievement.trim()) return;
        setAchievements([...achievements, newAchievement.trim()]);
        setNewAchievement("");
    };

    const removeAchievement = (index: number) => {
        setAchievements(achievements.filter((_, i) => i !== index));
    };

    const addSkill = () => {
        if (!newSkill.trim()) return;
        setSkills([...skills, newSkill.trim()]);
        setNewSkill("");
    };

    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const submit = async () => {
        if (!position || !company) return;
        setLoading(true);
        try {
            const payload = {
                position,
                company,
                period,
                description,
                achievements,
                skills
            };
            const res = await axios.post("/api/admin/experience", payload);
            if (res.data.success) {
                onAdded(res.data.experience);
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition">
                    <X size={18} />
                </button>

                <h3 className="text-2xl font-bold mb-4">Add Experience</h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Position</label>
                            <input className="w-full px-4 py-2 rounded-lg border bg-background" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Senior Developer" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Company</label>
                            <input className="w-full px-4 py-2 rounded-lg border bg-background" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Acme Corp" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Period</label>
                        <input className="w-full px-4 py-2 rounded-lg border bg-background" value={period} onChange={e => setPeriod(e.target.value)} placeholder="e.g. 2020 - Present" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea className="w-full px-4 py-2 rounded-lg border bg-background h-20 resize-none" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief summary of your role..." />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Key Achievements</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                className="flex-1 px-4 py-2 rounded-lg border bg-background"
                                value={newAchievement}
                                onChange={e => setNewAchievement(e.target.value)}
                                placeholder="e.g. Increased detailed performance by 20%..."
                                onKeyDown={(e) => e.key === 'Enter' && addAchievement()}
                            />
                            <button onClick={addAchievement} className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="mt-3 space-y-2">
                            {achievements.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg text-sm group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="flex-1">{item}</span>
                                    <button onClick={() => removeAchievement(i)} className="p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Skills Used</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                className="flex-1 px-4 py-2 rounded-lg border bg-background"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                placeholder="e.g. React, Node.js"
                                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            />
                            <button onClick={addSkill} className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {skills.map((item, i) => (
                                <span key={i} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm group">
                                    {item}
                                    <button onClick={() => removeSkill(i)} className="hover:text-red-500 transition">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-muted transition">Cancel</button>
                    <button onClick={submit} disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50">
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
