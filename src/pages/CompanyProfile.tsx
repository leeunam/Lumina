"use client"

import { MobileHeader } from "../components/MobileHeader"

export function CompanyProfile() {
  return (
    <div className="mobile-container">
      <MobileHeader title="My Profile" />

      <div style={{ padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#8B4513",
              margin: "0 auto 16px",
            }}
          ></div>
          <h2 style={{ fontSize: "20px", fontWeight: "600" }}>oBoticário</h2>
          <p style={{ color: "var(--lumina-dark-gray)" }}>Company Profile</p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Company Name</label>
            <input
              type="text"
              value="oBoticário"
              readOnly
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--lumina-gray)",
                borderRadius: "8px",
                backgroundColor: "var(--lumina-gray)",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              value="contact@oboticario.com"
              readOnly
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--lumina-gray)",
                borderRadius: "8px",
                backgroundColor: "var(--lumina-gray)",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Balance</label>
            <input
              type="text"
              value="US$1000"
              readOnly
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--lumina-gray)",
                borderRadius: "8px",
                backgroundColor: "var(--lumina-gray)",
              }}
            />
          </div>
        </div>

        <button
          className="button-primary"
          style={{ backgroundColor: "var(--lumina-teal)", color: "var(--lumina-white)" }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  )
}
