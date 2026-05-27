import { getDevtoPosts } from "@/lib/devto";
import { db } from "@/server/db";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import BlogClient from "@/app/(sections)/blog/BlogClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function AllBlogsPage() {
    let combinedPosts: any[] = [];
    
    try {
        const posts = await getDevtoPosts();
        
        // Fetch all custom series from the database
        const [seriesRows] = await db.query<any[]>("SELECT * FROM featured_blog_series");
        
        const seriesSlugs = new Set<string>();

        // 1. Process series and build stack items
        for (const item of seriesRows) {
            try {
                const slugs = JSON.parse(item.slugs);
                const seriesPosts = slugs.map((slug: string) => posts.find((p: any) => p.slug === slug)).filter(Boolean);
                
                if (seriesPosts.length > 0) {
                    combinedPosts.push({ type: 'series', id: item.id, title: item.title, posts: seriesPosts });
                    // Keep track of slugs that belong to a series
                    slugs.forEach((s: string) => seriesSlugs.add(s));
                }
            } catch (e) {
                console.error("Failed to parse series slugs in /blogs", e);
            }
        }

        // 2. Add remaining independent posts that aren't part of any series
        for (const post of posts) {
            if (!seriesSlugs.has(post.slug)) {
                combinedPosts.push({ type: 'single', post });
            }
        }

    } catch (error) {
        console.error("Error building blogs page data:", error);
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* We reuse the BlogClient to render the mixed grid of stacks and single posts. 
                        showViewAll={false} ensures we don't show the 'View All' buttons at the bottom. */}
                    <BlogClient posts={combinedPosts} showViewAll={false} />
                </div>
            </main>
            <Footer />
        </>
    );
}
