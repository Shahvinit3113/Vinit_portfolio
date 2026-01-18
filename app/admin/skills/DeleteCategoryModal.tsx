// app/skills/DeleteCategoryModal.tsx
"use client";
import axios from "axios";
import { X, Trash2 } from "lucide-react";

export default function DeleteCategoryModal({ category, onClose, onDeleted }: any) {
  const handleDelete = async () => {
    // backend should remove related skill_items (or you can cascade)
    await axios.delete(`/api/admin/skill-categories/${category.id}`);
    onDeleted(category.id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"><X size={18} /></button>
        <div className="text-center">
          <div className="text-5xl mb-2">{category.icon}</div>
          <h3 className="text-2xl font-bold text-red-500 flex justify-center items-center gap-2"><Trash2 size={22}/> Delete Category</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Deleting this category will also remove all skills inside it.
          </p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  );
}
