export type UserRole = 'dealer' | 'buyer' | 'admin'
export type ListingType = 'auction' | 'fixed'
export type ListingStatus = 'active' | 'pending' | 'sold' | 'draft'
export type ValuationConfidence = 'high' | 'medium' | 'low'
export type BidStatus = 'active' | 'outbid' | 'won' | 'cancelled'
export type InspectionStatus = 'verified' | 'pending' | 'failed'

export interface User {
  id: string
  email: string
  role: UserRole
  company_name: string | null
  full_name: string | null
  phone: string | null
  location: string | null
  created_at: string
}

export interface Listing {
  id: string
  seller_id: string
  title: string
  equipment_type: string
  year: number
  make: string
  model: string
  hours: number | null
  miles: number | null
  condition_grade: number
  location: string
  asking_price: number
  listing_type: ListingType
  status: ListingStatus
  description: string | null
  known_issues: string | null
  vin_serial: string | null
  auction_end_at: string | null
  created_at: string
  updated_at: string
  // joined
  listing_photos?: ListingPhoto[]
  valuations?: Valuation[]
  inspection_reports?: InspectionReport[]
  bids?: Bid[]
  users?: User
}

export interface ListingPhoto {
  id: string
  listing_id: string
  url: string
  sort_order: number
  created_at: string
}

export interface Comparable {
  equipment_type: string
  year: number
  make: string
  model: string
  hours: number | null
  miles: number | null
  condition: string | null
  sale_price: number
  sale_date: string
  region: string
  source: string
}

export interface Valuation {
  id: string
  listing_id: string
  fmv_low: number
  fmv_high: number
  confidence: ValuationConfidence
  rationale: string | null
  comparables: Comparable[]
  created_at: string
}

export interface InspectionReport {
  id: string
  listing_id: string
  inspector_name: string
  inspector_co: string | null
  inspection_date: string
  hours_verified: number | null
  condition_notes: string | null
  engine_grade: number | null
  transmission_grade: number | null
  frame_grade: number | null
  status: InspectionStatus
  photos: string[]
  created_at: string
}

export interface Bid {
  id: string
  listing_id: string
  bidder_id: string
  amount: number
  status: BidStatus
  created_at: string
  users?: User
}

export interface ValuationRequest {
  equipment_type: string
  year: number
  make: string
  model: string
  hours?: number
  miles?: number
  condition_grade: number
  location: string
  listing_id: string
}

export interface ValuationResponse {
  fmv_low: number
  fmv_high: number
  confidence: ValuationConfidence
  rationale: string
  comparables: Comparable[]
}
