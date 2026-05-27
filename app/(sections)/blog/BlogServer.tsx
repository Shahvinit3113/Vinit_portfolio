import { getDevtoPosts } from "@/lib/devto";
import { db } from "@/server/db";
import BlogClient from "./BlogClient";

export default async function BlogServer() {
    try {
        const posts = await getDevtoPosts();
        const [singleRows] = await db.query<any[]>("SELECT *, 'single' as type FROM featured_blogs");
        const [seriesRows] = await db.query<any[]>("SELECT *, 'series' as type FROM featured_blog_series");
        
        const allFeatured = [...singleRows, ...seriesRows];
        allFeatured.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());

        const combinedPosts = [];

        for (const item of allFeatured) {
            if (item.type === 'single') {
                const post = posts.find((p: any) => p.slug === item.slug);
                if (post) combinedPosts.push({ type: 'single', post });
            } else {
                try {
                    const slugs = JSON.parse(item.slugs);
                    const seriesPosts = slugs.map((slug: string) => posts.find((p: any) => p.slug === slug)).filter(Boolean);
                    if (seriesPosts.length > 0) {
                        combinedPosts.push({ type: 'series', id: item.id, title: item.title, posts: seriesPosts });
                    }
                } catch (e) {
                    console.error("Failed to parse series slugs", e);
                }
            }
        }

        return <BlogClient posts={combinedPosts} showViewAll={true} />;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return <BlogClient posts={[]} showViewAll={true} />;
    }
}
