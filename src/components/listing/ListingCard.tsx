import Link from 'next/link'
import Image from 'next/image'
import { Listing } from '@/types'
import { formatPrice, conditionLabel, conditionColor, equipmentTypeLabel } from '@/lib/utils'
import { ShieldCheck, Zap, Gavel, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  listing: Listing
}

export function ListingCard({ listing }: Props) {
  const photo = listing.listing_photos?.[0]?.url
  const valuation = listing.valuations?.[0]
  const inspected = listing.inspection_reports?.[0]?.status === 'verified'
  const isAuction = listing.listing_type === 'auction'

  // Get current high bid if auction
  const highBid = listing.bids
    ?.filter(b => b.status === 'active')
    ?.sort((a, b) => b.amount - a.amount)?.[0]?.amount

  return (
    <Link href={`/listings/${listing.id}`} className="card-hover block group">
      {/* Photo */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-stone-800">
        {photo ? (
          <Image
            src={photo}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-600 text-sm">
            No photo
          </div>
        )}
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isAuction ? (
            <span className="badge-auction">
              <Gavel size={11} /> Auction
            </span>
          ) : (
            <span className="badge-fixed">
              <Tag size={11} /> Buy Now
            </span>
          )}
          {inspected && (
            <span className="badge-verified">
              <ShieldCheck size={11} /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">
            {equipmentTypeLabel(listing.equipment_type)}
          </p>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            conditionColor(listing.condition_grade)
          )}>
            {conditionLabel(listing.condition_grade)}
          </span>
        </div>

        <h3 className="text-stone-100 font-semibold text-sm leading-snug mb-3 line-clamp-2">
          {listing.title}
        </h3>

        {/* Price row */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-stone-500 mb-0.5">
              {isAuction ? (highBid ? 'Current bid' : 'Starting') : 'Asking price'}
            </p>
            <p className="text-xl font-bold text-stone-100">
              {formatPrice(isAuction ? (highBid ?? listing.asking_price) : listing.asking_price)}
            </p>
          </div>
          {valuation && (
            <div className="text-right">
              <p className="text-xs text-stone-500 mb-0.5 flex items-center gap-1 justify-end">
                <Zap size={10} className="text-amber-500" />
                FMV range
              </p>
              <p className="text-sm font-medium text-amber-400">
                {formatPrice(valuation.fmv_low)}–{formatPrice(valuation.fmv_high)}
              </p>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-stone-500 pt-3 border-t border-stone-800">
          <span>{listing.year}</span>
          <span>·</span>
          <span>{listing.location}</span>
          {listing.hours && (
            <>
              <span>·</span>
              <span>{listing.hours.toLocaleString()} hrs</span>
            </>
          )}
          {listing.miles && (
            <>
              <span>·</span>
              <span>{listing.miles.toLocaleString()} mi</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
