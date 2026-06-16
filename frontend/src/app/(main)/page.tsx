import { HeroSection } from "@/components/boty/hero-section"
import { TrustBar } from "@/components/boty/trust-bar"
import { FeaturedSalons } from "@/components/boty/featured-salons"
import { CategorySection } from "@/components/boty/category-section"
import { PopularServices } from "@/components/boty/popular-services"
import { Testimonials } from "@/components/boty/testimonials"
import { CTABanner } from "@/components/boty/cta-banner"
import { AISearchButton } from "@/components/boty/ai-search-button"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <CategorySection />
      <FeaturedSalons />
      <PopularServices />
      <Testimonials />
      <CTABanner />
      <AISearchButton />
    </main>
  )
}
