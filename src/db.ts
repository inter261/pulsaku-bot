export interface UserRow {
  id: number;
  username: string | null;
  first_name: string | null;
  premium_until: number | null;
  created_at: number;
}

export async function upsertUser(
  db: D1Database,
  id: number,
  username: string | null,
  firstName: string | null,
): Promise<UserRow> {
  await db
    .prepare(
      `INSERT INTO users (id, username, first_name, created_at)
       VALUES (?1, ?2, ?3, ?4)
       ON CONFLICT(id) DO UPDATE SET username = ?2, first_name = ?3`,
    )
    .bind(id, username, firstName, Date.now())
    .run();
  const row = await db
    .prepare("SELECT * FROM users WHERE id = ?1")
    .bind(id)
    .first<UserRow>();
  return row!;
}

export const isPremiumActive = (u: UserRow): boolean =>
  !!u.premium_until && u.premium_until > Date.now();

/** Tambah masa premium (hari). Jika masih aktif, diperpanjang dari tanggal berakhirnya. */
export async function grantPremium(
  db: D1Database,
  userId: number,
  days: number,
): Promise<number> {
  const cur = await db
    .prepare("SELECT premium_until FROM users WHERE id = ?1")
    .bind(userId)
    .first<{ premium_until: number | null }>();
  const base = Math.max(Date.now(), cur?.premium_until ?? 0);
  const until = base + days * 86_400_000;
  await db
    .prepare(
      `INSERT INTO users (id, created_at, premium_until) VALUES (?1, ?2, ?3)
       ON CONFLICT(id) DO UPDATE SET premium_until = ?3`,
    )
    .bind(userId, Date.now(), until)
    .run();
  return until;
}

export async function getState(db: D1Database, userId: number): Promise<string | null> {
  const r = await db
    .prepare("SELECT state FROM sessions WHERE user_id = ?1")
    .bind(userId)
    .first<{ state: string | null }>();
  return r?.state ?? null;
}

export async function setState(
  db: D1Database,
  userId: number,
  state: string | null,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO sessions (user_id, state, updated_at) VALUES (?1, ?2, ?3)
       ON CONFLICT(user_id) DO UPDATE SET state = ?2, updated_at = ?3`,
    )
    .bind(userId, state, Date.now())
    .run();
}
