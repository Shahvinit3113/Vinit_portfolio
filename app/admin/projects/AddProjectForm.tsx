"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

export default function AddProjectForm({ onAdded }: any) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [stats, setStats] = useState("");
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const submit = async () => {
    const res = await axios.post("/api/admin/projects", {
      title,
      description: desc,
      image,
      stats,
      featured,
      tags: tags.split(",").map((t: string) => t.trim()),
      github,
      live,
    });

    if (res.data.success) {
      onAdded({
        id: res.data.id,
        title,
        description: desc,
        image,
        stats,
        featured,
        tags: tags.split(",").map((t: string) => t.trim()),
        links: { github, live },
      });

      setOpen(false);
      reset();
    }
  };

  const reset = () => {
    setTitle("");
    setDesc("");
    setTags("");
    setImage("");
    setStats("");
    setGithub("");
    setLive("");
    setFeatured(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
      >
        + Add Project
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-2xl shadow-xl border border-border/50 w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-2xl font-bold mb-6">Add Project</h3>

            <div className="space-y-4">
              <Input label="Project Title" value={title} setValue={setTitle} />
              <TextArea label="Description" value={desc} setValue={setDesc} />
              <Input
                label="Tags (comma separated)"
                value={tags}
                setValue={setTags}
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ImageIcon size={16} /> Project Image
                </label>
                <div className="flex items-center gap-4">
                  {image && (
                    <img src={image} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-border" />
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
                  placeholder="Or paste image URL"
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

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/***********************
  Reusable Inputs
***********************/

function Input({ label, value, setValue }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function TextArea({ label, value, setValue }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        className="w-full px-4 py-2 rounded-lg border border-border/40 bg-background min-h-[90px] focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
