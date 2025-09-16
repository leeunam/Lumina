"use client"

import { useState } from "react"
import { MobileHeader } from "../../components/MobileHeader"
import { NumericKeypad } from "../../components/NumericKeypad"

export function CompanyExpenses() {
  const [amount, setAmount] = useState("$00.00")

  const handleNumberPress = (number: string) => {
    if (amount === "$00.00") {
      setAmount(`$${number}0.00`)
    } else {
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
    }
  }

  const handleDone = () => {
    console.log("Recording expense:", amount)
  }

  return (
    <div className="mobile-container">
      <MobileHeader title="Choose your expenses" />

      <div style={{ padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "40px" }}>Enter the entry value:</h2>

        <div
          style={{
            fontSize: "32px",
            fontWeight: "300",
            color: "var(--lumina-dark-gray)",
            borderBottom: "2px solid var(--lumina-teal)",
            paddingBottom: "8px",
            marginBottom: "60px",
            display: "inline-block",
            minWidth: "200px",
          }}
        >
          {amount}
        </div>
      </div>

      <NumericKeypad onNumberPress={handleNumberPress} onBackspace={handleBackspace} onDone={handleDone} />
    </div>
  )
}
