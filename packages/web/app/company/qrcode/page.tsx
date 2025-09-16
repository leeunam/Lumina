"use client"

import { MobileHeader } from "../../../components/MobileHeader"
import { useRouter } from "next/navigation"

export default function QRCodePage() {
  const router = useRouter()
  const couponValue = "US$10,00"

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader title="Generate QRcode" showBack showDropdown onBack={() => router.back()} />

      <div className="px-6 py-8 text-center">
        <h2 className="text-2xl font-bold mb-8">Get your coupon</h2>

        <div className="bg-gray-100 rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-600 mb-2">Value:</p>
            <p className="text-3xl font-bold text-lumina-teal">{couponValue}</p>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-6 rounded-xl shadow-sm mx-auto max-w-xs">
            {/* QR Code corners */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-lumina-yellow rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-lumina-yellow rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-lumina-yellow rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-lumina-yellow rounded-br-lg" />

              {/* QR Code Pattern */}
              <div className="p-4">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 ${
                        Math.random() > 0.5 ? "bg-black" : "bg-white"
                      } ${i % 8 === 0 || i % 8 === 7 || i < 8 || i >= 56 ? "bg-black" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-500 mt-4">Scanning Code...</p>
        </div>
      </div>
    </div>
  )
}
