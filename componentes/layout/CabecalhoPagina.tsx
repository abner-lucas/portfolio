'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { CampoNeural } from '@/componentes/interativos/CampoNeural';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { Contador } from '@/componentes/ui/Contador';

interface CabecalhoPaginaProps {
  rotulo: string;
  numero: number;
  titulo: string;
  destaque: string;
  descricao: string;
  /** Trilha de navegação além de "Início" (o último item é a página atual). */
  trilha: { rotulo: string; href?: string }[];
  /** Números de destaque exibidos à direita. */
  numeros?: { valor: number; rotulo: string }[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Abertura das páginas internas: um "palco" escuro mais baixo que o da home,
 * com a mesma rede neural ao fundo, para que todas as páginas pareçam cenas
 * do mesmo espetáculo.
 */
export function CabecalhoPagina({ rotulo, numero, titulo, destaque, descricao, trilha, numeros = [] }: CabecalhoPaginaProps) {
  return (
    <section aria-label={rotulo} className="px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="no-palco grao relative isolate overflow-hidden rounded-[2rem] bg-palco text-palco-tinta">
        <CampoNeural className="absolute inset-0 -z-10 size-full opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-40 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(200,240,90,0.16),transparent_65%)]"
        />

        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.nav
              aria-label="Você está em"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mb-6"
            >
              <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-palco-suave">
                {[{ rotulo: 'Início', href: '/' }, ...trilha].map((t, i, todos) => (
                  <li key={t.rotulo} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
                    {t.href && i < todos.length - 1 ? (
                      <Link href={t.href} className="rounded px-1 py-0.5 transition hover:text-lima">
                        {t.rotulo}
                      </Link>
                    ) : (
                      <span aria-current="page" className="px-1 text-palco-tinta">
                        {t.rotulo}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </motion.nav>
            <TituloSecao principal noPalco rotulo={rotulo} numero={numero} titulo={titulo} destaque={destaque} descricao={descricao} />
          </div>

          {numeros.length > 0 && (
            <motion.dl
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
              className="flex gap-8 border-t border-palco-borda pt-6 lg:flex-col lg:gap-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
            >
              {numeros.map((n) => (
                <div key={n.rotulo} className="flex flex-col-reverse">
                  <dt className="text-sm text-palco-suave">{n.rotulo}</dt>
                  <dd className="font-display text-4xl font-bold sm:text-5xl">
                    <Contador valor={n.valor} />
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>
      </div>
    </section>
  );
}
