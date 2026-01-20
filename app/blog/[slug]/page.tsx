
import { getHashnodePost, getHashnodeComments } from "@/lib/hashnode";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/components/blog/LikeButton";
import CommentsSection from "@/components/blog/CommentsSection";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getHashnodePost(slug);

    if (!post) {
        notFound();
    }

    // Fetch comments using the post ID
    const comments = await getHashnodeComments(post.id);

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-8">
                <article className="max-w-5xl mx-auto px-6">

                    {/* Back Button */}
                    <Link
                        href="/#blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    {/* Header */}
                    <header className="mb-6 text-center">
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {post.readTimeInMinutes} min read
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight">
                            {post.title}
                        </h1>

                        {post.subtitle && (
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {post.subtitle}
                            </p>
                        )}

                        {post.coverImage?.url && (
                            <div className="mt-4 rounded-xl overflow-hidden shadow-lg border border-border/50">
                                <img
                                    src={post.coverImage.url}
                                    alt={post.title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}
                    </header>

                    {/* Author & Like Section */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-b border-border py-4 mb-6">
                        <div className="flex items-center gap-3">
                            {post.author.profilePicture && (
                                <img
                                    src={post.author.profilePicture}
                                    alt={post.author.name}
                                    className="w-10 h-10 rounded-full"
                                />
                            )}
                            <div className="text-left">
                                <p className="font-semibold text-sm">{post.author.name}</p>
                                <p className="text-xs text-muted-foreground">Author</p>
                            </div>
                        </div>

                        <LikeButton
                            reactionCount={post.reactionCount || 0}
                            postUrl={post.url}
                            slug={slug}
                        />
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content.html }}
                    />

                    {/* Comments Section */}
                    <CommentsSection
                        comments={comments}
                        postUrl={post.url}
                        responseCount={post.responseCount || 0}
                        slug={slug}
                    />

                </article>
            </main>
            <Footer />
        </>
    );
}

