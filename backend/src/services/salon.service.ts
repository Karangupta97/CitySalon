import { SalonRepository, SalonRow } from "@repositories/salon.repository";
import { NotFoundError, BadRequestError } from "@errors/HttpError";
import { logger } from "@utils/logger";
import { AUTH_CONFIG } from "@config/auth.config";
import { getSupabaseAdmin } from "@config/db";

const RESERVED_USERNAMES = new Set([
  "login", "signup", "book", "admin", "api", "settings",
  "auth", "advisor", "owner", "salons", "shop", "product",
  "privacy", "terms", "static", "images", "favicon", "favicon.ico",
  "sw.js", "robots.txt", "sitemap.xml", "dashboard", "register"
]);

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function formatUsername(name: string): string {
  let username = name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/__+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (username.length < 3) {
    username = (username + '_salon').substring(0, 30);
  }
  if (username.length > 30) {
    username = username.substring(0, 30);
  }
  return username;
}

function isValidUsername(username: string): boolean {
  return /^[a-z0-9_]{3,30}$/.test(username);
}

async function checkHistoryOrRedirect(username: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from("username_history")
    .select("salon_id")
    .eq("old_username", username.toLowerCase())
    .maybeSingle();
  if (error) return false;
  return !!data;
}

async function generateUniqueUsername(name: string): Promise<string> {
  const baseUsername = formatUsername(name);
  let username = baseUsername;
  
  while (true) {
    const existing = await SalonRepository.findByUsername(username);
    const previouslyUsed = await checkHistoryOrRedirect(username);
    if (!existing && !previouslyUsed && !RESERVED_USERNAMES.has(username)) {
      break;
    }
    const rand = Math.floor(100 + Math.random() * 900);
    const suffix = `_${rand}`;
    username = baseUsername.substring(0, 30 - suffix.length) + suffix;
  }
  return username;
}

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await SalonRepository.findBySlug(slug);
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

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
    username: formatUsername(demoAccount.salon.name),
    verified: true,
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
   * Checks if a username is available.
   */
  static async checkUsernameAvailability(username: string, excludeSalonId?: string): Promise<{ available: boolean; reason?: string }> {
    const sanitized = username.toLowerCase().trim();
    if (!isValidUsername(sanitized)) {
      return { available: false, reason: "Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores." };
    }
    if (RESERVED_USERNAMES.has(sanitized)) {
      return { available: false, reason: "This username is reserved and cannot be used." };
    }
    
    // Check main table
    const existing = await SalonRepository.findByUsername(sanitized);
    if (existing && existing.id !== excludeSalonId) {
      return { available: false, reason: "Username is already taken." };
    }

    // Check history table
    const { data: historyData } = await getSupabaseAdmin()
      .from("username_history")
      .select("salon_id")
      .eq("old_username", sanitized)
      .maybeSingle();

    if (historyData && historyData.salon_id !== excludeSalonId) {
      return { available: false, reason: "Username is reserved (previously used by another salon)." };
    }

    return { available: true };
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
      return {
        id: `demo-salon-${Date.now()}`,
        owner_id: ownerId,
        name: data.name || "Demo Salon",
        username: formatUsername(data.name || "Demo Salon"),
        city: data.city,
        full_address: data.full_address,
      } as SalonRow;
    }

    const slug = data.slug ? slugify(data.slug) : await generateUniqueSlug(data.name || "Untitled Salon");
    
    // Process and validate username
    let username = data.username ? data.username.toLowerCase().trim() : "";
    if (username) {
      const avail = await this.checkUsernameAvailability(username);
      if (!avail.available) {
        username = await generateUniqueUsername(data.name || "Untitled Salon");
      }
    } else {
      username = await generateUniqueUsername(data.name || "Untitled Salon");
    }

    const salon = await SalonRepository.create({
      ...data,
      owner_id: ownerId,
      name: data.name || "Untitled Salon",
      slug,
      username,
    } as SalonRow);
    logger.info("Salon created", { salonId: salon.id, ownerId, username });
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
    const existing = await this.getMySalon(ownerId, salonId);

    // If username changes, handle redirect history
    if (data.username && data.username.toLowerCase().trim() !== existing.username?.toLowerCase()) {
      const newUsername = data.username.toLowerCase().trim();
      const availability = await this.checkUsernameAvailability(newUsername, salonId);
      if (!availability.available) {
        throw new BadRequestError(availability.reason || "Username is not available.");
      }

      // Safe to change! Store old username in history for redirection
      if (existing.username) {
        // Delete any history for the *new* username to prevent self-referencing loops
        await getSupabaseAdmin()
          .from("username_history")
          .delete()
          .eq("old_username", newUsername);

        // Insert old username into history
        await getSupabaseAdmin()
          .from("username_history")
          .insert({
            salon_id: salonId,
            old_username: existing.username.toLowerCase(),
          });
        logger.info("Saved old username to history for redirects", { salonId, old: existing.username, new: newUsername });
      }
      data.username = newUsername;
    }

    const updated = await SalonRepository.update(salonId, data);
    logger.info("Salon updated", { salonId });
    return updated;
  }
}
