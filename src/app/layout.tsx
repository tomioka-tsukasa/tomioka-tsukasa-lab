import type { Metadata } from 'next'
import { Zen_Old_Mincho } from 'next/font/google'
import '@/styles/global/globals'
import '@/styles/global.css'
import StoreProvider from '@/store/provider'
import { GsapManager } from '@/components/GsapManager/GsapManager'
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen'

const zenOldMincho = Zen_Old_Mincho({
  variable: '--font-zen-old-mincho',
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'meta title.',
  description: 'meta description.',
  // manifest: '/sakura_camera/assets/home-icon/manifest.json',
  openGraph: {
    title: 'meta title.',
    siteName: 'meta title.',
    description: 'meta description.',
    url: 'https://portfolio-ver6.vercel.app/',
    type: 'website',
    images: [
      {
        url: 'meta og absolute path',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'ja_JP',
  },
  twitter: {
    images: 'meta og absolute path',
    card: 'summary_large_image',
    description: '「の',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <StoreProvider>
      <GsapManager />
      <html lang='ja'>
        <body className={`${zenOldMincho.variable}`}>
          <LoadingScreen />
          {children}
        </body>
      </html>
    </StoreProvider>
  </>
}
