"use client"

import { useRouter } from "next/navigation"

export function HomePage() {
  const router = useRouter()

  return (
    <div className="mobile-container">
      <div style={{ backgroundColor: "var(--lumina-teal)", minHeight: "100vh", padding: "24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            color: "var(--lumina-white)",
          }}
        >
          <span>Welcome! You have 0 accumulated points.</span>
          <div style={{ fontSize: "24px" }}>📷</div>
        </div>

        {/* Auth Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
          <button className="button-secondary" onClick={() => router.push("/company/register")}>
            Create account
          </button>
          <button className="button-secondary" onClick={() => router.push("/user-selection")}>
            Login
          </button>
          <div style={{ fontSize: "24px", color: "var(--lumina-white)" }}>☰</div>
        </div>

        {/* Partner Companies Section */}
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "var(--lumina-black)",
              marginBottom: "20px",
            }}
          >
            Partner companies
          </h2>
          {/* Empty space for partner companies list */}
        </div>
      </div>
    </div>
  )
}
