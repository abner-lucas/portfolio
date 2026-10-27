import type { Disciplina } from '@/lib/tipos';

/**
 * Disciplinas em oferta. Códigos, cargas horárias e períodos vêm do SIGAA.
 *
 * Para cada disciplina você pode:
 *  - preencher `planoDeAulas` com as etapas do semestre;
 *  - adicionar `materiais` (apostilas, slides, repositórios, vídeos…);
 *  - ajustar `resumo` e `topicos`.
 * Disciplinas sem plano ou materiais mostram um aviso apontando para o SIGAA.
 */

const CG = 'https://abner-lucas.github.io/computacao-grafica';
const WEB = 'https://abner-lucas.github.io/programacao-web';

export const disciplinas: Disciplina[] = [
  {
    id: 'computacao-grafica',
    codigo: 'TIINF0938',
    nome: 'Computação Gráfica',
    curso: 'Técnico em Informática',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo:
      'Do espaço tridimensional à publicação na web: câmera, modelagem 3D, formatos GLTF/GLB e cenas interativas com Three.js.',
    topicos: ['Coordenadas X/Y/Z e câmera', 'Projeção em perspectiva', 'Malhas poligonais', 'GLTF/GLB', 'Three.js e OrbitControls', 'Publicação na web'],
    icone: 'cubo',
    tom: 'violeta',
    planoDeAulas: [
      {
        etapa: 'Etapa 1',
        tema: 'Espaço tridimensional & câmera',
        descricao: 'Coordenadas X, Y e Z, campo de visão, planos de recorte near/far e projeção em perspectiva.',
      },
      {
        etapa: 'Etapa 2',
        tema: 'Modelagem 3D & formatos web',
        descricao: 'Criação de formas no Tinkercad e no Blender, malhas poligonais e exportação para GLTF/GLB.',
      },
      {
        etapa: 'Etapa 3',
        tema: 'Three.js & interatividade',
        descricao: 'Cena, materiais, luz ambiente e direcional, OrbitControls e laço de renderização.',
      },
      {
        etapa: 'Etapa 4',
        tema: 'Publicação & entrega',
        descricao: 'Organização dos arquivos (HTML, CSS, JS e GLB), testes locais, hospedagem e entrega no Classroom.',
      },
    ],
    materiais: [
      { titulo: 'Portal da disciplina', tipo: 'portal', url: `${CG}/`, descricao: 'Trilha de aprendizado, projetos e ferramentas.' },
      { titulo: 'Projeto 01 · Página com 3D', tipo: 'exercicio', url: `${CG}/01-pagina-com-3d/index.html`, descricao: 'Primeira cena Three.js carregando um modelo GLB.' },
      { titulo: 'Roteiro · Site com Modelos 3D', tipo: 'apostila', url: `${CG}/02-atividade-site-com-modelos-3d/pagina-orientacoes/dist/index.html`, descricao: '3ª avaliação, em dupla: etapas, gerador de ZIP e critérios.' },
      { titulo: 'Modelo de página para os estudantes', tipo: 'exercicio', url: 'https://abner-lucas.github.io/webpage-modelo-3d/' },
      { titulo: 'Geo3D · Laboratório interativo', tipo: 'repositorio', url: 'https://github.com/abner-lucas/geo3d-lab-interativo-cg', descricao: 'Sólidos, planificações, projeções ortogonais e desafios.' },
      { titulo: 'Código-fonte no GitHub', tipo: 'repositorio', url: 'https://github.com/abner-lucas/computacao-grafica' },
    ],
  },
  {
    id: 'programacao-web',
    codigo: 'TIINF0956',
    nome: 'Programação Web',
    curso: 'Técnico em Informática',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo:
      'HTML5 semântico, CSS3 com Flexbox e Grid, JavaScript para interatividade e publicação com Git e GitHub Pages.',
    topicos: ['HTML5 semântico', 'Formulários acessíveis', 'Flexbox e Grid', 'Variáveis e transições CSS', 'DOM e eventos', 'Git e deploy'],
    icone: 'codigo',
    tom: 'azul',
    planoDeAulas: [
      {
        etapa: 'Etapa 1',
        tema: 'Estrutura com HTML5',
        descricao: 'Tags semânticas, formulários acessíveis, links e organização de pastas no VS Code.',
      },
      {
        etapa: 'Etapa 2',
        tema: 'Estilização com CSS3',
        descricao: 'Box model, Flexbox, Grid, variáveis CSS, sombras e efeitos de transição.',
      },
      {
        etapa: 'Etapa 3',
        tema: 'Interatividade com JavaScript',
        descricao: 'Manipulação do DOM, eventos de clique, alternância de classes e validação de formulários.',
      },
      {
        etapa: 'Etapa 4',
        tema: 'Publicação & versionamento',
        descricao: 'Git, repositórios no GitHub e publicação contínua com GitHub Pages.',
      },
    ],
    materiais: [
      { titulo: 'Portal da disciplina', tipo: 'portal', url: `${WEB}/`, descricao: 'Trilha, projetos práticos e roteiros.' },
      { titulo: 'Atividade diagnóstica · Layout interativo', tipo: 'apostila', url: `${WEB}/docs/Atividade_Diagnostica_Layout_Interativo.pdf` },
      { titulo: 'Atividade diagnóstica · Mostra de Tecnologia', tipo: 'apostila', url: `${WEB}/docs/Atividade_Diagnostica_Web.pdf` },
      { titulo: 'Projeto-base · Patas & Cia', tipo: 'exercicio', url: `${WEB}/projetos/02-patas-e-cia/index.html`, descricao: 'Landing page comentada linha a linha.' },
      { titulo: '3ª avaliação · Site responsivo', tipo: 'exercicio', url: `${WEB}/projetos/03-atividade-3-avaliacao/index.html`, descricao: 'Orientações, checklist e pacote do projeto.' },
      { titulo: 'Código-fonte no GitHub', tipo: 'repositorio', url: 'https://github.com/abner-lucas/programacao-web' },
    ],
  },
  {
    id: 'estrutura-de-dados',
    codigo: 'TIINF0939',
    nome: 'Estrutura de Dados',
    curso: 'Técnico em Informática',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo: 'Como organizar a informação para que os algoritmos sejam rápidos: listas, pilhas, filas, árvores e análise de custo.',
    topicos: ['Vetores e matrizes', 'Listas encadeadas', 'Pilhas e filas', 'Recursão', 'Árvores', 'Busca e ordenação'],
    icone: 'arvore',
    tom: 'verde',
    planoDeAulas: [],
    materiais: [],
  },
  {
    id: 'redes-de-computadores',
    codigo: 'TIINF1647',
    nome: 'Redes de Computadores',
    curso: 'Técnico em Informática',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo: 'Do cabo ao aplicativo: modelo OSI, TCP/IP, endereçamento e os serviços que mantêm a internet de pé.',
    topicos: ['Modelo OSI', 'Pilha TCP/IP', 'Endereçamento IP', 'Cabeamento e equipamentos', 'Serviços de rede'],
    icone: 'rede',
    tom: 'coral',
    planoDeAulas: [],
    materiais: [
      { titulo: 'Missão OSI · Investigadores da Rede', tipo: 'portal', url: 'https://osi.profabnerlucas.com/', descricao: 'Diagnóstico gamificado das 7 camadas + desafio integrador (~3 encontros).' },
      { titulo: 'Código-fonte do Missão OSI', tipo: 'repositorio', url: 'https://github.com/abner-lucas/missao-osi' },
    ],
  },
  {
    id: 'eletronica-basica',
    codigo: 'TIINF0954',
    nome: 'Eletrônica Básica',
    curso: 'Técnico em Informática',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo: 'Grandezas elétricas, componentes e circuitos que estão por trás de todo computador.',
    topicos: ['Tensão, corrente e resistência', 'Lei de Ohm', 'Componentes passivos', 'Circuitos e medições'],
    icone: 'chip',
    tom: 'ambar',
    planoDeAulas: [],
    materiais: [],
  },
  {
    id: 'manutencao-e-suporte',
    codigo: 'TIINF0955',
    nome: 'Manutenção e Suporte de Computadores',
    curso: 'Técnico em Informática',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo: 'Montagem, diagnóstico e manutenção de computadores, sistemas operacionais e boas práticas de suporte.',
    topicos: ['Arquitetura do PC', 'Montagem e desmontagem', 'Diagnóstico de falhas', 'Instalação de sistemas'],
    icone: 'ferramenta',
    tom: 'lima',
    planoDeAulas: [],
    materiais: [],
  },
  {
    id: 'informatica-basica',
    codigo: 'TIMAM1117',
    nome: 'Informática Básica e Metodologia Científica',
    curso: 'Técnico integrado',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo: 'Ferramentas digitais para estudar, pesquisar e escrever trabalhos acadêmicos com método.',
    topicos: ['Editores e planilhas', 'Pesquisa na internet', 'Normas de trabalhos acadêmicos', 'Apresentações'],
    icone: 'livro',
    tom: 'verde',
    planoDeAulas: [],
    materiais: [],
  },
  {
    id: 'metodologias-ativas',
    codigo: 'DE/BREVES0093',
    nome: 'Metodologias Ativas e Ensino Híbrido',
    curso: 'Campus Breves',
    cargaHoraria: 34,
    periodo: '2026.2',
    resumo: 'Estratégias para colocar o estudante no centro: sala de aula invertida, rotação por estações e aprendizagem por projetos.',
    topicos: ['Sala de aula invertida', 'Rotação por estações', 'Aprendizagem baseada em projetos', 'Tecnologias digitais'],
    icone: 'lampada',
    tom: 'violeta',
    planoDeAulas: [],
    materiais: [],
  },
  {
    id: 'transmissoes-ao-vivo',
    codigo: 'DE/BREVES0097',
    nome: 'Produção de Transmissões ao Vivo (Lives)',
    curso: 'Campus Breves',
    cargaHoraria: 34,
    periodo: '2026.2',
    resumo: 'Planejamento, captação e transmissão de lives educacionais com qualidade de áudio, vídeo e roteiro.',
    topicos: ['Roteiro e planejamento', 'Captação de áudio e vídeo', 'Softwares de transmissão', 'Plataformas'],
    icone: 'transmissao',
    tom: 'coral',
    planoDeAulas: [],
    materiais: [],
  },
];
