import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | CitySalon",
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">Last updated: June 2026</p>

      <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
        <p>
          By accessing or using CitySalon, you agree to be bound by these Terms of Service.
          If you do not agree, please do not use the platform.
        </p>

        <h2 className="text-lg font-semibold text-foreground">2. Use of Services</h2>
        <p>
          CitySalon provides salon discovery, booking, and management tools. You must provide
          accurate information when creating an account and are responsible for maintaining the
          confidentiality of your credentials.
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Salon Partners</h2>
        <p>
          Salon owners who register on the platform agree to keep their service listings,
          pricing, and availability information accurate and up to date.
        </p>

        <h2 className="text-lg font-semibold text-foreground">4. Bookings &amp; Cancellations</h2>
        <p>
          Appointment bookings are subject to availability. Cancellation policies are set by
          individual salons and will be displayed at the time of booking.
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. Limitation of Liability</h2>
        <p>
          CitySalon acts as a platform connecting customers with salons. We are not liable for
          the quality of services provided by partner salons.
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
        <p>
          For questions about these terms, reach out to us at support@citysalon.in.
        </p>
      </section>
    </main>
  )
}
