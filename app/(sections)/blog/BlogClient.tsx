
import Link from 'next/link'
import { Calendar, User, ArrowRight, ExternalLink } from 'lucide-react'

export default function BlogClient({ posts, showViewAll = false }: { posts: any[], showViewAll?: boolean }) {
    // If there are no posts on the home page (where showViewAll is true), don't render the section at all.
    if (showViewAll && (!posts || posts.length === 0)) {
        return null;
    }

    // If there are no posts, we still want to render the section so the navigation anchor works,
    // and provide a link to the main blogs page.

    return (
        <section id="blog" className={showViewAll ? "py-24 md:py-32" : "py-8"}>
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 fade-in-up">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                        {showViewAll ? 'Featured Articles' : 'All Articles'}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Sharing insights and tutorials from my Dev.to blog
                    </p>
                </div>

                {/* Blog Grid or Empty State */}
                {!posts || posts.length === 0 ? (
                    <div className="text-center py-12 bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl mb-12 fade-in-up">
                        <p className="text-muted-foreground mb-6">There are no featured blogs at the moment.</p>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-colors font-medium"
                        >
                            View All Articles <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {posts.map((post, index) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col h-full p-5 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-card/60 transition-all duration-500 bg-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 fade-in-up"
                                style={{ animationDelay: `${index * 100 + 200}ms` }}
                            >
                                {post.image && (
                                    <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar size={12} />
                                        {post.date}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                                        {post.readTime}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-muted-foreground mb-4 flex-grow line-clamp-3 text-sm leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                    Read Article <ArrowRight size={14} className="ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* View All Buttons */}
                {showViewAll && posts && posts.length > 0 && (
                    <div className="text-center fade-in-up flex flex-wrap justify-center gap-4" style={{ animationDelay: '600ms' }}>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-colors font-medium"
                        >
                            View All Articles <ArrowRight size={16} />
                        </Link>
                        <a
                            href="https://dev.to/vinitshah"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition shadow-sm"
                        >
                            View on Dev.to <ExternalLink size={16} />
                        </a>
                    </div>
                )}
            </div>
        </section>
    )
}
