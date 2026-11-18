import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://cropconnect-delta.vercel.app'

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
