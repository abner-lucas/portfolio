'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { CategoriaTrabalho, Trabalho } from '@/lib/tipos';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { BotaoLink, SetaCirculo } from '@/componentes/ui/Botao';
import { Revelar } from '@/componentes/ui/Revelar';
import { cn } from '@/lib/utils';

interface PesquisaProps {
  trabalhos: Trabalho[];
  areas: string[];
  lattes: string;
  orcid: string;
}

const CATEGORIAS: ('Tudo' | CategoriaTrabalho)[] = [
  'Tudo',
  'Projeto de pesquisa',
  'Capítulo de livro',
  'Pesquisa aberta',
  'Orientação de TCC',
  'Extensão',
];

/** Produção acadêmica em formato de tabela, filtrável por categoria. */
export function Pesquisa({ trabalhos, areas, lattes, orcid, semCabecalho = false }: PesquisaProps & { semCabecalho?: boolean }) {
  const [filtro, setFiltro] = useState<(typeof CATEGORIAS)[number]>('Tudo');
  const lista = useMemo(
    () =>
      trabalhos
        .filter((t) => filtro === 'Tudo' || t.categoria === filtro)
        .sort((a, b) => Number(!!b.emAndamento) - Number(!!a.emAndamento) || b.ano - a.ano),
    [trabalhos, filtro],
  );

  return (
    <Secao id="pesquisa" rotulo="Pesquisa" divisor={!semCabecalho}>
      {!semCabecalho && (
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <TituloSecao
          rotulo="Pesquisa & produção"
          numero={6}
          titulo="Ciência feita"
          destaque="no Marajó."
        />
        <Revelar className="space-y-5">
          <p className="text-lg leading-relaxed text-tinta-suave">
            Inteligência computacional aplicada a problemas reais: robôs que sentem, pensam e agem, sinais cerebrais,
            visão computacional na cadeia do açaí, chatbots para a comunidade e sensores no campo.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Linhas de pesquisa">
            {areas.map((a) => (
              <li key={a} className="rounded-full border border-borda px-3 py-1 text-sm">
                {a}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <BotaoLink href={lattes} seta>
              Currículo Lattes
            </BotaoLink>
            <BotaoLink href={orcid} variante="contorno">
              ORCID
            </BotaoLink>
          </div>
        </Revelar>
      </div>
      )}

      <Revelar className={semCabecalho ? '' : 'mt-10'}>
        <div role="group" aria-label="Filtrar por categoria" className="sem-barra -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filtro === c}
              onClick={() => setFiltro(c)}
              className={cn(
                'min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition',
                filtro === c ? 'border-tinta bg-tinta text-fundo' : 'border-borda bg-superficie hover:border-tinta/40',
              )}
            >
              {c}
              <span className="ml-1.5 font-mono text-xs opacity-60">
                {c === 'Tudo' ? trabalhos.length : trabalhos.filter((t) => t.categoria === c).length}
              </span>
            </button>
          ))}
        </div>
      </Revelar>

      <Revelar className="mt-6">
        <div className="hidden grid-cols-[1fr_12rem_5rem_3rem] gap-6 border-b border-borda px-4 pb-3 font-mono text-xs uppercase tracking-[0.14em] text-tinta-suave md:grid">
          <span>Título</span>
          <span>Categoria</span>
          <span>Ano</span>
          <span className="sr-only">Link</span>
        </div>
        <ul aria-live="polite">
          <AnimatePresence initial={false} mode="popLayout">
            {lista.map((t) => {
              const Conteudo = (
                <>
                  <span className="min-w-0">
                    <span className="flex items-start gap-2">
                      {t.emAndamento && (
                        <span className="relative mt-2 flex size-2.5 shrink-0">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-marca opacity-60" />
                          <span className="relative inline-flex size-2.5 rounded-full bg-marca" />
                          <span className="sr-only">Em andamento: </span>
                        </span>
                      )}
                      <span className="font-display text-lg font-semibold leading-snug sm:text-xl">{t.titulo}</span>
                    </span>
                    <span className="mt-1 block text-sm text-tinta-suave">{t.detalhe}</span>
                  </span>
                  <span>
                    <span className="inline-flex rounded-full border border-borda px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-tinta-suave">
                      {t.categoria}
                    </span>
                  </span>
                  <span className="font-display text-xl font-semibold tabular-nums">{t.ano}</span>
                  {t.url ? <SetaCirculo /> : <span />}
                </>
              );
              const classe =
                'grid gap-3 rounded-2xl px-4 py-6 md:grid-cols-[1fr_12rem_5rem_3rem] md:items-center md:gap-6';
              return (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-borda"
                >
                  {t.url ? (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(classe, 'group transition-colors hover:bg-superficie')}
                    >
                      {Conteudo}
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  ) : (
                    <div className={classe}>{Conteudo}</div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </Revelar>
    </Secao>
  );
}
