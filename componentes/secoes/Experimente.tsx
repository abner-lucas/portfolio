'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, Bot, Box, BrainCircuit } from 'lucide-react';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { Revelar } from '@/componentes/ui/Revelar';
import { Solido3D } from '@/componentes/interativos/Solido3D';
import { Perceptron } from '@/componentes/interativos/Perceptron';
import { OndaEeg } from '@/componentes/interativos/OndaEeg';
import { SeguidorLinha } from '@/componentes/interativos/SeguidorLinha';
import { cn } from '@/lib/utils';

const EXPERIMENTOS = [
  { id: 'robo', rotulo: 'Seguidor de linha', icone: Bot, tom: 'tom-ambar', Componente: SeguidorLinha, disciplina: 'Robótica · RoboCup Junior Rescue Line' },
  { id: 'solidos', rotulo: 'Sólidos 3D', icone: Box, tom: 'tom-violeta', Componente: Solido3D, disciplina: 'Computação Gráfica' },
  { id: 'neuronio', rotulo: 'Neurônio artificial', icone: BrainCircuit, tom: 'tom-verde', Componente: Perceptron, disciplina: 'Inteligência Computacional' },
  { id: 'eeg', rotulo: 'Ondas cerebrais', icone: Activity, tom: 'tom-coral', Componente: OndaEeg, disciplina: 'Pesquisa em EEG' },
] as const;

/** Três mini-laboratórios renderizados em tempo real, direto no navegador. */
export function Experimente({ numero = 2 }: { numero?: number }) {
  const [ativo, setAtivo] = useState<(typeof EXPERIMENTOS)[number]['id']>('robo');
  const atual = EXPERIMENTOS.find((e) => e.id === ativo)!;

  const mover = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    const prox = EXPERIMENTOS[(i + delta + EXPERIMENTOS.length) % EXPERIMENTOS.length];
    setAtivo(prox.id);
    document.getElementById(`experimento-${prox.id}`)?.focus();
  };

  return (
    <Secao id="experimente" rotulo="Experimente" divisor={false}>
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <TituloSecao
          rotulo="Mão na massa"
          numero={numero}
          titulo="Aprender brincando"
          destaque="com os conceitos."
          descricao="Quatro experimentos calculados ao vivo no seu navegador: ajuste um robô seguidor de linha, gire sólidos, treine um neurônio e meça ondas cerebrais — sem instalar nada."
        />
        <Revelar>
          <div role="tablist" aria-label="Experimentos" className="flex flex-wrap gap-2 rounded-full border border-borda bg-superficie p-1.5">
            {EXPERIMENTOS.map((e, i) => (
              <button
                key={e.id}
                id={`experimento-${e.id}`}
                role="tab"
                type="button"
                aria-selected={ativo === e.id}
                aria-controls="painel-experimento"
                tabIndex={ativo === e.id ? 0 : -1}
                onClick={() => setAtivo(e.id)}
                onKeyDown={(ev) => mover(ev, i)}
                className={cn(e.tom, 'relative inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold')}
              >
                {ativo === e.id && (
                  <motion.span layoutId="experimento-ativo" className="absolute inset-0 rounded-full bg-tom" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <e.icone className={cn('relative size-4', ativo === e.id ? 'text-superficie' : 'text-tom')} />
                <span className={cn('relative', ativo === e.id ? 'text-superficie' : 'text-tinta')}>{e.rotulo}</span>
              </button>
            ))}
          </div>
        </Revelar>
      </div>

      <Revelar className="mt-10" atraso={0.1}>
        <div id="painel-experimento" role="tabpanel" aria-labelledby={`experimento-${ativo}`} className="rounded-[2rem] border border-borda bg-superficie-2/60 p-4 sm:p-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-tinta-suave">
            Conexão com · <span className="text-tinta">{atual.disciplina}</span>
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={ativo}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <atual.Componente />
            </motion.div>
          </AnimatePresence>
        </div>
      </Revelar>
    </Secao>
  );
}
