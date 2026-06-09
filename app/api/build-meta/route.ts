import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { BUILD_UPDATED_AT, BUILD_VERSION } from "@/lib/buildMeta";

const execFileAsync = promisify(execFile);

const ROOT = process.cwd();

type GitHubCommitResponse = {
  commit?: {
    author?: {
      date?: string;
    };
    committer?: {
      date?: string;
    };
  };
};

function validIsoDate(value?: string | null) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

async function getLocalCommitUpdatedAt() {
  try {
    const { stdout } = await execFileAsync("git", ["show", "-s", "--format=%cI", "HEAD"], { cwd: ROOT });
    return validIsoDate(stdout.trim());
  } catch {
    return null;
  }
}

async function getGitHubCommitUpdatedAt() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const repo = process.env.VERCEL_GIT_REPO_SLUG;

  if (!sha || !owner || !repo) return null;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "minwook-portfolio-build-meta",
      },
    });

    if (!response.ok) return null;
    const payload = (await response.json()) as GitHubCommitResponse;
    return validIsoDate(payload.commit?.committer?.date ?? payload.commit?.author?.date);
  } catch {
    return null;
  }
}

async function getUpdatedAt() {
  const configuredUpdatedAt = validIsoDate(process.env.NEXT_PUBLIC_BUILD_UPDATED_AT ?? process.env.BUILD_UPDATED_AT);
  return (
    configuredUpdatedAt ??
    (await getGitHubCommitUpdatedAt()) ??
    (await getLocalCommitUpdatedAt()) ??
    BUILD_UPDATED_AT
  );
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
