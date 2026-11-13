import type { UserRow } from "./db";

export interface Env {
  DB: D1Database;
  BOT_TOKEN: string;
  WEBHOOK_SECRET: string;
  ADMIN_IDS?: string;
}

export interface FeatureCtx {
  env: Env;
  user: UserRow;
}

export interface Feature {
  id: string;
  /** Teks tombol di keyboard (juga dipakai untuk mencocokkan pesan masuk). */
  label: string;
  description: string;
  premiumOnly?: boolean;
  /** Jika diisi, bot meminta input dulu sebelum run(). Format HTML. */
  prompt?: string;
  run(input: string, ctx: FeatureCtx): Promise<string>;
}
