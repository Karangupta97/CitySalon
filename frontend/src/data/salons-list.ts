import salonsListData from "./salons-list.json"

export interface SalonListItem {
  id: string
  name: string
  tagline: string
  image: string
  rating: number
  reviews: number
  location: string
  services: string[]
  badge: string | null
  badgeColor: string
  priceRange: string
  liveStatus: "available" | "short-wait" | "busy" | "fully-booked"
  waitTime: string
  hygieneScore: number
  distance: string
  openNow: boolean
}

export const salonsList: SalonListItem[] = salonsListData as SalonListItem[]
