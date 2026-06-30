import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase'
import { formatPrice, equipmentTypeLabel, conditionLabel, timeAgo } from '@/lib/utils'
import { Plus, TrendingUp, Eye, Gavel, DollarSign, Package, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DealerDashboard() {
  const supabase = createServerSupabaseClient()
  const DEALER_ID = 'a0000000-0000-0000-0000-000000000001'

  // Fetch dealer's listings with bid data
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      listing_photos ( url, sort_order ),
      valuations ( fmv_low, fmv_high ),
      bids ( amount, status, created_at )
    `)
    .eq('seller_id', DEALER_ID)
    .order('created_at', { ascending: false })

  const active    = listings?.filter(l => l.status === 'active')    ?? []
  const sold      = listings?.filter(l => l.status === 'sold')      ?? []
  const totalPipeline = active.reduce((sum, l) => sum + Number(l.asking_price), 0)
  const totalBidsThisWeek = listings?.flatMap(l => l.bids ?? [])
    .filter(b => new Date(b.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .length ?? 0

  return (
    <div className="section py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-100">Dealer dashboard</h1>
          <p className="text-stone-400 mt-1">Powell Heavy Equipment · Wilmington, NC</p>
        </div>
        <Link href="/listings/new" className="btn-primary">
          <Plus size={16} />
          New listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Package,    label: 'Active listings',  value: active.length.toString(), sub: `${sold.length} sold` },
          { icon: DollarSign, label: 'Pipeline value',   value: formatPrice(totalPipeline), sub: 'active listings' },
          { icon: Gavel,      label: 'Bids this week',   value: totalBidsThisWeek.toString(), sub: 'across all listings' },
          { icon: TrendingUp, label: 'Avg. asking price', value: active.length ? formatPrice(totalPipeline / active.length) : '$0', sub: 'active listings' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} className="text-amber-500" />
              <p className="text-stone-500 text-sm">{label}</p>
            </div>
            <p className="text-2xl font-bold text-stone-100">{value}</p>
            <p className="text-stone-600 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Lead activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-1 card p-5">
          <h2 className="font-semibold text-stone-100 mb-4">Recent activity</h2>
          <div className="space-y-3">
            {[
              { text: 'New bid on 2019 Kenworth T680', sub: '$151,000 · 4 hours ago', dot: 'bg-amber-500' },
              { text: 'Buyer viewed 2020 Cat 320',     sub: 'Charlotte, NC · 6 hours ago', dot: 'bg-blue-500' },
              { text: 'New bid on 2017 JD 850K Dozer', sub: '$109,000 · 8 hours ago', dot: 'bg-amber-500' },
              { text: 'Buyer viewed 2021 Peterbilt 389', sub: 'Raleigh, NC · 1 day ago', dot: 'bg-blue-500' },
              { text: 'Buyer viewed 2018 Fontaine RGN', sub: 'Atlanta, GA · 1 day ago', dot: 'bg-blue-500' },
              { text: 'Financing inquiry: 2020 Cat 320', sub: '1 day ago', dot: 'bg-green-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-stone-800 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
                <div>
                  <p className="text-stone-300 text-sm">{item.text}</p>
                  <p className="text-stone-600 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active listings table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
            <h2 className="font-semibold text-stone-100">Active listings</h2>
            <Link href="/listings" className="text-stone-400 hover:text-stone-100 text-sm flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="text-left text-stone-500 font-medium px-5 py-3">Equipment</th>
                  <th className="text-right text-stone-500 font-medium px-4 py-3">Asking</th>
                  <th className="text-right text-stone-500 font-medium px-4 py-3">Top bid</th>
                  <th className="text-right text-stone-500 font-medium px-4 py-3">Bids</th>
                  <th className="text-right text-stone-500 font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {active.map(listing => {
                  const bids = (listing.bids ?? []).sort((a: any, b: any) => b.amount - a.amount)
                  const topBid = bids[0]?.amount
                  return (
                    <tr key={listing.id} className="border-b border-stone-800 hover:bg-stone-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <Link href={`/listings/${listing.id}`} className="hover:text-amber-400 transition-colors">
                          <p className="text-stone-200 font-medium line-clamp-1">{listing.title}</p>
                          <p className="text-stone-600 text-xs mt-0.5">{listing.location}</p>
                        </Link>
                      </td>
                      <td className="text-right px-4 py-4 text-stone-300 font-medium">
                        {formatPrice(listing.asking_price)}
                      </td>
                      <td className="text-right px-4 py-4">
                        {topBid ? (
                          <span className="text-amber-400 font-medium">{formatPrice(topBid)}</span>
                        ) : (
                          <span className="text-stone-600">—</span>
                        )}
                      </td>
                      <td className="text-right px-4 py-4 text-stone-400">
                        {bids.length}
                      </td>
                      <td className="text-right px-4 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          listing.listing_type === 'auction'
                            ? 'bg-amber-900/30 text-amber-400'
                            : 'bg-green-900/30 text-green-400'
                        }`}>
                          {listing.listing_type === 'auction' ? 'Auction' : 'Fixed'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {active.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-stone-600">
                      No active listings.{' '}
                      <Link href="/listings/new" className="text-amber-500 hover:underline">
                        Create your first listing
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'List new equipment',    sub: 'Get AI valuation instantly',     href: '/listings/new',  primary: true },
          { label: 'Browse the marketplace', sub: 'See how your listings compare', href: '/listings',      primary: false },
          { label: 'Upgrade to dealer pro',  sub: '$299/mo — analytics + priority', href: '#',             primary: false },
        ].map(({ label, sub, href, primary }) => (
          <Link
            key={label}
            href={href}
            className={`p-5 rounded-xl border transition-colors ${
              primary
                ? 'bg-amber-500/10 border-amber-900/50 hover:border-amber-600'
                : 'card-hover'
            }`}
          >
            <p className={`font-semibold text-sm ${primary ? 'text-amber-400' : 'text-stone-200'}`}>{label}</p>
            <p className="text-stone-500 text-xs mt-1">{sub}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
