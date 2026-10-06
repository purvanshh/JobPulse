import fs from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

function prepareHostedSqlite() {
  // Serverless filesystems are read-only except /tmp. The build ships a
  // seeded prisma/dev.db; copy it somewhere Prisma can open and write.
  if (process.env.VERCEL !== "1") return;

  const configured = process.env.DATABASE_URL ?? "";
  if (configured && !configured.startsWith("file:")) return;

  const source = path.join(process.cwd(), "prisma", "dev.db");
  const dest = "/tmp/jobpulse.db";

  if (!fs.existsSync(dest)) {
    if (!fs.existsSync(source)) {
      throw new Error(
        "JobPulse database was not included in this deployment. Redeploy after the database build step.",
      );
    }
    fs.copyFileSync(source, dest);
  }

  process.env.DATABASE_URL = `file:${dest}`;
}

prepareHostedSqlite();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
