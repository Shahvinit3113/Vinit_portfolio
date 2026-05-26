import { getDevtoPosts } from "@/lib/devto";
import { db } from "@/server/db";
import BlogClient from "./BlogClient";

export default async function BlogServer() {
    try {
        const posts = await getDevtoPosts();
        const [featuredRows] = await db.query<any[]>("SELECT slug FROM featured_blogs");
        const featuredSlugs = featuredRows.map((r) => r.slug);

        // Filter to only show featured posts on homepage
        const featuredPosts = posts.filter((p: any) => featuredSlugs.includes(p.slug));

        return <BlogClient posts={featuredPosts} showViewAll={true} />;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return <BlogClient posts={[]} showViewAll={true} />;
    }
}
