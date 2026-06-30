'use client'
import { useState } from 'react'
import { Valuation } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Zap, ChevronDown, ChevronUp, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Props {
  valuation: Valuation
  askingPrice: number
}

export function ValuationCard({ valuation, askingPrice }: Props) {
  const [showComps, setShowComps] = useState(false)

  const mid = (valuation.fmv_low + valuation.fmv_high) / 2
  const pricePosition = (askingPrice - valuation.fmv_low) / (valuation.fmv_high - valuation.fmv_low)
  const clampedPos = Math.min(Math.max(pricePosition, 0), 1)
  const pricePct = Math.round(clampedPos * 100)

  const priceDiff = askingPrice - mid
  const priceDiffPct = Math.round((Math.abs(priceDiff) / mid) * 100)

  let priceStatus: { label: string; color: string; icon: typeof CheckCircle2 }
  if (askingPrice < valuation.fmv_low) {
    priceStatus = { label: 'Below market — strong value', color: 'text-green-400', icon: CheckCircle2 }
  } else if (askingPrice <= valuation.fmv_high) {
    priceStatus = { label: 'Within fair market range', color: 'text-green-400', icon: CheckCircle2 }
  } else {
    priceStatus = { label: `${priceDiffPct}% above market midpoint`, color: 'text-amber-400', icon: AlertCircle }
  }

  const confidenceBadge: Record<string, string> = {
    high:   'bg-green-900/40 text-green-400 border-green-800',
    medium: 'bg-amber-900/40 text-amber-400 border-amber-800',
    low:    'bg-stone-800 text-stone-400 border-stone-700',
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          <h3 className="font-semibold text-stone-100">AI valuation</h3>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${confidenceBadge[valuation.confidence]}`}>
          {valuation.confidence.charAt(0).toUpperCase() + valuation.confidence.slice(1)} confidence
        </span>
      </div>

      {/* FMV range */}
      <div className="mb-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-stone-500 text-xs mb-1">Fair market value range</p>
            <p className="text-2xl font-bold text-stone-100">
              {formatPrice(valuation.fmv_low)} – {formatPrice(valuation.fmv_high)}
            </p>
          </div>
        </div>

        {/* Price bar */}
        <div className="relative mt-4">
          <div className="h-2 bg-stone-800 rounded-full overflow-visible">
            <div
              className="h-full bg-amber-500/30 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          {/* Asking price marker */}
          <div
            className="absolute -top-1.5 transform -translate-x-1/2"
            style={{ left: `${pricePct}%` }}
          >
            <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-stone-900 flex items-center justify-center" />
          </div>
          {/* Range labels */}
          <div className="flex justify-between mt-2 text-xs text-stone-600">
            <span>{formatPrice(valuation.fmv_low)}</span>
            <span>{formatPrice(valuation.fmv_high)}</span>
          </div>
        </div>

        {/* Price status */}
        <div className={`flex items-center gap-2 mt-3 text-sm font-medium ${priceStatus.color}`}>
          <priceStatus.icon size={15} />
          {priceStatus.label}
        </div>
      </div>

      {/* Rationale */}
      {valuation.rationale && (
        <p className="text-stone-400 text-sm bg-stone-800/50 rounded-lg p-3 mb-4">
          {valuation.rationale}
        </p>
      )}

      {/* Comparables toggle */}
      {valuation.comparables && valuation.comparables.length > 0 && (
        <div>
          <button
            className="flex items-center justify-between w-full text-sm text-stone-400 hover:text-stone-200 transition-colors py-2"
            onClick={() => setShowComps(!showComps)}
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp size={14} />
              {valuation.comparables.length} comparable sales
            </span>
            {showComps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showComps && (
            <div className="mt-2 space-y-2">
              {valuation.comparables.map((comp, i) => (
                <div key={i} className="bg-stone-800/50 rounded-lg p-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-stone-200 font-medium">
                        {comp.year} {comp.make} {comp.model}
                      </p>
                      <p className="text-stone-500 text-xs mt-0.5">
                        {comp.hours ? `${comp.hours.toLocaleString()} hrs · ` : ''}
                        {comp.region} · {new Date(comp.sale_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} · {comp.source}
                      </p>
                    </div>
                    <p className="text-stone-100 font-bold shrink-0 ml-4">
                      {formatPrice(comp.sale_price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
