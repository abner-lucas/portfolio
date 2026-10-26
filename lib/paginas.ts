/**
 * Mapa do site. A ordem define o menu, a numeração das etiquetas, a cortina
 * de transição e o "próxima parada" no fim de cada página.
 */
export interface Pagina {
  href: string;
  rotulo: string;
  /** Frase curta usada na cortina de transição e no "próxima parada". */
  chamada: string;
}

export const PAGINAS: Pagina[] = [
  { href: '/', rotulo: 'Início', chamada: 'ensinar · pesquisar · criar' },
  { href: '/disciplinas', rotulo: 'Disciplinas', chamada: 'planos, materiais e avisos de cada turma' },
  { href: '/laboratorio', rotulo: 'Laboratório', chamada: 'subapps e experimentos ao vivo' },
  { href: '/pesquisa', rotulo: 'Pesquisa', chamada: 'projetos, publicações e orientações' },
  { href: '/sobre', rotulo: 'Sobre', chamada: 'formação e trajetória' },
  { href: '/mural', rotulo: 'Mural', chamada: 'avisos e datas do semestre' },
];

/** Página do mapa que corresponde a um caminho (subpáginas contam como a seção-mãe). */
export function paginaDe(caminho: string): Pagina {
  return (
    [...PAGINAS].reverse().find((p) => (p.href === '/' ? caminho === '/' : caminho.startsWith(p.href))) ?? PAGINAS[0]
  );
}

/** Número da página no mapa (Disciplinas = 1, Laboratório = 2…). */
export function numeroDe(href: string): number {
  return PAGINAS.findIndex((p) => p.href === href);
}

/** Próxima página do roteiro (a última volta para o início). */
export function proximaDe(href: string): Pagina {
  const i = PAGINAS.findIndex((p) => p.href === href);
  return PAGINAS[(i + 1) % PAGINAS.length];
}
