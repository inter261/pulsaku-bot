import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc, INVALID_NUMBER, normalizeMsisdn } from "../utils";
import { finish } from "./shared";

export const voucher: Feature = {
  id: "voucher",
  label: "🎟 Cek Voucher",
  description: "Cek info voucher pada nomor",
  prompt: "Kirim nomor yang mau dicek vouchernya.",
  async run(input, { env }) {
    const n = normalizeMsisdn(input.trim());
    if (!n) return INVALID_NUMBER;
    const p = getProvider(env);
    const list = await p.getVouchers(n);
    if (!list.length) return finish(p, `🎟 Tidak ada voucher untuk ${n}.`);
    const lines = list.map(
      (v) => `• <b>${esc(v.name)}</b>\n  Kode: <code>${esc(v.code)}</code>\n  Berlaku s.d. ${esc(v.validUntil)}`,
    );
    return finish(p, `🎟 <b>Voucher ${n}</b>\n\n${lines.join("\n\n")}`);
  },
};
