const { execFileSync } = require("node:child_process");

function readCommand(command, args) {
  try {
    return execFileSync(command, args, {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

function readBuildVersion() {
  const configuredVersion = process.env.NEXT_PUBLIC_BUILD_VERSION || process.env.BUILD_VERSION;
  if (configuredVersion) return configuredVersion;

  const sha = process.env.VERCEL_GIT_COMMIT_SHA || readCommand("git", ["rev-parse", "HEAD"]);
  return sha ? `3.1.${sha.slice(0, 5)}` : "3.1.local";
}

function readBuildUpdatedAt() {
  const configuredUpdatedAt = process.env.NEXT_PUBLIC_BUILD_UPDATED_AT || process.env.BUILD_UPDATED_AT;
  const timestamp = configuredUpdatedAt ? new Date(configuredUpdatedAt).getTime() : NaN;

  if (Number.isFinite(timestamp)) return new Date(timestamp).toISOString();

  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "HEAD";
  const commitDate = readCommand("git", ["show", "-s", "--format=%cI", sha]);
  const commitTimestamp = commitDate ? new Date(commitDate).getTime() : NaN;

  return Number.isFinite(commitTimestamp) ? new Date(commitTimestamp).toISOString() : new Date().toISOString();
}

const buildVersion = readBuildVersion();
const buildUpdatedAt = readBuildUpdatedAt();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["next-mdx-remote"],
  devIndicators: false,
  env: {
    NEXT_PUBLIC_BUILD_VERSION: buildVersion,
    NEXT_PUBLIC_BUILD_UPDATED_AT: buildUpdatedAt,
  },
  async rewrites() {
    return [
      {
        source: "/resume.pdf",
        destination: "/Minwook_Shin_Resume_2026.pdf",
      },
      {
        source: "/work/:slug.md",
        destination: "/api/markdown/work/:slug",
      },
      {
        source: "/studies/:slug.md",
        destination: "/api/markdown/studies/:slug",
      },
    ];
  },
  // Pin the workspace root so Next doesn't pick a stray parent lockfile
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
