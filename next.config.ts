import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  outputFileTracingIncludes: {
    "**": ["./prisma/dev.db", "./node_modules/.prisma/client/**"],
  },
};

export default nextConfig;
