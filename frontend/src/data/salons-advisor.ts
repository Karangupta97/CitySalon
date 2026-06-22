import salonsAdvisorData from "./salons-advisor.json"

export interface AdvisorSalonService {
  name: string
  price: number
  duration: string
  category: string
}

export interface AdvisorSalon {
  id: string
  name: string
  area: string
  city: string
  rating: number
  reviewCount: number
  startingPrice: number
  services: AdvisorSalonService[]
  specialties: string[]
  availableSlots: Record<string, string[]>
  distanceKm: number
  verified: boolean
  hygieneScore: number
  tags: string[]
}

export const salons: AdvisorSalon[] = salonsAdvisorData as AdvisorSalon[]
