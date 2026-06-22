import salonsData from "./salons.json"

export interface SalonService {
  name: string
  price: string
  duration: string
  category: string
}

export interface SalonStylist {
  id: string
  name: string
  role: string
  rating: number
  reviewCount: number
  experience: string
  clients: string
  speciality: string
  availability: "available" | "busy" | "off"
}

export interface GalleryImage {
  src: string
  alt: string
  caption: string
}

export interface BeforeAfterItem {
  before: string
  after: string
  service: string
  stylist: string
}

export interface HygieneChecklist {
  autoclaveSterlization: boolean
  freshTowels: boolean
  licensedStaff: boolean
  disposableKits: boolean
  regularSanitization: boolean
  airPurification: boolean
}

export interface SalonData {
  name: string
  tagline: string
  heroImage: string
  rating: number
  reviews: number
  location: string
  fullAddress: string
  liveStatus: "available" | "short-wait" | "busy" | "fully-booked"
  waitTime: string
  priceGuarantee: boolean
  hygieneScore: number
  description: string
  aiReviewSummary: string
  hygieneChecklist: HygieneChecklist
  services: SalonService[]
  stylists: SalonStylist[]
  galleryImages: GalleryImage[]
  beforeAfterGallery: BeforeAfterItem[]
  highlights: string[]
  amenities: string[]
  phone: string
  email: string
  website: string
  instagram: string
  openingHours: Record<string, string>
}

export const salons: Record<string, SalonData> = salonsData as Record<string, SalonData>
