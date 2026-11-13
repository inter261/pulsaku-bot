import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc, INVALID_NUMBER, normalizeMsisdn } from "../utils";
import { finish } from "./shared";

export const redeem: Feature = {
  id: "redeem",
  label: "🎁 Redeem Voucher",
  description: "Redeem voucher ke nomor",
  prompt: "Kirim dengan format:\n<code>nomor kode-voucher</code>\nContoh: <code>0812xxxxxxxx ABC123</code>",
  async run(input, { env }) {
    const [rawNum, code] = input.trim().split(/\s+/);
    const n = normalizeMsisdn(rawNum ?? "");
    if (!n) return INVALID_NUMBER;
    if (!code || !/^[A-Za-z0-9-]{4,32}$/.test(code)) {
      return "❌ Kode voucher tidak valid (4-32 karakter huruf/angka/strip).";
    }
    const p = getProvider(env);
    const r = await p.redeem(n, code);
    return finish(p, `${r.ok ? "✅" : "❌"} <b>Redeem ${n}</b>\n${esc(r.message)}`);
  },
};
