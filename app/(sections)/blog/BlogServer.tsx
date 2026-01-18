import { getHashnodePosts } from "@/lib/hashnode";
import { db } from "@/server/db";
import BlogClient from "./BlogClient";

export default async function BlogServer() {
    const posts = await getHashnodePosts();
    const [featuredRows] = await db.query<any[]>("SELECT slug FROM featured_blogs");
    const featuredSlugs = featuredRows.map((r) => r.slug);

    // Filter to only show featured posts on homepage
    const featuredPosts = posts.filter((p: any) => featuredSlugs.includes(p.slug));

    return <BlogClient posts={featuredPosts} showViewAll={true} />;
}
