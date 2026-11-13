// Pakai manual: BOT_TOKEN=... WORKER_URL=https://xxx.workers.dev WEBHOOK_SECRET=... npm run webhook
const { BOT_TOKEN, WORKER_URL, WEBHOOK_SECRET } = process.env;
if (!BOT_TOKEN || !WORKER_URL || !WEBHOOK_SECRET) {
  console.error("Isi BOT_TOKEN, WORKER_URL, dan WEBHOOK_SECRET.");
  process.exit(1);
}
const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    url: `${WORKER_URL.replace(/\/$/, "")}/webhook`,
    secret_token: WEBHOOK_SECRET,
    allowed_updates: ["message"],
  }),
});
console.log(await res.text());
