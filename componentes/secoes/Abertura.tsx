'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Bot, BrainCircuit, MapPin, MousePointer2 } from 'lucide-react';
import { CampoNeural } from '@/componentes/interativos/CampoNeural';
import { BotaoLink } from '@/componentes/ui/Botao';
import { Contador } from '@/componentes/ui/Contador';

interface AberturaProps {
  chamada: string;
  nome: string;
  campus: string;
  retrato: string | null;
  video: string | null;
  numeros: { valor: number; sufixo?: string; rotulo: string }[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Na primeira visita a abertura espera a cortina de carregamento subir;
 * nas seguintes (cortina oculta) começa logo.
 */
function atrasoBase() {
  if (typeof document === 'undefined') return 1.7;
  return document.documentElement.hasAttribute('data-visitado') ? 0.1 : 1.7;
}

const entrada = (atraso: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay: atrasoBase() + atraso },
});

export function Abertura({ chamada, nome, campus, retrato, video, numeros }: AberturaProps) {
  const reduzir = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const fotoX = useTransform(sx, (v) => v * 14);
  const fotoY = useTransform(sy, (v) => v * 14);
  const chipX = useTransform(sx, (v) => v * -26);
  const chipY = useTransform(sy, (v) => v * -26);

  return (
    <section id="inicio" aria-label="Início" data-secao="Início" className="px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        onPointerMove={(e) => {
          if (reduzir || e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        className="no-palco grao relative isolate flex min-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[2rem] bg-palco text-palco-tinta"
      >
        {video ? (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            className="absolute inset-0 -z-10 size-full object-cover opacity-40"
          />
        ) : (
          <CampoNeural className="absolute inset-0 -z-10 size-full" />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[42rem] rounded-full bg-[radial-gradient(circle,rgba(200,240,90,0.18),transparent_65%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-60 -left-40 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgba(34,176,125,0.22),transparent_65%)]"
        />

        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:pt-32">
          <div>
            <motion.p {...entrada(0)} className="flex items-center gap-3 font-mao text-2xl text-lima sm:text-3xl">
              Olá, eu sou o {nome.split(' ')[0]}!
              <svg aria-hidden viewBox="0 0 60 30" className="h-7 w-14 text-lima">
                <path d="M2 6c14 2 30 6 40 18m0 0-9-1m9 1 1-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.p>

            <motion.p
              {...entrada(0.08)}
              className="mt-5 font-mono text-[11px] uppercase tracking-[0.3em] text-palco-suave sm:text-xs"
            >
              Sentir <span className="text-lima">→</span> Pensar <span className="text-lima">→</span> Agir
            </motion.p>

            <h1 className="mt-4 text-[3.1rem] font-extrabold leading-[0.95] sm:text-7xl lg:text-[5.6rem]">
              <span className="sr-only">Prof. Me. {nome}: </span>
              {['Tecnologia que', 'se aprende'].map((linha, i) => (
                <span key={linha} className="block overflow-hidden pb-1">
                  <motion.span
                    className="block"
                    initial={{ y: '105%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, ease: EASE, delay: atrasoBase() + 0.05 + i * 0.1 }}
                  >
                    {linha}
                  </motion.span>
                </span>
              ))}
              <span className="relative block w-fit overflow-hidden pb-3">
                <motion.span
                  className="block text-lima"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE, delay: atrasoBase() + 0.25 }}
                >
                  fazendo.
                </motion.span>
                <motion.svg
                  aria-hidden
                  viewBox="0 0 300 20"
                  preserveAspectRatio="none"
                  className="absolute -bottom-0.5 left-0 h-4 w-full text-lima"
                >
                  <motion.path
                    d="M3 14C60 4 140 2 297 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: atrasoBase() + 0.8, ease: 'easeInOut' }}
                  />
                </motion.svg>
              </span>
            </h1>

            <motion.p {...entrada(0.35)} className="mt-6 max-w-xl text-base leading-relaxed text-palco-suave sm:text-lg">
              {chamada}
            </motion.p>

            <motion.div {...entrada(0.45)} className="mt-8 flex flex-wrap gap-3">
              <BotaoLink href="/disciplinas" variante="lima" seta>
                Explorar disciplinas
              </BotaoLink>
              <BotaoLink href="/laboratorio" variante="contorno-palco">
                Abrir laboratórios
              </BotaoLink>
            </motion.div>
          </div>

          {/* Retrato com elementos flutuantes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: atrasoBase() + 0.1 }}
            className="relative mx-auto aspect-square w-full max-w-[26rem]"
          >
            <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 size-full animate-[spin_40s_linear_infinite]">
              <circle cx="200" cy="200" r="196" fill="none" stroke="rgba(200,240,90,0.45)" strokeWidth="1.5" strokeDasharray="4 10" />
            </svg>
            <div className="absolute inset-[7%] rounded-full bg-[conic-gradient(from_200deg,#c8f05a,#22b07d,#0e7a54,#c8f05a)] p-1.5">
              <motion.div style={{ x: fotoX, y: fotoY }} className="size-full overflow-hidden rounded-full bg-palco">
                {retrato ? (
                  <img
                    src={retrato}
                    alt={`Foto do Prof. ${nome}`}
                    width={460}
                    height={460}
                    fetchPriority="high"
                    className="size-full scale-[1.13] object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center font-display text-8xl font-extrabold text-lima">ÁL</div>
                )}
              </motion.div>
            </div>

            <motion.div style={{ x: chipX, y: chipY }} className="absolute inset-0">
              <motion.p
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: atrasoBase() + 0.7, stiffness: 200, damping: 14 }}
                className="absolute -left-2 top-[4%] -rotate-6 rounded-[1.6rem] rounded-bl-md bg-lima px-5 py-3 font-mao text-xl font-bold leading-tight text-[#0c1a15] shadow-xl sm:-left-6 sm:text-2xl"
              >
                bora criar algo
                <br />
                incrível? ✨
              </motion.p>

              <Flutuante className="right-0 top-[30%] sm:right-[-4%]" atraso={atrasoBase() + 0.85} duracao={5}>
                <BrainCircuit className="size-4 text-lima" /> IA & redes neurais
              </Flutuante>
              <Flutuante className="bottom-[16%] left-0 sm:left-[-6%]" atraso={atrasoBase() + 1} duracao={6}>
                <Bot className="size-4 text-lima" /> Robótica & sensores
              </Flutuante>
              <Flutuante className="bottom-[1%] right-[4%] sm:right-[6%]" atraso={atrasoBase() + 1.15} duracao={5.5}>
                <MapPin className="size-4 text-coral" /> IFPA {campus}
              </Flutuante>
            </motion.div>
          </motion.div>
        </div>

        {/* Números */}
        <motion.dl
          {...entrada(0.6)}
          className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-6 border-t border-palco-borda px-5 py-7 sm:px-8 lg:grid-cols-4"
        >
          {numeros.map((n, i) => (
            <div key={n.rotulo} className={`flex flex-col-reverse ${i % 2 ? 'pl-5 sm:pl-8' : ''}`}>
              <dt className="mt-1 text-sm text-palco-suave">{n.rotulo}</dt>
              <dd className="font-display text-4xl font-bold sm:text-5xl">
                <Contador valor={n.valor} sufixo={n.sufixo} />
              </dd>
            </div>
          ))}
        </motion.dl>

        <a
          href="#sobre"
          className="absolute bottom-[8.5rem] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-palco-suave transition hover:text-lima xl:flex"
        >
          <MousePointer2 className="size-4 animate-bounce" aria-hidden />
          role para explorar
        </a>
      </div>
    </section>
  );
}

function Flutuante({
  children,
  className,
  atraso,
  duracao,
}: {
  children: React.ReactNode;
  className: string;
  atraso: number;
  duracao: number;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay: atraso, duration: 0.6 },
        y: { delay: atraso, duration: duracao, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`absolute flex items-center gap-2 whitespace-nowrap rounded-full border border-palco-borda bg-palco/85 px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-md sm:text-sm ${className}`}
    >
      {children}
    </motion.p>
  );
}
