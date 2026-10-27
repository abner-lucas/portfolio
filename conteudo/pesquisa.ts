import type { Trabalho } from '@/lib/tipos';

/**
 * Pesquisa, produção e orientações.
 * Fontes: SIGAA (pesquisa, extensão e produção intelectual), ORCID e GitHub.
 * Novos itens aparecem automaticamente, ordenados do mais recente ao mais antigo.
 */
export const trabalhos: Trabalho[] = [
  {
    id: 'acai-morfometria',
    titulo: 'Morfometria Computacional e IA: otimização de peneiras no despolpamento do açaí em Breves-PA',
    categoria: 'Projeto de pesquisa',
    ano: 2026,
    detalhe: 'SIGAA · PVA3919-2026 · Metodologia e Técnicas da Computação',
    emAndamento: true,
  },
  {
    id: 'monitor-acai',
    titulo: 'MonitorAçaí: rodízio de sensores de umidade do solo no SAF de açaí do Campus Breves',
    categoria: 'Pesquisa aberta',
    ano: 2026,
    detalhe: 'IoT · Next.js',
    url: 'https://github.com/abner-lucas/monitor-acai',
    emAndamento: true,
  },
  {
    id: 'erp-deep-learning',
    titulo: 'Deep Learning Applied to ERP in the Search for Spatial Intelligence Signatures',
    categoria: 'Capítulo de livro',
    ano: 2023,
    detalhe: 'Springer · DOI 10.1007/978-3-031-27524-1_77',
    url: 'https://doi.org/10.1007/978-3-031-27524-1_77',
  },
  {
    id: 'consulta-inteligente',
    titulo: 'Consulta Inteligente: chatbot com IA para atendimento à comunidade do IFPA Campus Breves',
    categoria: 'Projeto de pesquisa',
    ano: 2023,
    detalhe: 'SIGAA · PVA1035-2023 · Sistemas de Computação',
  },
  {
    id: 'eeg-features',
    titulo: 'Extração de características de EEG com DWT e classificação de grupos controle e superdotados',
    categoria: 'Pesquisa aberta',
    ano: 2024,
    detalhe: 'Python · ERP visual · Wavelets',
    url: 'https://github.com/abner-lucas/EEG-Feature-Extraction-Classification',
  },
  {
    id: 'eeg-series',
    titulo: 'Predição de séries temporais de EEG com redes MLP',
    categoria: 'Pesquisa aberta',
    ano: 2024,
    detalhe: 'Python · Redes neurais',
    url: 'https://github.com/abner-lucas/EEG-Time-Series-Prediction',
  },
  {
    id: 'eeg-mne',
    titulo: 'Pré-processamento de EEG (BrainVision) com MNE-Python',
    categoria: 'Pesquisa aberta',
    ano: 2024,
    detalhe: 'Python · MNE · Filtragem',
    url: 'https://github.com/abner-lucas/EEG-Preprocessing-MNE',
  },
  {
    id: 'pso-hiperparametros',
    titulo: 'Otimização de hiperparâmetros de redes neurais com PSO',
    categoria: 'Pesquisa aberta',
    ano: 2024,
    detalhe: 'Python · Enxame de partículas',
    url: 'https://github.com/abner-lucas/PSO-Hyperparameter-Optimization-Classification',
  },
  {
    id: 'tcc-proinfo',
    titulo: 'A Informática Educativa na Escola Prof.ª Maria de Lourdes Campos Sales: um estudo de caso do ProInfo em Breves-PA',
    categoria: 'Orientação de TCC',
    ano: 2024,
    detalhe: 'Roosevelt Pantoja Cunha',
  },
  {
    id: 'tcc-gamificacao',
    titulo: 'Impacto da gamificação e TDICs na alfabetização e letramento em anos iniciais: uma revisão integrativa',
    categoria: 'Orientação de TCC',
    ano: 2024,
    detalhe: 'Fátima de Souza Brabo e Marcelo Lobato Farias',
  },
  {
    id: 'tcc-literacia',
    titulo: 'Literacia digital docente: percepções das competências digitais dos professores do IFPA/Breves',
    categoria: 'Orientação de TCC',
    ano: 2022,
    detalhe: 'Elane da Silva e Silva Pereira',
  },
  {
    id: 'tcc-estagio',
    titulo: 'O impacto da pandemia de COVID-19 no estágio curricular no ensino médio do curso de Licenciatura em História da UNOPAR',
    categoria: 'Orientação de TCC',
    ano: 2022,
    detalhe: 'Mirian Carolina Gomes Lima',
  },
  {
    id: 'ext-dialogos',
    titulo: 'Diálogos Amazônicos: debates, reflexão e promoção de igualdades raciais na Amazônia Legal',
    categoria: 'Extensão',
    ano: 2020,
    detalhe: 'Participação · PJ003-2020',
  },
  {
    id: 'ext-experimentos',
    titulo: 'Experimentos na Escola',
    categoria: 'Extensão',
    ano: 2019,
    detalhe: 'Participação',
  },
  {
    id: 'ext-ferias',
    titulo: 'III Escola de Férias do IFPA Campus Breves',
    categoria: 'Extensão',
    ano: 2019,
    detalhe: 'Participação · EV002-2019',
  },
];
