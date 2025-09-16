'use client';

import { useState } from 'react';
import { MobileHeader } from '@/components/mobile-header';
import { NumericKeypad } from '@/components/numeric-keypad';
import { useRouter } from 'next/navigation';

export default function ExpensesPage() {
  const [amount, setAmount] = useState('$00.00');
  const router = useRouter();

  const handleNumberPress = (number: string) => {
    if (amount === '$00.00') {
      setAmount(`$${number}0.00`);
    } else {
      // Simple logic for demo - in real app, would handle decimal places properly
      const cleanAmount = amount.replace(/[$,]/g, '');
      const newAmount =
        cleanAmount.slice(0, -4) + number + cleanAmount.slice(-3);
      setAmount(`$${newAmount}`);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 5) {
      const cleanAmount = amount.replace(/[$,]/g, '');
      const newAmount = cleanAmount.slice(0, -4) + '0' + cleanAmount.slice(-3);
      setAmount(`$${newAmount}`);
    } else {
      setAmount('$00.00');
    }
  };

  const handleDone = () => {
    // Process the expense amount
    router.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MobileHeader
        title="Choose your expenses"
        showBack
        onBack={() => router.back()}
      />

      <div className="flex-1 flex flex-col justify-between">
        <div className="site-container">
          <div className="px-6 py-16 text-center lg:max-w-2xl lg:mx-auto">
            <p className="text-xl font-medium mb-8">Enter the entry value:</p>
            <div className="text-4xl font-light text-gray-400 border-b-2 border-lumina-teal pb-2 inline-block">
              {amount}
            </div>
          </div>
        </div>

        <NumericKeypad
          onNumberPress={handleNumberPress}
          onBackspace={handleBackspace}
          onDone={handleDone}
        />
      </div>
    </div>
  );
}
