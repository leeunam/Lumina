"use client"

import { Button } from "@/components/ui/button"
import { Backpack as Backspace } from "lucide-react"

interface NumericKeypadProps {
  onNumberPress: (number: string) => void
  onBackspace: () => void
  onDone: () => void
}

export function NumericKeypad({ onNumberPress, onBackspace, onDone }: NumericKeypadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "⌫"],
  ]

  return (
    <div className="bg-gray-50 p-6 rounded-t-3xl lg:rounded-none lg:max-w-md lg:mx-auto lg:mt-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {numbers.flat().map((key, index) => (
          <Button
            key={index}
            variant="ghost"
            className="h-12 text-xl font-medium hover:bg-gray-200"
            onClick={() => {
              if (key === "⌫") {
                onBackspace()
              } else {
                onNumberPress(key)
              }
            }}
          >
            {key === "⌫" ? <Backspace className="w-6 h-6" /> : key}
          </Button>
        ))}
      </div>

      <Button
        onClick={onDone}
        className="w-full bg-lumina-yellow hover:bg-lumina-yellow/90 text-black font-semibold py-3"
      >
        Done
      </Button>
    </div>
  )
}
