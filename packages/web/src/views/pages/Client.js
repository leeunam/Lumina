import { el } from '../../utils/dom.js';
import { getClientStatus, explorerLink } from '../../api/client.js';

export function Client() {
  const wrap = el('div', { class: 'container' }, [
    el('h2', {}, 'Cliente — Status'),
  ]);
  const form = el('form', { style: 'max-width:480px;' });
  const inputAddress = el('input', {
    type: 'text',
    placeholder: 'Seu address Stellar',
    required: true,
  });
  const btn = el('button', { type: 'submit' }, 'Consultar');
  const out = el('div', { style: 'margin-top:12px;' }, '');

  form.appendChild(inputAddress);
  form.appendChild(el('br'));
  form.appendChild(btn);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    out.textContent = 'Carregando...';
    const addr = inputAddress.value;
    const data = await getClientStatus(addr);
    if (!data) return (out.textContent = 'Erro ao buscar status');
    out.innerHTML = '';
    out.appendChild(el('div', {}, `Pontos: ${data.points ?? 0}`));
    out.appendChild(
      el(
        'div',
        {},
        `Cashback acumulado: R$ ${
          data.cashback?.toFixed?.(2) ?? data.cashback ?? 0
        }`
      )
    );
    out.appendChild(
      el('div', {}, `Créditos de carbono: ${data.carbon_kg ?? 0} kg`)
    );
    if (data.last_tx) {
      const a = el(
        'a',
        { href: explorerLink(data.last_tx), target: '_blank' },
        `Última TX: ${data.last_tx.slice(0, 12)}…`
      );
      out.appendChild(a);
    }
  });

  wrap.appendChild(form);
  wrap.appendChild(out);
  return wrap;
}
