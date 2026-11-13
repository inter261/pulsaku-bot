import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc } from "../utils";
import { finish } from "./shared";

export const spsegel: Feature = {
  id: "spsegel",
  label: "📦 Cek SP Segel",
  description: "Cek status segel kartu perdana",
  prompt: "Kirim nomor seri / ICCID kartu (10-20 digit angka).",
  async run(input, { env }) {
    const serial = input.replace(/\s+/g, "");
    if (!/^\d{10,20}$/.test(serial)) return "❌ Nomor seri harus 10-20 digit angka.";
    const p = getProvider(env);
    const r = await p.checkSimSeal(serial);
    return finish(p, `📦 <b>SP Segel</b>\n\nSeri: <code>${esc(r.serial)}</code>\nStatus: ${esc(r.status)}`);
  },
};
