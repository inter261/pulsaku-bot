import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc, INVALID_NUMBER, parseNumbers } from "../utils";
import { finish } from "./shared";

const MAX = 20;

export const masal: Feature = {
  id: "masal",
  label: "💎 Cek Masal",
  description: "Cek banyak nomor sekaligus (premium)",
  premiumOnly: true,
  prompt: `Kirim daftar nomor (maks ${MAX}), pisahkan dengan spasi, koma, atau baris baru.`,
  async run(input, { env }) {
    const { valid, invalid, truncated } = parseNumbers(input, MAX);
    if (!valid.length) return INVALID_NUMBER;
    const p = getProvider(env);
    const res = await Promise.all(valid.map((n) => p.getStatus(n)));
    const lines = res.map((s) => `• <code>${s.msisdn}</code> — ${esc(s.status)}, aktif s.d. ${esc(s.activeUntil)}`);
    let out = `💎 <b>Hasil Cek Masal (${res.length} nomor)</b>\n\n${lines.join("\n")}`;
    if (invalid.length) out += `\n\n❌ Dilewati (format salah): ${invalid.map(esc).join(", ")}`;
    if (truncated) out += `\n\n⚠️ Hanya ${MAX} nomor pertama yang diproses.`;
    return finish(p, out);
  },
};
