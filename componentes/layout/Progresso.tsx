'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';
import { useSecaoAtiva } from '@/hooks/useSecaoAtiva';

/** Barra fina no topo que acompanha a leitura da página. */
export function BarraProgresso() {
  const { scrollYProgress } = useScroll();
  const escala = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: escala }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-marca via-lima to-coral"
    />
  );
}

/**
 * Trilho lateral com um ponto por seção (telas grandes). Mostra em que parte
 * da página o visitante está e permite saltar entre seções.
 */
export function IndicadorSecoes({ secoes }: { secoes: { id: string; rotulo: string }[] }) {
  const ativa = useSecaoAtiva(secoes.map((s) => s.id));
  const indice = secoes.findIndex((s) => s.id === ativa);

  return (
    <nav aria-label="Navegação por seções" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ol className="flex flex-col items-end gap-3">
        {secoes.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="group flex items-center gap-3" aria-current={i === indice ? 'true' : undefined}>
              <span
                className={cn(
                  'rounded-full bg-superficie/90 px-2.5 py-1 font-mono text-[11px] text-tinta shadow-cartao backdrop-blur transition-all duration-300',
                  'pointer-events-none translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
                )}
              >
                {String(i + 1).padStart(2, '0')} · {s.rotulo}
              </span>
              <span
                className={cn(
                  'block rounded-full transition-all duration-500',
                  i === indice ? 'h-6 w-1.5 bg-marca' : 'size-1.5 bg-tinta-suave/40 group-hover:bg-tinta-suave',
                )}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
