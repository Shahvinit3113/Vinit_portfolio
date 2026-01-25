
import { getHashnodePost, getHashnodeComments } from "@/lib/hashnode";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Calendar, Clock, User, ArrowLeft, FolderOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/components/blog/LikeButton";
import CommentsSection from "@/components/blog/CommentsSection";
import ShareButton from "@/components/blog/ShareButton";
import { db } from "@/server/db";
import { Metadata } from "next";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

async function getLinkedProject(slug: string) {
    try {
        const [featured]: any = await db.query(
            "SELECT project_id FROM featured_blogs WHERE slug = ?",
            [slug]
        );

        if (!featured?.[0]?.project_id) return null;

        const [projects]: any = await db.query(
            "SELECT id, title, description, image FROM projects WHERE id = ?",
            [featured[0].project_id]
        );

        return projects?.[0] || null;
    } catch (error) {
        console.error("Error fetching linked project:", error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getHashnodePost(slug);

    if (!post) {
        return {
            title: "Blog Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.subtitle || post.title,
        openGraph: {
            title: post.title,
            description: post.subtitle || post.title,
            type: "article",
            publishedTime: post.publishedAt,
            authors: [post.author?.name || "Vinit Shah"],
            images: post.coverImage?.url ? [post.coverImage.url] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.subtitle || post.title,
            images: post.coverImage?.url ? [post.coverImage.url] : [],
        },
    };
}

async function getLocalLikes(slug: string) {
    try {
        const [result]: any = await db.query(
            "SELECT COUNT(*) as count FROM blog_likes WHERE post_slug = ?",
            [slug]
        );
        return result[0]?.count || 0;
    } catch (error) {
        console.error("Error fetching local likes:", error);
        return 0;
    }
}

async function getLocalComments(slug: string) {
    try {
        const [comments]: any = await db.query(
            "SELECT id, author_name, content, created_on FROM blog_comments WHERE post_slug = ? AND is_approved = 1 AND is_deleted = 0 ORDER BY created_on DESC",
            [slug]
        );
        return comments.map((c: any) => ({
            id: c.id,
            content: `<p>${c.content}</p>`,
            author: {
                name: c.author_name,
                avatar: ""
            },
            dateAdded: c.created_on.toISOString(),
            totalReactions: 0,
            replies: [],
            isLocal: true
        }));
    } catch (error) {
        console.error("Error fetching local comments:", error);
        return [];
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getHashnodePost(slug);

    if (!post) {
        notFound();
    }

    // Fetch comments and linked project
    const [comments, linkedProject, localLikes, localComments] = await Promise.all([
        getHashnodeComments(post.id),
        getLinkedProject(slug),
        getLocalLikes(slug),
        getLocalComments(slug)
    ]);

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

                        <div className="flex items-center gap-3">
                            <LikeButton
                                reactionCount={post.reactionCount || 0}
                                postUrl={post.url}
                                slug={slug}
                            />
                            <ShareButton
                                title={post.title}
                                text={post.subtitle || ""}
                                slug={slug}
                            />
                        </div>
                    </div>

                    {/* Linked Project Card */}
                    {linkedProject && (
                        <div className="mb-8 p-4 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
                                <FolderOpen size={16} />
                                <span>This blog is about</span>
                            </div>
                            <Link
                                href="/#projects"
                                className="group flex items-center gap-4 p-3 bg-card rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-300"
                            >
                                {linkedProject.image && (linkedProject.image.startsWith("http") || linkedProject.image.startsWith("data:")) ? (
                                    <img
                                        src={linkedProject.image}
                                        alt={linkedProject.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                                        {linkedProject.image || "📁"}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold group-hover:text-primary transition-colors">{linkedProject.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{linkedProject.description}</p>
                                </div>
                                <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.content.html }}
                    />

                    {/* Comments Section */}
                    <CommentsSection
                        comments={comments}
                        dbComments={localComments}
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

