'use client';

import { useState } from 'react';
import { FastForward, RotateCcw, StepForward } from 'lucide-react';
import { epocaPerceptron, preverPerceptron, PORTAS, type Exemplo, type Pesos } from '@/lib/regras';
import { useQuadroAnimado } from '@/hooks/useQuadroAnimado';
import { cn } from '@/lib/utils';

const XOU: Exemplo[] = [
  { x: 0, y: 0, alvo: 0 },
  { x: 0, y: 1, alvo: 1 },
  { x: 1, y: 0, alvo: 1 },
  { x: 1, y: 1, alvo: 0 },
];

const CONJUNTOS = {
  E: { nome: 'Porta E (AND)', dados: PORTAS.E },
  OU: { nome: 'Porta OU (OR)', dados: PORTAS.OU },
  NAO_E: { nome: 'Porta NÃO-E (NAND)', dados: PORTAS.NAO_E },
  XOU: { nome: 'OU exclusivo (XOR)', dados: XOU },
} as const;

type Conjunto = keyof typeof CONJUNTOS;

const PESOS_INICIAIS: Pesos = { w1: -0.3, w2: 0.5, b: 0.1 };

/**
 * Um neurônio artificial aprendendo portas lógicas. A cada época, a reta de
 * decisão se move; no XOR ela nunca separa as classes — o motivo histórico
 * para as redes de múltiplas camadas.
 */
export function Perceptron() {
  const [conjunto, setConjunto] = useState<Conjunto>('E');
  const [pesos, setPesos] = useState<Pesos>(PESOS_INICIAIS);
  const [epocas, setEpocas] = useState(0);
  const [erros, setErros] = useState<number | null>(null);
  const dados = CONJUNTOS[conjunto].dados;

  const { canvasRef } = useQuadroAnimado(({ ctx, largura, altura, tempo }) => {
    const m = 44;
    const lado = Math.min(largura, altura) - m * 2;
    const ox = (largura - lado) / 2;
    const oy = (altura - lado) / 2;
    const tela = (x: number, y: number) => ({ x: ox + x * lado, y: oy + (1 - y) * lado });

    // Regiões de decisão (amostragem em grade)
    const passos = 28;
    const t = lado / passos;
    for (let i = 0; i < passos; i++) {
      for (let j = 0; j < passos; j++) {
        const x = (i + 0.5) / passos;
        const y = 1 - (j + 0.5) / passos;
        ctx.fillStyle = preverPerceptron(pesos, x * 1.4 - 0.2, y * 1.4 - 0.2)
          ? 'rgba(34, 176, 125, 0.16)'
          : 'rgba(255, 107, 74, 0.12)';
        ctx.fillRect(ox + i * t, oy + j * t, t + 0.5, t + 0.5);
      }
    }

    // Eixos
    ctx.strokeStyle = 'rgba(120, 140, 130, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(ox, oy, lado, lado);

    // Reta de decisão: w1·x + w2·y + b = 0 (no espaço ampliado de −0,2 a 1,2)
    const conv = (v: number) => (v + 0.2) / 1.4;
    if (Math.abs(pesos.w2) > 1e-6 || Math.abs(pesos.w1) > 1e-6) {
      const pontos: { x: number; y: number }[] = [];
      if (Math.abs(pesos.w2) > 1e-6) {
        for (const x of [-0.2, 1.2]) pontos.push({ x, y: -(pesos.w1 * x + pesos.b) / pesos.w2 });
      } else {
        const x = -pesos.b / pesos.w1;
        pontos.push({ x, y: -0.2 }, { x, y: 1.2 });
      }
      const [a, b] = pontos.map((p) => tela(conv(p.x), conv(p.y)));
      ctx.save();
      ctx.beginPath();
      ctx.rect(ox, oy, lado, lado);
      ctx.clip();
      ctx.strokeStyle = '#0e7a54';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 6]);
      ctx.lineDashOffset = -tempo * 20;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }

    // Exemplos
    for (const e of dados) {
      const p = tela(conv(e.x), conv(e.y));
      const certo = preverPerceptron(pesos, e.x, e.y) === e.alvo;
      ctx.fillStyle = e.alvo ? '#22b07d' : '#ff6b4a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = certo ? 'rgba(255,255,255,0.9)' : '#0c1a15';
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '600 12px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(e.alvo), p.x, p.y);
      ctx.fillStyle = 'rgba(120, 140, 130, 0.95)';
      ctx.fillText(`(${e.x},${e.y})`, p.x, p.y + 28);
    }
  });

  const treinar = (vezes: number) => {
    let p = pesos;
    let e = 0;
    let n = 0;
    for (let i = 0; i < vezes; i++) {
      const r = epocaPerceptron(p, dados, 0.2);
      p = r.pesos;
      e = r.erros;
      n++;
      if (e === 0) break;
    }
    setPesos(p);
    setEpocas((v) => v + n);
    setErros(e);
  };

  const reiniciar = (c: Conjunto = conjunto) => {
    setConjunto(c);
    setPesos(PESOS_INICIAIS);
    setEpocas(0);
    setErros(null);
  };

  const convergiu = erros === 0;
  const impossivel = conjunto === 'XOU' && epocas >= 20;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative overflow-hidden rounded-3xl border border-borda bg-superficie">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Plano com os quatro exemplos da ${CONJUNTOS[conjunto].nome} e a reta de decisão do perceptron.`}
          className="h-[320px] w-full sm:h-[400px]"
        />
      </div>

      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Ensine o neurônio</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CONJUNTOS) as Conjunto[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === conjunto}
                onClick={() => reiniciar(c)}
                className={cn(
                  'min-h-10 rounded-full border px-4 text-sm font-semibold transition',
                  c === conjunto ? 'border-transparent bg-marca text-sobre-marca' : 'border-borda bg-superficie hover:border-tinta/30',
                )}
              >
                {CONJUNTOS[c].nome}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="rounded-3xl border border-borda bg-superficie p-5" aria-live="polite">
          <p className="font-mono text-sm">
            y = {pesos.w1.toFixed(2)}·x₁ + {pesos.w2.toFixed(2)}·x₂ + {pesos.b.toFixed(2)}
          </p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl bg-superficie-2 py-3">
              <dt className="text-xs text-tinta-suave">épocas</dt>
              <dd className="font-display text-3xl font-bold">{epocas}</dd>
            </div>
            <div className="rounded-2xl bg-superficie-2 py-3">
              <dt className="text-xs text-tinta-suave">erros na última</dt>
              <dd className="font-display text-3xl font-bold">{erros ?? '—'}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-tinta-suave">
            {convergiu
              ? '✔ Aprendeu! A reta separa as duas classes.'
              : impossivel
                ? 'O XOR não é linearmente separável: nenhuma reta resolve. É preciso uma rede com camadas ocultas.'
                : 'Verde = saída 1, coral = saída 0. Pontos com borda escura ainda estão errados.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => treinar(1)}
            disabled={convergiu}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-marca px-5 text-sm font-semibold text-sobre-marca transition hover:bg-marca-forte disabled:opacity-50"
          >
            <StepForward className="size-4" /> 1 época
          </button>
          <button
            type="button"
            onClick={() => treinar(20)}
            disabled={convergiu}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-superficie-2 px-5 text-sm font-semibold transition hover:bg-borda disabled:opacity-50"
          >
            <FastForward className="size-4" /> Treinar até 20
          </button>
          <button
            type="button"
            onClick={() => reiniciar()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-superficie-2 px-5 text-sm font-semibold transition hover:bg-borda"
          >
            <RotateCcw className="size-4" /> Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
