"use client";

import { useState } from "react";
import axios from "axios";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactClient() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;

        setLoading(true);
        setStatus("idle");

        try {
            const res = await axios.post("/api/contact", { name, email, message });
            if (res.data.success) {
                setStatus("success");
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 md:py-32 relative overflow-hidden bg-primary/5">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4 fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get in Touch</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Have a project in mind or just want to say hi? I'd love to hear from you.
                    </p>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm fade-in-up" style={{ animationDelay: "200ms" }}>
                    {status === "success" ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-2xl font-bold">Message Sent!</h3>
                            <p className="text-muted-foreground">Thanks for reaching out. I'll get back to you soon.</p>
                            <button
                                onClick={() => setStatus("idle")}
                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition h-32 resize-none"
                                    placeholder="Tell me about your project..."
                                    required
                                />
                            </div>

                            {status === "error" && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-lg text-sm">
                                    <AlertCircle size={16} />
                                    <span>Something went wrong. Please try again.</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send Message <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
