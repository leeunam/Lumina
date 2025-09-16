"use client"

import { MobileHeader } from "../components/MobileHeader"

export function CompanyCoupons() {
  const pointsData = [
    { amount: "10 points", expires: "Expires in 3 days" },
    { amount: "50 points", expires: "Expires in 5 days" },
    { amount: "200 points", expires: "Expires in 1 month" },
    { amount: "10000 points", expires: "Expires in 2 months" },
  ]

  return (
    <div className="mobile-container">
      <MobileHeader title="Points" />

      <div style={{ padding: "24px" }}>
        {/* Points Summary */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontWeight: "600" }}>Points issued:</span>
            <span
              style={{
                backgroundColor: "var(--lumina-teal)",
                color: "var(--lumina-white)",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              1200
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontWeight: "600" }}>Points returned:</span>
            <span
              style={{
                backgroundColor: "var(--lumina-teal)",
                color: "var(--lumina-white)",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              100
            </span>
          </div>
          <p style={{ color: "var(--lumina-dark-gray)", textAlign: "center", fontSize: "14px" }}>
            Know where your points are!
            <br />
            Lumina helps you
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            style={{
              backgroundColor: "var(--lumina-yellow)",
              color: "var(--lumina-black)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "20px",
              fontWeight: "600",
            }}
          >
            Recent
          </button>
          <button
            style={{
              backgroundColor: "var(--lumina-gray)",
              color: "var(--lumina-black)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "20px",
              fontWeight: "600",
            }}
          >
            All
          </button>
        </div>

        {/* Points List */}
        <div>
          {pointsData.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                backgroundColor: "var(--lumina-gray)",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "var(--lumina-yellow)",
                  borderRadius: "8px",
                  marginRight: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                🎫
              </div>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>{item.amount}</div>
                <div style={{ color: "var(--lumina-dark-gray)", fontSize: "14px" }}>{item.expires}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
