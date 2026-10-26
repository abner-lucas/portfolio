'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, Cpu, FlaskConical, GraduationCap, Presentation, type LucideIcon } from 'lucide-react';
import type { Marco } from '@/lib/tipos';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const TIPOS: Record<Marco['tipo'], { icone: LucideIcon; nome: string; tom: string }> = {
  formacao: { icone: GraduationCap, nome: 'Formação', tom: 'tom-azul' },
  docencia: { icone: Presentation, nome: 'Docência', tom: 'tom-verde' },
  pesquisa: { icone: FlaskConical, nome: 'Pesquisa', tom: 'tom-violeta' },
  projeto: { icone: Cpu, nome: 'Agora', tom: 'tom-coral' },
};

/**
 * Linha do tempo guiada pela rolagem: a trilha se desenha conforme o
 * visitante desce, um cabeçote luminoso corre na ponta dela e cada marco
 * "acende" (ano preenchido, nó ligado, cartão entrando pela lateral) quando
 * a trilha o alcança.
 */
export function LinhaDoTempo({ marcos, numero }: { marcos: Marco[]; numero: number }) {
  const trilho = useRef<HTMLOListElement | null>(null);
  const reduzir = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trilho, offset: ['start 0.65', 'end 0.65'] });
  const progresso = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const topoCabecote = useTransform(progresso, (v) => `${v * 100}%`);

  return (
    <Secao id="trajetoria" rotulo="Trajetória">
      <TituloSecao
        rotulo="Linha do tempo"
        numero={numero}
        titulo="Uma trajetória"
        destaque={`em ${marcos.length} paradas.`}
        alinhamento="centro"
        descricao="Só o essencial. Role para percorrer."
      />

      <ol ref={trilho} className="relative mx-auto mt-14 max-w-5xl">
        {/* Trilha de fundo e trilha "acesa" */}
        <span aria-hidden className="absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 rounded-full bg-borda md:left-1/2" />
        <motion.span
          aria-hidden
          style={reduzir ? undefined : { scaleY: progresso }}
          className="absolute bottom-0 left-5 top-0 w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-marca via-lima to-coral md:left-1/2"
        />
        {!reduzir && (
          <motion.span
            aria-hidden
            style={{ top: topoCabecote }}
            className="absolute left-5 z-10 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lima shadow-[0_0_0_6px_rgba(200,240,90,0.25),0_0_24px_6px_rgba(200,240,90,0.55)] md:left-1/2"
          >
            <span className="size-2 rounded-full bg-[#0c1a15]" />
          </motion.span>
        )}

        {marcos.map((m, i) => (
          <MarcoItem key={m.ano + m.titulo} marco={m} direita={i % 2 === 1} />
        ))}
      </ol>
    </Secao>
  );
}

function MarcoItem({ marco: m, direita }: { marco: Marco; direita: boolean }) {
  const tipo = TIPOS[m.tipo];
  const Icone = tipo.icone;
  const deslocamento = direita ? 48 : -48;

  const Cartao = (
    <motion.div
      variants={{
        apagado: { opacity: 0, x: deslocamento, filter: 'blur(6px)' },
        aceso: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE, delay: 0.1 } },
      }}
      className={cn(
        'group relative rounded-[1.4rem] border border-borda bg-superficie p-5 shadow-cartao transition-colors hover:border-tom/50 sm:p-6',
        // Seta do cartão apontando para a trilha (desktop)
        "md:before:absolute md:before:top-7 md:before:size-3 md:before:rotate-45 md:before:border md:before:border-borda md:before:bg-superficie md:before:content-['']",
        direita ? 'md:before:-left-[7px] md:before:border-r-0 md:before:border-t-0' : 'md:before:-right-[7px] md:before:border-b-0 md:before:border-l-0',
      )}
    >
      <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-tom">
        <Icone className="size-4" /> {tipo.nome}
      </p>
      <h3 className="mt-2 font-display text-lg font-bold leading-snug sm:text-xl">{m.titulo}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{m.detalhe}</p>
      {m.url && (
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-tom"
        >
          Ver publicação <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      )}
    </motion.div>
  );

  // Ano grande: contorno que se preenche da esquerda para a direita quando o marco acende.
  const Ano = (
    <div className={cn('relative hidden font-display text-6xl font-extrabold leading-none tracking-tight md:block lg:text-7xl', direita ? 'text-right' : '')}>
      <span aria-hidden className="text-transparent [-webkit-text-stroke:1.5px_var(--borda)]">
        {m.ano}
      </span>
      <motion.span
        aria-hidden
        className={cn('absolute inset-0 text-tom', direita ? 'text-right' : '')}
        variants={{
          apagado: { clipPath: 'inset(0 100% 0 0)' },
          aceso: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.9, ease: EASE, delay: 0.15 } },
        }}
      >
        {m.ano}
      </motion.span>
    </div>
  );

  return (
    <motion.li
      initial="apagado"
      whileInView="aceso"
      viewport={{ once: true, margin: '0px 0px -35% 0px' }}
      className={cn(tipo.tom, 'relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-10 last:pb-0 md:grid-cols-[1fr_4rem_1fr] md:gap-x-0 md:pb-14')}
    >
      {/* Nó na trilha */}
      <div className="relative col-start-1 row-start-1 flex justify-center md:col-start-2">
        <motion.span
          variants={{
            apagado: { scale: 0.4, backgroundColor: 'var(--superficie-2)' },
            aceso: { scale: 1, backgroundColor: 'var(--superficie)', transition: { type: 'spring', stiffness: 420, damping: 18 } },
          }}
          className="relative z-[5] mt-5 grid size-10 place-items-center rounded-full border-[3px] border-tom text-tom"
        >
          <Icone className="size-4" />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-tom"
            variants={{
              apagado: { scale: 1, opacity: 0 },
              aceso: { scale: [1, 2.2], opacity: [0.7, 0], transition: { duration: 0.9, ease: 'easeOut' } },
            }}
          />
        </motion.span>
      </div>

      {/* Ano no celular (acima do cartão) */}
      <p className="col-start-2 row-start-1 mt-6 font-display text-2xl font-extrabold text-tom md:hidden">{m.ano}</p>

      {direita ? (
        <>
          <div className="col-start-2 md:col-start-1 md:row-start-1 md:pr-8 md:pt-2">{Ano}</div>
          <div className="col-start-2 md:col-start-3 md:row-start-1 md:pl-6">{Cartao}</div>
        </>
      ) : (
        <>
          <div className="col-start-2 md:col-start-1 md:row-start-1 md:pr-6">{Cartao}</div>
          <div className="hidden md:col-start-3 md:row-start-1 md:block md:pl-8 md:pt-2">{Ano}</div>
        </>
      )}
    </motion.li>
  );
}
