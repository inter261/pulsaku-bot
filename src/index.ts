import { Bot, Context, webhookCallback } from "grammy";
import type { Env, Feature } from "./types";
import { features } from "./features";
import { buildKeyboard } from "./keyboard";
import { getState, grantPremium, isPremiumActive, setState, upsertUser, type UserRow } from "./db";
import { esc, fmtDateTime } from "./utils";

type MyCtx = Context & { user: UserRow };

let cached: { bot: Bot<MyCtx>; handle: (req: Request) => Promise<Response> } | undefined;

function create(env: Env) {
  const bot = new Bot<MyCtx>(env.BOT_TOKEN);
  const kb = buildKeyboard(features);
  const admins = new Set((env.ADMIN_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean));
  const HTML = { parse_mode: "HTML" as const };

  // Pastikan user tercatat di D1 untuk setiap pesan.
  bot.use(async (ctx, next) => {
    if (!ctx.from) return;
    ctx.user = await upsertUser(env.DB, ctx.from.id, ctx.from.username ?? null, ctx.from.first_name ?? null);
    await next();
  });

  async function guard(ctx: MyCtx, f: Feature): Promise<boolean> {
    if (f.premiumOnly && !isPremiumActive(ctx.user)) {
      await ctx.reply("🔒 Fitur ini khusus akun premium. Cek menu ⭐ Info Premium.", { reply_markup: kb });
      return false;
    }
    return true;
  }

  async function run(ctx: MyCtx, f: Feature, input: string) {
    if (!(await guard(ctx, f))) return;
    try {
      const text = await f.run(input, { env, user: ctx.user });
      await ctx.reply(text, { ...HTML, reply_markup: kb });
    } catch (e) {
      console.error(`feature ${f.id} gagal`, e);
      await ctx.reply("⚠️ Terjadi kesalahan saat memproses permintaan. Coba lagi nanti.", { reply_markup: kb });
    }
  }

  bot.command("start", async (ctx) => {
    await setState(env.DB, ctx.user.id, null);
    const u = ctx.user;
    const list = features.map((f) => `• ${esc(f.description)}`).join("\n");
    const prem = isPremiumActive(u) ? `⭐ Premium s.d. ${fmtDateTime(u.premium_until!)}` : "Akun biasa";
    await ctx.reply(
      `👋 Selamat datang di <b>PulsaKu Bot</b>!\nAsisten praktis untuk kebutuhan kartu seluler kamu 🚀\n\n` +
        `━━━━━━━━━━━━━━\n📋 <b>Informasi Akun Anda</b>\n🆔 ID Telegram: <code>${u.id}</code>\n` +
        `👤 Nama: ${esc(u.first_name ?? "-")}\n📱 Username: ${u.username ? "@" + esc(u.username) : "-"}\n` +
        `🏷 Status: ${prem}\n\n━━━━━━━━━━━━━━\n✨ <b>Yang bisa dilakukan:</b>\n${list}\n\n` +
        `━━━━━━━━━━━━━━\n👇 Silakan pilih menu di bawah.`,
      { ...HTML, reply_markup: kb },
    );
  });

  bot.command("batal", async (ctx) => {
    await setState(env.DB, ctx.user.id, null);
    await ctx.reply("Dibatalkan.", { reply_markup: kb });
  });

  // Admin: /setpremium <id_telegram> <hari>
  bot.command("setpremium", async (ctx) => {
    if (!admins.has(String(ctx.user.id))) return;
    const [idStr, daysStr] = ctx.match.trim().split(/\s+/);
    const id = Number(idStr);
    const days = Number(daysStr);
    if (!Number.isInteger(id) || !Number.isInteger(days) || days <= 0) {
      await ctx.reply("Format: /setpremium <id_telegram> <hari>");
      return;
    }
    const until = await grantPremium(env.DB, id, days);
    await ctx.reply(`✅ Premium ${id} aktif s.d. ${fmtDateTime(until)}`);
  });

  // Tombol menu.
  for (const f of features) {
    bot.hears(f.label, async (ctx) => {
      if (!(await guard(ctx, f))) return;
      if (f.prompt) {
        await setState(env.DB, ctx.user.id, f.id);
        await ctx.reply(`${f.prompt}\n\n<i>/batal untuk membatalkan</i>`, HTML);
      } else {
        await setState(env.DB, ctx.user.id, null);
        await run(ctx, f, "");
      }
    });
  }

  // Input teks setelah memilih menu.
  bot.on("message:text", async (ctx) => {
    const state = await getState(env.DB, ctx.user.id);
    const f = features.find((x) => x.id === state);
    if (!f) {
      await ctx.reply("Pilih menu di bawah ya 👇", { reply_markup: kb });
      return;
    }
    await setState(env.DB, ctx.user.id, null);
    await run(ctx, f, ctx.message.text);
  });

  // Jangan lempar error ke Telegram (supaya tidak di-retry terus).
  bot.catch((err) => console.error("bot error", err.error));

  return { bot, handle: webhookCallback(bot, "cloudflare-mod", { secretToken: env.WEBHOOK_SECRET }) };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/") return new Response("PulsaKu Bot OK");
    if (pathname !== "/webhook" || request.method !== "POST") {
      return new Response("Not found", { status: 404 });
    }
    cached ??= create(env);
    return cached.handle(request);
  },
} satisfies ExportedHandler<Env>;
