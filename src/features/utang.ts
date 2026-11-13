import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc, INVALID_NUMBER, normalizeMsisdn } from "../utils";
import { finish } from "./shared";

export const utang: Feature = {
  id: "utang",
  label: "💰 Cek Utang Pulsa",
  description: "Cek utang pulsa/emergency",
  prompt: "Kirim nomor yang mau dicek utang pulsanya.",
  async run(input, { env }) {
    const n = normalizeMsisdn(input.trim());
    if (!n) return INVALID_NUMBER;
    const p = getProvider(env);
    const d = await p.getDebt(n);
    const amount = d.amount > 0 ? `Rp ${d.amount.toLocaleString("id-ID")}` : "Rp 0";
    return finish(p, `💰 <b>Utang Pulsa ${d.msisdn}</b>\n\nTotal: ${amount}\n${esc(d.note)}`);
  },
};
