import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Roda como aplicação Node.js (`next build` + `next start`), hospedada na Hostinger.
  poweredByHeader: false,
};

export default nextConfig;
