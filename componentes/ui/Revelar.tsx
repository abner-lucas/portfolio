'use client';

import { motion, type Variants } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

const variantesItem: Variants = {
  oculto: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visivel: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};

interface RevelarProps {
  children: React.ReactNode;
  className?: string;
  atraso?: number;
  /** Elemento HTML renderizado. */
  como?: 'div' | 'li' | 'article' | 'header' | 'p';
}

/** Surge suavemente (subindo e saindo do desfoque) ao entrar na tela. */
export function Revelar({ children, className, atraso = 0, como = 'div' }: RevelarProps) {
  const Componente = motion[como];
  return (
    <Componente
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-60px' }}
      variants={variantesItem}
      transition={{ delay: atraso }}
    >
      {children}
    </Componente>
  );
}

interface CascataProps {
  children: React.ReactNode;
  className?: string;
  intervalo?: number;
  como?: 'div' | 'ul' | 'ol';
}

/** Contêiner que revela os filhos (`ItemCascata`) um após o outro. */
export function Cascata({ children, className, intervalo = 0.08, como = 'div' }: CascataProps) {
  const Componente = motion[como];
  return (
    <Componente
      className={className}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visivel: { transition: { staggerChildren: intervalo } } }}
    >
      {children}
    </Componente>
  );
}

export function ItemCascata({
  children,
  className,
  como = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  como?: 'div' | 'li' | 'article';
}) {
  const Componente = motion[como];
  return (
    <Componente className={className} variants={variantesItem}>
      {children}
    </Componente>
  );
}
