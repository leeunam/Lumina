import { el } from '../../utils/dom.js';
import { recordExpense } from '../../api/client.js';
import { explorerLink } from '../../api/client.js';

export function Company() {
  const wrap = el('div', { class: 'container' }, [
    el('h2', {}, 'Empresa — Registrar gasto'),
  ]);

  const form = el('form', { style: 'max-width:480px;' });
  const inputMerchant = el('input', {
    type: 'text',
    placeholder: 'Merchant ID (merchant_id)',
    required: true,
  });
  const inputAmount = el('input', {
    type: 'number',
    placeholder: 'Valor (BRL)',
    required: true,
  });
  const inputCustomer = el('input', {
    type: 'text',
    placeholder: 'Cliente (customer_pubkey)',
    required: true,
  });
  const submit = el('button', { type: 'submit' }, 'Registrar gasto');
  const result = el('div', { style: 'margin-top:12px;' }, '');

  form.appendChild(inputAmount);
  form.appendChild(el('br'));
  form.appendChild(inputCustomer);
  form.appendChild(el('br'));
  form.appendChild(submit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.textContent = 'Enviando...';
    try {
      const payload = {
        merchant_id:
          inputMerchant.value ||
          import.meta.env.VITE_MERCHANT_ID ||
          'MERCHANT_TEST',
        customer_pubkey: inputCustomer.value,
        amount_brl: Number(inputAmount.value),
      };
      const res = await recordExpense(payload);
      const tx = res?.tx_hash || res?.txHash || res?.hash;
      if (tx) {
        const a = el(
          'a',
          { href: explorerLink(tx), target: '_blank' },
          `Ver transação: ${tx.slice(0, 12)}…`
        );
        result.innerHTML = '';
        result.appendChild(el('div', {}, 'Gasto registrado com sucesso.'));
        result.appendChild(a);
      } else {
        result.textContent = JSON.stringify(res);
      }
    } catch (err) {
      result.textContent = `Erro: ${err.message}`;
    }
  });

  wrap.appendChild(form);
  wrap.appendChild(result);
  return wrap;
}
