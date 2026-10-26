import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolução de mídias substituíveis.
 *
 * Imagens e vídeos do site moram em `public/midia/`. Cada mídia é procurada
 * pelo nome-base, em qualquer formato aceito. Assim, para trocar a capa
 * `projetos/geo3d.svg` por uma foto, basta salvar `projetos/geo3d.jpg` na
 * mesma pasta (e apagar o .svg, ou não — formatos de foto têm prioridade).
 *
 * A busca acontece no servidor, no build e a cada regeração diária da página.
 */

const PASTA = path.join(process.cwd(), 'public', 'midia');

const IMAGENS = ['avif', 'webp', 'jpg', 'jpeg', 'png', 'gif', 'svg'];
const VIDEOS = ['webm', 'mp4'];

function procurar(nomeBase: string, extensoes: string[]): string | null {
  for (const ext of extensoes) {
    const relativo = `${nomeBase}.${ext}`;
    if (fs.existsSync(path.join(PASTA, relativo))) return `/midia/${relativo}`;
  }
  return null;
}

/** Caminho público da imagem (ex.: `/midia/professor.jpg`) ou `null`. */
export function imagem(nomeBase: string): string | null {
  return procurar(nomeBase, IMAGENS);
}

/** Caminho público do vídeo (ex.: `/midia/abertura.mp4`) ou `null`. */
export function video(nomeBase: string): string | null {
  return procurar(nomeBase, VIDEOS);
}
