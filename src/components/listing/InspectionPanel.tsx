'use client'
import { useState } from 'react'
import { InspectionReport } from '@/types'
import { ShieldCheck, ChevronDown, ChevronUp, Star } from 'lucide-react'

interface Props {
  inspection: InspectionReport
}

function GradeBar({ grade, label }: { grade: number | null; label: string }) {
  if (!grade) return null
  return (
    <div className="flex items-center gap-3">
      <span className="text-stone-400 text-sm w-28 shrink-0">{label}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            className={`w-6 h-2 rounded-sm ${
              i <= grade ? 'bg-amber-500' : 'bg-stone-700'
            }`}
          />
        ))}
      </div>
      <span className="text-stone-400 text-xs">{grade}/5</span>
    </div>
  )
}

export function InspectionPanel({ inspection }: Props) {
  const [expanded, setExpanded] = useState(false)
  const photos: string[] = inspection.photos ?? []

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-500" />
          <h3 className="font-semibold text-stone-100">Verified inspection</h3>
        </div>
        <span className="badge-verified">
          <ShieldCheck size={11} /> Verified
        </span>
      </div>

      <p className="text-stone-500 text-sm mb-4">
        Inspected by {inspection.inspector_name}
        {inspection.inspector_co ? ` · ${inspection.inspector_co}` : ''} on{' '}
        {new Date(inspection.inspection_date).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        })}
      </p>

      {inspection.hours_verified && (
        <div className="bg-green-900/20 border border-green-900/50 rounded-lg px-3 py-2 text-sm text-green-400 mb-4 flex items-center gap-2">
          <ShieldCheck size={14} />
          Hours verified via ECU: {inspection.hours_verified.toLocaleString()} hrs
        </div>
      )}

      {/* Component grades */}
      <div className="space-y-3 mb-4">
        <GradeBar grade={inspection.engine_grade}      label="Engine" />
        <GradeBar grade={inspection.transmission_grade} label="Transmission" />
        <GradeBar grade={inspection.frame_grade}       label="Frame / Structure" />
      </div>

      <button
        className="flex items-center justify-between w-full text-sm text-stone-400 hover:text-stone-200 transition-colors py-2 border-t border-stone-800"
        onClick={() => setExpanded(!expanded)}
      >
        <span>Full inspection notes</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-4">
          {inspection.condition_notes && (
            <p className="text-stone-400 text-sm leading-relaxed bg-stone-800/50 rounded-lg p-3">
              {inspection.condition_notes}
            </p>
          )}
          {photos.length > 0 && (
            <div>
              <p className="text-stone-500 text-xs mb-2">Inspection photos</p>
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 6).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Inspection photo ${i + 1}`}
                    className="aspect-square object-cover rounded-lg bg-stone-800"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
