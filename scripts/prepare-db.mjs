import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Hosts like Vercel clone the repo without prisma/dev.db (it is gitignored).
// Create and seed it during the build so the server can open a database.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

if (!process.env.DATABASE_URL.startsWith("file:")) {
  process.exit(0);
}

const dbFile = path.join(process.cwd(), "prisma", "dev.db");
const onVercel = process.env.VERCEL === "1";

if (!onVercel && fs.existsSync(dbFile)) {
  process.exit(0);
}

execSync("npx prisma migrate deploy", {
  stdio: "inherit",
  env: process.env,
});
execSync("npx tsx prisma/seed.ts", {
  stdio: "inherit",
  env: process.env,
});
