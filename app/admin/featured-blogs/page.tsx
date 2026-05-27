"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star, RefreshCw, Link2, ExternalLink, Plus, Trash2, Layers } from "lucide-react";

export default function FeaturedBlogsPage() {
    const [allPosts, setAllPosts] = useState<any[]>([]);
    const [featuredItems, setFeaturedItems] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Series Modal State
    const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);
    const [seriesTitle, setSeriesTitle] = useState("");
    const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const [postsRes, featuredRes, projectsRes] = await Promise.all([
                axios.get("/api/admin/devto-posts"),
                axios.get("/api/admin/featured-blogs"),
                axios.get("/api/admin/projects")
            ]);
            setAllPosts(postsRes.data);
            
            // Parse slugs for series
            const parsedFeatured = featuredRes.data.map((item: any) => {
                if (item.type === 'series') {
                    try {
                        item.slugsArray = JSON.parse(item.slugs);
                    } catch (e) {
                        item.slugsArray = [];
                    }
                }
                return item;
            });
            setFeaturedItems(parsedFeatured);
            setProjects(projectsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const singleFeaturedSlugs = featuredItems.filter(f => f.type === 'single').map(f => f.slug);

    const toggleFeatured = async (slug: string) => {
        const isFeatured = singleFeaturedSlugs.includes(slug);
        try {
            if (isFeatured) {
                await axios.delete(`/api/admin/featured-blogs?slug=${slug}`);
                setFeaturedItems(featuredItems.filter(f => !(f.type === 'single' && f.slug === slug)));
            } else {
                const res = await axios.post("/api/admin/featured-blogs", { slug });
                setFeaturedItems([...featuredItems, { id: res.data.id, slug, project_id: null, type: 'single' }]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteSeries = async (id: string) => {
        try {
            await axios.delete(`/api/admin/featured-blogs?type=series&id=${id}`);
            setFeaturedItems(featuredItems.filter(f => f.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const updateProjectLink = async (item: any, projectId: string | null) => {
        try {
            await axios.put("/api/admin/featured-blogs", { 
                type: item.type || 'single',
                id: item.id,
                slug: item.slug, 
                project_id: projectId || null 
            });
            setFeaturedItems(featuredItems.map(f =>
                f.id === item.id ? { ...f, project_id: projectId } : f
            ));
        } catch (error) {
            console.error(error);
        }
    };

    const createSeries = async () => {
        if (!seriesTitle || selectedSlugs.length === 0) return;
        setIsSubmitting(true);
        try {
            const res = await axios.post("/api/admin/featured-blogs", {
                type: 'series',
                title: seriesTitle,
                slugs: selectedSlugs
            });
            setFeaturedItems([{
                id: res.data.id,
                title: seriesTitle,
                slugsArray: selectedSlugs,
                project_id: null,
                type: 'series'
            }, ...featuredItems]);
            setIsSeriesModalOpen(false);
            setSeriesTitle("");
            setSelectedSlugs([]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <Star className="text-primary" /> Featured Blogs & Series
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Select which Dev.to blogs appear on homepage and link to projects. Group blogs into a series.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsSeriesModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition"
                    >
                        <Plus size={18} />
                        Create Series
                    </button>
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-border/50">
                    {/* Render Series First */}
                    {featuredItems.filter(i => i.type === 'series').map((series) => (
                        <div key={series.id} className="p-4 bg-primary/10 transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-lg flex items-center gap-2">
                                        <Layers className="text-primary" size={18} />
                                        {series.title}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Series containing {series.slugsArray?.length || 0} blogs
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                        {series.slugsArray?.join(", ")}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteSeries(series.id)}
                                    className="flex-shrink-0 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition bg-destructive/10 text-destructive hover:bg-destructive/20"
                                >
                                    <Trash2 size={16} />
                                    Delete Series
                                </button>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-border/30">
                                <div className="flex items-center gap-3">
                                    <Link2 size={16} className="text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Link to project:</span>
                                    <select
                                        value={series.project_id || ""}
                                        onChange={(e) => updateProjectLink(series, e.target.value)}
                                        className="flex-1 max-w-xs px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        <option value="">No project linked</option>
                                        {projects.map((project: any) => (
                                            <option key={project.id} value={project.id}>
                                                {project.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Render Independent Blogs */}
                    {allPosts.length === 0 && featuredItems.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Star className="mx-auto mb-3 opacity-50" size={32} />
                            No posts found. Check your Dev.to username.
                        </div>
                    ) : (
                        [
                            ...allPosts,
                            ...featuredItems
                                .filter((f: any) => f.type === 'single' && !allPosts.some(p => p.slug === f.slug))
                                .map((f: any) => ({
                                    id: f.id,
                                    slug: f.slug,
                                    title: f.slug, // Fallback
                                    date: "Unknown Date",
                                    readTime: "Dev.to API fetch failed",
                                }))
                        ].map((post) => {
                            const isFeatured = singleFeaturedSlugs.includes(post.slug);
                            const featuredItem = featuredItems.find(f => f.type === 'single' && f.slug === post.slug);
                            return (
                                <div
                                    key={post.id || post.slug}
                                    className={`p-4 transition ${isFeatured ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold line-clamp-1 flex items-center gap-2">
                                                {post.title}
                                                {post.url && (
                                                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="View on Dev.to">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
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

                                    {/* Project Link Selector */}
                                    {isFeatured && featuredItem && (
                                        <div className="mt-3 pt-3 border-t border-border/30">
                                            <div className="flex items-center gap-3">
                                                <Link2 size={16} className="text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Link to project:</span>
                                                <select
                                                    value={featuredItem.project_id || ""}
                                                    onChange={(e) => updateProjectLink(featuredItem, e.target.value)}
                                                    className="flex-1 max-w-xs px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                >
                                                    <option value="">No project linked</option>
                                                    {projects.map((project: any) => (
                                                        <option key={project.id} value={project.id}>
                                                            {project.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Series Creation Modal */}
            {isSeriesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border/50">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Layers className="text-primary" /> Create Blog Series
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Group multiple blogs together.</p>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Series Title</label>
                                <input
                                    type="text"
                                    value={seriesTitle}
                                    onChange={(e) => setSeriesTitle(e.target.value)}
                                    placeholder="e.g. Master React in 10 Days"
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Blogs ({selectedSlugs.length} selected)</label>
                                <div className="space-y-2 border border-border rounded-xl p-2 max-h-64 overflow-y-auto bg-background/50">
                                    {allPosts.map((post) => (
                                        <label key={post.slug} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedSlugs.includes(post.slug)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedSlugs([...selectedSlugs, post.slug]);
                                                    else setSelectedSlugs(selectedSlugs.filter(s => s !== post.slug));
                                                }}
                                                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium line-clamp-1">{post.title}</div>
                                                <div className="text-xs text-muted-foreground">{post.date}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/20">
                            <button
                                onClick={() => setIsSeriesModalOpen(false)}
                                className="px-4 py-2 rounded-xl font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createSeries}
                                disabled={isSubmitting || !seriesTitle || selectedSlugs.length === 0}
                                className="px-4 py-2 rounded-xl font-medium bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Series'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
