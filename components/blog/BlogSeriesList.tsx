
import Link from 'next/link'
import { Calendar, ArrowRight, Layers } from 'lucide-react'

interface Post {
    id: string;
    title: string;
    slug: string;
    image: string;
    date: string;
    readTime: string;
    excerpt: string;
    series: {
        id: string;
        name: string;
        slug: string;
    } | null;
}

interface BlogSeriesListProps {
    posts: Post[];
}

export default function BlogSeriesList({ posts }: BlogSeriesListProps) {
    // Group posts by series
    const groupedPosts: Record<string, Post[]> = {};
    const otherPosts: Post[] = [];

    posts.forEach(post => {
        if (post.series) {
            if (!groupedPosts[post.series.name]) {
                groupedPosts[post.series.name] = [];
            }
            groupedPosts[post.series.name].push(post);
        } else {
            otherPosts.push(post);
        }
    });

    return (
        <div className="space-y-16">
            {/* Series Sections */}
            {Object.entries(groupedPosts).map(([seriesName, seriesPosts]) => (
                <section key={seriesName} className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <Layers className="text-primary" size={24} />
                        <h2 className="text-2xl md:text-3xl font-bold">{seriesName}</h2>
                        <span className="text-sm font-normal text-muted-foreground px-3 py-1 bg-secondary rounded-full">
                            {seriesPosts.length} Articles
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seriesPosts.map(post => <BlogCard key={post.id} post={post} />)}
                    </div>
                </section>
            ))}

            {/* Other Posts */}
            {otherPosts.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">#</div>
                        <h2 className="text-2xl md:text-3xl font-bold">Other Articles</h2>
                        <span className="text-sm font-normal text-muted-foreground px-3 py-1 bg-secondary rounded-full">
                            {otherPosts.length} Articles
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherPosts.map(post => <BlogCard key={post.id} post={post} />)}
                    </div>
                </section>
            )}
        </div>
    );
}

function BlogCard({ post }: { post: Post }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col h-full p-5 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-card/60 transition-all duration-500 bg-card/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5"
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

            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
            </h3>

            <p className="text-muted-foreground mb-4 flex-grow line-clamp-3 text-sm leading-relaxed">
                {post.excerpt}
            </p>

            <div className="mt-auto pt-4 flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight size={14} className="ml-1" />
            </div>
        </Link>
    );
}

