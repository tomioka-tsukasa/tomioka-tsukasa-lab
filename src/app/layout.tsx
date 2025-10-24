import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New, Italiana, Playfair_Display } from 'next/font/google'
import '@/styles/global/globals'
import '@/styles/global.css'
import StoreProvider from '@/store/provider'
import { GsapManager } from '@/components/GsapManager/GsapManager'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: '--font-zen-kaku-gothic-new',
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
})

const italiana = Italiana({
  variable: '--font-italiana',
  weight: ['400'],
  subsets: ['latin'],
})

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
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
        <body className={`${zenKakuGothicNew.variable} ${italiana.variable} ${playfairDisplay.variable}`}>
          {children}
        </body>
      </html>
    </StoreProvider>
  </>
}
