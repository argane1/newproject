import type { NextConfig } from "next";

/**
 * Turbopack configuration - Set an explicit root directory for package resolution.
 * This ensures Next.js can find the project's dependencies even when compiled as a monorepo or deep nested structure.
 */
const nextConfig: Partial<NextConfig> = {
      turbopack: {},
};

export default nextConfig;
