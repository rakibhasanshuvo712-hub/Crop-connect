import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { AIAssistantWidget } from '@/components/ai/ai-assistant-modal'
import { LanguageProvider } from '@/context/language-context'
import './globals.css'
import { APP_CONFIG } from '@/lib/constants'

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://cropconnect-delta.vercel.app'),
  title: {
    default: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    'Bangladesh agriculture',
    'farmers marketplace',
    'buy crops',
    'sell crops',
    'krishi bazar',
    'কৃষি বাজার',
    'ধান চাল আলু পেঁয়াজ',
    'wholesale agricultural market'
  ],
  authors: [{ name: 'CropConnect Team' }],
  creator: 'CropConnect Bangladesh',
  publisher: 'CropConnect Bangladesh',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `${APP_CONFIG.name} — AI-Powered Agricultural Marketplace`,
    description: APP_CONFIG.description,
    url: 'https://cropconnect-delta.vercel.app',
    siteName: APP_CONFIG.name,
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen bg-[#fcfdfc] antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <LanguageProvider>
          {children}
          <AIAssistantWidget />
          <Toaster richColors position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  )
}
