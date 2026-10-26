'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Check, Download, ExternalLink, Pin } from 'lucide-react';
import type { Aviso, Disciplina, EventoCalendario, LinkExterno, TipoEvento } from '@/lib/tipos';
import { diasAte, filtrarAvisos, formatarData, partesData, proximosEventos } from '@/lib/regras';
import { baixarIcs } from '@/lib/baixarIcs';
import { useHoje } from '@/hooks/useHoje';
import { acoesPreferencias, usePreferencias } from '@/estado/preferencias';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { Revelar } from '@/componentes/ui/Revelar';
import { Parafuso, TrilhaCanto } from '@/componentes/ui/Robotica';
import { cn } from '@/lib/utils';

interface MuralProps {
  avisos: Aviso[];
  disciplinas: Pick<Disciplina, 'id' | 'nome' | 'tom'>[];
  eventos: EventoCalendario[];
  calendarioOficial: boolean;
  linkCalendario: LinkExterno;
}

const TIPOS: Record<TipoEvento, { nome: string; classe: string }> = {
  feriado: { nome: 'Feriado', classe: 'tom-coral' },
  avaliacao: { nome: 'Avaliação', classe: 'tom-violeta' },
  evento: { nome: 'Evento', classe: 'tom-azul' },
  prazo: { nome: 'Prazo', classe: 'tom-ambar' },
  letivo: { nome: 'Letivo', classe: 'tom-verde' },
};

export function Mural({ avisos, disciplinas, eventos, calendarioOficial, linkCalendario, semCabecalho = false }: MuralProps & { semCabecalho?: boolean }) {
  const [filtro, setFiltro] = useState('todas');
  const acompanhadas = usePreferencias((p) => p.acompanhadas);
  const vistos = usePreferencias((p) => p.vistos);
  const hoje = useHoje();

  const lista = useMemo(() => filtrarAvisos(avisos, filtro), [avisos, filtro]);
  const proximos = hoje ? proximosEventos(eventos, hoje, 6) : [];
  const disciplina = (id: string) => disciplinas.find((d) => d.id === id);
  const comAvisos = disciplinas.filter((d) => avisos.some((a) => a.disciplina === d.id));

  return (
    <Secao id="mural" rotulo="Mural" divisor={!semCabecalho}>
      {!semCabecalho && <TituloSecao
        rotulo="Mural da turma"
        numero={8}
        titulo="Avisos e datas"
        destaque="do semestre."
        descricao="Filtre pela sua disciplina. Se você acompanha a turma, os avisos novos ganham um selo até serem lidos — tudo fica salvo só no seu navegador."
      />}

      <div className={cn(semCabecalho ? '' : 'mt-10', 'grid gap-8 lg:grid-cols-[1.5fr_1fr]')}>
        {/* Avisos (min-w-0 impede que a fileira de filtros alargue a grade no celular) */}
        <div className="min-w-0">
          <Revelar>
            <div role="group" aria-label="Filtrar avisos por disciplina" className="sem-barra -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {[{ id: 'todas', nome: 'Todas', tom: 'verde' as const }, ...comAvisos].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={filtro === d.id}
                  onClick={() => setFiltro(d.id)}
                  className={cn(
                    'min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition',
                    filtro === d.id ? 'border-tinta bg-tinta text-fundo' : 'border-borda bg-superficie hover:border-tinta/40',
                  )}
                >
                  {d.nome}
                </button>
              ))}
            </div>
          </Revelar>

          <ul className="mt-5 space-y-3" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              {lista.map((a) => {
                const d = disciplina(a.disciplina);
                const novo =
                  (a.disciplina === 'geral' || acompanhadas.includes(a.disciplina)) &&
                  acompanhadas.length > 0 &&
                  !vistos.includes(a.id);
                return (
                  <motion.li
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      'tom-' + (d?.tom ?? 'verde'),
                      'group relative overflow-hidden rounded-[1.15rem] border p-6 sm:p-7',
                      a.fixado
                        ? 'border-transparent bg-palco text-palco-tinta no-palco'
                        : 'border-borda bg-superficie transition-colors hover:border-tom/40',
                    )}
                  >
                    {/* Placa de circuito: parafusos nos cantos e trilhas saindo do canto inferior */}
                    <Parafuso className={cn('absolute left-2.5 top-2.5', a.fixado ? 'text-lima' : 'text-tinta-suave')} />
                    <Parafuso className={cn('absolute right-2.5 top-2.5', a.fixado ? 'text-lima' : 'text-tinta-suave')} />
                    <Parafuso className={cn('absolute bottom-2.5 left-2.5', a.fixado ? 'text-lima' : 'text-tinta-suave')} />
                    <TrilhaCanto className={cn('absolute bottom-0 right-0 h-16 w-[7.5rem] opacity-80', a.fixado ? 'text-lima' : 'text-tom')} />

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                      {a.fixado && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-lima px-2.5 py-1 font-bold text-[#0c1a15]">
                          <Pin className="size-3" /> Fixado
                        </span>
                      )}
                      <span className={cn('inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]', a.fixado ? 'text-lima' : 'text-tom')}>
                        {/* Barra de pinos (pin header) na cor da disciplina */}
                        <span aria-hidden className="grid grid-cols-3 gap-[2px]">
                          {Array.from({ length: 6 }, (_, i) => (
                            <span key={i} className="size-[4px] rounded-[1px] bg-current" />
                          ))}
                        </span>
                        {d?.nome ?? 'Todas as turmas'}
                      </span>
                      <span className={cn('font-mono', a.fixado ? 'text-palco-suave' : 'text-tinta-suave')}>{formatarData(a.data)}</span>
                      {novo && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-coral">
                          <span aria-hidden className="robo-led size-2 rounded-full bg-coral shadow-[0_0_10px_var(--coral)]" />
                          novo
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-xl font-bold leading-snug">{a.titulo}</h3>
                    <p className={cn('mt-2 leading-relaxed', a.fixado ? 'text-palco-suave' : 'text-tinta-suave')}>{a.texto}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      {a.link && (
                        <a
                          href={a.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn('inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold', a.fixado ? 'text-lima' : 'text-tom')}
                        >
                          {a.link.rotulo} <ExternalLink className="size-3.5" />
                          <span className="sr-only"> (abre em nova aba)</span>
                        </a>
                      )}
                      {novo && (
                        <button
                          type="button"
                          onClick={() => acoesPreferencias.marcarLidos([a.id])}
                          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold opacity-80 hover:opacity-100"
                        >
                          <Check className="size-4" /> Marcar como lido
                        </button>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>

        {/* Calendário */}
        <Revelar atraso={0.1}>
          <aside aria-labelledby="titulo-calendario" className="rounded-[1.75rem] border border-borda bg-superficie p-6 shadow-cartao lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-3">
              <h3 id="titulo-calendario" className="text-2xl font-bold">
                Próximas datas
              </h3>
              <button
                type="button"
                onClick={() => baixarIcs(proximosEventos(eventos, hoje ?? '0000-00-00'), 'calendario-prof-abner.ics')}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-superficie-2 px-3.5 text-xs font-semibold transition hover:bg-borda"
              >
                <Download className="size-4" /> Baixar .ics
              </button>
            </div>

            {!calendarioOficial && (
              <p className="mt-4 flex gap-2 rounded-2xl bg-[#fdefd2] p-3 text-xs leading-relaxed text-[#6b4500] dark:bg-[#2c2109] dark:text-[#f7c763]">
                <AlertTriangle className="size-4 shrink-0" />
                <span>
                  Feriados nacionais são oficiais; as demais datas são ilustrativas. Confira sempre o calendário do campus.
                </span>
              </p>
            )}

            <ol className="mt-5 space-y-2">
              {proximos.map((e) => {
                const { dia, mes } = partesData(e.data);
                const dias = hoje ? diasAte(hoje, e.data) : null;
                return (
                  <li key={e.id} className={cn(TIPOS[e.tipo].classe, 'flex items-center gap-4 rounded-2xl p-2 transition hover:bg-superficie-2')}>
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-tom-suave text-center text-tom">
                      <span className="font-display text-xl font-bold leading-none">
                        {dia}
                        <span className="block font-mono text-[10px] uppercase">{mes}</span>
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">{e.titulo}</span>
                      <span className="text-xs text-tinta-suave">
                        {TIPOS[e.tipo].nome}
                        {dias !== null && ` · ${dias === 0 ? 'hoje' : dias === 1 ? 'amanhã' : `em ${dias} dias`}`}
                      </span>
                    </span>
                  </li>
                );
              })}
              {hoje && proximos.length === 0 && <li className="text-sm text-tinta-suave">Nenhuma data futura cadastrada.</li>}
            </ol>

            <a
              href={linkCalendario.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-marca"
            >
              {linkCalendario.rotulo} <ExternalLink className="size-3.5" />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </aside>
        </Revelar>
      </div>
    </Secao>
  );
}
