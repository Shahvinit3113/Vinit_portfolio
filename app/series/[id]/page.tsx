import { db } from "@/server/db";
import { getDevtoPosts } from "@/lib/devto";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import BlogClient from "@/app/(sections)/blog/BlogClient";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SeriesPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    
    // Fetch series from DB
    const [seriesRows] = await db.query<any[]>("SELECT * FROM featured_blog_series WHERE id = ?", [id]);
    const series = seriesRows[0];
    
    if (!series) {
        notFound();
    }
    
    let seriesPosts: any[] = [];
    try {
        const posts = await getDevtoPosts();
        const slugs = JSON.parse(series.slugs);
        
        // Map Dev.to posts matching the slugs
        const matchedPosts = slugs.map((slug: string) => posts.find((p: any) => p.slug === slug)).filter(Boolean);
        
        // Format for BlogClient
        seriesPosts = matchedPosts.map((post: any) => ({ type: 'single', post }));
    } catch (e) {
        console.error("Failed to load series posts", e);
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft size={16} /> Back to All Articles
                    </Link>

                    <div className="text-center mb-16 fade-in-up">
                        <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                            <Layers size={16} /> Series
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            {series.title}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Part of a {seriesPosts.length}-part series exploring this topic in depth.
                        </p>
                    </div>

                    {/* Reuse BlogClient grid, hide its default header */}
                    <div className="-mt-16">
                        <BlogClient posts={seriesPosts} showViewAll={false} hideHeader={true} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
