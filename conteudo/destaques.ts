import type { Destaque, LinkExterno } from '@/lib/tipos';

/**
 * O que aparece em "Em destaque" logo abaixo da abertura.
 *
 * O primeiro item ocupa o cartão grande. Avisos fixados e o próximo evento
 * do calendário entram automaticamente ao lado destes destaques.
 */
export const destaques: Destaque[] = [
  {
    rotulo: 'Novo laboratório',
    titulo: 'Geo3D: sólidos que se abrem na sua tela',
    texto:
      'Gire, planifique e projete cinco sólidos geométricos. Dez desafios para revisar Computação Gráfica no seu ritmo.',
    link: { rotulo: 'Abrir o Geo3D', url: 'https://geo3d-lab-interativo.vercel.app/' },
    tom: 'lima',
  },
  {
    rotulo: 'Pesquisa em andamento',
    titulo: 'IA e morfometria no despolpamento do açaí',
    texto: 'Visão computacional para otimizar peneiras nas batedeiras de açaí de Breves.',
    link: { rotulo: 'Ver pesquisa', url: '/pesquisa' },
    tom: 'coral',
  },
  {
    rotulo: 'Extensão',
    titulo: 'Letramento Digital em IA',
    texto: 'Curso aberto para estudantes e comunidades de Belém, com PRODEPA, iSACI, IFPA e UFPA.',
    link: { rotulo: 'Conhecer o curso', url: 'https://abner-lucas.github.io/letramento-digital-em-ia/' },
    tom: 'violeta',
  },
];

/** Atalhos exibidos na faixa de acesso rápido. */
export const atalhos: LinkExterno[] = [
  { rotulo: 'Portal docente no SIGAA', url: 'https://sigaa.ifpa.edu.br/sigaa/public/docente/portal.jsf?siape=2269079' },
  { rotulo: 'SIGAA do estudante', url: 'https://sigaa.ifpa.edu.br/sigaa/verTelaLogin.do' },
  { rotulo: 'IFPA Campus Breves', url: 'https://breves.ifpa.edu.br/' },
  { rotulo: 'Google Classroom', url: 'https://classroom.google.com/' },
];
