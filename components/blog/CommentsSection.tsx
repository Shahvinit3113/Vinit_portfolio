"use client";

import { useState } from "react";
import { MessageCircle, ExternalLink, Heart, Send, User, Mail } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    dateAdded: string;
    totalReactions: number;
    replies: Comment[];
    isLocal?: boolean;
}

interface CommentsSectionProps {
    comments: Comment[];
    dbComments?: Comment[];
    postUrl: string;
    responseCount: number;
    slug: string;
}

function CommentCard({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    return (
        <div className={`${isReply ? 'ml-8 md:ml-12 mt-4' : ''}`}>
            <div className={`bg-card border border-border/50 rounded-xl p-4 ${isReply ? 'bg-muted/30' : ''} ${comment.isLocal ? 'border-primary/30' : ''}`}>
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                    {comment.author.avatar ? (
                        <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {comment.author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{comment.author.name}</p>
                            {comment.isLocal && (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">New</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {new Date(comment.dateAdded).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                />

                {/* Reactions */}
                {comment.totalReactions > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 text-muted-foreground text-xs">
                        <Heart size={12} className="text-red-400" />
                        <span>{comment.totalReactions}</span>
                    </div>
                )}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-3 mt-3">
                    {comment.replies.map((reply) => (
                        <CommentCard key={reply.id} comment={reply} isReply />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentsSection({ comments, dbComments = [], postUrl, responseCount, slug }: CommentsSectionProps) {
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/blog/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, name, email, content }),
            });

            if (res.ok) {
                const newComment: Comment = {
                    id: Date.now().toString(),
                    content: `<p>${content}</p>`,
                    author: { name, avatar: "" },
                    dateAdded: new Date().toISOString(),
                    totalReactions: 0,
                    replies: [],
                    isLocal: true,
                };
                setLocalComments([newComment, ...localComments]);
                setName("");
                setEmail("");
                setContent("");
                setShowForm(false);
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const allComments = [...localComments, ...dbComments, ...comments];

    return (
        <section className="mt-12 pt-8 border-t border-border/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageCircle className="text-primary" size={24} />
                    Comments
                    {(responseCount + localComments.length + dbComments.length) > 0 && (
                        <span className="text-base font-normal text-muted-foreground">
                            ({responseCount + localComments.length + dbComments.length})
                        </span>
                    )}
                </h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                        <MessageCircle size={18} />
                        {showForm ? 'Cancel' : 'Add Comment'}
                    </button>
                    <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-muted-foreground rounded-xl font-medium hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                        <ExternalLink size={16} />
                        Hashnode
                    </a>
                </div>
            </div>

            {/* Success Message */}
            {submitted && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 text-sm">
                    ✓ Comment submitted! It will appear after approval.
                </div>
            )}

            {/* Comment Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 p-6 bg-card border border-border/50 rounded-xl space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Leave a comment</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <User size={14} className="inline mr-1" /> Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                required
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                <Mail size={14} className="inline mr-1" /> Email (optional)
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Comment *</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts..."
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-muted-foreground hover:text-foreground transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !name.trim() || !content.trim()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                        >
                            <Send size={16} />
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            )}

            {/* Comments List */}
            {allComments.length > 0 ? (
                <div className="space-y-4">
                    {allComments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-card border border-border/50 rounded-xl">
                    <MessageCircle className="mx-auto mb-3 text-muted-foreground/50" size={40} />
                    <p className="text-muted-foreground mb-4">No comments yet. Be the first to share your thoughts!</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition"
                    >
                        <MessageCircle size={16} />
                        Add a comment
                    </button>
                </div>
            )}
        </section>
    );
}
