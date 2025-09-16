"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LuminaLogo } from "@/components/lumina-logo"
import { useRouter } from "next/navigation"

export default function UserSelectionPage() {
  const [selectedType, setSelectedType] = useState<"company" | "person" | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedType === "company") {
      router.push("/company/login")
    } else if (selectedType === "person") {
      router.push("/person/login")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <LuminaLogo className="mb-16" />

      <div className="w-full max-w-sm space-y-4 mb-8">
        {/* Company Option */}
        <button
          onClick={() => setSelectedType("company")}
          className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
            selectedType === "company"
              ? "bg-lumina-yellow border-lumina-yellow"
              : "bg-gray-100 border-gray-200 hover:border-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full ${
              selectedType === "company" ? "bg-lumina-yellow border-2 border-yellow-600" : "bg-gray-300"
            }`}
          />
          <span className="text-lg font-medium text-black">{"I'm a company"}</span>
        </button>

        {/* Person Option */}
        <button
          onClick={() => setSelectedType("person")}
          className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
            selectedType === "person"
              ? "bg-lumina-yellow border-lumina-yellow"
              : "bg-gray-100 border-gray-200 hover:border-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full ${
              selectedType === "person" ? "bg-lumina-yellow border-2 border-yellow-600" : "bg-gray-300"
            }`}
          />
          <span className="text-lg font-medium text-black">I am a person</span>
        </button>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedType}
        className="w-full max-w-sm bg-lumina-yellow hover:bg-lumina-yellow/90 text-black font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </Button>
    </div>
  )
}
