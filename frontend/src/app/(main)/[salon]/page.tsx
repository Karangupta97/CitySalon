import { notFound, redirect } from "next/navigation";
import SalonProfileClient from "@/components/salon/salon-profile-client";
import { salons } from "@/data/salons";

// Define reserved words to prevent matching system routes
const RESERVED = new Set([
  "login", "signup", "book", "admin", "api", "settings",
  "auth", "advisor", "owner", "salons", "shop", "product",
  "privacy", "terms"
]);

function getMockSalon(username: string) {
  const lowercase = username.toLowerCase();
  if (salons[lowercase]) {
    return salons[lowercase];
  }
  // Try matching static mock name slug (e.g. if username is case-insensitive or slightly different)
  const mockMatch = Object.entries(salons).find(([key, s]) => {
    return (
      key.toLowerCase() === lowercase ||
      s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === lowercase
    );
  });
  return mockMatch ? mockMatch[1] : null;
}

function isValidUsername(username: string): boolean {
  return /^[a-z0-9_]{3,30}$/i.test(username);
}

function getApiUrl(): string {
  const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  return RAW_API_URL.endsWith("/api/v1")
    ? RAW_API_URL
    : RAW_API_URL.replace(/\/+$/, "") + "/api/v1";
}

export async function generateMetadata({ params }: { params: Promise<{ salon: string }> }) {
  const { salon } = await params;
  const username = salon;

  // Check mock salon first
  const mockSalon = getMockSalon(username);
  if (mockSalon) {
    return {
      title: `${mockSalon.name} - Book Online | CitySalon`,
      description: mockSalon.description || `${mockSalon.name} is verified on CitySalon. Browse services, reviews, and book appointments online.`,
      openGraph: {
        title: `${mockSalon.name} | CitySalon`,
        description: mockSalon.tagline || mockSalon.description,
        images: [
          {
            url: mockSalon.heroImage,
            width: 1200,
            height: 630,
            alt: mockSalon.name,
          }
        ]
      }
    };
  }

  if (RESERVED.has(username.toLowerCase()) || !isValidUsername(username)) {
    return {
      title: "Salon Not Found | CitySalon",
      description: "The salon profile you are looking for does not exist."
    };
  }

  const API_URL = getApiUrl();
  try {
    const res = await fetch(`${API_URL}/public/salons/${username}`, {
      next: { revalidate: 60 } // Next.js ISR (Incremental Static Regeneration)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.status === "success" && json.data) {
        const salon = json.data;
        return {
          title: `${salon.name} - Book Online | CitySalon`,
          description: salon.description || `${salon.name} is verified on CitySalon. Browse services, reviews, and book appointments online.`,
          openGraph: {
            title: `${salon.name} | CitySalon`,
            description: salon.tagline || salon.description,
            images: [
              {
                url: salon.heroImage,
                width: 1200,
                height: 630,
                alt: salon.name,
              }
            ]
          }
        };
      }
    }
  } catch (e) {
    console.error("Error generating metadata:", e);
  }

  return {
    title: "Salon Profile | CitySalon",
    description: "Book appointments online at your favorite beauty salon."
  };
}

export default async function SalonPersonalPage({ params }: { params: Promise<{ salon: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.salon;

  // 1. Route resolution: prioritize system routes
  if (RESERVED.has(username.toLowerCase())) {
    return notFound();
  }

  // 1.5 Check mock salon
  const mockSalon = getMockSalon(username);
  if (mockSalon) {
    return <SalonProfileClient initialSalon={mockSalon} username={username} />;
  }

  // 2. Validate username
  if (!isValidUsername(username)) {
    return notFound();
  }

  const API_URL = getApiUrl();
  let salon = null;

  try {
    const res = await fetch(`${API_URL}/public/salons/${username}`, {
      next: { revalidate: 60 } // Cache profile with ISR
    });
    if (res.ok) {
      const json = await res.json();
      
      // 3. Support username change with redirects from old username
      if (json.status === "redirect" && json.redirectTo) {
        redirect(`/${json.redirectTo}`);
      }
      
      if (json.status === "success" && json.data) {
        salon = json.data;
      }
    }
  } catch (e) {
    console.error("Error fetching salon on server:", e);
  }

  // 4. Return 404 if not found
  if (!salon) {
    return notFound();
  }

  return <SalonProfileClient initialSalon={salon} username={username} />;
}
