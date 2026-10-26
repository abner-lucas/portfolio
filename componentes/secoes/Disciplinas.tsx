'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, BellPlus, BellRing, Clock, ExternalLink } from 'lucide-react';
import type { Aviso, Disciplina } from '@/lib/tipos';
import { filtrarAvisos, formatarData } from '@/lib/regras';
import { acoesPreferencias, usePreferencias } from '@/estado/preferencias';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { Cascata, ItemCascata } from '@/componentes/ui/Revelar';
import Link from 'next/link';
import { SetaCirculo } from '@/componentes/ui/Botao';
import { iconesDisciplina, iconesMaterial, nomesMaterial } from '@/componentes/ui/Icones';
import { cn } from '@/lib/utils';

interface DisciplinasProps {
  disciplinas: Disciplina[];
  totalTurmas: number;
  /** Na página própria o título vem do cabeçalho da página. */
  semCabecalho?: boolean;
  /** Histórico público de turmas no SIGAA. */
  linkHistorico: string;
}

export function Disciplinas({ disciplinas, totalTurmas, linkHistorico, semCabecalho = false }: DisciplinasProps) {

  return (
    <Secao id="disciplinas" rotulo="Disciplinas" divisor={!semCabecalho}>
      {!semCabecalho && <TituloSecao
        alinhamento="centro"
        rotulo="Sala de aula"
        numero={3}
        titulo="Disciplinas que"
        destaque="estou ministrando."
        descricao="Escolha uma disciplina para ver o plano de aulas, os materiais e os avisos da turma."
      />}

      <Cascata className={cn(semCabecalho ? '' : 'mt-10', 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3')} intervalo={0.06} como="ul">
        {disciplinas.map((d) => {
          const Icone = iconesDisciplina[d.icone];
          return (
            <ItemCascata key={d.id} como="li" className={'tom-' + d.tom}>
              <Link
                href={`/disciplinas/${d.id}`}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-borda bg-superficie p-6 text-left shadow-cartao transition duration-500 hover:-translate-y-1.5 hover:border-tom/40"
              >
                <span
                  aria-hidden
                  className="absolute -right-10 -top-10 size-36 rounded-full bg-tom-suave transition-transform duration-700 group-hover:scale-[3.2]"
                />
                <span className="relative flex items-start justify-between gap-4">
                  <span className="grid size-14 place-items-center rounded-2xl bg-tom text-superficie shadow-lg transition-transform duration-500 group-hover:-rotate-6">
                    <Icone className="size-7" />
                  </span>
                  <span className="rounded-full bg-superficie/80 px-2.5 py-1 font-mono text-[11px] text-tinta-suave backdrop-blur">
                    {d.periodo}
                  </span>
                </span>
                <span className="relative mt-6 block font-mono text-[11px] uppercase tracking-[0.14em] text-tom">
                  {d.codigo} · {d.cargaHoraria}h
                </span>
                <span className="relative mt-1.5 block font-display text-xl font-bold leading-snug">{d.nome}</span>
                <span className="relative mt-2 block flex-1 text-sm leading-relaxed text-tinta-suave">{d.resumo}</span>
                <span className="relative mt-6 flex items-center justify-between text-sm font-semibold">
                  {d.planoDeAulas.length || d.materiais.length ? 'Plano & materiais' : 'Ver detalhes'}
                  <SetaCirculo className="size-10 text-tom" />
                </span>
              </Link>
            </ItemCascata>
          );
        })}
      </Cascata>

      <p className="mt-10 text-center text-sm text-tinta-suave">
        Desde 2015 foram <strong className="text-tinta">{totalTurmas} turmas</strong> registradas no SIGAA.{' '}
        <a href={linkHistorico} target="_blank" rel="noopener noreferrer" className="font-semibold text-marca underline underline-offset-4">
          Ver histórico completo<span className="sr-only"> (abre em nova aba)</span>
        </a>
      </p>
    </Secao>
  );
}

const ABAS = ['Visão geral', 'Plano de aulas', 'Materiais', 'Avisos'] as const;

/** Conteúdo completo de uma disciplina (página `/disciplinas/[id]`). */
export function DetalheDisciplina({ disciplina: d, avisos, linkSigaa }: { disciplina: Disciplina; avisos: Aviso[]; linkSigaa: string }) {
  const [aba, setAba] = useState<(typeof ABAS)[number]>('Visão geral');
  const acompanhada = usePreferencias((p) => p.acompanhadas.includes(d.id));
  const Icone = iconesDisciplina[d.icone];
  const avisosDaTurma = filtrarAvisos(avisos, d.id).filter((a) => a.disciplina === d.id);

  const contagem: Record<(typeof ABAS)[number], number | null> = {
    'Visão geral': null,
    'Plano de aulas': d.planoDeAulas.length,
    Materiais: d.materiais.length,
    Avisos: avisosDaTurma.length,
  };

  const moverAba = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    const proxima = ABAS[(i + delta + ABAS.length) % ABAS.length];
    setAba(proxima);
    document.getElementById(`aba-${d.id}-${proxima}`)?.focus();
  };

  return (
    <div className={'tom-' + d.tom}>
      <header className="relative overflow-hidden bg-tom-suave px-6 pb-6 pt-8 sm:px-10">
        <Icone aria-hidden className="absolute -right-6 -top-6 size-48 text-tom opacity-10" />
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-tom">
          {d.codigo} · {d.curso} · {d.periodo}
        </p>
        <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">{d.nome}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-tinta-suave">
            <Clock className="size-4" /> {d.cargaHoraria} horas
          </span>
          <button
            type="button"
            aria-pressed={acompanhada}
            onClick={() => acoesPreferencias.alternarTurma(d.id)}
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition',
              acompanhada ? 'bg-tom text-superficie' : 'bg-superficie text-tom hover:brightness-95',
            )}
          >
            {acompanhada ? <BellRing className="size-4" /> : <BellPlus className="size-4" />}
            {acompanhada ? 'Acompanhando' : 'Acompanhar turma'}
          </button>
        </div>

        <div role="tablist" aria-label="Seções da disciplina" className="sem-barra -mx-1 mt-6 flex gap-1 overflow-x-auto">
          {ABAS.map((nome, i) => (
            <button
              key={nome}
              id={`aba-${d.id}-${nome}`}
              role="tab"
              type="button"
              aria-selected={aba === nome}
              aria-controls={`painel-${d.id}`}
              tabIndex={aba === nome ? 0 : -1}
              onClick={() => setAba(nome)}
              onKeyDown={(e) => moverAba(e, i)}
              className="relative min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold"
            >
              {aba === nome && (
                <motion.span layoutId={`aba-ativa-${d.id}`} className="absolute inset-0 rounded-full bg-superficie shadow-cartao" />
              )}
              <span className={cn('relative', aba === nome ? 'text-tinta' : 'text-tinta-suave')}>
                {nome}
                {contagem[nome] ? <span className="ml-1.5 font-mono text-xs text-tom">{contagem[nome]}</span> : null}
              </span>
            </button>
          ))}
        </div>
      </header>

      <motion.div
        key={aba}
        id={`painel-${d.id}`}
        role="tabpanel"
        aria-labelledby={`aba-${d.id}-${aba}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-72 px-6 py-8 sm:px-10"
      >
        {aba === 'Visão geral' && (
          <div>
            <p className="text-lg leading-relaxed">{d.resumo}</p>
            <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-tinta-suave">Tópicos</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {d.topicos.map((t) => (
                <li key={t} className="rounded-full bg-tom-suave px-3.5 py-1.5 text-sm font-medium text-tom">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {aba === 'Plano de aulas' &&
          (d.planoDeAulas.length ? (
            <ol className="relative space-y-6 border-l-2 border-dashed border-tom/30 pl-7">
              {d.planoDeAulas.map((a) => (
                <li key={a.etapa} className="relative">
                  <span aria-hidden className="absolute -left-[2.15rem] top-1 size-4 rounded-full border-4 border-superficie bg-tom" />
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-tom">{a.etapa}</p>
                  <h3 className="mt-1 text-lg font-bold">{a.tema}</h3>
                  <p className="mt-1 text-tinta-suave">{a.descricao}</p>
                </li>
              ))}
            </ol>
          ) : (
            <Vazio linkSigaa={linkSigaa} texto="O plano de aulas desta disciplina está disponível na turma virtual do SIGAA." />
          ))}

        {aba === 'Materiais' &&
          (d.materiais.length ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {d.materiais.map((m) => {
                const IconeMaterial = iconesMaterial[m.tipo];
                return (
                  <li key={m.url}>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-start gap-4 rounded-2xl border border-borda p-4 transition hover:border-tom/50 hover:bg-tom-suave"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-tom-suave text-tom">
                        <IconeMaterial className="size-5" />
                      </span>
                      <span className="flex-1">
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-tinta-suave">{nomesMaterial[m.tipo]}</span>
                        <span className="block font-semibold leading-snug">{m.titulo}</span>
                        {m.descricao && <span className="mt-1 block text-sm text-tinta-suave">{m.descricao}</span>}
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-tinta-suave transition group-hover:rotate-45 group-hover:text-tom" />
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Vazio linkSigaa={linkSigaa} texto="Os materiais desta disciplina são publicados na turma virtual do SIGAA." />
          ))}

        {aba === 'Avisos' &&
          (avisosDaTurma.length ? (
            <ul className="space-y-3">
              {avisosDaTurma.map((a) => (
                <li key={a.id} className="rounded-2xl border border-borda p-5">
                  <p className="font-mono text-xs text-tinta-suave">{formatarData(a.data)}</p>
                  <h3 className="mt-1 font-bold">{a.titulo}</h3>
                  <p className="mt-1 text-sm text-tinta-suave">{a.texto}</p>
                  {a.link && (
                    <a href={a.link.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-tom">
                      {a.link.rotulo} <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-tinta-suave">Nenhum aviso para esta turma no momento.</p>
          ))}
      </motion.div>
    </div>
  );
}

function Vazio({ texto, linkSigaa }: { texto: string; linkSigaa: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-borda p-8 text-center">
      <p className="text-tinta-suave">{texto}</p>
      <a
        href={linkSigaa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-tom px-5 text-sm font-semibold text-superficie"
      >
        Abrir o SIGAA <ArrowUpRight className="size-4" />
      </a>
    </div>
  );
}
