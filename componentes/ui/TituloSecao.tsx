'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface TituloSecaoProps {
  rotulo: string;
  /** Número da seção, exibido na porca sextavada da etiqueta. */
  numero: number;
  /** Primeira linha do título. */
  titulo: string;
  /** Segunda linha, destacada em cor. */
  destaque?: string;
  descricao?: React.ReactNode;
  alinhamento?: 'esquerda' | 'centro';
  /** Use dentro de seções `palco`. */
  noPalco?: boolean;
  className?: string;
  id?: string;
  /** Título principal da página (h1, maior). */
  principal?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Divide o texto em palavras que sobem uma a uma, como um letreiro. */
function Palavras({ texto, inicio = 0 }: { texto: string; inicio?: number }) {
  return (
    <>
      {texto.split(' ').map((palavra, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              oculto: { y: '110%' },
              visivel: { y: '0%', transition: { duration: 0.8, ease: EASE, delay: (inicio + i) * 0.05 } },
            }}
          >
            {palavra}
            {' '}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/**
 * Etiqueta da seção no estilo de uma placa eletrônica: uma porca sextavada
 * com o número da seção "aperta" girando, uma trilha de circuito se desenha
 * até a ilha de solda e o rótulo é digitado com cursor de terminal.
 */
function Etiqueta({ rotulo, numero, noPalco, centro }: { rotulo: string; numero: number; noPalco: boolean; centro: boolean }) {
  const cor = noPalco ? 'text-lima' : 'text-marca';
  return (
    <p className={cn('mb-5 flex items-center font-mono text-xs font-medium uppercase tracking-[0.2em]', cor, centro && 'justify-center')}>
      <span className="relative grid size-9 shrink-0 place-items-center">
        <motion.svg
          aria-hidden
          viewBox="0 0 36 36"
          className="absolute inset-0 size-full"
          variants={{
            oculto: { rotate: -150, scale: 0.4, opacity: 0 },
            visivel: { rotate: 0, scale: 1, opacity: 1, transition: { duration: 0.9, ease: EASE } },
          }}
        >
          <path
            d="M18 2.5 31.4 10.25V25.75L18 33.5 4.6 25.75V10.25Z"
            fill={noPalco ? 'var(--palco)' : 'var(--superficie)'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="18" r="10" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
        </motion.svg>
        <motion.span
          className="relative text-[11px] font-bold tracking-normal"
          variants={{ oculto: { opacity: 0 }, visivel: { opacity: 1, transition: { delay: 0.3 } } }}
        >
          {String(numero).padStart(2, '0')}
        </motion.span>
      </span>
      <svg aria-hidden viewBox="0 0 64 16" className="h-4 w-16 shrink-0" fill="none">
        <motion.path
          d="M0 8H16L22 2H40L46 8H56"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            oculto: { pathLength: 0 },
            visivel: { pathLength: 1, transition: { duration: 0.45, delay: 0.15, ease: 'easeInOut' } },
          }}
        />
        <motion.circle
          cx="59.5"
          cy="8"
          r="3.5"
          stroke="currentColor"
          strokeWidth="2"
          variants={{
            oculto: { scale: 0 },
            visivel: { scale: 1, transition: { delay: 0.55, type: 'spring', stiffness: 500, damping: 14 } },
          }}
        />
      </svg>
      <motion.span
        className="ml-2"
        variants={{
          oculto: { clipPath: 'inset(0 100% 0 0)' },
          visivel: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.5, delay: 0.5, ease: 'linear' } },
        }}
      >
        {rotulo}
      </motion.span>
      <span aria-hidden className="cursor-terminal ml-1 inline-block h-[1.15em] w-[0.6em] bg-current" />
    </p>
  );
}

export function TituloSecao({
  rotulo,
  numero,
  titulo,
  destaque,
  descricao,
  alinhamento = 'esquerda',
  noPalco = false,
  className,
  id,
  principal = false,
}: TituloSecaoProps) {
  const Titulo = principal ? 'h1' : 'h2';
  const centro = alinhamento === 'centro';
  return (
    <motion.header
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: '-40px' }}
      className={cn('max-w-3xl', centro && 'mx-auto text-center', className)}
    >
      <Etiqueta rotulo={rotulo} numero={numero} noPalco={noPalco} centro={centro} />
      <Titulo
        id={id}
        className={cn(
          'font-bold leading-[1.05]',
          principal ? 'text-[2.4rem] sm:text-5xl lg:text-[3.8rem]' : 'text-[2.1rem] sm:text-5xl lg:text-[3.6rem]',
        )}
      >
        <Palavras texto={titulo} />
        {destaque && (
          <>
            <br />
            <span className={noPalco ? 'text-lima' : 'text-marca'}>
              <Palavras texto={destaque} inicio={titulo.split(' ').length} />
            </span>
          </>
        )}
      </Titulo>
      {descricao && (
        <motion.div
          variants={{
            oculto: { opacity: 0, y: 14 },
            visivel: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.25, ease: EASE } },
          }}
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-lg',
            noPalco ? 'text-palco-suave' : 'text-tinta-suave',
            centro && 'mx-auto max-w-2xl',
          )}
        >
          {descricao}
        </motion.div>
      )}
    </motion.header>
  );
}
