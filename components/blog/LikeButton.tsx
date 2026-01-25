"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";

interface LikeButtonProps {
    reactionCount: number;
    initialLocalLikes?: number;
    postUrl: string;
    slug: string;
}

export default function LikeButton({ reactionCount, initialLocalLikes = 0, postUrl, slug }: LikeButtonProps) {
    const [localLikes, setLocalLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async () => {
        if (hasLiked) return;

        setIsAnimating(true);
        setLocalLikes(prev => prev + 1);
        setHasLiked(true);

        // Store in localStorage to persist across page refreshes
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        if (!likedPosts.includes(slug)) {
            likedPosts.push(slug);
            localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
        }

        // Optional: Save to database
        try {
            await fetch('/api/blog/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
            });
        } catch (error) {
            console.error('Error saving like:', error);
        }

        setTimeout(() => setIsAnimating(false), 300);
    };

    // Check if already liked on mount
    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
        if (likedPosts.includes(slug)) {
            setHasLiked(true);
        }
    }, [slug]);

    const totalLikes = reactionCount + initialLocalLikes + localLikes;

    return (
        <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${hasLiked
                    ? 'bg-red-500/10 border-red-500/30 text-red-500'
                    : 'bg-card border-border/50 hover:border-red-500/50 hover:bg-red-500/5 text-muted-foreground hover:text-red-500'
                    }`}
            >
                <Heart
                    size={18}
                    className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : ''} ${hasLiked ? 'fill-current' : ''}`}
                />
                <span className="font-medium">{totalLikes}</span>
            </button>

            {/* React on Hashnode Link */}
            <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
                <ExternalLink size={16} />
                <span className="text-sm font-medium">React on Hashnode</span>
            </a>
        </div>
    );
}
