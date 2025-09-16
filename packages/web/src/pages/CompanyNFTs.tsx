"use client"

import { MobileHeader } from "../../components/MobileHeader"

export function CompanyNFTs() {
  const levels = [
    {
      level: 6,
      title: "Accumulate 1000 carbon credits",
      icon: "🌳",
      color: "#999",
      completed: false,
    },
    {
      level: 5,
      title: "Congratulations! You've accumulated 500 credits!",
      icon: "🌍",
      color: "var(--lumina-teal)",
      completed: true,
    },
    {
      level: 4,
      title: "Congratulations! You've accumulated 100 credits!",
      icon: "🌱",
      color: "var(--lumina-teal)",
      completed: true,
    },
  ]

  return (
    <div className="mobile-container">
      <MobileHeader title="My NFT's" />

      <div style={{ padding: "24px" }}>
        {/* Main NFT Card */}
        <div className="nft-card">
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
            }}
          >
            🏆
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "2px" }}>oBOTICARIO</h2>
        </div>

        {/* Levels */}
        {levels.map((level, index) => (
          <div key={index} className="level-card">
            <div
              className="level-icon"
              style={{
                backgroundColor: level.color,
                color: level.completed ? "var(--lumina-white)" : "var(--lumina-dark-gray)",
              }}
            >
              {level.icon}
            </div>
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: level.completed ? "var(--lumina-teal)" : "var(--lumina-black)",
                }}
              >
                Level {level.level}
              </h3>
              <p style={{ color: "var(--lumina-dark-gray)", fontSize: "14px" }}>{level.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
