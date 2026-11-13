import type { TelcoProvider } from "../provider";

export function finish(p: TelcoProvider, text: string): string {
  return p.isDummy ? `${text}\n\n<i>⚠️ Data contoh (provider dummy).</i>` : text;
}
