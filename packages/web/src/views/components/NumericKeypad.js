import { el } from '../../utils/dom.js';

export function NumericKeypad({ onNumberPress, onBackspace, onDone } = {}) {
  const wrap = el('div', {
    style:
      'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:360px;margin:0 auto;',
  });
  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'];
  buttons.forEach((b) => {
    const btn = el('button', { style: 'padding:16px;font-size:18px;' }, b);
    btn.onclick = () => {
      if (b === '←') return onBackspace && onBackspace();
      if (b === '.') return; // ignore for simplicity
      return onNumberPress && onNumberPress(b);
    };
    wrap.appendChild(btn);
  });
  const done = el(
    'button',
    { style: 'grid-column:1/-1;margin-top:8px;padding:12px;' },
    'Done'
  );
  done.onclick = () => onDone && onDone();
  const container = el('div', {}, wrap);
  container.appendChild(done);
  return container;
}
