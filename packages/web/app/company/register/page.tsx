"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CompanyRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleRegister = () => {
    // Simulate registration - in real app, this would create account
    router.push("/company/dashboard")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Bottom section with register form */}
      <div className="absolute bottom-0 left-0 right-0 bg-lumina-teal rounded-t-3xl px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-8">Register</h2>

        <div className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 text-lg"
            />
          </div>

          <div>
            <Input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 text-lg"
            />
          </div>

          <div>
            <Input
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 text-lg"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 pr-12 text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme a Senha"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 rounded-lg py-3 px-4 pr-12 text-lg"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button
            onClick={handleRegister}
            className="w-full bg-white text-lumina-teal hover:bg-gray-100 font-semibold py-3 rounded-lg text-lg"
          >
            Registre-se
          </Button>
        </div>

        <div className="text-center mt-6">
          <span className="text-white/80 text-sm">
            Already have an account?{" "}
            <button onClick={() => router.push("/company/login")} className="text-white font-semibold hover:underline">
              Login here
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
