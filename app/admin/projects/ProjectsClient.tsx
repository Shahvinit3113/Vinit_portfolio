"use client";

import { useState } from "react";
import axios from "axios";
import AddProjectForm from "./AddProjectForm";
import EditProjectForm from "./EditProjectForm";
import type { Project } from "@/types/project";
import { Pencil, Trash2, Github, ExternalLink } from "lucide-react";
import DeleteProjectModal from "./DeleteProjectModal";

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState<Project[]>(projects);
  const [editItem, setEditItem] = useState<Project | null>(null);

  // NEW: delete modal
  const [deleteItem, setDeleteItem] = useState<Project | null>(null);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Manage Projects</h2>
        <AddProjectForm onAdded={(p: Project) => setItems([p, ...items])} />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-xl border border-border/40 bg-card/60 shadow-sm hover:shadow-md transition-all hover:border-primary/40 group"
          >
            {/* Image/Icon */}
            <div className="mb-3 h-20 flex items-center justify-center">
              {p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? (
                <img src={p.image} alt={p.title} className="h-20 w-full object-cover rounded-lg" />
              ) : (
                <span className="text-5xl group-hover:scale-110 transition-transform">{p.image || "📁"}</span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {p.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Featured */}
            {(p.featured === 1 || p.featured === true || p.featured === '1') && (
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-600 font-semibold">
                ⭐ Featured
              </span>
            )}

            {/* Links */}
            <div className="flex items-center gap-4 mt-4 text-sm">
              {p.links.github && (
                <a
                  href={p.links.github}
                  target="_blank"
                  className="flex items-center gap-1 text-primary hover:text-accent"
                >
                  <Github size={16} /> Code
                </a>
              )}
              {p.links.live && (
                <a
                  href={p.links.live}
                  target="_blank"
                  className="flex items-center gap-1 text-primary hover:text-accent"
                >
                  <ExternalLink size={16} /> Live
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditItem(p)}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition"
              >
                <Pencil size={18} className="text-primary" />
              </button>

              {/* OPEN DELETE MODAL */}
              <button
                onClick={() => setDeleteItem(p)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editItem && (
        <EditProjectForm
          project={editItem}
          onClose={() => setEditItem(null)}
          onUpdated={(u) => {
            setItems(items.map((p) => (p.id === u.id ? u : p)));
            setEditItem(null);
          }}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteItem && (
        <DeleteProjectModal
          project={deleteItem}
          onClose={() => setDeleteItem(null)}
          onDeleted={(id) => {
            setItems(items.filter((p) => p.id !== id));
            setDeleteItem(null);
          }}
        />
      )}
    </div>
  );
}
