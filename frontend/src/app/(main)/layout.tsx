import React from "react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
