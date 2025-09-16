"use client"

interface NumericKeypadProps {
  onNumberPress: (number: string) => void
  onBackspace: () => void
  onDone: () => void
}

export function NumericKeypad({ onNumberPress, onBackspace, onDone }: NumericKeypadProps) {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"]

  return (
    <div className="numeric-keypad">
      {numbers.map((num) => (
        <button key={num} className="keypad-button" onClick={() => onNumberPress(num)}>
          {num}
        </button>
      ))}
      <button className="keypad-button" onClick={onBackspace}>
        ⌫
      </button>
      <button
        className="keypad-button"
        onClick={onDone}
        style={{
          gridColumn: "span 3",
          backgroundColor: "var(--lumina-yellow)",
          marginTop: "16px",
        }}
      >
        Done
      </button>
    </div>
  )
}
