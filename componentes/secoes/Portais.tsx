'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, FlaskConical } from 'lucide-react';
import type { Tom } from '@/lib/tipos';
import { PAGINAS } from '@/lib/paginas';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { Cascata, ItemCascata } from '@/componentes/ui/Revelar';
import { cn } from '@/lib/utils';

export interface ResumoPortais {
  disciplinas: { nome: string; tom: Tom }[];
  capas: string[];
  totalSubapps: number;
  pesquisaAtual: string;
  totalTrabalhos: number;
  retrato: string | null;
  sobre: string[];
  totalMarcos: number;
  ultimoAviso: { titulo: string; data: string } | null;
  totalAvisos: number;
}

/**
 * Mapa do site em forma de lista editorial. Ao passar o mouse (ou focar pelo
 * teclado), a linha se preenche e uma prévia real da página desliza para
 * dentro da própria linha — nada cobre o conteúdo vizinho.
 */
export function Portais({ resumo, numero }: { resumo: ResumoPortais; numero: number }) {
  const [ativo, setAtivo] = useState<string | null>(null);

  const contagem: Record<string, string> = {
    '/disciplinas': `${resumo.disciplinas.length} disciplinas`,
    '/laboratorio': `${resumo.totalSubapps} subapps · 4 experimentos`,
    '/pesquisa': `${resumo.totalTrabalhos} trabalhos`,
    '/sobre': `${resumo.totalMarcos} marcos`,
    '/mural': `${resumo.totalAvisos} avisos`,
  };

  return (
    <Secao id="explore" rotulo="Explore" variante="palco">
      <TituloSecao
        noPalco
        rotulo="Mapa do site"
        numero={numero}
        titulo="Escolha por onde"
        destaque="começar a explorar."
        descricao="Cada área tem sua própria página. Passe o mouse para espiar o que tem lá dentro."
      />

      <Cascata como="ol" className="mt-10 border-t border-palco-borda" intervalo={0.07}>
        {PAGINAS.slice(1).map((p, i) => {
          const aceso = ativo === p.href;
          return (
            <ItemCascata key={p.href} como="li" className="border-b border-palco-borda">
              <Link
                href={p.href}
                onPointerEnter={() => setAtivo(p.href)}
                onPointerLeave={() => setAtivo(null)}
                onFocus={() => setAtivo(p.href)}
                onBlur={() => setAtivo(null)}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl px-3 py-5 sm:gap-6 sm:px-5"
              >
                {/* Preenchimento que varre a linha da esquerda para a direita */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-0 origin-left bg-lima transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    aceso ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
                <span className={cn('relative w-6 font-mono text-sm transition-colors', aceso ? 'text-[#0c1a15]' : 'text-lima')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative min-w-0 flex-1">
                  <span
                    className={cn(
                      'block font-display text-2xl font-bold leading-tight transition-[color,transform] duration-500 sm:text-4xl',
                      aceso ? 'translate-x-1.5 text-[#0c1a15]' : 'text-palco-tinta',
                    )}
                  >
                    {p.rotulo}
                  </span>
                  <span className={cn('mt-1 block text-sm transition-colors', aceso ? 'text-[#0c1a15]/70' : 'text-palco-suave')}>
                    {p.chamada}
                  </span>
                </span>

                {/* Lado direito: contagem em repouso, prévia quando acesa (telas grandes) */}
                <span className="relative hidden h-12 w-[22rem] shrink-0 items-center justify-end lg:flex">
                  <span
                    className={cn(
                      'absolute right-0 font-mono text-xs uppercase tracking-[0.14em] text-palco-suave transition-all duration-300',
                      aceso ? 'translate-y-3 opacity-0' : 'opacity-100',
                    )}
                  >
                    {contagem[p.href]}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'absolute right-0 flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      aceso ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-8 opacity-0',
                    )}
                  >
                    <Previa href={p.href} resumo={resumo} />
                  </span>
                </span>

                <span
                  aria-hidden
                  className={cn(
                    'relative grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500',
                    aceso ? 'rotate-45 border-transparent bg-[#0c1a15] text-lima' : 'border-palco-borda text-palco-tinta',
                  )}
                >
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </ItemCascata>
          );
        })}
      </Cascata>
    </Secao>
  );
}

/** Prévia de uma linha só, com dados reais, sobre o fundo verde-limão. */
function Previa({ href, resumo }: { href: string; resumo: ResumoPortais }) {
  const texto = 'max-w-[18rem] truncate text-sm font-semibold text-[#0c1a15]';
  switch (href) {
    case '/disciplinas':
      return (
        <span className="flex gap-1.5">
          {resumo.disciplinas.slice(0, 3).map((d) => (
            <span key={d.nome} className="max-w-[7rem] truncate rounded-full bg-[#0c1a15] px-2.5 py-1 text-xs font-semibold text-lima">
              {d.nome}
            </span>
          ))}
        </span>
      );
    case '/laboratorio':
      return (
        <span className="flex -space-x-4">
          {resumo.capas.slice(0, 4).map((c, i) => (
            <img
              key={c}
              src={c}
              alt=""
              loading="lazy"
              className="h-11 w-16 rounded-lg border-2 border-[#0c1a15] object-cover"
              style={{ rotate: `${(i - 1.5) * 5}deg` }}
            />
          ))}
        </span>
      );
    case '/pesquisa':
      return (
        <span className="flex items-center gap-2">
          <FlaskConical className="size-4 shrink-0 text-[#0c1a15]" />
          <span className={texto}>{resumo.pesquisaAtual}</span>
        </span>
      );
    case '/sobre':
      return (
        <span className="flex items-center gap-3">
          {resumo.retrato && <img src={resumo.retrato} alt="" loading="lazy" className="size-10 rounded-full border-2 border-[#0c1a15] object-cover" />}
          <span className="text-sm leading-tight text-[#0c1a15]">
            {resumo.sobre.map((s) => (
              <span key={s} className="block font-semibold">
                {s}
              </span>
            ))}
          </span>
        </span>
      );
    case '/mural':
      return resumo.ultimoAviso ? (
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-[#0c1a15]" />
          <span className={texto}>{resumo.ultimoAviso.titulo}</span>
        </span>
      ) : null;
    default:
      return null;
  }
}
