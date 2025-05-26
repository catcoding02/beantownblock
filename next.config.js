// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ This skips ESLint errors during build (e.g., on Vercel)
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;