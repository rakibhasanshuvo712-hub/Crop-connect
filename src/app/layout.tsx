import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { AIAssistantWidget } from '@/components/ai/ai-assistant-modal'
import './globals.css'
import { APP_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
  description: APP_CONFIG.description,
  keywords: [
    'Bangladesh agriculture',
    'farmers marketplace',
    'buy crops',
    'sell crops',
    'krishi bazar',
    'কৃষি বাজার',
    'ধান চাল আলু পেঁয়াজ'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="min-h-screen bg-[#fcfdfc] antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
        <AIAssistantWidget />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
