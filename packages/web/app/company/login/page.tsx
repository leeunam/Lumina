"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { useRouter } from "next/navigation"

export default function CompanyLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    // Simulate login - in real app, this would validate credentials
    router.push("/company/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Bottom section with login form */}
      <div className="absolute bottom-0 left-0 right-0 bg-lumina-teal rounded-t-3xl px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-8">Login</h2>

        <div className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 text-lg"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 text-lg"
            />
          </div>

          <div className="text-right">
            <button className="text-white/80 text-sm hover:text-white">Esqueceu a senha?</button>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full bg-white text-lumina-teal hover:bg-gray-100 font-semibold py-3 rounded-lg text-lg"
          >
            Login
          </Button>
        </div>

        <div className="text-center mt-6">
          <span className="text-white/80 text-sm">
            {"Don't have an account? "}
            <button
              onClick={() => router.push("/company/register")}
              className="text-white font-semibold hover:underline"
            >
              Register here
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
