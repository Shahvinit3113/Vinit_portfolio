"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Settings, Save, Github, Linkedin, Mail, Instagram, ExternalLink, User, FileText, Image as ImageIcon, Info, Briefcase, Upload, Loader2 } from "lucide-react";

// Profile Info Section
const PROFILE_FIELDS = [
    { key: "name", label: "Your Name", icon: User, placeholder: "Alex Dev" },
    { key: "title", label: "Job Title", icon: Briefcase, placeholder: "Full Stack Developer" },
    { key: "bio", label: "Short Bio", icon: Info, placeholder: "A brief description about yourself...", isTextarea: true },
];

// Social Links Section
const SOCIAL_FIELDS = [
    { key: "github", label: "GitHub URL", icon: Github, placeholder: "https://github.com/username" },
    { key: "linkedin", label: "LinkedIn URL", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
    { key: "email", label: "Email Address", icon: Mail, placeholder: "hello@example.com" },
    { key: "instagram", label: "Instagram URL", icon: Instagram, placeholder: "https://instagram.com/username" },
    { key: "devto", label: "Dev.to URL", icon: ExternalLink, placeholder: "https://dev.to/username" },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get("/api/admin/settings");
            setSettings(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings({ ...settings, [key]: value });
    };

    // Direct upload using API route
    const uploadToCloudinary = async (file: File, folder: string): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
                console.error("Cloudinary error:", data.error);
                throw new Error(data.error || "Upload failed");
            }

            return data.url;
        } catch (error: any) {
            console.error("Upload error:", error);
            throw error;
        }
    };

    const handleUpload = async (file: File, key: string, setUploading: (v: boolean) => void, folder: string) => {
        setUploading(true);
        setMessage("");
        try {
            const url = await uploadToCloudinary(file, folder);
            if (url) {
                handleChange(key, url);
                setMessage(`${key === "user_image" ? "Image" : "Resume"} uploaded successfully!`);
            }
        } catch (error: any) {
            setMessage(error.message || "Upload failed. Make sure you have configured Cloudinary correctly in .env.local.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            await axios.post("/api/admin/settings", settings);
            setMessage("Settings saved successfully!");
        } catch (error) {
            setMessage("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    <Settings className="text-primary" /> Profile Settings
                </h2>
                <p className="text-muted-foreground mt-1">
                    Manage your profile information and social links.
                </p>
            </div>

            {/* Profile Section */}
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold border-b border-border pb-3">Profile Information</h3>

                {PROFILE_FIELDS.map((field) => {
                    const Icon = field.icon;
                    return (
                        <div key={field.key}>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Icon size={16} /> {field.label}
                            </label>
                            {field.isTextarea ? (
                                <textarea
                                    value={settings[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={settings[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                />
                            )}
                        </div>
                    );
                })}

                {/* Profile Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <ImageIcon size={16} /> Profile Image
                    </label>
                    <div className="flex items-center gap-4">
                        {settings.user_image && (
                            <img src={settings.user_image} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                        )}
                        <div className="flex-1 space-y-2">
                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpload(file, "user_image", setUploadingImage, "profile");
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium flex items-center gap-2 hover:bg-secondary/80 transition disabled:opacity-50"
                            >
                                {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {uploadingImage ? "Uploading..." : "Upload Image"}
                            </button>
                            <input
                                type="text"
                                placeholder="Or paste image URL"
                                value={settings.user_image || ""}
                                onChange={(e) => handleChange("user_image", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Resume Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText size={16} /> Resume (PDF)
                    </label>
                    <div className="space-y-2">
                        {settings.resume_url && (
                            <a href={settings.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
                                View Current Resume
                            </a>
                        )}
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                ref={resumeInputRef}
                                accept=".pdf,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUpload(file, "resume_url", setUploadingResume, "resumes");
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => resumeInputRef.current?.click()}
                                disabled={uploadingResume}
                                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium flex items-center gap-2 hover:bg-secondary/80 transition disabled:opacity-50"
                            >
                                {uploadingResume ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {uploadingResume ? "Uploading..." : "Upload Resume"}
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Or paste resume URL"
                            value={settings.resume_url || ""}
                            onChange={(e) => handleChange("resume_url", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Social Links Section */}
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold border-b border-border pb-3">Social Links</h3>
                {SOCIAL_FIELDS.map((field) => {
                    const Icon = field.icon;
                    return (
                        <div key={field.key}>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Icon size={16} /> {field.label}
                            </label>
                            <input
                                type="text"
                                value={settings[field.key] || ""}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            />
                        </div>
                    );
                })}
            </div>

            {message && (
                <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
            >
                <Save size={18} />
                {saving ? "Saving..." : "Save Settings"}
            </button>
        </div>
    );
}
