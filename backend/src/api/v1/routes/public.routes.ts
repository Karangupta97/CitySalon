import { Router, Request, Response } from "express";
import { StorageService } from "@services/storage.service";
import { asyncHandler } from "@utils/asyncHandler";
import { NotFoundError } from "@errors/HttpError";
import { getSupabaseAdmin } from "@config/db";
import { logger } from "@utils/logger";
import { ServiceRepository } from "@repositories/service.repository";
import { StaffRepository } from "@repositories/staff.repository";
import { cache } from "@utils/cache";

const router = Router();

/**
 * GET /public/images/:folder/:filename — Proxy S3 image files
 * Streams private S3 files back to client securely.
 */
router.get(
  "/images/:folder/:filename",
  asyncHandler(async (req: Request, res: Response) => {
    const { folder, filename } = req.params;
    const s3Key = `${folder}/${filename}`;

    try {
      const s3Response = await StorageService.getObjectStream(s3Key);
      if (!s3Response || !s3Response.Body) {
        throw new NotFoundError("Image not found.");
      }

      // Set headers
      if (s3Response.ContentType) {
        res.setHeader("Content-Type", s3Response.ContentType);
      }
      if (s3Response.ContentLength) {
        res.setHeader("Content-Length", s3Response.ContentLength);
      }
      res.setHeader("Cache-Control", "public, max-age=31536000");
      // Allow cross-origin access so the frontend can display these images
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");

      // Stream the response body
      const stream = s3Response.Body as any;
      stream.pipe(res);
    } catch (err: any) {
      if (err.name === "NoSuchKey") {
        throw new NotFoundError("Image not found.");
      }
      throw err;
    }
  })
);

/**
 * GET /public/salons — Get all registered active salons
 */
router.get(
  "/salons",
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from("salons")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Map rows to SalonListItem schema for frontend compat
      const mapped = (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        username: s.username,
        verified: !!s.verified,
        tagline: s.tagline || "Where beauty meets care, every day",
        image: s.hero_image || "/images/hero-model.jpg",
        rating: s.rating || 5.0,
        reviews: s.review_count || 1,
        location: s.location || s.city || "Mumbai",
        services: s.highlights || ["Hair", "Skin", "Makeup"],
        badge: "New",
        badgeColor: "bg-primary text-primary-foreground",
        priceRange: "₹₹",
        liveStatus: s.live_status || "available",
        waitTime: s.wait_time || "Walk-in",
        hygieneScore: s.hygiene_score || 95,
        distance: "1.2 km",
        openNow: true,
      }));

      res.status(200).json({ status: "success", data: mapped });
    } catch (err: any) {
      // Fail gracefully: if table doesn't exist or DB is offline, return empty list
      res.status(200).json({ status: "success", data: [] });
    }
  })
);

/**
 * GET /public/salons/:idOrSlug — Get salon details by ID or Username Slug
 */
router.get(
  "/salons/:idOrSlug",
  asyncHandler(async (req: Request, res: Response) => {
    const idOrSlug = req.params.idOrSlug as string;

    // Check cache first
    const cacheKey = `salon:${idOrSlug.toLowerCase()}`;
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      if (cachedData.status === "redirect") {
        return res.status(200).json(cachedData);
      }
      return res.status(200).json({ status: "success", data: cachedData });
    }

    let salon: any = null;
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrSlug);

    try {
      // 1. Query by username first (case-insensitive)
      const { data: userRow, error: userErr } = await getSupabaseAdmin()
        .from("salons")
        .select("*")
        .ilike("username", idOrSlug)
        .maybeSingle();
      if (userErr) throw userErr;

      if (userRow) {
        salon = userRow;
      } else {
        // 2. Query by UUID if applicable
        if (isUuid) {
          const { data, error } = await getSupabaseAdmin()
            .from("salons")
            .select("*")
            .eq("id", idOrSlug)
            .maybeSingle();
          if (error) throw error;
          salon = data;
        } else {
          // 3. Query by slug (legacy support)
          const { data: slugData, error: slugErr } = await getSupabaseAdmin()
            .from("salons")
            .select("*")
            .ilike("slug", idOrSlug)
            .maybeSingle();
          if (slugErr) throw slugErr;

          if (slugData) {
            salon = slugData;
          } else {
            // 4. Check username_history for redirects (SEO preservation)
            const { data: histRow, error: histErr } = await getSupabaseAdmin()
              .from("username_history")
              .select("salon_id")
              .ilike("old_username", idOrSlug)
              .maybeSingle();
            if (histErr) throw histErr;

            if (histRow) {
              // Fetch salon to get current username
              const { data: curSalon, error: curErr } = await getSupabaseAdmin()
                .from("salons")
                .select("username")
                .eq("id", histRow.salon_id)
                .maybeSingle();
              if (curErr) throw curErr;

              if (curSalon) {
                const redirectRes = { status: "redirect", redirectTo: curSalon.username };
                // Cache the redirect for 5 minutes
                await cache.set(cacheKey, redirectRes, 300);
                return res.status(200).json(redirectRes);
              }
            }

            // 5. Fallback: Query by name slug (convert hyphen to space)
            const nameQuery = idOrSlug.replace(/-/g, " ");
            const { data: nameData, error: nameErr } = await getSupabaseAdmin()
              .from("salons")
              .select("*")
              .ilike("name", nameQuery)
              .maybeSingle();
            if (nameErr) throw nameErr;
            salon = nameData;
          }
        }
      }
    } catch (err) {
      logger.error("Failed to query salon by ID or Slug", { idOrSlug, err });
    }

    if (!salon) {
      throw new NotFoundError("Salon not found.");
    }

    // Fetch services and staff
    let services: any[] = [];
    let staff: any[] = [];
    try {
      const servicesData = await ServiceRepository.findBySalonId(salon.id, true);
      services = servicesData || [];
    } catch (err) {
      logger.error("Failed to fetch services for public salon", { salonId: salon.id, err });
    }

    try {
      const staffData = await StaffRepository.findBySalonId(salon.id, true);
      staff = staffData || [];
    } catch (err) {
      logger.error("Failed to fetch staff for public salon", { salonId: salon.id, err });
    }

    // Map to frontend expected SalonData shape
    const mappedServices = services.map((svc: any) => ({
      name: svc.name,
      price: `₹${svc.price}`,
      duration: `${svc.duration} min`,
      category: svc.category,
    }));

    const mappedStylists = staff.map((st: any) => ({
      id: st.id,
      name: st.name,
      role: st.role || "Stylist",
      rating: st.rating || 5.0,
      reviewCount: st.review_count || 1,
      experience: st.experience || "3 years",
      clients: st.clients || "100+",
      speciality: st.speciality || "Haircut",
      availability: st.availability || "available",
    }));

    const mapped = {
      id: salon.id,
      name: salon.name,
      tagline: salon.tagline || "Where beauty meets care, every day",
      heroImage: salon.hero_image || "/images/hero-model.jpg",
      rating: salon.rating || 5.0,
      reviews: salon.review_count || 1,
      location: salon.location || salon.city || "Mumbai",
      fullAddress: salon.full_address || `${salon.location || ""}, ${salon.city || ""}`,
      liveStatus: salon.live_status || "available",
      waitTime: salon.wait_time || "Walk-in",
      priceGuarantee: salon.price_guarantee ?? true,
      hygieneScore: salon.hygiene_score || 95,
      description: salon.description || "A premium salon experience offering top-tier services.",
      aiReviewSummary: salon.aiReviewSummary || salon.ai_review_summary || "Customers appreciate the cleanliness, professional staff, and excellent value.",
      hygieneChecklist: {
        autoclaveSterlization: salon.hc_autoclave ?? true,
        freshTowels: salon.hc_fresh_towels ?? true,
        licensedStaff: salon.hc_licensed_staff ?? true,
        disposableKits: salon.hc_disposable_kits ?? true,
        regularSanitization: salon.hc_sanitization ?? true,
        airPurification: salon.hc_air_purification ?? false,
      },
      services: mappedServices,
      stylists: mappedStylists,
      galleryImages: salon.gallery || [
        { src: "/images/hero-model.jpg", alt: "Salon Interior", caption: "Welcome to our salon" }
      ],
      beforeAfterGallery: salon.before_after || [],
      highlights: salon.highlights || ["Premium Services", "Certified Stylists", "Hygienic Environment"],
      amenities: salon.amenities || ["Air Conditioned", "Card Payment Accepted", "Free WiFi"],
      phone: salon.phone || "",
      email: salon.email || "",
      website: salon.website || "",
      instagram: salon.instagram || "",
      openingHours: salon.opening_hours || {
        Monday: "10:00 AM – 8:00 PM",
        Tuesday: "10:00 AM – 8:00 PM",
        Wednesday: "10:00 AM – 8:00 PM",
        Thursday: "10:00 AM – 8:00 PM",
        Friday: "10:00 AM – 9:00 PM",
        Saturday: "9:00 AM – 9:00 PM",
        Sunday: "10:00 AM – 6:00 PM",
      },
    };

    res.status(200).json({ status: "success", data: mapped });
  })
);

export default router;
