'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { paginaDe } from '@/lib/paginas';

const EASE = [0.16, 1, 0.3, 1] as const;

declare global {
  interface Window {
    __navegou?: boolean;
  }
}

/**
 * Transição entre páginas. O `template` é remontado a cada navegação: uma
 * cortina escura com o nome da página de destino cobre a tela e se recolhe
 * para cima, enquanto o conteúdo novo sobe para o lugar.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pagina = paginaDe(usePathname());
  const reduzir = useReducedMotion();
  // A primeira página da visita já tem a cortina de carregamento; as próximas usam esta.
  const [navegou] = useState(() => typeof window !== 'undefined' && !!window.__navegou);
  useEffect(() => {
    window.__navegou = true;
  }, []);
  const comCortina = navegou && !reduzir;

  return (
    <>
      {comCortina && (
        <motion.div
          aria-hidden
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          animate={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          className="no-palco grao pointer-events-none fixed inset-0 z-[80] flex flex-col items-center justify-center gap-3 bg-palco text-palco-tinta"
        >
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl"
          >
            {pagina.rotulo}
            <span className="text-lima">.</span>
          </motion.p>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-palco-suave">{pagina.chamada}</p>
        </motion.div>
      )}
      <motion.div
        initial={comCortina ? { opacity: 0, y: 40 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
      >
        {children}
      </motion.div>
    </>
  );
}
