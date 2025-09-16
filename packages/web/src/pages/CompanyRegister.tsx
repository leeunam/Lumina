"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CompanyRegister() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleRegister = () => {
    // Simulate registration - in real app, validate and submit data
    router.push("/company/dashboard")
  }

  return (
    <div className="mobile-container">
      <div
        style={{
          backgroundColor: "var(--lumina-teal)",
          minHeight: "100vh",
          padding: "60px 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "var(--lumina-white)",
              marginBottom: "40px",
            }}
          >
            Register
          </h1>

          <input
            className="input-field"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input-field"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input-field"
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div style={{ position: "relative" }}>
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--lumina-white)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>

          <div style={{ position: "relative" }}>
            <input
              className="input-field"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme a Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--lumina-white)",
                cursor: "pointer",
              }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              🚫
            </button>
          </div>

          <button
            className="button-primary"
            onClick={handleRegister}
            style={{ backgroundColor: "var(--lumina-white)", color: "var(--lumina-teal)" }}
          >
            Registre-se
          </button>
        </div>
      </div>
    </div>
  )
}
