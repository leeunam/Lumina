"use client"

import { MobileHeader } from "../components/MobileHeader"

export function CompanyQRCode() {
  return (
    <div className="mobile-container">
      <MobileHeader title="Generate QRcode" />

      <div style={{ padding: "24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "32px" }}>Get your coupon</h2>

        <div className="qr-code-container">
          <div style={{ marginBottom: "16px" }}>
            <span style={{ color: "var(--lumina-dark-gray)" }}>Value:</span>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "var(--lumina-teal)",
              marginBottom: "32px",
            }}
          >
            US$10,00
          </div>

          <div className="qr-code">
            {/* QR Code placeholder with corner brackets */}
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              {/* Corner brackets */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "30px",
                  height: "30px",
                  borderTop: "4px solid var(--lumina-yellow)",
                  borderLeft: "4px solid var(--lumina-yellow)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  width: "30px",
                  height: "30px",
                  borderTop: "4px solid var(--lumina-yellow)",
                  borderRight: "4px solid var(--lumina-yellow)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "30px",
                  height: "30px",
                  borderBottom: "4px solid var(--lumina-yellow)",
                  borderLeft: "4px solid var(--lumina-yellow)",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "30px",
                  height: "30px",
                  borderBottom: "4px solid var(--lumina-yellow)",
                  borderRight: "4px solid var(--lumina-yellow)",
                }}
              ></div>

              {/* QR Code pattern */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "120px",
                  height: "120px",
                  backgroundColor: "var(--lumina-black)",
                  display: "grid",
                  gridTemplate: "repeat(8, 1fr) / repeat(8, 1fr)",
                  gap: "2px",
                }}
              >
                {/* Simple QR pattern */}
                {Array.from({ length: 64 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: Math.random() > 0.5 ? "var(--lumina-black)" : "var(--lumina-white)",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <p style={{ color: "var(--lumina-dark-gray)", fontSize: "14px", marginTop: "16px" }}>Scanning Code...</p>
        </div>
      </div>
    </div>
  )
}
