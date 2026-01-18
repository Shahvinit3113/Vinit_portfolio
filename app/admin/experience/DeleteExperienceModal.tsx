"use client";

import axios from "axios";
import { X, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteExperienceModal({ experience, onClose, onDeleted }: { experience: any, onClose: () => void, onDeleted: (id: string) => void }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`/api/admin/experience/${experience.id}`);
            onDeleted(experience.id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-sm relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"><X size={18} /></button>

                <div className="flex justify-center mb-4 text-red-500">
                    <Trash2 size={48} />
                </div>

                <h3 className="text-xl font-bold">Delete Experience?</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Are you sure you want to delete <span className="font-semibold text-foreground">{experience.position}</span> at {experience.company}? This action cannot be undone.
                </p>

                <div className="flex justify-center gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-muted transition">Cancel</button>
                    <button onClick={handleDelete} disabled={loading} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50">
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
