'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BellRing, CalendarDays, Check, Download, Pin } from 'lucide-react';
import type { Aviso, Destaque, Disciplina, EventoCalendario, LinkExterno } from '@/lib/tipos';
import { diasAte, ordenarAvisos, partesData, proximosEventos } from '@/lib/regras';
import { baixarIcs } from '@/lib/baixarIcs';
import { useHoje } from '@/hooks/useHoje';
import { acoesPreferencias, usePreferencias } from '@/estado/preferencias';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { Cascata, ItemCascata } from '@/componentes/ui/Revelar';
import { SetaCirculo } from '@/componentes/ui/Botao';
import { cn } from '@/lib/utils';

interface DestaquesProps {
  destaques: Destaque[];
  capaPrincipal: string | null;
  avisos: Aviso[];
  eventos: EventoCalendario[];
  disciplinas: Pick<Disciplina, 'id' | 'nome' | 'tom'>[];
  atalhos: LinkExterno[];
}

export function Destaques({ destaques, capaPrincipal, avisos, eventos, disciplinas, atalhos, numero = 3 }: DestaquesProps & { numero?: number }) {
  const [principal, ...outros] = destaques;
  const fixado = useMemo(() => ordenarAvisos(avisos).find((a) => a.fixado && a.disciplina !== 'geral') ?? ordenarAvisos(avisos)[0], [avisos]);
  const hoje = useHoje();
  const proximo = hoje ? proximosEventos(eventos, hoje, 1)[0] : undefined;
  const acompanhadas = usePreferencias((p) => p.acompanhadas);
  const nome = (id: string) => disciplinas.find((d) => d.id === id)?.nome ?? 'Todas as turmas';

  return (
    <Secao id="destaques" rotulo="Em destaque">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <TituloSecao
          rotulo="Em destaque"
          numero={numero}
          titulo="O que está"
          destaque="acontecendo agora."
          descricao="Novidades das turmas, laboratórios recém-publicados e as próximas datas do semestre, num só lugar."
        />
      </div>

      <Cascata className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
        {/* Destaque principal */}
        <ItemCascata className={cn('tom-' + principal.tom, 'md:col-span-2 lg:row-span-2')}>
          <Link
            href={principal.link.url}
            {...(principal.link.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-palco p-7 text-palco-tinta"
          >
            {capaPrincipal && (
              <img
                src={capaPrincipal}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
              />
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-palco via-palco/70 to-transparent" />
            <div className="relative">
              <span className="inline-flex rounded-full bg-tom-vivo px-3 py-1 text-xs font-bold text-[#0c1a15]">
                {principal.rotulo}
              </span>
              <h3 className="mt-4 max-w-md text-3xl font-bold leading-tight sm:text-4xl">{principal.titulo}</h3>
              <p className="mt-3 max-w-md text-palco-suave">{principal.texto}</p>
              <span className="mt-6 inline-flex items-center gap-3 font-semibold">
                {principal.link.rotulo}
                <SetaCirculo className="border-palco-borda group-hover:bg-lima group-hover:text-[#0c1a15]" />
              </span>
            </div>
          </Link>
        </ItemCascata>

        {/* Aviso fixado */}
        {fixado && (
          <ItemCascata className="lg:col-span-2">
            <Link
              href="/mural"
              className="group flex h-full flex-col justify-between gap-6 rounded-[1.75rem] border border-borda bg-superficie p-6 shadow-cartao transition hover:-translate-y-1"
            >
              <div>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-coral">
                  <Pin className="size-3.5" /> Aviso fixado · {nome(fixado.disciplina)}
                </p>
                <h3 className="mt-3 text-2xl font-bold leading-snug">{fixado.titulo}</h3>
                <p className="mt-2 line-clamp-2 text-tinta-suave">{fixado.texto}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-marca">
                Ver mural de avisos <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
              </span>
            </Link>
          </ItemCascata>
        )}

        {/* Próximo evento */}
        <ItemCascata>
          <div className="flex h-full flex-col justify-between gap-5 rounded-[1.75rem] bg-lima p-6 text-[#0c1a15]">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              <CalendarDays className="size-3.5" /> Próxima data
            </p>
            {proximo && hoje ? (
              <>
                <div>
                  <p className="font-display text-6xl font-extrabold leading-none">
                    {partesData(proximo.data).dia}
                    <span className="ml-2 text-2xl font-bold">{partesData(proximo.data).mes}</span>
                  </p>
                  <p className="mt-2 text-lg font-bold leading-snug">{proximo.titulo}</p>
                  <p className="text-sm">
                    {diasAte(hoje, proximo.data) === 0 ? 'é hoje!' : `em ${diasAte(hoje, proximo.data)} dias`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => baixarIcs([proximo], `${proximo.id}.ics`)}
                  className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full bg-[#0c1a15] px-4 text-sm font-semibold text-lima transition hover:bg-[#0c1a15]/85"
                >
                  <Download className="size-4" /> Pôr na agenda
                </button>
              </>
            ) : (
              <p className="text-lg font-bold">{hoje ? 'Nenhuma data cadastrada.' : 'Carregando…'}</p>
            )}
          </div>
        </ItemCascata>

        {/* Acompanhar turmas */}
        <ItemCascata>
          <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-borda bg-superficie p-6 shadow-cartao">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-marca">
              <BellRing className="size-3.5" /> Acompanhar turmas
            </p>
            <p className="text-sm text-tinta-suave">Marque suas disciplinas e receba os avisos novos no sino do topo.</p>
            <ul className="flex flex-wrap gap-1.5">
              {disciplinas.slice(0, 6).map((d) => {
                const ativa = acompanhadas.includes(d.id);
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      aria-pressed={ativa}
                      onClick={() => acoesPreferencias.alternarTurma(d.id)}
                      className={cn(
                        'tom-' + d.tom,
                        'inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold transition',
                        ativa ? 'bg-tom text-superficie' : 'bg-tom-suave text-tom hover:brightness-95',
                      )}
                    >
                      {ativa && <Check className="size-3.5" />}
                      {d.nome}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </ItemCascata>

        {/* Destaques secundários */}
        {outros.map((d) => (
          <ItemCascata key={d.titulo} className={cn('tom-' + d.tom, 'lg:col-span-2')}>
            <Link
              href={d.link.url}
              {...(d.link.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex h-full items-center gap-5 rounded-[1.75rem] bg-tom-suave p-6 transition hover:-translate-y-1"
            >
              <div className="flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-tom">{d.rotulo}</p>
                <h3 className="mt-2 text-xl font-bold leading-snug">{d.titulo}</h3>
                <p className="mt-1 text-sm text-tinta-suave">{d.texto}</p>
              </div>
              <SetaCirculo className="text-tom" />
            </Link>
          </ItemCascata>
        ))}
      </Cascata>

      {/* Acesso rápido */}
      <nav aria-label="Acesso rápido" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {atalhos.map((a) => (
            <li key={a.url}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-borda bg-superficie px-4 text-sm font-semibold transition hover:border-marca hover:text-marca"
              >
                {a.rotulo} <ArrowUpRight className="size-4" />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Secao>
  );
}
