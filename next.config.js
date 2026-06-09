/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["next-mdx-remote"],
  devIndicators: false,
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
