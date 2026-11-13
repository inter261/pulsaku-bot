import type { Feature } from "../types";
import { getProvider } from "../provider";
import { esc, INVALID_NUMBER, normalizeMsisdn } from "../utils";
import { finish } from "./shared";

export const masaaktif: Feature = {
  id: "masaaktif",
  label: "⏳ Tambah Masa Aktif",
  description: "Perpanjang masa aktif nomor",
  prompt: "Kirim nomor yang mau diperpanjang masa aktifnya.",
  async run(input, { env }) {
    const n = normalizeMsisdn(input.trim());
    if (!n) return INVALID_NUMBER;
    const p = getProvider(env);
    const r = await p.extendActive(n);
    return finish(p, `${r.ok ? "✅" : "❌"} <b>${n}</b>\n${esc(r.message)}`);
  },
};
