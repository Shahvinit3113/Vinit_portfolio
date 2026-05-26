
import { MetadataRoute } from 'next';
import { getDevtoPosts } from '@/lib/devto';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Base URL
    const baseUrl = 'vinit-portfolio-b59bz81g3-shah-vinits-projects.vercel.app'; // Replace with actual domain if different

    // Static routes
    const routes = [
        '',
        '/blogs',
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
    const posts = await getDevtoPosts();

    const blogRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date().toISOString(), // Ideal to use post.publishedAt or updated date if available
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...blogRoutes];
}
