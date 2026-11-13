import type { Feature } from "../types";
import { isPremiumActive } from "../db";
import { fmtDateTime } from "../utils";

export const premium: Feature = {
  id: "premium",
  label: "⭐ Info Premium",
  description: "Status akun premium",
  async run(_input, { user }) {
    if (isPremiumActive(user)) {
      return `⭐ <b>Akun Premium aktif</b>\nBerakhir: ${fmtDateTime(user.premium_until!)}`;
    }
    return (
      "⭐ <b>Akun kamu belum premium.</b>\n" +
      "Fitur premium: Cek Masal (banyak nomor sekaligus).\n\n" +
      `ID Telegram kamu: <code>${user.id}</code>\nHubungi admin untuk aktivasi.`
    );
  },
};
