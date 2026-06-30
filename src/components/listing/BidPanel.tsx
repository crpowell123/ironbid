'use client'
import { useState } from 'react'
import { Listing, Bid } from '@/types'
import { formatPrice, timeAgo } from '@/lib/utils'
import { Gavel, Tag, TrendingUp, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'

interface Props {
  listing: Listing
  currentBid?: number
  bids: Bid[]
}

export function BidPanel({ listing, currentBid, bids }: Props) {
  const [bidAmount, setBidAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showBidHistory, setShowBidHistory] = useState(false)

  const isAuction = listing.listing_type === 'auction'
  const minBid = (currentBid ?? listing.asking_price * 0.9) + 500
  const displayPrice = isAuction ? (currentBid ?? listing.asking_price) : listing.asking_price

  async function placeBid() {
    const amount = parseFloat(bidAmount.replace(/[^0-9.]/g, ''))
    if (!amount || amount < minBid) {
      setMessage({ type: 'error', text: `Minimum bid is ${formatPrice(minBid)}` })
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      const supabase = getSupabase()
      // Demo: use the demo buyer ID (in production this would use auth.uid())
      const { error } = await supabase.from('bids').insert({
        listing_id: listing.id,
        bidder_id:  'a0000000-0000-0000-0000-000000000002',
        amount,
        status: 'active',
      })
      if (error) throw error
      setMessage({ type: 'success', text: `Your bid of ${formatPrice(amount)} has been placed!` })
      setBidAmount('')
    } catch (e: any) {
      setMessage({ type: 'error', text: 'Failed to place bid. Try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card p-5 space-y-5">
      {/* Price */}
      <div>
        <p className="text-stone-500 text-sm mb-1">
          {isAuction ? (currentBid ? 'Current bid' : 'Starting price') : 'Buy now price'}
        </p>
        <p className="text-4xl font-bold text-stone-100">{formatPrice(displayPrice)}</p>
        {isAuction && bids.length > 0 && (
          <p className="text-stone-500 text-sm mt-1">
            {bids.length} bid{bids.length !== 1 ? 's' : ''} placed
          </p>
        )}
      </div>

      {/* Auction CTA */}
      {isAuction && (
        <div className="space-y-3">
          <div>
            <label className="label">Your bid</label>
            <input
              type="text"
              className="input"
              placeholder={`Min: ${formatPrice(minBid)}`}
              value={bidAmount}
              onChange={e => setBidAmount(e.target.value)}
            />
            <p className="text-xs text-stone-500 mt-1.5">
              Minimum increment: $500
            </p>
          </div>

          {message && (
            <div className={`text-sm px-4 py-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-900/30 text-green-400 border border-green-800'
                : 'bg-red-900/30 text-red-400 border border-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <button
            className="btn-primary w-full justify-center"
            onClick={placeBid}
            disabled={submitting}
          >
            <Gavel size={16} />
            {submitting ? 'Placing bid...' : 'Place bid'}
          </button>

          {/* Bid history */}
          {bids.length > 0 && (
            <div>
              <button
                className="flex items-center gap-1 text-stone-400 text-sm w-full justify-between py-2"
                onClick={() => setShowBidHistory(!showBidHistory)}
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={14} />
                  Bid history
                </span>
                {showBidHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showBidHistory && (
                <div className="space-y-2 mt-2">
                  {bids.slice(0, 6).map((bid, i) => (
                    <div key={bid.id} className="flex items-center justify-between py-2 border-b border-stone-800 last:border-0">
                      <div>
                        <p className="text-stone-300 text-sm font-medium">
                          {i === 0 ? '🏆 ' : ''}{formatPrice(bid.amount)}
                        </p>
                        <p className="text-stone-600 text-xs">{timeAgo(bid.created_at)}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        bid.status === 'active'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-stone-800 text-stone-500'
                      }`}>
                        {bid.status === 'active' ? 'Leading' : 'Outbid'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fixed price CTA */}
      {!isAuction && (
        <div className="space-y-3">
          <button className="btn-primary w-full justify-center">
            <Tag size={16} />
            Buy now — {formatPrice(listing.asking_price)}
          </button>
          <button className="btn-secondary w-full justify-center">
            Make an offer
          </button>
        </div>
      )}

      {/* Seller info */}
      <div className="pt-4 border-t border-stone-800">
        <p className="text-xs text-stone-500 mb-2 uppercase tracking-wide">Listed by</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 text-sm font-bold shrink-0">
            {((listing.users as any)?.company_name ?? (listing.users as any)?.full_name ?? 'D')[0]}
          </div>
          <div>
            <p className="text-stone-200 text-sm font-medium">
              {(listing.users as any)?.company_name ?? (listing.users as any)?.full_name ?? 'Dealer'}
            </p>
            <p className="text-stone-500 text-xs">
              {(listing.users as any)?.location ?? listing.location}
            </p>
          </div>
        </div>
        <button className="btn-secondary w-full justify-center mt-3 text-sm">
          Contact seller
        </button>
      </div>
    </div>
  )
}
