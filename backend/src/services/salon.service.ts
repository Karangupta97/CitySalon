import { SalonRepository, SalonRow } from "@repositories/salon.repository";
import { NotFoundError } from "@errors/HttpError";
import { logger } from "@utils/logger";
import { AUTH_CONFIG } from "@config/auth.config";

/**
 * Returns mock salon data for demo/judge accounts that bypass the database.
 */
function getDemoSalonData(ownerId: string, salonId: string): SalonRow | null {
  const demoAccounts = Object.values(AUTH_CONFIG.DEMO_ACCOUNTS);
  const demoAccount = demoAccounts.find(
    (a) => a.id === ownerId && a.salon?.id === salonId
  );
  if (!demoAccount || !demoAccount.salon) return null;

  return {
    id: demoAccount.salon.id,
    owner_id: demoAccount.id,
    name: demoAccount.salon.name,
    tagline: "Where beauty meets care, every day",
    description: "A premium demo salon for showcasing the CitySalon platform.",
    phone: demoAccount.phone_number || "+91 98765 43210",
    email: demoAccount.email,
    website: "https://citysalon.in",
    instagram: "https://instagram.com/citysalon",
    full_address: `${demoAccount.salon.location}, ${demoAccount.salon.city}`,
    city: demoAccount.salon.city,
    location: demoAccount.salon.location,
    hero_image: "/hero/Hero.svg",
    rating: demoAccount.salon.rating,
    review_count: demoAccount.salon.review_count,
    hygiene_score: 95,
    price_guarantee: true,
    live_status: "available",
    wait_time: "0 min",
    is_active: true,
    hc_autoclave: true,
    hc_fresh_towels: true,
    hc_licensed_staff: true,
    hc_disposable_kits: true,
    hc_sanitization: true,
    hc_air_purification: false,
    highlights: ["Premium service", "Certified stylists", "Organic products"],
    amenities: ["Free WiFi", "Complimentary Beverages", "Air Conditioned"],
    opening_hours: {
      Monday: "10:00 AM – 8:00 PM",
      Tuesday: "10:00 AM – 8:00 PM",
      Wednesday: "10:00 AM – 8:00 PM",
      Thursday: "10:00 AM – 8:00 PM",
      Friday: "10:00 AM – 9:00 PM",
      Saturday: "9:00 AM – 9:00 PM",
      Sunday: "10:00 AM – 6:00 PM",
    },
    gallery: [],
    offers: [],
    products: [],
    faqs: [],
  };
}

/**
 * Check if a salon ID belongs to a demo account (non-UUID format).
 */
function isDemoSalonId(salonId: string): boolean {
  return salonId.startsWith("demo-");
}

export class SalonService {
  /**
   * Returns all salons for a given owner.
   */
  static async getMySalons(ownerId: string): Promise<SalonRow[]> {
    // Demo owners: return their mock salon from config
    if (ownerId.startsWith("demo-")) {
      const demoAccounts = Object.values(AUTH_CONFIG.DEMO_ACCOUNTS);
      const demoAccount = demoAccounts.find((a) => a.id === ownerId);
      if (demoAccount?.salon) {
        const mockSalon = getDemoSalonData(ownerId, demoAccount.salon.id);
        return mockSalon ? [mockSalon] : [];
      }
      return [];
    }
    return SalonRepository.findByOwnerId(ownerId);
  }

  /**
   * Returns a single salon if the owner matches.
   */
  static async getMySalon(ownerId: string, salonId: string): Promise<SalonRow> {
    // Demo accounts: return mock data without DB query
    if (isDemoSalonId(salonId) || ownerId.startsWith("demo-")) {
      const demoSalon = getDemoSalonData(ownerId, salonId);
      if (demoSalon) return demoSalon;
      throw new NotFoundError("Salon not found or you do not have access.");
    }

    const salon = await SalonRepository.findByOwnerAndId(ownerId, salonId);
    if (!salon) throw new NotFoundError("Salon not found or you do not have access.");
    return salon;
  }

  /**
   * Creates a salon and assigns ownership to the caller.
   */
  static async createSalon(ownerId: string, data: Partial<SalonRow>): Promise<SalonRow> {
    // Demo accounts can't create real salons
    if (ownerId.startsWith("demo-")) {
      const demoAccounts = Object.values(AUTH_CONFIG.DEMO_ACCOUNTS);
      const demoAccount = demoAccounts.find((a) => a.id === ownerId);
      if (demoAccount?.salon) {
        const mockSalon = getDemoSalonData(ownerId, demoAccount.salon.id);
        if (mockSalon) return mockSalon;
      }
      // Return a mock salon for demo
      return {
        id: `demo-salon-${Date.now()}`,
        owner_id: ownerId,
        name: data.name || "Demo Salon",
        city: data.city,
        full_address: data.full_address,
      } as SalonRow;
    }

    const salon = await SalonRepository.create({
      ...data,
      owner_id: ownerId,
      name: data.name || "Untitled Salon",
    } as SalonRow);
    logger.info("Salon created", { salonId: salon.id, ownerId });
    return salon;
  }

  /**
   * Updates salon profile info.
   */
  static async updateSalon(ownerId: string, salonId: string, data: Partial<SalonRow>): Promise<SalonRow> {
    // Demo accounts: return merged mock data without DB write
    if (isDemoSalonId(salonId) || ownerId.startsWith("demo-")) {
      const existingSalon = await this.getMySalon(ownerId, salonId);
      logger.info("Demo salon update (no-op)", { salonId });
      return { ...existingSalon, ...data };
    }

    // Verify ownership
    await this.getMySalon(ownerId, salonId);
    const updated = await SalonRepository.update(salonId, data);
    logger.info("Salon updated", { salonId });
    return updated;
  }
}
