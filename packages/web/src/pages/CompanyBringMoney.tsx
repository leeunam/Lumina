"use client"

import { useState } from "react"
import { MobileHeader } from "../../components/MobileHeader";
import { NumericKeypad } from "../../components/NumericKeypad"

export function CompanyBringMoney() {
  const [amount, setAmount] = useState("$00.00")

  const handleNumberPress = (number: string) => {
    if (amount === "$00.00") {
      setAmount(`$${number}0.00`)
    } else {
      // Simple logic for demo - in real app, handle decimal places properly
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
    // Handle payment processing
    console.log("Processing payment:", amount)
  }

  return (
    <div className="mobile-container">
      <MobileHeader title="Bring money" />

      <div style={{ padding: "24px" }}>
        {/* User Greeting */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#8B4513",
              marginRight: "12px",
            }}
          ></div>
          <div>
            <div style={{ fontWeight: "600" }}>Hello,</div>
            <div style={{ fontWeight: "600" }}>oBoticário!</div>
          </div>
        </div>

        {/* Balance */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Your balance is US$1000</h2>
        </div>

        {/* Put Credit Section */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>Put credit</h3>
          <div style={{ color: "var(--lumina-dark-gray)", marginBottom: "8px" }}>Value:</div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "var(--lumina-dark-gray)",
              borderBottom: "2px solid var(--lumina-teal)",
              paddingBottom: "8px",
              marginBottom: "24px",
            }}
          >
            {amount}
          </div>
        </div>
      </div>

      <NumericKeypad onNumberPress={handleNumberPress} onBackspace={handleBackspace} onDone={handleDone} />
    </div>
  )
}
