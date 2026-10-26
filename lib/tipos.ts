/**
 * Tipos de domínio do portfólio.
 *
 * Todo o conteúdo exibido no site é descrito por estes tipos e mora na
 * pasta `conteudo/`. Para mudar um texto, link ou item basta editar o
 * arquivo correspondente — o TypeScript avisa se faltar algum campo.
 */

/** Paleta de destaque usada em cartões, ícones e capas. */
export type Tom = 'verde' | 'lima' | 'coral' | 'violeta' | 'ambar' | 'azul';

export interface LinkExterno {
  rotulo: string;
  url: string;
}

export interface Perfil {
  nome: string;
  nomeCurto: string;
  titulo: string;
  cargo: string;
  instituicao: string;
  campus: string;
  eixo: string;
  siape: string;
  email: string;
  endereco: string;
  /** Frase curta exibida no topo da página. */
  chamada: string;
  bio: string[];
  areas: string[];
  formacao: Formacao[];
  /** Marcos essenciais, em ordem cronológica. */
  trajetoria: Marco[];
  redes: {
    github: string;
    linkedin: string;
    lattes: string;
    orcid: string;
    sigaa: string;
  };
}

/** Marco da linha do tempo da página "Sobre". */
export interface Marco {
  ano: string;
  tipo: 'formacao' | 'docencia' | 'pesquisa' | 'projeto';
  titulo: string;
  detalhe: string;
  url?: string;
}

export interface Formacao {
  nivel: string;
  curso: string;
  instituicao: string;
  periodo: string;
}

export interface Material {
  titulo: string;
  tipo: 'portal' | 'repositorio' | 'apostila' | 'slides' | 'video' | 'exercicio';
  url: string;
  descricao?: string;
}

/** Etapa do plano de aulas (unidade, módulo ou semana — como preferir). */
export interface Aula {
  etapa: string;
  tema: string;
  descricao: string;
}

export interface Disciplina {
  /** Identificador estável usado em links e no filtro de avisos. */
  id: string;
  codigo: string;
  nome: string;
  curso: string;
  cargaHoraria: number;
  periodo: string;
  resumo: string;
  topicos: string[];
  icone: 'cubo' | 'arvore' | 'codigo' | 'rede' | 'chip' | 'ferramenta' | 'livro' | 'transmissao' | 'lampada';
  tom: Tom;
  materiais: Material[];
  planoDeAulas: Aula[];
}

export interface Subapp {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  tecnologias: string[];
  /** Nome do repositório em github.com/<usuario>/<repositorio>. */
  repositorio: string;
  demo?: string;
  /** Nome-base da capa em `public/midia/projetos/` (sem extensão). */
  capa: string;
  tom: Tom;
  /** Pode ser aberto dentro do site em um quadro (iframe). */
  incorporavel: boolean;
  /** Dados preenchidos pela API do GitHub em tempo de build. */
  estrelas?: number;
  atualizadoEm?: string;
}

export type CategoriaTrabalho =
  | 'Projeto de pesquisa'
  | 'Capítulo de livro'
  | 'Pesquisa aberta'
  | 'Extensão'
  | 'Orientação de TCC';

export interface Trabalho {
  id: string;
  titulo: string;
  categoria: CategoriaTrabalho;
  ano: number;
  detalhe: string;
  url?: string;
  emAndamento?: boolean;
}

export interface Aviso {
  id: string;
  titulo: string;
  texto: string;
  /** `id` da disciplina ou `'geral'` para todas as turmas. */
  disciplina: string;
  data: string;
  fixado?: boolean;
  link?: LinkExterno;
}

export type TipoEvento = 'letivo' | 'avaliacao' | 'feriado' | 'evento' | 'prazo';

export interface EventoCalendario {
  id: string;
  titulo: string;
  /** Data ISO (AAAA-MM-DD). */
  data: string;
  tipo: TipoEvento;
  descricao?: string;
}

export interface Destaque {
  rotulo: string;
  titulo: string;
  texto: string;
  link: LinkExterno;
  tom: Tom;
}
