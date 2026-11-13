export const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const INVALID_NUMBER =
  "❌ Nomor tidak valid. Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx.";

/** Normalisasi ke format 08xxxxxxxxxx. Null jika bentuknya tidak valid. */
export function normalizeMsisdn(raw: string): string | null {
  let d = raw.replace(/[\s\-().]/g, "");
  if (d.startsWith("+62")) d = "0" + d.slice(3);
  else if (d.startsWith("62")) d = "0" + d.slice(2);
  return /^08\d{8,11}$/.test(d) ? d : null;
}

export function parseNumbers(text: string, max = 20) {
  const tokens = text.split(/[\s,;]+/).filter(Boolean);
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const t of tokens) {
    const n = normalizeMsisdn(t);
    if (n) {
      if (!valid.includes(n)) valid.push(n);
    } else invalid.push(t);
  }
  const truncated = valid.length > max;
  return { valid: valid.slice(0, max), invalid, truncated };
}

export function fmtDateTime(ms: number): string {
  return new Date(ms + 7 * 3600 * 1000)
    .toISOString()
    .replace("T", " ")
    .slice(0, 16) + " WIB";
}
