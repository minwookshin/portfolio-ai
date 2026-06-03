import { execFile } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { BUILD_VERSION } from "@/lib/buildMeta";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();
const WATCH_PATHS = [
  "app",
  "components",
  "data",
  "lib",
  "public",
  "next.config.js",
  "next.config.mjs",
  "tailwind.config.ts",
  "package.json",
] as const;

const TRACKED_EXTENSIONS = new Set([
  ".css",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".mp4",
  ".pdf",
  ".png",
  ".svg",
  ".ts",
  ".tsx",
  ".webp",
  ".woff",
  ".woff2",
]);

const IGNORED_NAMES = new Set([".DS_Store", "__tests__"]);

async function newestMtime(targetPath: string): Promise<number> {
  const fileStat = await stat(targetPath);

  if (!fileStat.isDirectory()) {
    return TRACKED_EXTENSIONS.has(path.extname(targetPath)) ? fileStat.mtimeMs : 0;
  }

  const entries = await readdir(targetPath, { withFileTypes: true });
  const mtimes = await Promise.all(
    entries
      .filter((entry) => !IGNORED_NAMES.has(entry.name))
      .map((entry) => newestMtime(path.join(targetPath, entry.name)))
  );

  return Math.max(fileStat.mtimeMs, ...mtimes, 0);
}

async function getUpdatedAt() {
  const mtimes = await Promise.all(
    WATCH_PATHS.map(async (watchPath) => {
      try {
        return await newestMtime(path.join(/* turbopackIgnore: true */ process.cwd(), watchPath));
      } catch {
        return 0;
      }
    })
  );

  const latest = Math.max(...mtimes, 0);
  return new Date(latest || Date.now()).toISOString();
}

async function getVersion() {
  const configuredVersion = process.env.NEXT_PUBLIC_BUILD_VERSION ?? process.env.BUILD_VERSION;
  if (configuredVersion) return configuredVersion;

  const vercelHash = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 5);
  if (vercelHash) return `3.1.${vercelHash}`;

  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "--short=5", "HEAD"], { cwd: ROOT });
    return `3.1.${stdout.trim()}`;
  } catch {
    return BUILD_VERSION;
  }
}

export async function GET() {
  const [updatedAt, version] = await Promise.all([getUpdatedAt(), getVersion()]);

  return NextResponse.json(
    { updatedAt, version },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
