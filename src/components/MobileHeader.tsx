"use client"

import { useNavigate } from "react-router-dom"

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export function MobileHeader({ title, showBack = true, onBack }: MobileHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="header-teal">
      {showBack && (
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
      )}
      <h1 className="header-title">{title}</h1>
      <div style={{ width: "24px" }}></div>
    </div>
  )
}
