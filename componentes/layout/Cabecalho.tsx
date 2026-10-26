'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, X } from 'lucide-react';
import type { Aviso, Disciplina } from '@/lib/tipos';
import { PAGINAS, paginaDe } from '@/lib/paginas';
import { cn } from '@/lib/utils';
import { AlternarTema } from './AlternarTema';
import { SinoAvisos } from './SinoAvisos';
import { Marca } from './Marca';

interface CabecalhoProps {
  avisos: Aviso[];
  disciplinas: Pick<Disciplina, 'id' | 'nome'>[];
}

const LINKS = PAGINAS.slice(1);

export function Cabecalho({ avisos, disciplinas }: CabecalhoProps) {
  const [oculto, setOculto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const ativa = paginaDe(usePathname()).href;
  const { scrollY } = useScroll();

  // Some ao rolar para baixo e volta ao rolar para cima.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const anterior = scrollY.getPrevious() ?? 0;
    setOculto(y > anterior && y > 400 && !menuAberto);
    setRolou(y > 24);
  });

  useEffect(() => {
    document.documentElement.style.overflow = menuAberto ? 'hidden' : '';
    if (!menuAberto) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [menuAberto]);

  return (
    <>
      <motion.header
        animate={{ y: oculto ? '-130%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5"
      >
        <div
          className={cn(
            'mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-full border pl-5 pr-2 transition-all duration-500',
            rolou || menuAberto
              ? 'border-borda bg-superficie/85 shadow-cartao backdrop-blur-xl'
              : 'border-transparent bg-superficie/90 backdrop-blur-md',
          )}
        >
          <Marca />

          <nav aria-label="Páginas" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full bg-superficie-2/70 p-1">
              {LINKS.map((l) => (
                <li key={l.href} className="relative">
                  {ativa === l.href && (
                    <motion.span
                      layoutId="pilula-ativa"
                      className="absolute inset-0 rounded-full bg-superficie shadow-cartao"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Link
                    href={l.href}
                    aria-current={ativa === l.href ? 'page' : undefined}
                    className={cn(
                      'relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                      ativa === l.href ? 'text-tinta' : 'text-tinta-suave hover:text-tinta',
                    )}
                  >
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-0.5">
            <SinoAvisos avisos={avisos} disciplinas={disciplinas} />
            <AlternarTema />
            <Link
              href="/#contato"
              className="ml-1 hidden min-h-11 items-center rounded-full bg-marca px-5 text-sm font-semibold text-sobre-marca transition hover:bg-marca-forte sm:inline-flex"
            >
              Fale comigo
            </Link>
            <button
              type="button"
              onClick={() => setMenuAberto((m) => !m)}
              aria-expanded={menuAberto}
              aria-controls="menu-movel"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              className="grid size-11 place-items-center rounded-full text-tinta transition hover:bg-superficie-2 lg:hidden"
            >
              {menuAberto ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuAberto && (
          <motion.nav
            id="menu-movel"
            aria-label="Menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="no-palco fixed inset-0 z-40 flex flex-col justify-end bg-palco px-6 pb-10 pt-28 text-palco-tinta lg:hidden"
          >
            <ul className="space-y-1">
              {PAGINAS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuAberto(false)}
                    aria-current={ativa === l.href ? 'page' : undefined}
                    className={cn(
                      'flex items-baseline gap-4 py-1.5 font-display text-4xl font-bold sm:text-5xl',
                      ativa === l.href && 'text-lima',
                    )}
                  >
                    <span className="font-mono text-xs text-lima">{String(i).padStart(2, '0')}</span>
                    {l.rotulo}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
