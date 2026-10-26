import type { Perfil } from '@/lib/tipos';

/**
 * Dados pessoais e institucionais.
 * Fontes: portal público do SIGAA (SIAPE 2269079), perfil do GitHub e ORCID.
 */
export const perfil: Perfil = {
  nome: 'Ábner Lucas Alves Pereira',
  nomeCurto: 'Ábner Lucas',
  titulo: 'Prof. Me. Ábner Lucas',
  cargo: 'Professor EBTT · Eixo Informação e Comunicação',
  instituicao: 'Instituto Federal do Pará',
  campus: 'Campus Breves',
  eixo: 'Informação e Comunicação',
  siape: '2269079',
  email: 'abner.lucas@ifpa.edu.br',
  endereco: 'Rua Antônio Fulgêncio da Silva, s/n · Parque Universitário · Breves (PA)',
  chamada:
    'Professor EBTT do IFPA Campus Breves, no Marajó. Aqui estão minhas disciplinas, materiais de aula, laboratórios interativos e pesquisas em Inteligência Computacional e Robótica.',
  bio: [
    'Sou professor do Eixo Informação e Comunicação do IFPA Campus Breves e mestre em Ciência da Computação na linha de Inteligência Computacional.',
    'Gosto de transformar conceitos abstratos — projeções 3D, protocolos de rede, redes neurais — em experiências que cabem no navegador e que os estudantes podem tocar, quebrar e reconstruir.',
    'Na pesquisa, trabalho com Deep Learning, redes neurais artificiais, sinais cerebrais (EEG) e robótica, sempre buscando aplicações que façam sentido para a realidade amazônica.',
  ],
  areas: [
    'Inteligência Computacional',
    'Deep Learning',
    'Redes Neurais Artificiais',
    'Robótica',
    'Computação Gráfica',
    'Desenvolvimento Web',
  ],
  formacao: [
    {
      nivel: 'Mestrado',
      curso: 'Ciência da Computação · Inteligência Computacional',
      instituicao: 'Universidade Federal do Pará (UFPA)',
      periodo: '2021',
    },
    {
      nivel: 'Especialização',
      curso: 'Docência para a Educação Profissional, Técnica e Tecnológica',
      instituicao: 'Instituto Federal do Pará (IFPA)',
      periodo: '2017',
    },
    {
      nivel: 'Especialização',
      curso: 'Engenharia de Sistemas',
      instituicao: 'Escola Superior Aberta do Brasil (ESAB)',
      periodo: '2016 – 2017',
    },
    {
      nivel: 'Licenciatura',
      curso: 'Matemática',
      instituicao: 'Universidade Federal do Pará (UFPA)',
      periodo: '2013 – 2019',
    },
    {
      nivel: 'Tecnologia',
      curso: 'Análise e Desenvolvimento de Sistemas',
      instituicao: 'Universidade Norte do Paraná (UNOPAR)',
      periodo: '2012 – 2014',
    },
  ],
  /**
   * Linha do tempo da página "Sobre": só o essencial, em ordem cronológica.
   * Fontes: SIGAA (turmas e projetos), ORCID (formação e capítulo) e GitHub.
   */
  trajetoria: [
    {
      ano: '2014',
      tipo: 'formacao',
      titulo: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
      detalhe: 'UNOPAR · o primeiro contato profissional com código.',
    },
    {
      ano: '2015',
      tipo: 'docencia',
      titulo: 'Professor no IFPA',
      detalhe: 'Primeiras turmas no SIGAA. Desde então, mais de 60 turmas de banco de dados a computação gráfica.',
    },
    {
      ano: '2017',
      tipo: 'formacao',
      titulo: 'Especializações em Docência EPT e Engenharia de Sistemas',
      detalhe: 'IFPA e ESAB · ensinar tecnologia com método.',
    },
    {
      ano: '2019',
      tipo: 'formacao',
      titulo: 'Licenciatura em Matemática',
      detalhe: 'UFPA · a base para geometria, projeções e algoritmos.',
    },
    {
      ano: '2021',
      tipo: 'formacao',
      titulo: 'Mestrado em Ciência da Computação',
      detalhe: 'UFPA · linha de Inteligência Computacional: redes neurais e sinais cerebrais (EEG).',
    },
    {
      ano: '2023',
      tipo: 'pesquisa',
      titulo: 'Deep Learning aplicado a ERP',
      detalhe: 'Capítulo publicado pela Springer e projeto de chatbot com IA para o Campus Breves.',
      url: 'https://doi.org/10.1007/978-3-031-27524-1_77',
    },
    {
      ano: '2026',
      tipo: 'projeto',
      titulo: 'IA no açaí e laboratórios interativos',
      detalhe: 'Pesquisa em morfometria computacional e plataformas como Geo3D e Missão OSI para as turmas.',
    },
  ],
  redes: {
    github: 'https://github.com/abner-lucas',
    linkedin: 'https://www.linkedin.com/in/abnerlucas',
    lattes: 'https://lattes.cnpq.br/7018451290087512',
    orcid: 'https://orcid.org/0000-0002-2554-8246',
    sigaa: 'https://sigaa.ifpa.edu.br/sigaa/public/docente/portal.jsf?siape=2269079',
  },
};

/** Usuário do GitHub consultado pela API para estrelas e datas dos subapps. */
export const usuarioGithub = 'abner-lucas';

/**
 * Números exibidos no topo da página.
 * `turmas` e `desde` vêm do histórico de turmas do SIGAA (primeira turma em 2015.2).
 * A quantidade de repositórios é atualizada automaticamente pela API do GitHub.
 */
export const numeros = {
  desde: 2015,
  turmas: 69,
  repositoriosPadrao: 22,
};
