"use client"

import { useState } from "react"
import { MobileHeader } from "@/components/mobile-header"
import { NumericKeypad } from "@/components/numeric-keypad"
import { useRouter } from "next/navigation"

export default function BringMoneyPage() {
  const [amount, setAmount] = useState("$00.00")
  const router = useRouter()

  const handleNumberPress = (number: string) => {
    if (amount === "$00.00") {
      setAmount(`$${number}0.00`)
    } else {
      // Simple logic for demo - in real app, would handle decimal places properly
      const cleanAmount = amount.replace(/[$,]/g, "")
      const newAmount = cleanAmount.slice(0, -4) + number + cleanAmount.slice(-3)
      setAmount(`$${newAmount}`)
    }
  }

  const handleBackspace = () => {
    if (amount.length > 5) {
      const cleanAmount = amount.replace(/[$,]/g, "")
      const newAmount = cleanAmount.slice(0, -4) + "0" + cleanAmount.slice(-3)
      setAmount(`$${newAmount}`)
    } else {
      setAmount("$00.00")
    }
  }

  const handleDone = () => {
    // Process the amount and navigate back
    router.back()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MobileHeader title="Bring money" showBack onBack={() => router.back()} />

      <div className="flex-1 flex flex-col justify-between">
        <div className="px-6 py-8">
          {/* User greeting */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hello,</p>
              <p className="font-semibold">oBoticario!</p>
            </div>
          </div>

          <p className="text-lg font-medium mb-2">Your balance is US$1000</p>

          <div className="mt-8">
            <p className="text-lg font-semibold mb-4">Put credit</p>
            <p className="text-sm text-gray-600 mb-2">Value:</p>
            <div className="text-4xl font-light text-gray-400 border-b-2 border-lumina-teal pb-2">{amount}</div>
          </div>
        </div>

        <NumericKeypad onNumberPress={handleNumberPress} onBackspace={handleBackspace} onDone={handleDone} />
      </div>
    </div>
  )
}
