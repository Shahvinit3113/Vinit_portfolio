// app/skills/EditSkillForm.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function EditSkillForm({ skill, onClose, onUpdated }: any) {
  const [name, setName] = useState(skill.name);
  const [level, setLevel] = useState<number>(skill.level);

  const submit = async () => {
    const res = await axios.put(`/api/admin/skill-items/${skill.id}`, { name, level });
    if (res.data?.success) {
      onUpdated(res.data.skill);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"><X size={18} /></button>
        <h3 className="text-2xl font-bold mb-4">Edit Skill</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Skill Name</label>
            <input className="w-full px-4 py-2 rounded-lg border" value={name} onChange={e=>setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Level (%)</label>
            <input type="range" min={0} max={100} value={level} onChange={e=>setLevel(Number(e.target.value))}/>
            <div className="text-sm mt-1">{level}%</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={submit} className="px-4 py-2 rounded-lg bg-primary text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
