import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Aplicação Node.js na Hostinger. O modo standalone gera um servidor enxuto,
  // que o servidor consegue iniciar com menos memória que o `next start` completo.
  output: 'standalone',
  poweredByHeader: false,
};

export default nextConfig;
