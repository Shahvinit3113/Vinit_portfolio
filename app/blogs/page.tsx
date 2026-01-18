import { getHashnodePosts } from "@/lib/hashnode";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import BlogClient from "../(sections)/blog/BlogClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AllBlogsPage() {
    const posts = await getHashnodePosts();

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-8">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
                <BlogClient posts={posts} showViewAll={false} />
            </main>
            <Footer />
        </>
    );
}
