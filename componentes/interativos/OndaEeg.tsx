'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { amostraEeg, FREQUENCIAS_EEG, type BandaEeg } from '@/lib/regras';
import { useQuadroAnimado } from '@/hooks/useQuadroAnimado';
import { cn } from '@/lib/utils';

const BANDAS: { id: BandaEeg; nome: string; estado: string; cor: string }[] = [
  { id: 'delta', nome: 'Delta', estado: 'sono profundo', cor: '#3a8dff' },
  { id: 'teta', nome: 'Teta', estado: 'sonolência, memória', cor: '#7c5cff' },
  { id: 'alfa', nome: 'Alfa', estado: 'relaxado, olhos fechados', cor: '#22b07d' },
  { id: 'beta', nome: 'Beta', estado: 'atenção, raciocínio', cor: '#ff6b4a' },
  { id: 'todas', nome: 'Sinal composto', estado: 'mistura das bandas', cor: '#c8f05a' },
];

const JANELA = 3; // segundos visíveis

/** Sinal cerebral sintético rolando como num eletroencefalógrafo. */
export function OndaEeg() {
  const [banda, setBanda] = useState<BandaEeg>('alfa');
  const [ruido, setRuido] = useState(0.15);
  const [rodando, setRodando] = useState(true);
  const relogio = useRef(0);
  const info = BANDAS.find((b) => b.id === banda)!;

  const { canvasRef } = useQuadroAnimado(({ ctx, largura, altura, delta }) => {
    if (rodando) relogio.current += delta;
    const meio = altura / 2;

    // Grade de papel milimetrado
    ctx.strokeStyle = 'rgba(200, 240, 90, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < largura; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, altura);
      ctx.stroke();
    }
    for (let y = meio % 24; y < altura; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(largura, y);
      ctx.stroke();
    }

    // Sinal
    const fim = relogio.current;
    const inicio = fim - JANELA;
    const amostras = Math.round(largura);
    ctx.strokeStyle = info.cor;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = info.cor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let i = 0; i <= amostras; i++) {
      const t = inicio + (i / amostras) * JANELA;
      const y = meio - amostraEeg(t, banda, ruido) * altura * 0.22;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo((i / amostras) * largura, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Cabeçote de leitura
    ctx.fillStyle = info.cor;
    ctx.beginPath();
    ctx.arc(largura - 3, meio - amostraEeg(fim, banda, ruido) * altura * 0.22, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(234, 243, 238, 0.6)';
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText(`canal Oz · ${fim.toFixed(1)} s`, 12, 20);
  }, rodando);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative overflow-hidden rounded-3xl border border-palco-borda bg-palco">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Sinal de EEG sintético na banda ${info.nome}.`}
          className="h-[320px] w-full sm:h-[400px]"
        />
      </div>

      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Banda de frequência</legend>
          <div className="flex flex-wrap gap-2">
            {BANDAS.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={b.id === banda}
                onClick={() => setBanda(b.id)}
                className={cn(
                  'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition',
                  b.id === banda ? 'border-tinta bg-tinta text-fundo' : 'border-borda bg-superficie hover:border-tinta/30',
                )}
              >
                <span aria-hidden className="size-2.5 rounded-full" style={{ background: b.cor }} />
                {b.nome}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="rounded-3xl border border-borda bg-superficie p-5">
          <p className="font-display text-2xl font-bold">{info.nome}</p>
          <p className="mt-1 text-sm text-tinta-suave">
            {banda === 'todas'
              ? 'Soma ponderada das quatro bandas, como num registro real.'
              : `≈ ${FREQUENCIAS_EEG[banda]} Hz · associada a ${info.estado}.`}
          </p>
          <label className="mt-5 block text-sm font-semibold" htmlFor="ruido-eeg">
            Ruído / artefatos: {Math.round(ruido * 100)}%
          </label>
          <input
            id="ruido-eeg"
            type="range"
            min={0}
            max={0.6}
            step={0.01}
            value={ruido}
            onChange={(e) => setRuido(Number(e.target.value))}
            className="mt-2 w-full accent-[#0e7a54]"
          />
          <p className="mt-3 text-xs leading-relaxed text-tinta-suave">
            Remover esse ruído é a primeira etapa do pré-processamento que faço com MNE-Python antes de treinar redes
            neurais com sinais de EEG.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRodando((r) => !r)}
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-superficie-2 px-5 text-sm font-semibold transition hover:bg-borda"
        >
          {rodando ? <Pause className="size-4" /> : <Play className="size-4" />}
          {rodando ? 'Pausar registro' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}
