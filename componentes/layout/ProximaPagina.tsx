'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { numeroDe, proximaDe } from '@/lib/paginas';
import { TrilhaCanto } from '@/componentes/ui/Robotica';

/**
 * "Próxima parada": no fim de cada página, um cartão grande leva à seguinte
 * do roteiro, para que o visitante percorra o site como uma sequência.
 */
export function ProximaPagina({ atual }: { atual: string }) {
  const proxima = proximaDe(atual);
  const numero = numeroDe(proxima.href);

  return (
    <nav aria-label="Próxima página" className="px-3 pb-8 pt-4 sm:px-5 sm:pb-10">
      <Link
        href={proxima.href}
        className="group relative mx-auto block max-w-7xl overflow-hidden rounded-[2rem] border border-borda bg-superficie px-6 py-8 transition-colors hover:border-marca sm:px-10 sm:py-10"
      >
        <TrilhaCanto className="absolute bottom-0 right-0 h-20 w-40 text-marca opacity-60" />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-tinta-suave">
          Próxima parada {numero > 0 && `· ${String(numero).padStart(2, '0')}`}
        </p>
        <div className="mt-3 flex items-center justify-between gap-6">
          <div>
            <p className="font-display text-3xl font-bold leading-none sm:text-5xl">
              <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                {proxima.rotulo}
              </span>
            </p>
            <p className="mt-3 text-tinta-suave">{proxima.chamada}</p>
          </div>
          <motion.span
            aria-hidden
            className="grid size-14 shrink-0 place-items-center rounded-full bg-marca text-sobre-marca transition-transform duration-500 group-hover:-rotate-45"
            whileHover={{ scale: 1.08 }}
          >
            <ArrowRight className="size-6" />
          </motion.span>
        </div>
      </Link>
    </nav>
  );
}
