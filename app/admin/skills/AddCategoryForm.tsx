// app/skills/AddCategoryForm.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { X, Plus } from "lucide-react";
import * as Lucide from "lucide-react";

const ICON_NAMES = ["Palette","Database","Code2","Zap","Globe","Feather","Package"] as const;

export default function AddCategoryForm({ onAdded }: any) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [icon, setIcon] = useState<string>("Palette");
  const reset = () => { setCategory(""); setIcon("Palette"); };

  const submit = async () => {
    const res = await axios.post("/api/admin/skill-categories", { category, icon });
    if (res.data?.success) {
      onAdded(res.data.category);
      reset();
      setOpen(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90">
        + Add Category
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-md relative">
            <button onClick={() => { reset(); setOpen(false); }} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"><X size={18} /></button>
            <h3 className="text-2xl font-bold mb-4">Add Category</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <input className="w-full px-4 py-2 rounded-lg border" value={category} onChange={e=>setCategory(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Icon</label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {ICON_NAMES.map(name => {
                    const Icon = (Lucide as any)[name];
                    return (
                      <button key={name} onClick={() => setIcon(name)} type="button"
                        className={`p-2 rounded-md border ${icon===name? "border-primary bg-primary/10": "border-border/30"}`}>
                        <div className="flex items-center gap-2">
                          <Icon size={18} />
                          <span className="text-xs">{name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { reset(); setOpen(false); }} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={submit} className="px-4 py-2 rounded-lg bg-primary text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
