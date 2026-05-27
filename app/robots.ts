
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://vinit.me'; // Replace with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'], // Disallow API and Admin routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
