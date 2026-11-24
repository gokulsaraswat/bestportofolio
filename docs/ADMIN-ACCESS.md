# Admin access runbook

Login uses the `AdminUser` table (not Supabase Auth). `username` can be an email. `password` must be a scrypt hash (`scrypt$N$r$p$salt$hash`, see `src/lib/password.ts`); plaintext rows are rejected with "Invalid credentials". Postgres cannot generate scrypt, so hash locally.

## Grant admin access (works without DB connectivity)

1. Generate the SQL (min 12 chars password; replace email and password):

```bash
node -e "const c=require('crypto');const s=c.randomBytes(16);const h=c.scryptSync(process.argv[2],s,64,{N:16384,r:8,p:1}).toString('hex');console.log(\`INSERT INTO \"AdminUser\" (id,username,password,role,permissions,\"mustChangePassword\",\"createdAt\",\"updatedAt\") VALUES (gen_random_uuid()::text,'\${process.argv[1]}','scrypt\$16384\$8\$1\$\${s.toString('hex')}\$\${h}','admin','',false,now(),now()) ON CONFLICT (username) DO UPDATE SET password=EXCLUDED.password,\"updatedAt\"=now();\`)" 'admin@example.com' 'LongPassword12+'
```

2. Paste the printed statement into the Supabase SQL Editor and run it. Paste only the SQL (no shell prompt). The same statement resets the password of an existing user.

## Alternative (needs reachable DATABASE_URL)

```bash
node --env-file=.env scripts/create-admin.mjs admin@example.com 'LongPassword12+'
```

## Troubleshooting

- "Can't reach database server ... :6543": project paused, or network/VPN blocks the pooler. Use the SQL route above.
- "Invalid credentials": row missing, password not a scrypt hash, or username mismatch (exact string match).
- Set `"mustChangePassword"` to `true` to force a change at first sign-in.
