export function LuminaLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-16 h-16 mb-4 relative">
        <svg viewBox="0 0 64 64" className="w-full h-full text-lumina-teal">
          <path
            d="M32 8L48 20V44L32 56L16 44V20L32 8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M24 28C24 24 28 20 32 20C36 20 40 24 40 28C40 32 36 36 32 36C28 36 24 32 24 28Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M28 32L32 28L36 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-lumina-teal">Lumina</h1>
    </div>
  )
}
