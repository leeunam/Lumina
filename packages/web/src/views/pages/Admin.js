import { el } from '../../utils/dom.js';

function fmt(n) {
  if (n === null || n === undefined) return '-';
  if (Number.isInteger(n)) return n.toString();
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function explorerLink(hash) {
  const base =
    import.meta.env.VITE_STELLAR_EXPLORER ||
    'https://stellar.expert/explorer/public';
  if (!hash) return null;
  // prefer explorer path /tx/<hash>
  return `${base.replace(/\/$/, '')}/tx/${hash}`;
}

export function Admin() {
  const wrap = el('div', { class: 'container' }, [
    el('h2', {}, 'Admin — Dashboard'),
  ]);
  const out = el('div', { style: 'margin-top:12px;' }, 'Carregando...');

  function renderSummary(json) {
    out.innerHTML = '';

    // totals (Tailwind)
    const totals = el('div', { class: 'admin-totals flex gap-4 items-end' }, [
      el('div', { class: 'p-3 rounded-md bg-white shadow min-w-[140px]' }, [
        el('div', { class: 'text-sm text-gray-500' }, 'Total gastos'),
        el(
          'div',
          { class: 'font-semibold text-lg mt-1' },
          `R$ ${fmt(json.total_expenses ?? 0)}`
        ),
      ]),
      el('div', { class: 'p-3 rounded-md bg-white shadow min-w-[140px]' }, [
        el('div', { class: 'text-sm text-gray-500' }, 'Pontos emitidos'),
        el(
          'div',
          { class: 'font-semibold text-lg mt-1' },
          `${fmt(json.points_emitted ?? 0)}`
        ),
      ]),
      el('div', { class: 'p-3 rounded-md bg-white shadow min-w-[140px]' }, [
        el('div', { class: 'text-sm text-gray-500' }, 'Fundo (saldo)'),
        el(
          'div',
          { class: 'font-semibold text-lg mt-1' },
          `R$ ${fmt(json.fund_balance ?? 0)}`
        ),
      ]),
    ]);

    // simple inline SVG summary chart (three bars)
    const a = Number(json.total_expenses || 0);
    const b = Number(json.points_emitted || 0);
    const c = Number(json.fund_balance || 0);
    const max = Math.max(a, b, c, 1);
    const svg = el('div', { class: 'ml-3' }, '');
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('width', '220');
    svgEl.setAttribute('height', '48');
    const barW = 40;
    [
      [a, '#2563eb'],
      [b, '#10b981'],
      [c, '#f59e0b'],
    ].forEach((pair, i) => {
      const v = pair[0];
      const color = pair[1];
      const h = Math.round((v / max) * 36) + 4;
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.setAttribute('x', `${i * (barW + 6) + 6}`);
      rect.setAttribute('y', `${48 - h - 6}`);
      rect.setAttribute('width', `${barW}`);
      rect.setAttribute('height', `${h}`);
      rect.setAttribute('fill', color);
      svgEl.appendChild(rect);
    });
    svg.appendChild(svgEl);

    const top = el('div', { class: 'flex items-end' }, [totals, svg]);
    out.appendChild(top);

    // recent transactions table
    out.appendChild(
      el('h3', { class: 'mt-3 text-base font-medium' }, 'Transações recentes')
    );
    const table = el('table', {
      class: 'w-full table-fixed bg-white rounded-md overflow-hidden',
    });
    const thead = el('thead', {}, [
      el('tr', {}, [
        el(
          'th',
          { class: 'text-left p-3 border-b text-sm text-gray-500' },
          'Tipo'
        ),
        el(
          'th',
          { class: 'text-left p-3 border-b text-sm text-gray-500' },
          'Hash'
        ),
        el(
          'th',
          { class: 'text-left p-3 border-b text-sm text-gray-500' },
          'Explorer'
        ),
      ]),
    ]);
    const tbody = el('tbody', {});
    (json.recent_txs || []).forEach((t) => {
      const hash = t.hash || '';
      const short = hash ? (hash.slice ? hash.slice(0, 12) : hash) : '-';
      const link = explorerLink(hash);
      const tr = el('tr', {}, [
        el('td', { class: 'p-3 border-b' }, t.type || '-'),
        el(
          'td',
          { class: 'p-3 border-b font-mono text-sm text-gray-700' },
          short
        ),
        el(
          'td',
          { class: 'p-3 border-b' },
          link
            ? el(
                'a',
                {
                  href: link,
                  target: '_blank',
                  rel: 'noreferrer',
                  class: 'text-blue-600 underline',
                },
                'ver'
              )
            : '-'
        ),
      ]);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    out.appendChild(table);

    // debug/raw
    out.appendChild(
      el(
        'pre',
        { style: 'margin-top:12px;font-size:12px;color:#444;' },
        JSON.stringify(json, null, 2)
      )
    );
  }

  async function load() {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE || 'http://localhost:3000'
        }/admin_summary`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      renderSummary(json);
    } catch (err) {
      out.textContent = `Erro ao carregar: ${err.message}`;
    }
  }

  load();
  wrap.appendChild(out);
  return wrap;
}
