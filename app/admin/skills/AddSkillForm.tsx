"use client";

import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import type { SkillCategory } from "@/types/skills";

export default function AddSkillForm({
  category,
  onClose,
  onAdded
}: {
  category: SkillCategory;
  onClose: () => void;
  onAdded: (skill: any) => void;
}) {

  const [name, setName] = useState("");
  const [level, setLevel] = useState(80);

  const submit = async () => {
    const payload = {
      category_id: String(category.id),   // 🔥 FIX: FORCE STRING!
      name,
      level
    };

    const res = await axios.post("/api/admin/skill-items", payload);

    if (res.data.success) {
      onAdded(res.data.skill);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-2xl font-bold mb-4">
          Add Skill to {category.category}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Skill Name</label>
            <input
              className="w-full px-4 py-2 rounded-lg border"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Level (%)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={level}
              onChange={e => setLevel(Number(e.target.value))}
            />
            <div className="text-sm mt-1">{level}%</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-primary text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
