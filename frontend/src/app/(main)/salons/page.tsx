import { Suspense } from "react"
import { SalonsContent } from "./salons-content"

export default function SalonsPage() {
  return (
    <Suspense fallback={null}>
      <SalonsContent />
    </Suspense>
  )
}
