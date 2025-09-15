import { el } from "../../utils/dom.js";
import { hasFreighter, connect, disconnect } from "../../controllers/auth.js";
import { user } from "../../models/user.js";

export function ConnectButton() {
  const node = el("div");
  const btn  = el("button", {}, "Conectar carteira");
  const info = el("div", { class: "mono", style: "margin-top:8px;" }, "");

  async function render() {
    const ok = await hasFreighter();
    if (!ok) {
      node.innerHTML = "";
      node.appendChild(el("a", { href: "https://www.freighter.app/", target: "_blank" }, "Instale o Freighter"));
      return;
    }
    node.innerHTML = "";
    if (user.address) {
      btn.textContent = `Desconectar (${user.address.slice(0,6)}…)`;
      btn.onclick = () => { disconnect(); render(); };
      info.textContent = `Address: ${user.address}`;
    } else {
      btn.textContent = "Conectar carteira";
      btn.onclick = async () => { await connect(); render(); };
      info.textContent = "";
    }
    node.appendChild(btn);
    node.appendChild(info);
  }

  render();
  return node;
}
