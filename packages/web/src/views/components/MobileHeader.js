import { el } from '../../utils/dom.js';

export function MobileHeader({ title = '', showBack = false, onBack } = {}) {
  const node = el(
    'div',
    {
      style:
        'display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;',
    },
    ''
  );
  const left = el('div', {}, showBack ? '←' : '');
  const center = el('div', { style: 'font-weight:600;' }, title);
  const right = el('div', {}, '');
  if (showBack) left.onclick = () => onBack && onBack();
  node.appendChild(left);
  node.appendChild(center);
  node.appendChild(right);
  return node;
}
