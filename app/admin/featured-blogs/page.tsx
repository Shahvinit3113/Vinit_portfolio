"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Plus, Trash2, RefreshCw } from "lucide-react";

export default function FeaturedBlogsPage() {
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [featuredSlugs, setFeaturedSlugs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const [postsRes, featuredRes] = await Promise.all([
                axios.get("/api/admin/hashnode-posts"),
                axios.get("/api/admin/featured-blogs")
            ]);
            setAllPosts(postsRes.data);
            setFeaturedSlugs(featuredRes.data.map((f: any) => f.slug));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const toggleFeatured = async (slug: string) => {
        const isFeatured = featuredSlugs.includes(slug);
        try {
            if (isFeatured) {
                await axios.delete(`/api/admin/featured-blogs?slug=${slug}`);
                setFeaturedSlugs(featuredSlugs.filter(s => s !== slug));
            } else {
                await axios.post("/api/admin/featured-blogs", { slug });
                setFeaturedSlugs([...featuredSlugs, slug]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <Star className="text-primary" /> Featured Blogs
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Select which Hashnode blogs appear on homepage.
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition disabled:opacity-50"
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Featured count */}
            <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    {featuredSlugs.length} featured
                </span>
                <span className="text-muted-foreground">
                    of {allPosts.length} total posts
                </span>
            </div>

            {/* Posts List */}
            <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-border/50">
                    {allPosts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Star className="mx-auto mb-3 opacity-50" size={32} />
                            No posts found. Check your Hashnode username.
                        </div>
                    ) : (
                        allPosts.map((post) => {
                            const isFeatured = featuredSlugs.includes(post.slug);
                            return (
                                <div
                                    key={post.id}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 transition ${isFeatured
                                        ? 'bg-primary/5'
                                        : 'hover:bg-muted/30'
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold line-clamp-1">{post.title}</div>
                                        <div className="text-sm text-muted-foreground">{post.date} • {post.readTime}</div>
                                    </div>
                                    <button
                                        onClick={() => toggleFeatured(post.slug)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition w-full sm:w-auto ${isFeatured
                                            ? 'bg-primary text-primary-foreground hover:opacity-90'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                            }`}
                                    >
                                        <Star size={16} fill={isFeatured ? 'currentColor' : 'none'} />
                                        {isFeatured ? 'Featured' : 'Add to Featured'}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
