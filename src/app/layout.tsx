import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/ui/Nav'

export const metadata: Metadata = {
  title: 'IronBid — Heavy Equipment Marketplace',
  description: 'AI-powered heavy equipment buying, selling, and auctions. Verified inspections, fair market valuations, and financing — all in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-stone-800 mt-24 py-12">
          <div className="section">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-500 font-bold text-xl">IRON</span>
                  <span className="text-stone-100 font-bold text-xl">BID</span>
                </div>
                <p className="text-stone-500 text-sm max-w-xs">
                  The only heavy equipment marketplace with AI valuation, verified inspections, and built-in financing.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 text-sm text-stone-400">
                <div className="space-y-2">
                  <p className="text-stone-300 font-medium">Marketplace</p>
                  <a href="/listings" className="block hover:text-stone-100">Browse Equipment</a>
                  <a href="/listings/new" className="block hover:text-stone-100">Sell Equipment</a>
                </div>
                <div className="space-y-2">
                  <p className="text-stone-300 font-medium">Platform</p>
                  <a href="#" className="block hover:text-stone-100">How It Works</a>
                  <a href="#" className="block hover:text-stone-100">Dealer Accounts</a>
                </div>
              </div>
            </div>
            <div className="divider mt-8 pt-8 text-stone-600 text-xs">
              © 2025 IronBid. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
