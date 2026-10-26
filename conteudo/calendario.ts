import type { EventoCalendario } from '@/lib/tipos';

/**
 * Calendário do semestre.
 *
 * Enquanto `calendarioOficial` for `false`, o site mostra um aviso pedindo
 * que os estudantes confiram o calendário oficial do campus. Depois de
 * cadastrar as datas oficiais, mude para `true`.
 *
 * Feriados nacionais abaixo são reais; os demais itens são ilustrativos.
 */
export const calendarioOficial = false;

export const linkCalendarioOficial = {
  rotulo: 'Secretaria Acadêmica · Campus Breves',
  url: 'https://breves.ifpa.edu.br/secretaria-academica',
};

export const eventos: EventoCalendario[] = [
  { id: 'finados-2026', titulo: 'Finados', data: '2026-11-02', tipo: 'feriado', descricao: 'Feriado nacional, sem aulas.' },
  { id: 'republica-2026', titulo: 'Proclamação da República', data: '2026-11-15', tipo: 'feriado' },
  { id: 'consciencia-negra-2026', titulo: 'Dia da Consciência Negra', data: '2026-11-20', tipo: 'feriado', descricao: 'Feriado nacional.' },
  { id: 'avaliacoes-2026-2', titulo: 'Semana de avaliações', data: '2026-11-30', tipo: 'avaliacao', descricao: 'Data ilustrativa: confirme com a coordenação.' },
  { id: 'mostra-2026', titulo: 'Mostra de projetos das turmas', data: '2026-12-09', tipo: 'evento', descricao: 'Data ilustrativa.' },
  { id: 'entrega-notas-2026-2', titulo: 'Prazo de lançamento de notas', data: '2026-12-16', tipo: 'prazo', descricao: 'Data ilustrativa.' },
  { id: 'fim-2026-2', titulo: 'Encerramento do semestre', data: '2026-12-18', tipo: 'letivo', descricao: 'Data ilustrativa.' },
  { id: 'natal-2026', titulo: 'Natal', data: '2026-12-25', tipo: 'feriado' },
];
