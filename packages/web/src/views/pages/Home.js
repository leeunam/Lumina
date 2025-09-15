import { el } from "../../utils/dom.js";
import { ConnectButton } from "../components/ConnectButton.js";
import { BalanceCard } from "../components/BalanceCard.js";

export function Home() {
  const wrap = el("div", { class: "container" }, [
    el("h1", {}, "Lumina — Vanilla + Soroban"),
    el("p", {}, "Demo mínima com MVC-like (Models/Controllers/Services/Views)."),
  ]);

  const connect = ConnectButton();
  const balance = BalanceCard();

  // quando o botão reconectar/desconectar for usado, podemos pedir um refresh manual:
  // (simples: observa cliques no wrapper; em projeto real, use um event bus leve)
  wrap.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      // aguarda a UI atualizar e tenta atualizar o card
      setTimeout(() => balance.refresh && balance.refresh(), 200);
    }
  });

  wrap.appendChild(connect);
  wrap.appendChild(balance);
  return wrap;
}
