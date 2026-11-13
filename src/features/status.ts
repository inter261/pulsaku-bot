import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc, INVALID_NUMBER, normalizeMsisdn } from "../utils";
import { finish } from "./shared";

export const status: Feature = {
  id: "status",
  label: "📱 Status Nomor",
  description: "Cek status dan masa aktif nomor",
  prompt: "Kirim nomor yang mau dicek.\nContoh: <code>0812xxxxxxxx</code>",
  async run(input, { env }) {
    const n = normalizeMsisdn(input.trim());
    if (!n) return INVALID_NUMBER;
    const p = getProvider(env);
    const s = await p.getStatus(n);
    return finish(
      p,
      `📱 <b>Status ${s.msisdn}</b>\n\nStatus: ${esc(s.status)}\nJenis: ${esc(s.type)}\nAktif s.d.: ${esc(s.activeUntil)}\nMasa tenggang s.d.: ${esc(s.graceUntil)}`,
    );
  },
};
