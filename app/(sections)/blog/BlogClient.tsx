import Link from 'next/link'
import { Calendar, User, ArrowRight, ExternalLink, Layers } from 'lucide-react'

export default function BlogClient({ posts, showViewAll = false, hideHeader = false }: { posts: any[], showViewAll?: boolean, hideHeader?: boolean }) {
    // If there are no posts on the home page (where showViewAll is true), don't render the section at all.
    if (showViewAll && (!posts || posts.length === 0)) {
        return null;
    }

    return (
        <section id="blog" className={showViewAll ? "py-24 md:py-32" : "py-8"}>
            <div className="max-w-6xl mx-auto px-6">
                {!hideHeader && (
                    <div className="text-center mb-16 fade-in-up">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            {showViewAll ? 'Featured Articles' : 'All Articles'}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Sharing insights and tutorials from my Dev.to blog
                        </p>
                    </div>
                )}

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
                        {posts.map((item, index) => {
                            if (item.type === 'single') {
                                const post = item.post;
                                if (!post) return null;
                                return (
                                    <Link
                                        key={post.id || index}
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
                                );
                            } else if (item.type === 'series') {
                                const firstPost = item.posts[0];
                                if (!firstPost) return null;
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/series/${item.id}`}
                                        className="group relative flex flex-col h-full fade-in-up"
                                        style={{ animationDelay: `${index * 100 + 200}ms` }}
                                    >
                                        {/* Stack background cards */}
                                        <div className="absolute inset-0 bg-card/20 border border-border/30 rounded-xl transform translate-y-3 translate-x-3 transition-transform group-hover:translate-y-4 group-hover:translate-x-4"></div>
                                        <div className="absolute inset-0 bg-card/30 border border-border/40 rounded-xl transform translate-y-1.5 translate-x-1.5 transition-transform group-hover:translate-y-2 group-hover:translate-x-2"></div>
                                        
                                        {/* Main card */}
                                        <div className="relative z-10 flex flex-col h-full p-5 rounded-xl border border-primary/40 bg-card/80 backdrop-blur-md hover:bg-card/90 transition-all duration-500 shadow-sm hover:shadow-primary/10">
                                            <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                                <Layers size={12} /> Series
                                            </div>
                                            
                                            <div className="text-primary font-semibold text-sm mb-3 pb-3 border-b border-border/50 flex items-center gap-2">
                                                <Layers size={16} />
                                                {item.title}
                                                <span className="ml-auto text-xs opacity-80 font-normal">{item.posts.length} Parts</span>
                                            </div>

                                            {firstPost.image && (
                                                <div className="w-full h-40 mb-4 overflow-hidden rounded-lg">
                                                    <img
                                                        src={firstPost.image}
                                                        alt={firstPost.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            )}

                                            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {firstPost.title}
                                            </h2>
                                            
                                            <p className="text-muted-foreground mb-4 flex-grow line-clamp-2 text-sm leading-relaxed">
                                                {firstPost.excerpt}
                                            </p>

                                            <div className="mt-auto pt-4 flex items-center justify-between text-primary font-medium text-sm border-t border-border/30">
                                                <span>Part 1 of {item.posts.length}</span>
                                                <span className="flex items-center group-hover:translate-x-1 transition-transform">
                                                    Start Reading <ArrowRight size={14} className="ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }
                            return null;
                        })}
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
