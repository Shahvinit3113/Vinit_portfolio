// app/skills/DeleteSkillModal.tsx
"use client";
import axios from "axios";
import { X, Trash2 } from "lucide-react";

export default function DeleteSkillModal({ skill, onClose, onDeleted }: any) {
  const handleDelete = async () => {
    await axios.delete(`/api/admin/skill-items/${skill.id}`);
    onDeleted(skill.id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"><X size={18} /></button>
        <div className="text-center">
          <div className="text-5xl mb-2">{skill.name}</div>
          <h3 className="text-2xl font-bold text-red-500 flex justify-center items-center gap-2"><Trash2 size={22}/> Delete Skill</h3>
          <p className="text-sm text-muted-foreground mt-2">This will permanently delete the skill.</p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
