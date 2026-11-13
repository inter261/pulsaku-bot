import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc } from "../utils";
import { finish } from "./shared";

export const promo: Feature = {
  id: "promo",
  label: "👛 Paket Promo",
  description: "Daftar paket data promo murah",
  async run(_input, { env }) {
    const p = getProvider(env);
    const list = await p.getPromos();
    const lines = list.map((x) => `• <b>${esc(x.name)}</b> — ${esc(x.price)}\n  ${esc(x.detail)}`);
    return finish(p, `👛 <b>Paket Promo</b>\n\n${lines.join("\n\n")}`);
  },
};
