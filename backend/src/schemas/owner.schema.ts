import { z } from "zod";

// ─── Salon ───────────────────────────────────────────────────────
export const updateSalonSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    tagline: z.string().max(500).optional(),
    description: z.string().max(5000).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional().or(z.literal("")),
    full_address: z.string().max(500).optional(),
    location: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    hero_image: z.string().max(1000).optional(),
    price_guarantee: z.boolean().optional(),
    live_status: z.enum(["available", "short-wait", "busy", "fully-booked"]).optional(),
    wait_time: z.string().max(50).optional(),
    hc_autoclave: z.boolean().optional(),
    hc_fresh_towels: z.boolean().optional(),
    hc_licensed_staff: z.boolean().optional(),
    hc_disposable_kits: z.boolean().optional(),
    hc_sanitization: z.boolean().optional(),
    hc_air_purification: z.boolean().optional(),
    highlights: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    instagram: z.string().url().optional().or(z.literal("")),
    opening_hours: z.record(z.string(), z.string()).optional(),
    offers: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      originalPrice: z.string().optional(),
      offerPrice: z.string(),
      badge: z.string().optional(),
      validity: z.string().optional(),
    })).optional(),
    products: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    faqs: z.array(z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
    })).optional(),
    gallery: z.array(z.object({
      id: z.string(),
      src: z.string(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    })).optional(),
  }).optional().default({}),
  params: z.object({ salonId: z.string().uuid() }).optional(),
});

export const createSalonSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255),
    city: z.string().max(100).optional(),
    full_address: z.string().max(500).optional(),
  }),
});

export const uploadImageSchema = z.object({
  body: z.object({
    filename: z.string().min(1),
    contentType: z.string().min(1),
    base64Data: z.string().min(1),
  }),
});

// ─── Staff ───────────────────────────────────────────────────────
export const createStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255),
    role: z.string().max(100).optional(),
    speciality: z.string().max(255).optional(),
    experience: z.string().max(100).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional(),
    photo: z.string().max(1000).optional(),
    availability: z.enum(["available", "busy", "off"]).optional(),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    role: z.string().max(100).optional(),
    speciality: z.string().max(255).optional(),
    experience: z.string().max(100).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional(),
    photo: z.string().max(1000).optional(),
    availability: z.enum(["available", "busy", "off"]).optional(),
  }),
});

export const blockSlotSchema = z.object({
  body: z.object({
    staff_id: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
    reason: z.string().max(255).optional(),
  }),
});

// ─── Services ────────────────────────────────────────────────────
export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255),
    category: z.string().min(2).max(100),
    price: z.number().int().positive(),
    duration: z.number().int().positive(),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    category: z.string().min(2).max(100).optional(),
    price: z.number().int().positive().optional(),
    duration: z.number().int().positive().optional(),
    is_active: z.boolean().optional(),
  }),
});

// ─── Appointments ────────────────────────────────────────────────
export const createAppointmentSchema = z.object({
  body: z.object({
    service_ids: z.array(z.string()),
    service_names: z.array(z.string()),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
    total_price: z.number().int().min(0),
    staff_id: z.string().uuid().optional().nullable(),
    customer_name: z.string().min(1).max(255),
    customer_phone: z.string().max(50).optional(),
    notes: z.string().max(1000).optional(),
    is_walk_in: z.boolean().optional(),
    status: z.enum(["pending", "confirmed", "completed", "cancelled", "no-show"]).optional(),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "confirmed", "completed", "cancelled", "no-show"]),
  }),
});

export const rescheduleAppointmentSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  }),
});

// ─── Customers ───────────────────────────────────────────────────
export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(255).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().email().optional(),
    notes: z.string().max(2000).optional(),
    tag: z.enum(["vip", "regular", "at-risk"]).optional(),
  }),
});

// ─── Analytics ───────────────────────────────────────────────────
export const analyticsQuerySchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
  }),
});

export const dateQuerySchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  }),
});

export const dateRangeQuerySchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  }),
});
