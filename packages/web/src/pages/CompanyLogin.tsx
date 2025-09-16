"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function CompanyLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = () => {
    // Simulate login - in real app, validate credentials
    navigate("/company/dashboard")
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
            Login
          </h1>

          <input
            className="input-field"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input-field"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div style={{ textAlign: "right", marginBottom: "24px" }}>
            <a href="#" style={{ color: "var(--lumina-white)", fontSize: "14px" }}>
              Esqueceu a senha?
            </a>
          </div>

          <button
            className="button-primary"
            onClick={handleLogin}
            style={{ backgroundColor: "var(--lumina-white)", color: "var(--lumina-teal)" }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
