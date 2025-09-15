import { el } from "../../utils/dom.js";
import { getUserPoints } from "../../controllers/loyalty.js";
import { user } from "../../models/user.js";

export function BalanceCard() {
  const card = el("div", { class: "card" }, [
    el("h3", {}, "Seus pontos (simulate)"),
    el("div", { class: "mono", id: "points" }, "—"),
  ]);

  async function refresh() {
    const target = card.querySelector("#points");
    if (!user.address) {
      target.textContent = "Conecte a carteira para ver o saldo.";
      return;
    }
    try {
      const v = await getUserPoints({ network: "testnet", address: user.address });
      target.textContent = `${v.toString()} pts`;
    } catch (e) {
      target.textContent = `Erro: ${e?.message ?? e}`;
    }
  }

  // expose para a Home chamar após conectar
  card.refresh = refresh;
  return card;
}
