# PulsaKu Bot

Bot Telegram di Cloudflare Workers (grammY + D1), deploy otomatis lewat GitHub Actions.

Menu: Cek Kuota, Status Nomor, Cek Voucher, Paket Promo, Cek SP Segel, Cek Masal (premium),
Utang Pulsa, Tambah Masa Aktif, Redeem Voucher, Info Premium.

Semua fitur memakai data contoh (`src/providers/dummy.ts`) sampai kamu memasang provider API sendiri.

## Struktur

```
src/index.ts            webhook + routing menu
src/features/*.ts       satu file per fitur
src/provider.ts         antarmuka TelcoProvider (colok API di sini)
src/providers/dummy.ts  data contoh
src/db.ts               D1: user, premium, state input
schema.sql              skema D1
.github/workflows/deploy.yml
```

## Setup (tanpa terminal, semua dari GitHub)

Worker dan database D1 dibuat otomatis oleh workflow saat push pertama. Yang perlu disiapkan:

1. **Bot**: buat bot di @BotFather, simpan tokennya.
2. **Cloudflare**:
   - Buka dash.cloudflare.com → Workers & Pages sekali (supaya subdomain workers.dev akun aktif).
   - My Profile → API Tokens → Create Token → template "Edit Cloudflare Workers", lalu tambahkan izin
     Account → D1 → Edit.
   - Catat Account ID (ada di halaman Workers & Pages, sisi kanan).
3. **Isi `ADMIN_IDS`** di `wrangler.toml` dengan ID Telegram kamu (opsional, untuk /setpremium).
4. **Upload ke GitHub**: buat repo, upload isi folder ini ke branch `main`.
5. **GitHub Secrets** (repo → Settings → Secrets and variables → Actions):

   | Secret | Isi |
   |---|---|
   | `CLOUDFLARE_API_TOKEN` | token langkah 2 |
   | `CLOUDFLARE_ACCOUNT_ID` | Account ID |
   | `BOT_TOKEN` | token dari BotFather |
   | `WEBHOOK_SECRET` | string acak panjang (huruf/angka/_/-) |

6. **Jalankan**: push ke `main`, atau tab Actions → Deploy → Run workflow.

Workflow akan: typecheck, membuat D1 `pulsaku` jika belum ada, migrasi tabel, deploy Worker beserta secrets,
lalu mendaftarkan webhook Telegram ke URL Worker secara otomatis. Setelah hijau, kirim /start ke botmu.

Jika langkah "Siapkan database D1" gagal, pastikan token punya izin D1 Edit.

## Memberi premium

Kirim ke bot dari akun admin: `/setpremium <id_telegram> <hari>`

## Memasang API sungguhan

Buat `src/providers/api.ts` yang meng-implement `TelcoProvider`, lalu ubah `getProvider()` di `src/provider.ts`.
Fitur lain tidak perlu diubah. Simpan kredensial API sebagai secret (`wrangler secret put`), bukan di kode.

## Batasan Workers

- Satu request punya batas subrequest dan waktu CPU (lebih ketat di plan gratis). Cek Masal dibatasi 20 nomor.
  Untuk jumlah besar, pecah per batch atau pakai Cloudflare Queues.
- Bot ini hanya mode webhook; long polling tidak jalan di Workers.

## Dev lokal

```
cp .dev.vars.example .dev.vars   # isi token
npm run db:init:local
npm run dev                      # lalu expose dengan tunnel dan set webhook manual: npm run webhook
```
