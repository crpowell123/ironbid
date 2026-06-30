import { createServerSupabaseClient } from '@/lib/supabase'
import { ListingCard } from '@/components/listing/ListingCard'
import { Listing } from '@/types'
import { equipmentTypeLabel } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const EQUIPMENT_TYPES = [
  'semi_tractor', 'excavator', 'bulldozer',
  'trailer_rgn', 'trailer_flatbed', 'crane', 'grader',
]

interface SearchParams {
  type?: string
  listing_type?: string
  q?: string
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createServerSupabaseClient()

  let query = supabase
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

  if (searchParams.type) {
    query = query.eq('equipment_type', searchParams.type)
  }
  if (searchParams.listing_type) {
    query = query.eq('listing_type', searchParams.listing_type)
  }

  const { data: listings } = await query

  return (
    <div className="section py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-100 mb-2">Browse equipment</h1>
        <p className="text-stone-400">
          {listings?.length ?? 0} listings — all with AI fair market valuations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/listings"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border
            ${!searchParams.type ? 'bg-amber-500 text-stone-950 border-amber-500' : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500'}`}
        >
          All types
        </a>
        {EQUIPMENT_TYPES.map(type => (
          <a
            key={type}
            href={`/listings?type=${type}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border
              ${searchParams.type === type ? 'bg-amber-500 text-stone-950 border-amber-500' : 'bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-500'}`}
          >
            {equipmentTypeLabel(type)}
          </a>
        ))}
      </div>

      {/* Listing type toggle */}
      <div className="flex gap-2 mb-8">
        {[
          { value: '', label: 'All listings' },
          { value: 'auction', label: 'Auctions' },
          { value: 'fixed', label: 'Buy now' },
        ].map(({ value, label }) => (
          <a
            key={value}
            href={value ? `/listings?listing_type=${value}${searchParams.type ? `&type=${searchParams.type}` : ''}` : '/listings'}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors border
              ${(searchParams.listing_type ?? '') === value
                ? 'bg-stone-700 text-stone-100 border-stone-600'
                : 'bg-transparent text-stone-500 border-stone-800 hover:border-stone-600'}`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Grid */}
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(listings as Listing[]).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-stone-500">
          <p className="text-lg mb-2">No listings found</p>
          <p className="text-sm">Try a different filter or check back soon.</p>
        </div>
      )}
    </div>
  )
}
