import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Site estático: `npm run build` gera a pasta `out/` (HTML, CSS, JS e mídias),
  // servida diretamente pela Hostinger, sem processo Node.js rodando no servidor.
  // Animações e interações rodam no navegador e continuam iguais.
  output: 'export',
  // Cada página vira uma pasta com index.html (/sobre/index.html), formato que
  // qualquer servidor web entende para o endereço /sobre.
  trailingSlash: true,
  poweredByHeader: false,
};

export default nextConfig;
