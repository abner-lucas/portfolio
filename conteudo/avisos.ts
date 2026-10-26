import type { Aviso } from '@/lib/tipos';

/**
 * Mural de avisos.
 *
 * - `disciplina`: `id` de uma disciplina (veja `disciplinas.ts`) ou `'geral'`.
 * - `fixado: true` mantém o aviso no topo e o leva para "Em destaque".
 * - Estudantes que acompanham a disciplina veem um selo de "novo" até lerem.
 *
 * Os avisos abaixo são exemplos baseados nas atividades publicadas nos
 * portais das disciplinas — substitua pelos comunicados reais das turmas.
 */
export const avisos: Aviso[] = [
  {
    id: '2026-10-boas-vindas',
    titulo: 'Acompanhe suas turmas por aqui',
    texto:
      'Marque as disciplinas que você cursa em "Acompanhar turmas". Os avisos novos delas aparecem no sino do topo da página, sem precisar de login.',
    disciplina: 'geral',
    data: '2026-10-20',
    fixado: true,
  },
  {
    id: '2026-10-cg-modelos-3d',
    titulo: '3ª avaliação: Site com Modelos 3D (em dupla)',
    texto:
      'O roteiro com as seis etapas, o gerador de ZIP e os critérios de avaliação está publicado no portal. Modelem no Tinkercad, exportem em .glb e publiquem o site.',
    disciplina: 'computacao-grafica',
    data: '2026-10-17',
    link: {
      rotulo: 'Abrir roteiro',
      url: 'https://abner-lucas.github.io/computacao-grafica/02-atividade-site-com-modelos-3d/pagina-orientacoes/dist/index.html',
    },
  },
  {
    id: '2026-10-web-responsivo',
    titulo: '3ª avaliação: personalização de site responsivo',
    texto:
      'Baixem o pacote do projeto-base, sigam o checklist de testes e publiquem a versão final. As orientações completas estão no portal da disciplina.',
    disciplina: 'programacao-web',
    data: '2026-10-15',
    link: {
      rotulo: 'Ver orientações',
      url: 'https://abner-lucas.github.io/programacao-web/projetos/03-atividade-3-avaliacao/index.html',
    },
  },
  {
    id: '2026-10-geo3d',
    titulo: 'Geo3D no ar: dez desafios de planificação',
    texto:
      'Usem o laboratório para revisar sólidos, planificações e projeções ortogonais. Ele funciona no celular e tem recursos de acessibilidade.',
    disciplina: 'computacao-grafica',
    data: '2026-10-09',
    link: { rotulo: 'Abrir o Geo3D', url: 'https://geo3d-lab-interativo.vercel.app/' },
  },
  {
    id: '2026-09-osi',
    titulo: 'Missão OSI: investiguem a falha na rede',
    texto:
      'A comunicação entre o laboratório e o servidor central caiu! Entrem na Missão OSI, identifiquem-se e investiguem camada por camada. Consultar o Atlas OSI não tira ponto, mas as justificativas no caderno de evidências contam.',
    disciplina: 'redes-de-computadores',
    data: '2026-09-28',
    link: { rotulo: 'Entrar na Missão OSI', url: 'https://osi.profabnerlucas.com/' },
  },
];
