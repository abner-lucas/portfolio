'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Code2, ExternalLink, Maximize2, Star } from 'lucide-react';
import type { Subapp } from '@/lib/tipos';
import { formatarData } from '@/lib/regras';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { Dialogo } from '@/componentes/ui/Dialogo';
import { BotaoLink } from '@/componentes/ui/Botao';
import { Revelar } from '@/componentes/ui/Revelar';
import { cn } from '@/lib/utils';

interface LaboratorioProps {
  subapps: (Subapp & { capaUrl: string | null })[];
  usuarioGithub: string;
}

/**
 * Subapps do GitHub em um carrossel arrastável. Os que permitem são abertos
 * dentro do próprio site, em um quadro; os demais levam ao repositório.
 */
export function Laboratorio({ subapps, usuarioGithub, numero = 1 }: LaboratorioProps & { numero?: number }) {
  const trilho = useRef<HTMLUListElement | null>(null);
  const arrasto = useRef<{ x: number; rolagem: number; moveu: boolean } | null>(null);
  const [aberto, setAberto] = useState<Subapp | null>(null);

  const rolar = (direcao: 1 | -1) => {
    const el = trilho.current;
    if (!el) return;
    const cartao = el.querySelector('li');
    el.scrollBy({ left: direcao * ((cartao?.clientWidth ?? 360) + 20), behavior: 'smooth' });
  };

  return (
    <Secao id="laboratorio" rotulo="Laboratório" variante="palco">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <TituloSecao
          noPalco
          rotulo="Laboratório aberto"
          numero={numero}
          titulo="Subapps que viram"
          destaque="sala de aula."
          descricao="Plataformas que desenvolvo para as disciplinas, a pesquisa e a extensão. Todas abertas no GitHub — abra aqui mesmo ou explore o código."
        />
        <Revelar className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => rolar(-1)}
            aria-label="Subapp anterior"
            className="grid size-12 place-items-center rounded-full border border-palco-borda transition hover:border-lima hover:text-lima"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => rolar(1)}
            aria-label="Próximo subapp"
            className="grid size-12 place-items-center rounded-full bg-lima text-[#0c1a15] transition hover:scale-105"
          >
            <ArrowRight className="size-5" />
          </button>
        </Revelar>
      </div>

      <Revelar className="relative mt-10" atraso={0.1}>
        <ul
          ref={trilho}
          tabIndex={0}
          aria-label="Subapps — use as setas do teclado para rolar"
          className="sem-barra -mx-4 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 active:cursor-grabbing sm:-mx-8 sm:px-8"
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') return;
            arrasto.current = { x: e.clientX, rolagem: e.currentTarget.scrollLeft, moveu: false };
          }}
          onPointerMove={(e) => {
            const a = arrasto.current;
            if (!a) return;
            const dx = e.clientX - a.x;
            if (Math.abs(dx) > 5) a.moveu = true;
            e.currentTarget.style.scrollSnapType = 'none';
            e.currentTarget.scrollLeft = a.rolagem - dx;
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.scrollSnapType = '';
            setTimeout(() => (arrasto.current = null), 0);
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.scrollSnapType = '';
            arrasto.current = null;
          }}
          onClickCapture={(e) => {
            // Um arrasto não deve disparar o clique do cartão.
            if (arrasto.current?.moveu) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {subapps.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                'tom-' + s.tom,
                'group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] sm:w-[22rem]',
                i % 2 ? 'bg-superficie text-tinta' : 'border border-palco-borda bg-[#10291f] text-palco-tinta',
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-tom-vivo">
                {s.capaUrl && (
                  <img
                    src={s.capaUrl}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="size-full object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
                <span className="absolute left-4 top-4 rounded-full bg-[#0c1a15]/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {s.categoria}
                </span>
                {typeof s.estrelas === 'number' && s.estrelas > 0 && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-[#0c1a15]">
                    <Star className="size-3.5 fill-ambar text-ambar" /> {s.estrelas}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold leading-snug">{s.nome}</h3>
                <p className={cn('mt-2 flex-1 text-sm leading-relaxed', i % 2 ? 'text-tinta-suave' : 'text-palco-suave')}>
                  {s.descricao}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tecnologias">
                  {s.tecnologias.map((t) => (
                    <li
                      key={t}
                      className={cn(
                        'rounded-full px-2.5 py-1 font-mono text-[11px]',
                        i % 2 ? 'bg-superficie-2 text-tinta-suave' : 'bg-palco text-palco-suave',
                      )}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                {s.atualizadoEm && (
                  <p className={cn('mt-4 font-mono text-[11px]', i % 2 ? 'text-tinta-suave' : 'text-palco-suave')}>
                    atualizado em {formatarData(s.atualizadoEm)}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.demo && s.incorporavel ? (
                    <button
                      type="button"
                      onClick={() => setAberto(s)}
                      aria-haspopup="dialog"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tom-vivo px-4 text-sm font-bold text-[#0c1a15] transition hover:brightness-105"
                    >
                      <Maximize2 className="size-4" /> Abrir aqui
                    </button>
                  ) : null}
                  {s.demo && (
                    <a
                      href={s.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition',
                        i % 2 ? 'border-borda hover:border-tinta/40' : 'border-palco-borda hover:border-lima hover:text-lima',
                      )}
                    >
                      <ExternalLink className="size-4" /> Site
                      <span className="sr-only"> de {s.nome} (abre em nova aba)</span>
                    </a>
                  )}
                  <a
                    href={`https://github.com/${usuarioGithub}/${s.repositorio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition',
                      i % 2 ? 'border-borda hover:border-tinta/40' : 'border-palco-borda hover:border-lima hover:text-lima',
                    )}
                  >
                    <Code2 className="size-4" /> Código
                    <span className="sr-only"> de {s.nome} no GitHub (abre em nova aba)</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Revelar>

      <Revelar className="mt-10 flex flex-wrap items-center gap-4">
        <BotaoLink href={`https://github.com/${usuarioGithub}`} variante="lima" seta>
          Todos os repositórios
        </BotaoLink>
        <p className="font-mao text-xl text-palco-suave">psiu: tudo é código aberto, pode estudar à vontade!</p>
      </Revelar>

      <Dialogo
        aberto={!!aberto}
        aoFechar={() => setAberto(null)}
        titulo={aberto ? `Subapp ${aberto.nome}` : 'Subapp'}
        className="w-[min(100%-1rem,80rem)]"
      >
        {aberto?.demo && (
          <div className="flex h-[88dvh] flex-col">
            <div className="flex flex-wrap items-center gap-3 border-b border-borda px-5 py-3 pr-20">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-3 rounded-full bg-coral" />
                <span className="size-3 rounded-full bg-ambar" />
                <span className="size-3 rounded-full bg-verde" />
              </span>
              <p className="min-w-0 flex-1 truncate rounded-full bg-superficie-2 px-4 py-1.5 font-mono text-xs text-tinta-suave">
                {aberto.demo}
              </p>
              <a
                href={aberto.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-marca px-4 text-xs font-semibold text-sobre-marca"
              >
                Nova aba <ExternalLink className="size-3.5" />
              </a>
            </div>
            <iframe
              src={aberto.demo}
              title={aberto.nome}
              loading="lazy"
              allow="fullscreen; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full flex-1 bg-white"
            />
          </div>
        )}
      </Dialogo>
    </Secao>
  );
}
