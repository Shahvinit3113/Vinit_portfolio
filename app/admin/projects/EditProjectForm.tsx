"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import type { Project } from "@/types/project";

interface EditProps {
  project: Project;
  onClose: () => void;
  onUpdated: (p: Project) => void;
}

export default function EditProjectForm({ project, onClose, onUpdated }: EditProps) {
  const [title, setTitle] = useState(project.title);
  const [desc, setDesc] = useState(project.description);
  const [tags, setTags] = useState(project.tags.join(", "));
  const [image, setImage] = useState(project.image);
  const [stats, setStats] = useState(project.stats ?? "");
  const [github, setGithub] = useState(project.links.github ?? "");
  const [live, setLive] = useState(project.links.live ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ⭐ featured: convert 1/0 to boolean
  const [featured, setFeatured] = useState(project.featured === 1 || project.featured === true);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "projects");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setImage(data.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const update = async () => {
    const formattedTags = tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    await axios.put(`/api/admin/projects/${project.id}`, {
      title,
      description: desc,
      image,
      stats,
      featured, // ⭐ include featured
      tags: formattedTags,
      github,
      live
    });

    onUpdated({
      id: project.id,
      title,
      description: desc,
      image,
      stats,
      featured,
      tags: formattedTags,
      links: { github, live }
    });
  };

  const isImageUrl = image && (image.startsWith("http") || image.startsWith("data:"));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-card/90 p-6 rounded-2xl shadow-xl border border-border/50 w-full max-w-xl space-y-5 relative animate-scaleIn max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          {isImageUrl ? (
            <img src={image} alt="Preview" className="w-20 h-20 rounded-xl object-cover mx-auto border border-border" />
          ) : (
            <div className="text-5xl">{image || "📁"}</div>
          )}
          <h3 className="text-2xl font-bold">Edit Project</h3>
          <p className="text-sm text-muted-foreground">
            Update the project details and save your changes.
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Input label="Project Title" value={title} setValue={setTitle} />
          <TextArea label="Description" value={desc} setValue={setDesc} />
          <Input label="Tags (comma separated)" value={tags} setValue={setTags} />

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon size={16} /> Project Image
            </label>
            <div className="flex items-center gap-4">
              {isImageUrl && (
                <img src={image} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-border" />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium flex items-center gap-2 hover:bg-secondary/80 transition disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Or paste image URL / emoji"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition text-sm"
            />
          </div>

          <Input label="Stats" value={stats} setValue={setStats} />
          <Input label="GitHub URL" value={github} setValue={setGithub} />
          <Input label="Live Demo URL" value={live} setValue={setLive} />

          {/* ⭐ Featured Toggle */}
          <div className="flex items-center justify-between pt-3">
            <span className="font-medium">Featured Project</span>

            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`w-12 h-6 rounded-full relative transition ${featured ? "bg-primary" : "bg-muted"
                }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${featured ? "right-0.5" : "left-0.5"
                  }`}
              />
            </button>
          </div>
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
            onClick={update}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


/***********************
  Reusable Components
***********************/

function Input({ label, value, setValue, placeholder }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background 
          focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function TextArea({ label, value, setValue, placeholder }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background 
          min-h-[90px] focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
