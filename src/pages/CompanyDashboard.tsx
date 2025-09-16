"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function CompanyDashboard() {
  const [showSidebar, setShowSidebar] = useState(false)
  const navigate = useNavigate()

  const sidebarItems = [
    { icon: "👤", label: "My profile", path: "/company/profile" },
    { icon: "💳", label: "Bring money", path: "/company/bring-money" },
    { icon: "🎫", label: "Coupons issued", path: "/company/coupons" },
    { icon: "🏆", label: "My NFT's", path: "/company/nfts" },
    { icon: "📱", label: "Generate QRcode", path: "/company/qrcode" },
  ]

  return (
    <div className="mobile-container">
      {/* Sidebar */}
      {showSidebar && (
        <div className="sidebar">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <button
              style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
              onClick={() => setShowSidebar(false)}
            >
              ↑
            </button>
          </div>

          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="sidebar-item"
              onClick={() => {
                navigate(item.path)
                setShowSidebar(false)
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "16px", fontSize: "20px" }}>{item.icon}</span>
                <span style={{ fontSize: "16px", fontWeight: "500" }}>{item.label}</span>
              </div>
              <span>→</span>
            </div>
          ))}

          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--lumina-gray)" }}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <span style={{ marginRight: "16px", fontSize: "20px" }}>ℹ️</span>
              <span style={{ fontSize: "16px", fontWeight: "500" }}>Help center</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button
            style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Company Dashboard</h1>

        <p style={{ color: "var(--lumina-dark-gray)" }}>
          Welcome to your company dashboard. Use the menu to navigate to different features.
        </p>
      </div>
    </div>
  )
}
