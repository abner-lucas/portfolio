'use client';

import { useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { euler, piramide, prisma, projetar, type Solido } from '@/lib/regras';
import { useQuadroAnimado } from '@/hooks/useQuadroAnimado';
import { cn } from '@/lib/utils';

const SOLIDOS: { id: string; nome: string; criar: () => Solido; poliedro: boolean }[] = [
  { id: 'cubo', nome: 'Cubo', criar: () => prisma(4, 1.05, 1.5), poliedro: true },
  { id: 'prisma3', nome: 'Prisma triangular', criar: () => prisma(3, 1.15, 1.6), poliedro: true },
  { id: 'prisma6', nome: 'Prisma hexagonal', criar: () => prisma(6, 1, 1.5), poliedro: true },
  { id: 'piramide', nome: 'Pirâmide', criar: () => piramide(4, 1.1, 1.7), poliedro: true },
  { id: 'cilindro', nome: 'Cilindro', criar: () => prisma(28, 1, 1.6), poliedro: false },
  { id: 'cone', nome: 'Cone', criar: () => piramide(28, 1.05, 1.7), poliedro: false },
];

/**
 * Visualizador de sólidos com projeção em perspectiva feita "à mão":
 * rotação, ordenação das faces por profundidade (algoritmo do pintor) e
 * sombreamento pela inclinação de cada face. Arraste para girar.
 */
export function Solido3D() {
  const [solidoId, setSolidoId] = useState('cubo');
  const [girando, setGirando] = useState(true);
  const [mostrar, setMostrar] = useState({ faces: true, arestas: true, vertices: true });
  const angulos = useRef({ x: -22, y: 35 });
  const arrasto = useRef<{ x: number; y: number } | null>(null);

  const escolhido = SOLIDOS.find((s) => s.id === solidoId)!;
  const solido = useMemo(() => escolhido.criar(), [escolhido]);
  const contagem = euler(solido);

  const { canvasRef, redesenhar } = useQuadroAnimado(({ ctx, largura, altura, delta }) => {
    if (girando && !arrasto.current) angulos.current.y += 24 * delta;
    const escala = Math.min(largura, altura) * 0.3;
    const cx = largura / 2;
    const cy = altura / 2 + 6;
    const p = solido.vertices.map((v) => projetar(v, angulos.current.x, angulos.current.y, escala, cx, cy, 6));

    // Sombra no "chão"
    ctx.fillStyle = 'rgba(12, 26, 21, 0.12)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + escala * 1.15, escala * 0.95, escala * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();

    if (mostrar.faces) {
      const faces = solido.faces
        .map((f) => ({ f, z: f.reduce((s, i) => s + p[i].z, 0) / f.length }))
        .sort((a, b) => b.z - a.z);
      for (const { f } of faces) {
        // Área projetada: faces voltadas para a câmera aparecem maiores e mais claras.
        let area = 0;
        for (let k = 0; k < f.length; k++) {
          const a = p[f[k]];
          const b = p[f[(k + 1) % f.length]];
          area += a.x * b.y - b.x * a.y;
        }
        const luz = Math.min(1, Math.abs(area) / (escala * escala * 2.2));
        ctx.fillStyle = `rgba(124, 92, 255, ${0.1 + luz * 0.4})`;
        ctx.beginPath();
        f.forEach((i, k) => (k ? ctx.lineTo(p[i].x, p[i].y) : ctx.moveTo(p[i].x, p[i].y)));
        ctx.closePath();
        ctx.fill();
      }
    }

    if (mostrar.arestas) {
      for (const [i, j] of solido.arestas) {
        const fundo = (p[i].z + p[j].z) / 2 > 0;
        ctx.strokeStyle = fundo ? 'rgba(91, 62, 224, 0.35)' : '#5b3ee0';
        ctx.setLineDash(fundo ? [5, 5] : []);
        ctx.lineWidth = fundo ? 1 : 2;
        ctx.beginPath();
        ctx.moveTo(p[i].x, p[i].y);
        ctx.lineTo(p[j].x, p[j].y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    if (mostrar.vertices && escolhido.poliedro) {
      for (const v of p) {
        ctx.fillStyle = '#ff6b4a';
        ctx.beginPath();
        ctx.arc(v.x, v.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, true);

  const alternar = (chave: keyof typeof mostrar) => {
    setMostrar((m) => ({ ...m, [chave]: !m[chave] }));
    requestAnimationFrame(redesenhar);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative overflow-hidden rounded-3xl border border-borda bg-[radial-gradient(circle_at_50%_40%,#f3efff,#e7e0ff_60%,#ddd3ff)] dark:bg-[radial-gradient(circle_at_50%_40%,#2a2350,#1d1736_65%)]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${escolhido.nome} em perspectiva. Arraste para girar.`}
          className="h-[320px] w-full cursor-grab touch-none active:cursor-grabbing sm:h-[400px]"
          onPointerDown={(e) => {
            arrasto.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!arrasto.current) return;
            angulos.current.y += (e.clientX - arrasto.current.x) * 0.6;
            angulos.current.x = Math.max(-80, Math.min(80, angulos.current.x - (e.clientY - arrasto.current.y) * 0.6));
            arrasto.current = { x: e.clientX, y: e.clientY };
            redesenhar();
          }}
          onPointerUp={() => (arrasto.current = null)}
          onPointerCancel={() => (arrasto.current = null)}
        />
        <p className="pointer-events-none absolute bottom-3 left-4 font-mao text-lg text-[#5b3ee0] dark:text-[#a994ff]">
          arraste para girar ↻
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Escolha um sólido</legend>
          <div className="flex flex-wrap gap-2">
            {SOLIDOS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === solidoId}
                onClick={() => setSolidoId(s.id)}
                className={cn(
                  'min-h-10 rounded-full border px-4 text-sm font-semibold transition',
                  s.id === solidoId
                    ? 'border-transparent bg-violeta text-white'
                    : 'border-borda bg-superficie hover:border-tinta/30',
                )}
              >
                {s.nome}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Mostrar</legend>
          <div className="flex flex-wrap gap-2">
            {(['faces', 'arestas', 'vertices'] as const).map((k) => (
              <label key={k} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-borda bg-superficie px-4 text-sm font-medium">
                <input type="checkbox" checked={mostrar[k]} onChange={() => alternar(k)} className="size-4 accent-[#7c5cff]" />
                {k === 'vertices' ? 'vértices' : k}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-3xl border border-borda bg-superficie p-5">
          {escolhido.poliedro ? (
            <>
              <p className="text-sm font-semibold">Relação de Euler</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ['V', 'vértices', contagem.v],
                  ['A', 'arestas', contagem.a],
                  ['F', 'faces', contagem.f],
                ].map(([letra, nome, valor]) => (
                  <div key={letra as string} className="rounded-2xl bg-superficie-2 py-3">
                    <dt className="text-xs text-tinta-suave">{nome}</dt>
                    <dd className="font-display text-3xl font-bold">{valor}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 font-mono text-sm">
                V − A + F = {contagem.v} − {contagem.a} + {contagem.f} ={' '}
                <strong className="text-marca">{contagem.v - contagem.a + contagem.f}</strong>
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-tinta-suave">
              <strong className="text-tinta">{escolhido.nome}</strong> é um corpo redondo, não um poliedro. Aqui ele
              é aproximado por 28 faces laterais — é assim que placas de vídeo desenham superfícies curvas.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGirando((g) => !g)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-superficie-2 px-5 text-sm font-semibold transition hover:bg-borda"
          >
            {girando ? <Pause className="size-4" /> : <Play className="size-4" />}
            {girando ? 'Pausar giro' : 'Girar'}
          </button>
          <button
            type="button"
            onClick={() => {
              angulos.current = { x: -22, y: 35 };
              redesenhar();
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-superficie-2 px-5 text-sm font-semibold transition hover:bg-borda"
          >
            <RotateCcw className="size-4" /> Recentralizar
          </button>
        </div>
      </div>
    </div>
  );
}
