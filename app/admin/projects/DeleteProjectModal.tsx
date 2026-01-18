// DeleteProjectModal.tsx
"use client";

import axios from "axios";
import { X, Trash2 } from "lucide-react";
import type { Project } from "@/types/project";

interface DeleteProps {
  project: Project;
  onClose: () => void;
    onDeleted: (id: string) => void; 
}

export default function DeleteProjectModal({ project, onClose, onDeleted }: DeleteProps) {
  const handleDelete = async () => {
    await axios.delete(`/api/admin/projects/${project.id}`);
    onDeleted(project.id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-card/90 p-6 rounded-2xl shadow-xl border border-border/50 w-full max-w-md space-y-6 relative animate-scaleIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-5xl">{project.image}</div>
          <h3 className="text-2xl font-bold text-red-500 flex justify-center items-center gap-2">
            <Trash2 size={22} /> Delete Project
          </h3>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to permanently delete this project?  
            This action cannot be undone.
          </p>
        </div>

        {/* Project Preview */}
        <div className="p-4 bg-muted/40 rounded-lg border border-border/40">
          <p className="font-medium">{project.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {project.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
