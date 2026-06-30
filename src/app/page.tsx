import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { ListingCard } from '@/components/listing/ListingCard'
import { Listing } from '@/types'
import { asArray } from '@/lib/utils'
import { ShieldCheck, Zap, CreditCard, Truck, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  const { data: rawListings, error } = await supabase
    .from('listings')
    .select(`
      *,
      listing_photos ( url, sort_order ),
      valuations ( fmv_low, fmv_high, confidence ),
      inspection_reports ( status ),
      bids ( amount, status )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Homepage listings query failed:', error.message)
  }

  // Normalize nested relations to always be arrays, even if Supabase
  // returns null or a malformed shape for any joined table.
  const listings = (rawListings ?? []).map((l: any) => ({
    ...l,
    listing_photos: asArray(l.listing_photos),
    valuations: asArray(l.valuations),
    inspection_reports: asArray(l.inspection_reports),
    bids: asArray(l.bids),
  }))

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative border-b border-stone-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-stone-950 to-stone-950" />
        <div className="section relative py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/30 border border-amber-800/50 text-amber-400 text-xs font-medium mb-6">
              <Zap size={12} />
              AI-powered fair market valuations on every listing
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-stone-50 mb-6 leading-tight">
              Heavy equipment,<br />
              <span className="text-amber-500">priced right.</span>
            </h1>
            <p className="text-xl text-stone-400 mb-10 leading-relaxed max-w-xl">
              The only marketplace with AI valuation, verified inspections, and built-in financing — built for operators who know what iron is worth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/listings" className="btn-primary text-base px-7 py-3">
                Browse Equipment
                <ArrowRight size={18} />
              </Link>
              <Link href="/listings/new" className="btn-secondary text-base px-7 py-3">
                Sell Your Equipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="border-b border-stone-800 bg-stone-900/30">
        <div className="section py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap,         label: 'AI Valuation',         sub: 'Instant fair market value' },
              { icon: ShieldCheck, label: 'Verified Inspections', sub: 'Independent inspector network' },
              { icon: CreditCard,  label: 'In-listing Financing', sub: 'Pre-approval in 24 hours' },
              { icon: Truck,       label: 'Transport Quotes',     sub: 'At point of sale' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-200">{label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent listings ── */}
      <section className="section py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-100">Recent listings</h2>
            <p className="text-stone-500 mt-1 text-sm">Verified equipment from trusted sellers</p>
          </div>
          <Link href="/listings" className="btn-ghost">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing as Listing} />
          ))}
        </div>
        {listings.length === 0 && (
          <div className="text-center py-16 text-stone-500">
            <p>No listings yet. Be the first to list equipment.</p>
            <Link href="/listings/new" className="btn-primary mt-4 inline-flex">
              List Equipment
            </Link>
          </div>
        )}
      </section>

      {/* ── CTA Band ── */}
      <section className="border-t border-stone-800 bg-stone-900/30">
        <div className="section py-16 text-center">
          <h2 className="text-3xl font-bold text-stone-100 mb-4">
            Ready to move iron?
          </h2>
          <p className="text-stone-400 mb-8 max-w-lg mx-auto">
            List your equipment today and get an AI valuation instantly. Dealer accounts include analytics, lead routing, and unlimited listings.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/listings/new" className="btn-primary text-base px-7 py-3">
              List Equipment Free
            </Link>
            <Link href="/dealer" className="btn-secondary text-base px-7 py-3">
              Dealer Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
