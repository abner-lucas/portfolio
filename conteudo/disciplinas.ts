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
const ED = 'https://abner-lucas.github.io/estrutura-de-dados';
const RC = 'https://abner-lucas.github.io/redes-computadores';

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
    planoDeAulas: [
      { etapa: 'Etapa 1', tema: 'Vetores e matrizes', descricao: 'Memória contígua, acesso por índice em O(1), percursos e operações com vetores e matrizes.' },
      { etapa: 'Etapa 2', tema: 'Listas encadeadas', descricao: 'Nós e ponteiros: inserção, remoção e busca sem precisar de memória contígua.' },
      { etapa: 'Etapa 3', tema: 'Pilhas e filas', descricao: 'As disciplinas LIFO e FIFO e onde elas aparecem: desfazer, chamadas de função e filas de atendimento.' },
      { etapa: 'Etapa 4', tema: 'Recursão', descricao: 'Funções que chamam a si mesmas, caso base e a pilha de chamadas por trás de cada uma.' },
      { etapa: 'Etapa 5', tema: 'Árvores', descricao: 'Árvores binárias e de busca: raiz, folhas, altura, inserção, busca e percursos.' },
      { etapa: 'Etapa 6', tema: 'Busca e ordenação', descricao: 'Busca sequencial e binária, algoritmos de ordenação e a análise do custo de cada um.' },
    ],
    materiais: [
      { titulo: 'Portal da disciplina', tipo: 'portal', url: `${ED}/`, descricao: 'Avisos, trilha, atividades e laboratório da turma.' },
      { titulo: 'Apresentação · Árvores binárias de busca', tipo: 'slides', url: `${ED}/aulas/01-arvores-binarias/`, descricao: 'Slides da aula sobre árvores binárias de busca.' },
      { titulo: 'Simulador passo a passo · Árvore binária', tipo: 'exercicio', url: `${ED}/aulas/01-arvores-binarias/simulador/`, descricao: 'Executa o código Python da aula uma linha por vez.' },
      { titulo: 'Exercícios no Colab · Árvore binária de busca', tipo: 'exercicio', url: 'https://colab.research.google.com/github/abner-lucas/estrutura-de-dados/blob/main/aulas/01-arvores-binarias/simulador/materiais/exercicios-abb-aluno.ipynb' },
      { titulo: 'Cartões da árvore humana', tipo: 'apostila', url: `${ED}/aulas/01-arvores-binarias/simulador/materiais/cartoes-arvore-humana.pdf`, descricao: 'PDF para imprimir e montar a árvore em sala.' },
      { titulo: 'Colab · Praticando listas encadeadas', tipo: 'exercicio', url: 'https://colab.research.google.com/drive/1gam0BepX1Y_SDAF9RjcFqB5qK3qfywkA', descricao: 'Aula prática de 20 ago 2026.' },
      { titulo: 'Colab · Praticando hashing', tipo: 'exercicio', url: 'https://colab.research.google.com/drive/1gi2oXQX2JHpepk0cnlJdIETvv4-Od0U6', descricao: 'Aula prática de 10 set 2026.' },
      { titulo: 'Laboratório interativo', tipo: 'portal', url: `${ED}/#laboratorio`, descricao: 'Visualizador de pilha, fila e lista ligada, ordenação passo a passo e árvore binária de busca.' },
      { titulo: 'Código-fonte no GitHub', tipo: 'repositorio', url: 'https://github.com/abner-lucas/estrutura-de-dados' },
    ],
  },
  {
    id: 'redes-de-computadores',
    codigo: 'TIINF1647',
    nome: 'Redes de Computadores',
    curso: 'Técnico em Informática',
    cargaHoraria: 67,
    periodo: '2026.1',
    resumo: 'Do cabo ao aplicativo: como uma mensagem sai do celular, atravessa a rede e chega do outro lado — cabeamento, modelo OSI e arquitetura TCP/IP.',
    topicos: ['Tipos e modelos de redes', 'Dispositivos e topologias', 'Meios de transmissão', 'Cabo UTP (T568A/T568B)', 'Modelo OSI', 'Arquitetura TCP/IP'],
    icone: 'rede',
    tom: 'coral',
    planoDeAulas: [
      {
        etapa: 'Unidade 1',
        tema: 'Fundamentos',
        descricao: 'O que é uma rede e como ela se organiza: introdução, tipos de redes (PAN a WAN), Internet, intranet e extranet, e modelos de redes.',
      },
      {
        etapa: 'Unidade 2',
        tema: 'Infraestrutura e topologias',
        descricao: 'Dispositivos de interconexão, domínios de broadcast e colisão, topologias físicas e meios de transmissão guiados e não guiados.',
      },
      {
        etapa: 'Unidade 3',
        tema: 'Cabeamento e modelo OSI',
        descricao: 'Padrões T568A e T568B, montagem de cabo UTP em sala, a padronização da ISO e as sete camadas do modelo OSI.',
      },
      {
        etapa: 'Unidade 4',
        tema: 'Arquitetura TCP/IP',
        descricao: 'Pilha de protocolos e camadas do TCP/IP, elementos de interconexão e a Missão OSI como prática final.',
      },
    ],
    materiais: [
      { titulo: 'Portal da disciplina', tipo: 'portal', url: `${RC}/`, descricao: 'Aulas por unidade, avisos, laboratórios e trilha do semestre.' },
      { titulo: 'Aulas por unidade', tipo: 'portal', url: `${RC}/#aulas`, descricao: 'Tópicos e material de cada uma das 13 aulas.' },
      { titulo: 'Laboratório · Monte o cabo UTP', tipo: 'exercicio', url: `${RC}/#lab-cabo`, descricao: 'Monte a pinagem T568A ou T568B fio a fio e confira.' },
      { titulo: 'Laboratório · Em qual camada?', tipo: 'exercicio', url: `${RC}/#lab-camada`, descricao: 'Quiz: em qual camada do modelo OSI cada equipamento ou protocolo trabalha.' },
      { titulo: 'Simulador · Envie uma mensagem pela rede', tipo: 'exercicio', url: `${RC}/#lab-envio`, descricao: 'Cada camada do OSI acrescenta sua etiqueta; avance camada por camada.' },
      { titulo: 'Missão OSI · Investigadores da Rede', tipo: 'portal', url: 'https://osi.profabnerlucas.com/', descricao: 'Diagnóstico gamificado das 7 camadas + desafio integrador (~3 encontros).' },
      { titulo: 'Slides das aulas (Google Sala de Aula)', tipo: 'slides', url: 'https://classroom.google.com/', descricao: 'PDFs de todas as aulas na turma. Código da turma: g4nkpcli.' },
      { titulo: 'Código-fonte do portal', tipo: 'repositorio', url: 'https://github.com/abner-lucas/redes-computadores' },
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
    materiais: [
      { titulo: 'Portal da disciplina', tipo: 'portal', url: 'https://abner-lucas.github.io/eletronica-basica', descricao: 'Avisos, trilha, atividades e laboratório virtual da turma.' },
    ],
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
