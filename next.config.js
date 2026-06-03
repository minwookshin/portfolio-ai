/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["next-mdx-remote"],
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  // Pin the workspace root so Next doesn't pick a stray parent lockfile
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
