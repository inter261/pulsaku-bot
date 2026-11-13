import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc, INVALID_NUMBER, normalizeMsisdn } from "../utils";
import { finish } from "./shared";

export const kuota: Feature = {
  id: "kuota",
  label: "📊 Cek Kuota",
  description: "Cek kuota dan detail nomor",
  prompt: "Kirim nomor yang mau dicek.\nContoh: <code>0812xxxxxxxx</code>",
  async run(input, { env }) {
    const n = normalizeMsisdn(input.trim());
    if (!n) return INVALID_NUMBER;
    const p = getProvider(env);
    const q = await p.getQuota(n);
    const lines = q.packages.map(
      (k) =>
        `• <b>${esc(k.name)}</b>\n  Sisa ${esc(k.remaining)} dari ${esc(k.total)}\n  Berlaku s.d. ${esc(k.expires)}`,
    );
    return finish(p, `📊 <b>Kuota ${n}</b>\n\n${lines.join("\n\n") || "Tidak ada paket aktif."}`);
  },
};
