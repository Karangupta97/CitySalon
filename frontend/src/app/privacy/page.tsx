import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | CitySalon",
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">Last updated: June 2026</p>

      <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
        <p>
          We collect personal information you provide when registering, booking appointments,
          or contacting support — including your name, email, phone number, and booking
          preferences.
        </p>

        <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
        <p>
          Your information is used to facilitate bookings, communicate appointment updates,
          improve our services, and provide customer support.
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Data Sharing</h2>
        <p>
          We share relevant booking details with salon partners to fulfill your appointments.
          We do not sell your personal data to third parties.
        </p>

        <h2 className="text-lg font-semibold text-foreground">4. Data Security</h2>
        <p>
          We implement industry-standard security measures including encryption, secure token
          storage, and regular security audits to protect your information.
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. Analytics cookies
          are used only to improve the platform experience.
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any
          time by contacting support@citysalon.in.
        </p>

        <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
        <p>
          For privacy-related inquiries, email us at privacy@citysalon.in.
        </p>
      </section>
    </main>
  )
}
