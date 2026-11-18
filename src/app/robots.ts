import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://krishibazar-app.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/marketplace', '/about', '/contact', '/products/*'],
        disallow: ['/admin/*', '/farmer/dashboard/*', '/buyer/dashboard/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
