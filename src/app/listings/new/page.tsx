'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { Zap, Upload, Plus, X } from 'lucide-react'

const EQUIPMENT_TYPES = [
  { value: 'semi_tractor',    label: 'Semi Tractor' },
  { value: 'excavator',       label: 'Excavator' },
  { value: 'bulldozer',       label: 'Bulldozer' },
  { value: 'trailer_rgn',     label: 'RGN Trailer' },
  { value: 'trailer_flatbed', label: 'Flatbed Trailer' },
  { value: 'trailer_lowboy',  label: 'Lowboy Trailer' },
  { value: 'crane',           label: 'Crane / Lift' },
  { value: 'grader',          label: 'Motor Grader' },
  { value: 'loader',          label: 'Wheel Loader' },
  { value: 'other',           label: 'Other' },
]

export default function NewListingPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'valuation' | 'done'>('form')
  const [saving, setSaving] = useState(false)
  const [listingId, setListingId] = useState<string | null>(null)
  const [valuation, setValuation] = useState<any>(null)
  const [photos, setPhotos] = useState<string[]>([])

  const [form, setForm] = useState({
    equipment_type: 'semi_tractor',
    year: new Date().getFullYear().toString(),
    make: '',
    model: '',
    hours: '',
    miles: '',
    condition_grade: '4',
    location: '',
    asking_price: '',
    listing_type: 'fixed',
    description: '',
    known_issues: '',
    vin_serial: '',
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit() {
    if (!form.make || !form.model || !form.location || !form.asking_price) {
      alert('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const supabase = getSupabase()

      // Insert listing (demo: use hardcoded dealer ID)
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          seller_id:       'a0000000-0000-0000-0000-000000000001',
          title:           `${form.year} ${form.make} ${form.model}`,
          equipment_type:  form.equipment_type,
          year:            parseInt(form.year),
          make:            form.make,
          model:           form.model,
          hours:           form.hours ? parseInt(form.hours) : null,
          miles:           form.miles ? parseInt(form.miles) : null,
          condition_grade: parseInt(form.condition_grade),
          location:        form.location,
          asking_price:    parseFloat(form.asking_price.replace(/[^0-9.]/g, '')),
          listing_type:    form.listing_type,
          description:     form.description || null,
          known_issues:    form.known_issues || null,
          vin_serial:      form.vin_serial || null,
          status:          'active',
        })
        .select()
        .single()

      if (error) throw error
      setListingId(listing.id)

      // Add photo URLs if any (demo uses placeholder)
      if (photos.length > 0) {
        await supabase.from('listing_photos').insert(
          photos.map((url, i) => ({ listing_id: listing.id, url, sort_order: i }))
        )
      } else {
        // Add a stock photo for demo
        await supabase.from('listing_photos').insert([{
          listing_id: listing.id,
          url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200',
          sort_order: 0
        }])
      }

      setStep('valuation')

      // Trigger AI valuation
      const res = await fetch('/api/valuate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id:      listing.id,
          equipment_type:  form.equipment_type,
          year:            parseInt(form.year),
          make:            form.make,
          model:           form.model,
          hours:           form.hours ? parseInt(form.hours) : undefined,
          miles:           form.miles ? parseInt(form.miles) : undefined,
          condition_grade: parseInt(form.condition_grade),
          location:        form.location,
        }),
      })
      const val = await res.json()
      setValuation(val)
      setStep('done')
    } catch (e: any) {
      alert(`Error: ${e.message}`)
      setSaving(false)
    }
  }

  if (step === 'valuation') {
    return (
      <div className="section py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Zap size={28} className="text-amber-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-stone-100 mb-3">Getting your valuation</h2>
          <p className="text-stone-400">
            The AI is analyzing comparable sales data to calculate your equipment's fair market value...
          </p>
          <div className="flex gap-1.5 justify-center mt-8">
            {[0,1,2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'done' && valuation && listingId) {
    const formatP = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    return (
      <div className="section py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <Zap size={28} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-stone-100 mb-2">Listing live — AI valuation ready</h2>
          <p className="text-stone-400 mb-8">Your listing is active and has been valued by the IronBid AI engine.</p>

          <div className="card p-6 mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-amber-500" />
              <p className="text-stone-300 font-medium">AI fair market value</p>
            </div>
            <p className="text-4xl font-bold text-stone-100 mb-1">
              {formatP(valuation.fmv_low)} – {formatP(valuation.fmv_high)}
            </p>
            <p className="text-stone-500 text-sm mb-4">{valuation.confidence} confidence</p>
            {valuation.rationale && (
              <p className="text-stone-400 text-sm bg-stone-800 rounded-lg p-3">{valuation.rationale}</p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              className="btn-primary"
              onClick={() => router.push(`/listings/${listingId}`)}
            >
              View your listing
            </button>
            <button
              className="btn-secondary"
              onClick={() => router.push('/dealer')}
            >
              Go to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-100 mb-2">List your equipment</h1>
          <p className="text-stone-400">
            Fill out the form and get an AI-powered fair market valuation instantly.
          </p>
        </div>

        <div className="space-y-6">
          {/* Equipment info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-100">Equipment details</h2>

            <div>
              <label className="label">Equipment type *</label>
              <select className="select" value={form.equipment_type} onChange={e => set('equipment_type', e.target.value)}>
                {EQUIPMENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Year *</label>
                <input className="input" type="number" min="1990" max="2026" value={form.year} onChange={e => set('year', e.target.value)} />
              </div>
              <div>
                <label className="label">Make *</label>
                <input className="input" type="text" placeholder="Kenworth" value={form.make} onChange={e => set('make', e.target.value)} />
              </div>
              <div>
                <label className="label">Model *</label>
                <input className="input" type="text" placeholder="T680" value={form.model} onChange={e => set('model', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Hours</label>
                <input className="input" type="number" placeholder="e.g. 2400" value={form.hours} onChange={e => set('hours', e.target.value)} />
              </div>
              <div>
                <label className="label">Miles</label>
                <input className="input" type="number" placeholder="e.g. 485000" value={form.miles} onChange={e => set('miles', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Condition grade *</label>
              <div className="flex gap-2">
                {[
                  { v: '1', l: 'Poor' },
                  { v: '2', l: 'Fair' },
                  { v: '3', l: 'Good' },
                  { v: '4', l: 'Very Good' },
                  { v: '5', l: 'Excellent' },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    type="button"
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.condition_grade === v
                        ? 'bg-amber-500 text-stone-950 border-amber-500'
                        : 'bg-stone-800 text-stone-400 border-stone-700 hover:border-stone-500'
                    }`}
                    onClick={() => set('condition_grade', v)}
                  >
                    {v}<span className="hidden sm:inline"> · {l}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">VIN / Serial number</label>
              <input className="input" type="text" placeholder="Optional" value={form.vin_serial} onChange={e => set('vin_serial', e.target.value)} />
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-100">Pricing & listing type</h2>

            <div>
              <label className="label">Listing type *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'fixed',   l: 'Fixed price (Buy Now)', sub: 'Set a firm price' },
                  { v: 'auction', l: 'Auction',               sub: 'Buyers compete with bids' },
                ].map(({ v, l, sub }) => (
                  <button
                    key={v}
                    type="button"
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      form.listing_type === v
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-stone-700 bg-stone-800 hover:border-stone-500'
                    }`}
                    onClick={() => set('listing_type', v)}
                  >
                    <p className={`font-medium text-sm ${form.listing_type === v ? 'text-amber-400' : 'text-stone-200'}`}>{l}</p>
                    <p className="text-stone-500 text-xs mt-0.5">{sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">
                {form.listing_type === 'auction' ? 'Starting price *' : 'Asking price *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-medium">$</span>
                <input
                  className="input pl-7"
                  type="text"
                  placeholder="150,000"
                  value={form.asking_price}
                  onChange={e => set('asking_price', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">Location *</label>
              <input className="input" type="text" placeholder="Wilmington, NC" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
          </div>

          {/* Description */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-100">Description</h2>

            <div>
              <label className="label">Description</label>
              <textarea
                className="input resize-none"
                rows={4}
                placeholder="Service history, maintenance, notable features..."
                value={form.description}
                onChange={e => set('description', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Known issues</label>
              <textarea
                className="input resize-none"
                rows={2}
                placeholder="Any known defects, needed repairs, or wear items..."
                value={form.known_issues}
                onChange={e => set('known_issues', e.target.value)}
              />
            </div>
          </div>

          {/* AI valuation callout */}
          <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-900/50 rounded-xl p-4">
            <Zap size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-medium text-sm">AI valuation included free</p>
              <p className="text-stone-400 text-sm mt-0.5">
                After you list, the IronBid AI engine will analyze comparable sales and give you an instant fair market value range.
              </p>
            </div>
          </div>

          <button
            className="btn-primary w-full justify-center py-4 text-base"
            onClick={handleSubmit}
            disabled={saving}
          >
            <Zap size={18} />
            {saving ? 'Creating listing...' : 'List equipment and get AI valuation'}
          </button>
        </div>
      </div>
    </div>
  )
}
