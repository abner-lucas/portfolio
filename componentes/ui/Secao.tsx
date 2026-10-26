'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

interface SecaoProps {
  id: string;
  /** Nome lido pelo indicador lateral e por leitores de tela. */
  rotulo: string;
  /** `palco` desenha a seção como um painel escuro arredondado. */
  variante?: 'aberta' | 'palco';
  /** Trilha de circuito sutil no topo, separando da seção anterior. */
  divisor?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Bloco de seção com a transição de entrada usada em toda a página.
 *
 * Enquanto a seção sobe na tela, o painel "se abre": o recorte arredondado
 * cresce até ocupar a largura toda e o conteúdo desliza para o lugar. O
 * efeito acompanha a rolagem (não é disparado uma vez só), então rolar para
 * cima desfaz a transição naturalmente.
 */
export function Secao({ id, rotulo, variante = 'aberta', divisor = true, className, children }: SecaoProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.65'] });

  const recorte = useTransform(
    scrollYProgress,
    [0, 1],
    variante === 'palco'
      ? ['inset(4% 5% 0% 5% round 56px)', 'inset(0% 0% 0% 0% round 32px)']
      : ['inset(3% 2% 0% 2% round 40px)', 'inset(0% 0% 0% 0% round 0px)'],
  );
  const deslocamento = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const opacidade = useTransform(scrollYProgress, [0, 0.4], [0.7, 1]);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={rotulo}
      data-secao={rotulo}
      className={cn('relative px-3 sm:px-5', variante === 'palco' ? 'py-3' : 'py-14 sm:py-16 lg:py-20', className)}
    >
      {variante === 'aberta' && divisor && <Divisor />}
      <motion.div
        style={reduzir ? undefined : { clipPath: recorte, y: deslocamento, opacity: opacidade }}
        className={cn(
          variante === 'palco' &&
            'no-palco grao relative overflow-hidden rounded-[2rem] bg-palco text-palco-tinta py-14 sm:py-20',
        )}
      >
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">{children}</div>
      </motion.div>
    </section>
  );
}

/** Trilha de circuito impresso que liga uma seção à outra, com uma ilha de solda no centro. */
function Divisor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-7xl items-center gap-3 px-7 sm:px-13">
      <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,var(--borda))]" />
      <svg viewBox="0 0 40 12" className="h-3 w-10 text-tinta-suave/50">
        <path d="M0 6h12l3-4h10l3 4h12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="20" cy="2" r="1.8" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-[linear-gradient(270deg,transparent,var(--borda))]" />
    </div>
  );
}
