import { el } from '../../utils/dom.js';
import { MobileHeader } from '../components/MobileHeader.js';
import { NumericKeypad } from '../components/NumericKeypad.js';
import { recordExpense, explorerLink } from '../../api/client.js';

export function CompanyExpenses() {
  const wrap = el('div', { class: 'container' });
  wrap.appendChild(
    MobileHeader({
      title: 'Registrar gasto',
      showBack: true,
      onBack: () => window.history.back(),
    })
  );
  const display = el(
    'div',
    { style: 'padding:24px;text-align:center;' },
    '$00.00'
  );
  let amount = '0';

  const keypad = NumericKeypad({
    onNumberPress: (n) => {
      amount = amount === '0' ? n : amount + n;
      display.textContent = `R$ ${amount}`;
    },
    onBackspace: () => {
      amount = amount.slice(0, -1) || '0';
      display.textContent = `R$ ${amount}`;
    },
    onDone: async () => {
      const payload = {
        merchant_id: import.meta.env.VITE_MERCHANT_ID || 'MERCHANT_TEST',
        customer_pubkey: 'TEST-CUST-ADDR',
        amount_brl: Number(amount),
      };
      try {
        const res = await recordExpense(payload);
        const tx = res?.tx_hash || res?.hash || res?.txHash;
        if (tx) {
          wrap.appendChild(el('div', {}, 'Gasto registrado.'));
          const a = el(
            'a',
            { href: explorerLink(tx), target: '_blank' },
            `Ver tx ${tx.slice(0, 12)}…`
          );
          wrap.appendChild(a);
        }
      } catch (err) {
        wrap.appendChild(el('div', {}, `Erro: ${err.message}`));
      }
    },
  });

  wrap.appendChild(display);
  wrap.appendChild(keypad);
  return wrap;
}
