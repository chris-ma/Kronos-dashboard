import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kronos | AI Premarket Dashboard',
  description: 'Real-time financial intelligence powered by Kronos AI forecasting engine',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-kronos-bg text-kronos-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
