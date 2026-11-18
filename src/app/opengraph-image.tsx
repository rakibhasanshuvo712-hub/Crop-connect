import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'CropConnect - AI Agricultural Marketplace Bangladesh'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '12px 28px',
            borderRadius: '9999px',
            marginBottom: '24px',
            fontSize: '22px',
            fontWeight: 700,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <span>CropConnect Bangladesh</span>
          <span>|</span>
          <span>AI-Powered Agri-Commerce</span>
        </div>

        <h1
          style={{
            fontSize: '64px',
            fontWeight: 900,
            textAlign: 'center',
            margin: '0 0 20px 0',
            lineHeight: 1.15,
          }}
        >
          CropConnect
        </h1>

        <p
          style={{
            fontSize: '26px',
            textAlign: 'center',
            margin: 0,
            maxWidth: '900px',
            color: '#d1fae5',
            lineHeight: 1.4,
          }}
        >
          Connecting Bangladeshi Farmers Directly With Buyers
        </p>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '40px',
            fontSize: '20px',
            color: '#a7f3d0',
            fontWeight: 600,
          }}
        >
          <span>Direct Trade</span>
          <span>•</span>
          <span>Real-Time Market Rates</span>
          <span>•</span>
          <span>Zero Middlemen</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
