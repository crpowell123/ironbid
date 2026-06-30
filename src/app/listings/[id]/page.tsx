import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Listing } from '@/types'
import { formatPrice, conditionLabel, conditionColor, equipmentTypeLabel, monthlyPayment, timeAgo } from '@/lib/utils'
import { BidPanel } from '@/components/listing/BidPanel'
import { ValuationCard } from '@/components/valuation/ValuationCard'
import { InspectionPanel } from '@/components/listing/InspectionPanel'
import { ShieldCheck, MapPin, Calendar, Gauge, Zap, CreditCard, Truck, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ListingPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      users ( full_name, company_name, location ),
      listing_photos ( url, sort_order ),
      valuations ( * ),
      inspection_reports ( * ),
      bids ( *, users ( full_name ) )
    `)
    .eq('id', params.id)
    .single()

  if (!listing) notFound()

  const l = listing as Listing
  const photos = (l.listing_photos ?? []).sort((a, b) => a.sort_order - b.sort_order)
  const valuation = l.valuations?.[0]
  const inspection = l.inspection_reports?.[0]
  const isAuction = l.listing_type === 'auction'
  const activeBids = (l.bids ?? [])
    .filter(b => b.status !== 'cancelled')
    .sort((a, b) => b.amount - a.amount)
  const currentBid = activeBids[0]?.amount
  const payment = monthlyPayment(l.asking_price)

  return (
    <div className="section py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Photos + Details ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Photo gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-800">
              {photos[0] ? (
                <Image
                  src={photos[0].url}
                  alt={l.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-600">
                  No photos
                </div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.slice(1, 5).map((photo, i) => (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-stone-800">
                    <Image
                      src={photo.url}
                      alt={`${l.title} photo ${i + 2}`}
                      fill
                      className="object-cover hover:opacity-80 transition-opacity cursor-pointer"
                      sizes="25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title + badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                {equipmentTypeLabel(l.equipment_type)}
              </span>
              {inspection?.status === 'verified' && (
                <span className="badge-verified">
                  <ShieldCheck size={11} /> Verified Inspection
                </span>
              )}
              {isAuction ? (
                <span className="badge-auction">Auction</span>
              ) : (
                <span className="badge-fixed">Buy Now</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-stone-100">{l.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-stone-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {l.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> Listed {timeAgo(l.created_at)}
              </span>
            </div>
          </div>

          {/* Specs table */}
          <div className="card p-5">
            <h3 className="font-semibold text-stone-100 mb-4">Equipment specs</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                { label: 'Year',        value: l.year.toString() },
                { label: 'Make',        value: l.make },
                { label: 'Model',       value: l.model },
                { label: 'Condition',   value: conditionLabel(l.condition_grade) },
                l.hours ? { label: 'Hours',  value: `${l.hours.toLocaleString()} hrs` } : null,
                l.miles ? { label: 'Miles',  value: `${l.miles.toLocaleString()} mi` } : null,
                l.vin_serial ? { label: 'VIN/Serial', value: l.vin_serial } : null,
              ].filter(Boolean).map((spec) => (
                <div key={spec!.label} className="flex justify-between py-2 border-b border-stone-800 last:border-0">
                  <span className="text-stone-500 text-sm">{spec!.label}</span>
                  <span className="text-stone-200 text-sm font-medium">{spec!.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {l.description && (
            <div className="card p-5">
              <h3 className="font-semibold text-stone-100 mb-3">Description</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{l.description}</p>
            </div>
          )}

          {/* Known issues */}
          {l.known_issues && (
            <div className="card p-5 border-orange-900/50">
              <h3 className="font-semibold text-orange-400 mb-3">Known issues</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{l.known_issues}</p>
            </div>
          )}

          {/* AI Valuation */}
          {valuation && (
            <ValuationCard valuation={valuation} askingPrice={l.asking_price} />
          )}

          {/* Inspection report */}
          {inspection && (
            <InspectionPanel inspection={inspection} />
          )}

          {/* Financing widget */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-amber-500" />
              <h3 className="font-semibold text-stone-100">Equipment financing</h3>
            </div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-stone-500 text-sm">Estimated monthly payment</p>
                <p className="text-3xl font-bold text-stone-100 mt-1">
                  {formatPrice(payment)}<span className="text-lg text-stone-400 font-normal">/mo</span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Based on {formatPrice(l.asking_price)} at 7.9% APR for 60 months — estimate only
                </p>
              </div>
            </div>
            <button className="btn-secondary w-full justify-center">
              Get pre-approved in 24 hours
            </button>
          </div>

          {/* Transport */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={18} className="text-amber-500" />
              <h3 className="font-semibold text-stone-100">Transport coordination</h3>
            </div>
            <p className="text-stone-400 text-sm mb-4">
              We coordinate heavy haul transport from {l.location} to your location.
              Estimated range based on Southeast US delivery:
            </p>
            <div className="bg-stone-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-stone-300 font-medium">Estimated transport</p>
                <p className="text-2xl font-bold text-stone-100 mt-0.5">$1,200 – $2,400</p>
              </div>
              <button className="btn-secondary text-sm">Get exact quote</button>
            </div>
          </div>
        </div>

        {/* ── Right: Bid / Buy Panel ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BidPanel listing={l} currentBid={currentBid} bids={activeBids} />
          </div>
        </div>
      </div>
    </div>
  )
}
