import type { Subapp } from '@/lib/tipos';

/**
 * Subapps (projetos abertos no GitHub) integrados ao portfólio.
 *
 * - `capa`: nome-base do arquivo em `public/midia/projetos/`. Para trocar a
 *   imagem, sobrescreva o arquivo — pode ser .svg, .png, .jpg, .webp ou .avif.
 * - `incorporavel`: abre o subapp dentro do site, em um quadro.
 * - Estrelas e data de atualização vêm da API do GitHub automaticamente.
 */
export const subapps: Subapp[] = [
  {
    id: 'geo3d',
    nome: 'Geo3D · Laboratório Interativo',
    categoria: 'Computação Gráfica',
    descricao:
      'Cinco sólidos com animações de planificação, projeções ortogonais e dez desafios. Acessível (WCAG 2.2 AA) e com Libras.',
    tecnologias: ['Three.js', 'Next.js', 'Acessibilidade'],
    repositorio: 'geo3d-lab-interativo-cg',
    capa: 'geo3d',
    tom: 'lima',
    incorporavel: false,
  },
  {
    id: 'letramento-ia',
    nome: 'Letramento Digital em IA',
    categoria: 'Extensão',
    descricao:
      'Plataforma do curso de Letramento Digital em IA para estudantes e comunidades de Belém, em parceria PRODEPA, iSACI, IFPA e UFPA.',
    tecnologias: ['Next.js', 'Engenharia de prompts', 'IA'],
    repositorio: 'letramento-digital-em-ia',
    demo: 'https://abner-lucas.github.io/letramento-digital-em-ia/',
    capa: 'letramento-ia',
    tom: 'violeta',
    incorporavel: true,
  },
  {
    id: 'monitor-acai',
    nome: 'MonitorAçaí',
    categoria: 'Pesquisa · IoT',
    descricao:
      'Rodízio aleatório de sensores de umidade do solo (FDR) no sistema agroflorestal irrigado de açaí do Campus Breves, com exportação para planilhas.',
    tecnologias: ['Next.js', 'IoT', 'SheetJS'],
    repositorio: 'monitor-acai',
    demo: 'https://monitoracai.profabnerlucas.com',
    capa: 'monitor-acai',
    tom: 'coral',
    incorporavel: true,
  },
  {
    id: 'computacao-grafica',
    nome: 'Portal de Computação Gráfica',
    categoria: 'Disciplina',
    descricao:
      'Trilha de aprendizado, modelos 3D interativos com Three.js e roteiros das avaliações práticas da disciplina.',
    tecnologias: ['Three.js', 'WebGL', 'GLTF'],
    repositorio: 'computacao-grafica',
    demo: 'https://abner-lucas.github.io/computacao-grafica/',
    capa: 'computacao-grafica',
    tom: 'azul',
    incorporavel: true,
  },
  {
    id: 'programacao-web',
    nome: 'Portal de Programação Web',
    categoria: 'Disciplina',
    descricao:
      'Projetos práticos comentados, roteiros em PDF e pacotes de atividades de HTML5, CSS3 e JavaScript.',
    tecnologias: ['HTML5', 'CSS3', 'JavaScript'],
    repositorio: 'programacao-web',
    demo: 'https://abner-lucas.github.io/programacao-web/',
    capa: 'programacao-web',
    tom: 'ambar',
    incorporavel: true,
  },
  {
    id: 'missao-osi',
    nome: 'Missão OSI · Investigadores da Rede',
    categoria: 'Redes de Computadores',
    descricao:
      'A rede do laboratório caiu! Estudantes do 1º ano investigam as sete camadas com testes simulados (tensão, ARP, ping, TCP, HTTP), Atlas OSI e caderno de evidências.',
    tecnologias: ['Next.js', 'Simulação', 'Gamificação'],
    repositorio: 'missao-osi',
    demo: 'https://osi.profabnerlucas.com/',
    capa: 'missao-osi',
    tom: 'verde',
    incorporavel: true,
  },
];
