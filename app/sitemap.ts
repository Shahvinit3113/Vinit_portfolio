
import { MetadataRoute } from 'next';
import { getHashnodePosts } from '@/lib/hashnode';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Base URL
    const baseUrl = 'https://vinit.me'; // Replace with actual domain if different

    // Static routes
    const routes = [
        '',
        '/#projects',
        '/#blog',
        '/#contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 1,
    }));

    // Fetch dynamic blog posts
    const posts = await getHashnodePosts();

    const blogRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date().toISOString(), // Ideal to use post.publishedAt or updated date if available
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...blogRoutes];
}
