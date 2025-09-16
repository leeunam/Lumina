import { el } from '../../utils/dom.js';

export function CompanyRegister() {
  const wrap = el('div', { class: 'container' }, [
    el('h2', {}, 'Registro de Empresa'),
  ]);
  const form = el('form', { style: 'max-width:480px;' });
  const name = el('input', { placeholder: 'Nome' });
  const email = el('input', { type: 'email', placeholder: 'E-mail' });
  const phone = el('input', { placeholder: 'Telefone' });
  const pass = el('input', { type: 'password', placeholder: 'Senha' });
  const btn = el('button', { type: 'button' }, 'Registrar');
  btn.onclick = () => {
    alert('Registro simulado — redirecionando para dashboard');
    wrap.innerHTML = '';
    wrap.appendChild(el('h2', {}, 'Dashboard (simulado)'));
  };
  form.appendChild(name);
  form.appendChild(el('br'));
  form.appendChild(email);
  form.appendChild(el('br'));
  form.appendChild(phone);
  form.appendChild(el('br'));
  form.appendChild(pass);
  form.appendChild(el('br'));
  form.appendChild(btn);
  wrap.appendChild(form);
  return wrap;
}
