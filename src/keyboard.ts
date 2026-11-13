import { Keyboard } from "grammy";
import type { Feature } from "./types";

/** Reply keyboard 2 kolom dari daftar fitur. */
export function buildKeyboard(features: Feature[]): Keyboard {
  const kb = new Keyboard();
  features.forEach((f, i) => {
    kb.text(f.label);
    if (i % 2 === 1) kb.row();
  });
  return kb.resized().persistent();
}
