'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Gavel, Plus, LayoutDashboard } from 'lucide-react'

export function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur border-b border-stone-800">
      <div className="section flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-amber-500 font-bold text-xl tracking-tight">IRON</span>
          <span className="text-stone-100 font-bold text-xl tracking-tight">BID</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/listings"
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith('/listings')
                ? 'text-stone-100 bg-stone-800'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            )}
          >
            Browse
          </Link>
          <Link
            href="/dealer"
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname.startsWith('/dealer')
                ? 'text-stone-100 bg-stone-800'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
            )}
          >
            Dealer Dashboard
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/listings/new" className="btn-primary hidden sm:inline-flex">
            <Plus size={16} />
            List Equipment
          </Link>
          <Link href="/dealer" className="btn-ghost">
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
