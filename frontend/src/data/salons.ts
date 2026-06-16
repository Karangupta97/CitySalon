export interface SalonService {
  name: string
  duration: string
  price: string
  category: string
}

export interface SalonGalleryImage {
  src: string
  alt: string
  caption: string
}

export interface SalonZone {
  name: string
  description: string
  image: string
}

export interface SalonStylist {
  id: string
  name: string
  role: string
  experience: string
  speciality: string
  clients: string
  rating: number
  reviewCount: number
  image: string
  availability: "available" | "busy" | "off"
}

export interface BeforeAfterImage {
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
  id: string
  name: string
  tagline: string
  description: string
  heroImage: string
  galleryImages: SalonGalleryImage[]
  rating: number
  reviews: number
  location: string
  fullAddress: string
  phone: string
  email: string
  website: string
  instagram: string
  openingHours: Record<string, string>
  services: SalonService[]
  zones: SalonZone[]
  designFirm: string
  principalDesigner: string
  designPhilosophy: string
  highlights: string[]
  amenities: string[]
  // New deep profile fields
  hygieneScore: number
  hygieneChecklist: HygieneChecklist
  liveStatus: "available" | "short-wait" | "busy" | "fully-booked"
  waitTime: string
  aiReviewSummary: string
  priceGuarantee: boolean
  stylists: SalonStylist[]
  beforeAfterGallery: BeforeAfterImage[]
}

export const salons: Record<string, SalonData> = {
  "akshita-shoanak": {
    id: "akshita-shoanak",
    name: "Akshita Shoanak Studio Salon",
    tagline: "Where luxury meets comfort — a glamorous journey through refined beauty",
    description:
      "Located in Ulwe, Navi Mumbai, Akshita Shoanak Studio Salon is a sophisticated hospitality space designed by Studio Serif. The salon harmoniously balances luxury and comfort through rich maroon and green palettes, refined textures, and a spatial composition that enhances both experience and elegance. Every element is rooted in a unified design language that celebrates glamour and grace.",
    heroImage: "/images/hero-model.jpg",
    galleryImages: [
      {
        src: "/images/bento-skin-model.jpg",
        alt: "Reception area with maroon-toned desk",
        caption: "Maroon-toned reception with natural sunlight",
      },
      {
        src: "/images/skincare-ritual.jpg",
        alt: "Hairdressing area with green chairs",
        caption: "Elegant hairdressing zone with crystal chandelier",
      },
      {
        src: "/images/natural-leaf.jpg",
        alt: "Skin room with tropical wallpaper",
        caption: "Serene skin room with tropical accents",
      },
      {
        src: "/images/036a9eb7-4aa9-44aa-ba0a-c3a03061efca.png",
        alt: "Pedicure station with maroon chairs",
        caption: "Professional pedicure station",
      },
      {
        src: "/images/add13a77-0251-4025-aa57-2aa5760e6d04.png",
        alt: "Makeup room with illuminated mirror",
        caption: "First floor makeup room with dramatic lighting",
      },
      {
        src: "/images/bf965cf4-e728-4e72-ab1b-16b1cd8f1822.png",
        alt: "Nail art station",
        caption: "Precision nail art station with modern décor",
      },
    ],
    rating: 4.9,
    reviews: 856,
    location: "Ulwe, Navi Mumbai",
    fullAddress: "Sector 19, Ulwe, Navi Mumbai, Maharashtra 410206",
    phone: "+91 98765 43210",
    email: "hello@akshitashoanak.com",
    website: "https://www.akshitashoanak.com",
    instagram: "https://www.instagram.com/akshitashoanakstudio",
    openingHours: {
      Monday: "10:00 AM – 8:00 PM",
      Tuesday: "10:00 AM – 8:00 PM",
      Wednesday: "10:00 AM – 8:00 PM",
      Thursday: "10:00 AM – 8:00 PM",
      Friday: "10:00 AM – 9:00 PM",
      Saturday: "9:00 AM – 9:00 PM",
      Sunday: "9:00 AM – 7:00 PM",
    },
    services: [
      // Hair Services
      { name: "Haircut & Styling", duration: "45 min", price: "₹599", category: "Hair" },
      { name: "Hair Coloring (Global)", duration: "2 hrs", price: "₹2,999", category: "Hair" },
      { name: "Highlights & Balayage", duration: "2.5 hrs", price: "₹4,499", category: "Hair" },
      { name: "Keratin Treatment", duration: "3 hrs", price: "₹5,999", category: "Hair" },
      { name: "Hair Spa & Deep Conditioning", duration: "1 hr", price: "₹1,499", category: "Hair" },
      { name: "Smoothening Treatment", duration: "3 hrs", price: "₹6,999", category: "Hair" },
      // Skin Services
      { name: "Classic Facial", duration: "1 hr", price: "₹999", category: "Skin" },
      { name: "Gold Facial Treatment", duration: "1.5 hrs", price: "₹1,999", category: "Skin" },
      { name: "Anti-Aging Facial", duration: "1.5 hrs", price: "₹2,499", category: "Skin" },
      { name: "De-Tan Treatment", duration: "45 min", price: "₹799", category: "Skin" },
      { name: "Hydra Facial", duration: "1 hr", price: "₹3,499", category: "Skin" },
      // Makeup
      { name: "Party Makeup", duration: "1 hr", price: "₹2,499", category: "Makeup" },
      { name: "Bridal Makeup", duration: "3 hrs", price: "₹15,999", category: "Makeup" },
      { name: "Engagement Makeup", duration: "2 hrs", price: "₹8,999", category: "Makeup" },
      { name: "Air-Brush Makeup", duration: "1.5 hrs", price: "₹4,999", category: "Makeup" },
      // Nails
      { name: "Classic Manicure", duration: "30 min", price: "₹499", category: "Nails" },
      { name: "Gel Nail Extensions", duration: "1.5 hrs", price: "₹1,999", category: "Nails" },
      { name: "Nail Art (per nail)", duration: "15 min", price: "₹149", category: "Nails" },
      { name: "Spa Pedicure", duration: "45 min", price: "₹799", category: "Nails" },
      // Body
      { name: "Full Body Waxing", duration: "1.5 hrs", price: "₹1,999", category: "Body" },
      { name: "Threading & Shaping", duration: "20 min", price: "₹199", category: "Body" },
    ],
    zones: [
      {
        name: "Main Entry & Reception",
        description:
          "The glass-fronted entryway sets a bold tone with blend of signage and polished flooring. A maroon-toned reception desk anchors the space, brightened by natural sunlight through expansive windows with intricate ceiling wallpaper.",
        image: "/images/bento-skin-model.jpg",
      },
      {
        name: "Hairdressing Area",
        description:
          "Featuring lush green chairs and double-height elegantly framed mirrors, a crystal chandelier and intricately papered ceiling add glamorous flourish while integrating luxury and utility seamlessly.",
        image: "/images/skincare-ritual.jpg",
      },
      {
        name: "Nail Art Station",
        description:
          "Designed for precision and style with spacious tables, modern chairs, display accents, and focused lighting that underscore this chic and efficient setting.",
        image: "/images/bf965cf4-e728-4e72-ab1b-16b1cd8f1822.png",
      },
      {
        name: "Skin Room",
        description:
          "A palette of deep green and oakwood tones with tropical wallpaper creates a tranquil environment tailored for calming, personalized skincare rituals.",
        image: "/images/natural-leaf.jpg",
      },
      {
        name: "Pedicure Station",
        description:
          "Outfitted with plush maroon chairs and professional pedicure equipment. Green walls with elaborate murals introduce freshness while adjustable stools and functional lighting elevate the experience.",
        image: "/images/036a9eb7-4aa9-44aa-ba0a-c3a03061efca.png",
      },
      {
        name: "First Floor Makeup Room",
        description:
          "Rich maroon walls and large illuminated mirrors define this dramatic yet inviting setting, tailored for beauty transformations where functionality meets flair.",
        image: "/images/add13a77-0251-4025-aa57-2aa5760e6d04.png",
      },
    ],
    designFirm: "Studio Serif",
    principalDesigner: "Anmol Kataria",
    designPhilosophy:
      "Studio Serif crafted an immersive environment that feels glamorous yet grounded. Each zone reflects a unique identity while maintaining a cohesive visual narrative — from the tropical calm of the skin room to the bold charm of the makeup area. The entire salon follows a single theme, with each space adding to one complete visual story.",
    highlights: [
      "Designed by award-winning Studio Serif",
      "Rich maroon & green colour palette throughout",
      "Crystal chandeliers & designer lighting",
      "Double-height mirrors in hairdressing zone",
      "Tropical-themed skin treatment rooms",
      "Two-floor premium salon experience",
      "Premium imported hair care products",
      "Complimentary beverages during service",
    ],
    amenities: [
      "Free WiFi",
      "Complimentary Beverages",
      "Dedicated Parking",
      "Air Conditioned",
      "Wheelchair Accessible",
      "Online Booking",
      "Card Payment Accepted",
      "Sanitized Equipment",
    ],
    hygieneScore: 96,
    hygieneChecklist: {
      autoclaveSterlization: true,
      freshTowels: true,
      licensedStaff: true,
      disposableKits: true,
      regularSanitization: true,
      airPurification: true,
    },
    liveStatus: "short-wait",
    waitTime: "~15 min",
    aiReviewSummary: "Customers love the keratin treatment and balayage work by Priya. The ambience and crystal chandeliers get frequent praise. Staff is described as friendly and professional. Common feedback: parking can be difficult on weekends, and occasional 10–15 minute wait times during peak hours. Bridal packages are highly recommended.",
    priceGuarantee: true,
    stylists: [
      { id: "priya", name: "Priya Sharma", role: "Senior Hair Stylist", experience: "8 years", speciality: "Balayage & Color", clients: "2,400+", rating: 4.9, reviewCount: 312, image: "/placeholder-user.jpg", availability: "available" },
      { id: "rahul", name: "Rahul Desai", role: "Creative Director", experience: "12 years", speciality: "Precision Cuts", clients: "4,200+", rating: 4.8, reviewCount: 485, image: "/placeholder-user.jpg", availability: "busy" },
      { id: "sneha", name: "Sneha Patel", role: "Skin Specialist", experience: "6 years", speciality: "Hydra Facials", clients: "1,800+", rating: 4.9, reviewCount: 198, image: "/placeholder-user.jpg", availability: "available" },
      { id: "ananya", name: "Ananya Mehta", role: "Makeup Artist", experience: "10 years", speciality: "Bridal Makeup", clients: "3,100+", rating: 4.7, reviewCount: 267, image: "/placeholder-user.jpg", availability: "available" },
      { id: "vikram", name: "Vikram Joshi", role: "Hair Stylist", experience: "5 years", speciality: "Keratin & Smoothening", clients: "1,500+", rating: 4.8, reviewCount: 156, image: "/placeholder-user.jpg", availability: "off" },
      { id: "divya", name: "Divya Nair", role: "Nail Artist", experience: "4 years", speciality: "Gel Extensions & Art", clients: "1,200+", rating: 4.7, reviewCount: 134, image: "/placeholder-user.jpg", availability: "available" },
    ],
    beforeAfterGallery: [
      { before: "/images/bento-skin-model.jpg", after: "/images/skincare-ritual.jpg", service: "Balayage", stylist: "Priya Sharma" },
      { before: "/images/natural-leaf.jpg", after: "/images/hero-model.jpg", service: "Keratin Treatment", stylist: "Vikram Joshi" },
      { before: "/images/036a9eb7-4aa9-44aa-ba0a-c3a03061efca.png", after: "/images/add13a77-0251-4025-aa57-2aa5760e6d04.png", service: "Bridal Makeup", stylist: "Ananya Mehta" },
    ],
  },
}
