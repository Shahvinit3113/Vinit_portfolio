import { getDevtoPosts } from "@/lib/devto";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import BlogSeriesList from "@/components/blog/BlogSeriesList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function AllBlogsPage() {
    const posts = await getDevtoPosts();

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

                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            All Articles
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Explore my technical writings, tutorials, and thoughts on software development.
                        </p>
                    </div>

                    <BlogSeriesList posts={posts} />
                </div>
            </main>
            <Footer />
        </>
    );
}
