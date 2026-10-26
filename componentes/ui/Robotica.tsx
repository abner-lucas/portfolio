'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Elementos gráficos com linguagem de robótica e eletrônica, usados para dar
 * identidade às etiquetas, cartões e ilustrações do site.
 */

/** Cabeça de parafuso Phillips. Gira um quarto de volta quando o cartão-pai (`group`) recebe hover. */
export function Parafuso({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={cn('size-3 transition-transform duration-700 ease-out group-hover:rotate-90', className)}
    >
      <circle cx="6" cy="6" r="5.2" fill="currentColor" opacity="0.18" />
      <circle cx="6" cy="6" r="5.2" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
      <path d="M3.6 6h4.8M6 3.6v4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

const TRILHAS = [
  { d: 'M120 14H96L84 26H62', pad: [58, 26] },
  { d: 'M120 30H104L92 42H76', pad: [72, 42] },
  { d: 'M100 64V58L92 50H86', pad: [82, 50] },
] as const;

/**
 * Trilhas de circuito impresso que nascem no canto do cartão e terminam em
 * ilhas de solda. São "desenhadas" quando o cartão entra na tela.
 */
export function TrilhaCanto({ className }: { className?: string }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 120 64"
      fill="none"
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-40px' }}
      className={cn('pointer-events-none', className)}
    >
      {TRILHAS.map((t, i) => (
        <g key={t.d}>
          <motion.path
            d={t.d}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              oculto: { pathLength: 0, opacity: 0 },
              visivel: { pathLength: 1, opacity: 1, transition: { duration: 0.9, delay: 0.2 + i * 0.15, ease: 'easeInOut' } },
            }}
          />
          <motion.circle
            cx={t.pad[0]}
            cy={t.pad[1]}
            r="3.4"
            stroke="currentColor"
            strokeWidth="2"
            variants={{
              oculto: { scale: 0 },
              visivel: { scale: 1, transition: { delay: 1 + i * 0.15, type: 'spring', stiffness: 400, damping: 15 } },
            }}
          />
        </g>
      ))}
    </motion.svg>
  );
}

/**
 * Robozinho mascote em traço de caneta: a antena pisca como LED, os olhos
 * piscam e o braço acena. Herda a cor de `currentColor`.
 */
export function Robozinho({ className, corpo = 'var(--lima)' }: { className?: string; corpo?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 90 96" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M45 16V6" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="45" cy="6" r="4.5" fill="var(--coral)" stroke="currentColor" strokeWidth="2.5" className="robo-led" />
      <rect x="9" y="30" width="7" height="14" rx="3" fill={corpo} stroke="currentColor" strokeWidth="3" />
      <rect x="74" y="30" width="7" height="14" rx="3" fill={corpo} stroke="currentColor" strokeWidth="3" />
      <rect x="16" y="16" width="58" height="42" rx="12" fill={corpo} stroke="currentColor" strokeWidth="3.5" />
      <g className="robo-olhos">
        <circle cx="34" cy="35" r="5.5" fill="currentColor" />
        <circle cx="56" cy="35" r="5.5" fill="currentColor" />
      </g>
      <path d="M36 47q9 6 18 0" stroke="currentColor" strokeWidth="3" />
      <rect x="27" y="62" width="36" height="26" rx="7" fill={corpo} stroke="currentColor" strokeWidth="3.5" />
      <circle cx="45" cy="75" r="4" fill="currentColor" />
      <path d="M27 70 16 80" stroke="currentColor" strokeWidth="3.5" />
      <g className="robo-braco">
        <path d="M63 70 75 58" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="77" cy="55" r="4.5" fill={corpo} stroke="currentColor" strokeWidth="3" />
      </g>
    </svg>
  );
}
