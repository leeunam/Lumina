import { el } from '../../utils/dom.js';

export function CompanyLogin() {
  const wrap = el('div', { class: 'container' }, [
    el('h2', {}, 'Login Empresa'),
  ]);
  const email = el('input', { type: 'email', placeholder: 'E-mail' });
  const pass = el('input', { type: 'password', placeholder: 'Senha' });
  const btn = el('button', { type: 'button' }, 'Login');
  btn.onclick = () => {
    wrap.innerHTML = '';
    wrap.appendChild(el('h2', {}, 'Dashboard (simulado)'));
  };
  wrap.appendChild(email);
  wrap.appendChild(el('br'));
  wrap.appendChild(pass);
  wrap.appendChild(el('br'));
  wrap.appendChild(btn);
  return wrap;
}
