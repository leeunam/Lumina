"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function UserSelection() {
  const [selectedType, setSelectedType] = useState<"company" | "person">("company")
  const navigate = useNavigate()

  const handleContinue = () => {
    if (selectedType === "company") {
      navigate("/company/login")
    } else {
      // Navigate to person flow (not implemented yet)
      navigate("/")
    }
  }

  return (
    <div className="mobile-container">
      <div style={{ padding: "60px 24px", textAlign: "center" }}>
        {/* Lumina Logo */}
        <div style={{ marginBottom: "80px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "var(--lumina-teal)",
              margin: "0 auto 24px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid white",
                borderRadius: "50%",
              }}
            ></div>
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "var(--lumina-teal)",
              marginBottom: "60px",
            }}
          >
            Lumina
          </h1>
        </div>

        {/* User Type Selection */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 24px",
              marginBottom: "16px",
              backgroundColor: selectedType === "company" ? "var(--lumina-yellow)" : "var(--lumina-gray)",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => setSelectedType("company")}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: selectedType === "company" ? "var(--lumina-yellow)" : "var(--lumina-dark-gray)",
                marginRight: "16px",
                border: "3px solid " + (selectedType === "company" ? "var(--lumina-black)" : "var(--lumina-dark-gray)"),
              }}
            ></div>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>I'm a company</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 24px",
              backgroundColor: selectedType === "person" ? "var(--lumina-yellow)" : "var(--lumina-gray)",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => setSelectedType("person")}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: selectedType === "person" ? "var(--lumina-yellow)" : "var(--lumina-dark-gray)",
                marginRight: "16px",
                border: "3px solid " + (selectedType === "person" ? "var(--lumina-black)" : "var(--lumina-dark-gray)"),
              }}
            ></div>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>I am a person</span>
          </div>
        </div>

        <button className="button-primary" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}
