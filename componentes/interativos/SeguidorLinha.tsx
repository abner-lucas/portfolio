'use client';

import { useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Shuffle, Timer } from 'lucide-react';
import {
  GEOMETRIA,
  TAPETE,
  erroDaLinha,
  lerSensores,
  passoSeguidor,
  pistaPadrao,
  pontoMaisProximo,
  posicoesSensores,
  poseInicial,
  type Robo,
} from '@/lib/regras';
import { useQuadroAnimado } from '@/hooks/useQuadroAnimado';
import { cn } from '@/lib/utils';

const DT = 1 / 120;
const PADRAO = { kp: 0.1, kd: 0.001, velocidade: 0.3 };

interface Painel {
  leituras: boolean[];
  erro: number;
  ultimaVolta: number | null;
  melhorVolta: number | null;
  situacao: 'linha' | 'procurando' | 'fora';
}

/**
 * Robô seguidor de linha (categoria Rescue Line da RoboCup Junior):
 * cinco sensores infravermelhos leem a faixa preta e um controlador PD
 * ajusta a velocidade de cada roda. Arraste o robô para reposicioná-lo.
 */
export function SeguidorLinha() {
  const pista = useMemo(() => pistaPadrao(), []);
  const [kp, setKp] = useState(PADRAO.kp);
  const [kd, setKd] = useState(PADRAO.kd);
  const [velocidade, setVelocidade] = useState(PADRAO.velocidade);
  const [rodando, setRodando] = useState(true);
  const [painel, setPainel] = useState<Painel>({
    leituras: [false, false, true, false, false],
    erro: 0,
    ultimaVolta: null,
    melhorVolta: null,
    situacao: 'linha',
  });

  const sim = useRef({
    robo: poseInicial(pista),
    erroAnterior: 0,
    acumulado: 0,
    rastro: [] as { x: number; y: number }[],
    erros: [] as number[],
    indiceAnterior: 0,
    avanco: 0,
    tempoVolta: 0,
    ultimaVolta: null as number | null,
    melhorVolta: null as number | null,
    fora: false,
    arrastando: false,
    proximoPainel: 0,
  });

  const reiniciar = () => {
    const s = sim.current;
    Object.assign(s, {
      robo: poseInicial(pista),
      erroAnterior: 0,
      rastro: [],
      erros: [],
      indiceAnterior: 0,
      avanco: 0,
      tempoVolta: 0,
      fora: false,
    });
  };

  const { canvasRef } = useQuadroAnimado(({ ctx, largura, altura, delta, tempo }) => {
    const s = sim.current;
    const alturaGrafico = 46;
    const escala = Math.min(largura / TAPETE.largura, (altura - alturaGrafico) / TAPETE.altura);
    const ox = (largura - TAPETE.largura * escala) / 2;
    const oy = (altura - alturaGrafico - TAPETE.altura * escala) / 2;
    const tela = (x: number, y: number) => [ox + x * escala, oy + y * escala] as const;

    // --- Simulação em passos fixos ---
    if (rodando && !s.arrastando && !s.fora) {
      s.acumulado += delta;
      while (s.acumulado >= DT) {
        s.acumulado -= DT;
        const erro = erroDaLinha(lerSensores(s.robo, pista), s.erroAnterior);
        s.robo = passoSeguidor(s.robo, erro, s.erroAnterior, { kp, kd }, velocidade, DT);
        s.erroAnterior = erro;
        s.tempoVolta += DT;

        const { indice } = pontoMaisProximo(s.robo, pista);
        let passo = indice - s.indiceAnterior;
        if (passo < -pista.length / 2) passo += pista.length;
        if (passo > pista.length / 2) passo -= pista.length;
        s.avanco += passo;
        s.indiceAnterior = indice;
        if (s.avanco >= pista.length) {
          s.avanco -= pista.length;
          s.ultimaVolta = s.tempoVolta;
          s.melhorVolta = s.melhorVolta === null ? s.tempoVolta : Math.min(s.melhorVolta, s.tempoVolta);
          s.tempoVolta = 0;
        }

        const { x, y } = s.robo;
        if (x < -0.05 || y < -0.05 || x > TAPETE.largura + 0.05 || y > TAPETE.altura + 0.05) s.fora = true;
      }
      s.rastro.push({ x: s.robo.x, y: s.robo.y });
      if (s.rastro.length > 260) s.rastro.shift();
      s.erros.push(s.erroAnterior);
      if (s.erros.length > 240) s.erros.shift();
    }

    // --- Tapete ---
    ctx.fillStyle = '#f6f3ea';
    ctx.beginPath();
    ctx.roundRect(ox, oy, TAPETE.largura * escala, TAPETE.altura * escala, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(12, 26, 21, 0.07)';
    ctx.lineWidth = 1;
    for (let gx = 0.3; gx < TAPETE.largura; gx += 0.3) {
      const [x] = tela(gx, 0);
      ctx.beginPath();
      ctx.moveTo(x, oy);
      ctx.lineTo(x, oy + TAPETE.altura * escala);
      ctx.stroke();
    }
    for (let gy = 0.3; gy < TAPETE.altura; gy += 0.3) {
      const [, y] = tela(0, gy);
      ctx.beginPath();
      ctx.moveTo(ox, y);
      ctx.lineTo(ox + TAPETE.largura * escala, y);
      ctx.stroke();
    }

    // --- Faixa preta ---
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = GEOMETRIA.meiaLinha * 2 * escala;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pista.forEach((p, i) => {
      const [x, y] = tela(p.x, p.y);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // Marcador de largada (verde, como nos tapetes de competição)
    const [lx, ly] = tela(pista[0].x, pista[0].y);
    ctx.fillStyle = '#22b07d';
    ctx.fillRect(lx - 9, ly - 22, 18, 9);

    // --- Rastro ---
    s.rastro.forEach((p, i) => {
      const [x, y] = tela(p.x, p.y);
      ctx.fillStyle = `rgba(245, 184, 61, ${(i / s.rastro.length) * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- Robô ---
    const [rx, ry] = tela(s.robo.x, s.robo.y);
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(s.robo.angulo);
    const c = 0.085 * escala;
    const l = 0.07 * escala;
    ctx.fillStyle = '#0c1a15';
    ctx.fillRect(-c * 0.32, -l * 0.62, c * 0.42, l * 0.16); // roda esquerda
    ctx.fillRect(-c * 0.32, l * 0.46, c * 0.42, l * 0.16); // roda direita
    ctx.fillStyle = '#0e7a54';
    ctx.strokeStyle = '#0c1a15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-c * 0.5, -l * 0.46, c, l * 0.92, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#c8f05a';
    ctx.fillRect(c * 0.42, -l * 0.42, c * 0.14, l * 0.84); // barra de sensores
    const piscando = Math.sin(tempo * 8) > 0;
    ctx.fillStyle = s.fora ? '#ff6b4a' : piscando ? '#c8f05a' : '#74e7b9';
    ctx.beginPath();
    ctx.arc(-c * 0.12, 0, 3.5, 0, Math.PI * 2); // LED de status
    ctx.fill();
    ctx.restore();

    // Sensores (desenhados em coordenadas do tapete)
    const leituras = lerSensores(s.robo, pista);
    posicoesSensores(s.robo).forEach((p, i) => {
      const [x, y] = tela(p.x, p.y);
      if (leituras[i]) {
        ctx.fillStyle = 'rgba(255, 75, 50, 0.35)';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = leituras[i] ? '#ff4b32' : '#5b6b65';
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- Gráfico do erro ---
    const gy0 = altura - alturaGrafico + 8;
    const gh = alturaGrafico - 14;
    ctx.strokeStyle = 'rgba(120, 140, 130, 0.35)';
    ctx.beginPath();
    ctx.moveTo(12, gy0 + gh / 2);
    ctx.lineTo(largura - 12, gy0 + gh / 2);
    ctx.stroke();
    ctx.strokeStyle = '#f5b83d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    s.erros.forEach((e, i) => {
      const x = 12 + (i / 240) * (largura - 24);
      const y = gy0 + gh / 2 - (e / 3) * (gh / 2);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = 'rgba(120, 140, 130, 0.95)';
    ctx.font = '10px ui-monospace, monospace';
    ctx.fillText('erro', 14, gy0 + 9);

    // --- Painel (atualiza ~6 vezes por segundo para não re-renderizar a cada quadro) ---
    if (tempo >= s.proximoPainel) {
      s.proximoPainel = tempo + 0.16;
      const { distancia } = pontoMaisProximo(s.robo, pista);
      setPainel({
        leituras,
        erro: s.erroAnterior,
        ultimaVolta: s.ultimaVolta,
        melhorVolta: s.melhorVolta,
        situacao: s.fora || distancia > 0.15 ? 'fora' : leituras.some(Boolean) ? 'linha' : 'procurando',
      });
    }
  });

  const paraTapete = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const caixa = e.currentTarget.getBoundingClientRect();
    const alturaGrafico = 46;
    const escala = Math.min(caixa.width / TAPETE.largura, (caixa.height - alturaGrafico) / TAPETE.altura);
    const ox = (caixa.width - TAPETE.largura * escala) / 2;
    const oy = (caixa.height - alturaGrafico - TAPETE.altura * escala) / 2;
    return { x: (e.clientX - caixa.left - ox) / escala, y: (e.clientY - caixa.top - oy) / escala };
  };

  const moverRobo = (p: { x: number; y: number }) => {
    const s = sim.current;
    s.robo = { ...s.robo, x: Math.max(0, Math.min(TAPETE.largura, p.x)), y: Math.max(0, Math.min(TAPETE.altura, p.y)) } satisfies Robo;
    s.fora = false;
    s.rastro = [];
    s.indiceAnterior = pontoMaisProximo(s.robo, pista).indice;
    s.avanco = 0;
    s.tempoVolta = 0;
  };

  const situacoes = {
    linha: { texto: 'Na linha', classe: 'bg-[#22b07d]' },
    procurando: { texto: 'Procurando a linha…', classe: 'bg-ambar' },
    fora: { texto: 'Fora da pista! Reposicione ou reinicie.', classe: 'bg-coral' },
  };
  const formatar = (s: number | null) => (s === null ? '—' : `${s.toFixed(1).replace('.', ',')} s`);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative min-h-[340px] overflow-hidden rounded-3xl border border-borda bg-[#e9e4d6] dark:bg-[#1b1a16]">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Simulação de um robô seguidor de linha percorrendo uma pista preta em um tapete. Arraste para reposicionar o robô."
          className="h-[340px] w-full cursor-grab touch-none active:cursor-grabbing sm:h-[420px] lg:h-full lg:min-h-[420px]"
          onPointerDown={(e) => {
            sim.current.arrastando = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            moverRobo(paraTapete(e));
          }}
          onPointerMove={(e) => sim.current.arrastando && moverRobo(paraTapete(e))}
          onPointerUp={() => (sim.current.arrastando = false)}
          onPointerCancel={() => (sim.current.arrastando = false)}
        />
        <p className="pointer-events-none absolute right-4 top-3 font-mao text-lg text-[#8f5b00] dark:text-ambar">
          arraste o robô ✋
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-3xl border border-borda bg-superficie p-5" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Sensores infravermelhos</p>
            <span className="inline-flex items-center gap-2 font-mono text-xs">
              <span className={cn('size-2.5 rounded-full', situacoes[painel.situacao].classe)} />
              {situacoes[painel.situacao].texto}
            </span>
          </div>
          <ol className="mt-4 grid grid-cols-5 gap-2" aria-label="Leitura dos cinco sensores">
            {painel.leituras.map((ativo, i) => (
              <li key={i} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'size-6 rounded-full border-2 transition-all duration-150',
                    ativo ? 'border-[#ff4b32] bg-[#ff4b32] shadow-[0_0_14px_#ff4b32]' : 'border-borda bg-superficie-2',
                  )}
                />
                <span className="font-mono text-[11px] text-tinta-suave">
                  S{i + 1}
                  <span className="sr-only">{ativo ? ' vê a linha' : ' não vê a linha'}</span>
                </span>
              </li>
            ))}
          </ol>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-superficie-2 py-2.5">
              <dt className="text-[11px] text-tinta-suave">erro</dt>
              <dd className="font-display text-xl font-bold tabular-nums">{painel.erro.toFixed(1).replace('.', ',')}</dd>
            </div>
            <div className="rounded-2xl bg-superficie-2 py-2.5">
              <dt className="text-[11px] text-tinta-suave">última volta</dt>
              <dd className="font-display text-xl font-bold tabular-nums">{formatar(painel.ultimaVolta)}</dd>
            </div>
            <div className="rounded-2xl bg-superficie-2 py-2.5">
              <dt className="inline-flex items-center gap-1 text-[11px] text-tinta-suave">
                <Timer className="size-3" /> melhor
              </dt>
              <dd className="font-display text-xl font-bold tabular-nums text-marca">{formatar(painel.melhorVolta)}</dd>
            </div>
          </dl>
        </div>

        <fieldset className="space-y-3 rounded-3xl border border-borda bg-superficie p-5">
          <legend className="sr-only">Ajuste do controlador</legend>
          {[
            { id: 'kp', rotulo: 'Ganho proporcional (Kp)', valor: kp, set: setKp, min: 0, max: 0.2, passo: 0.005, casas: 3 },
            { id: 'kd', rotulo: 'Ganho derivativo (Kd)', valor: kd, set: setKd, min: 0, max: 0.004, passo: 0.0001, casas: 4 },
            { id: 'vel', rotulo: 'Velocidade base', valor: velocidade, set: setVelocidade, min: 0.1, max: 0.6, passo: 0.01, casas: 2 },
          ].map((c) => (
            <div key={c.id}>
              <label htmlFor={`seguidor-${c.id}`} className="flex justify-between text-sm font-semibold">
                {c.rotulo}
                <span className="font-mono text-xs text-tinta-suave">{c.valor.toFixed(c.casas)}</span>
              </label>
              <input
                id={`seguidor-${c.id}`}
                type="range"
                min={c.min}
                max={c.max}
                step={c.passo}
                value={c.valor}
                onChange={(e) => c.set(Number(e.target.value))}
                className="mt-1 w-full accent-[#f5b83d]"
              />
            </div>
          ))}
          <p className="text-xs leading-relaxed text-tinta-suave">
            Desafio: aumente a velocidade e reajuste Kp e Kd até bater sua melhor volta sem sair da linha.
          </p>
        </fieldset>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRodando((r) => !r)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ambar px-5 text-sm font-semibold text-[#0c1a15] transition hover:brightness-105"
          >
            {rodando ? <Pause className="size-4" /> : <Play className="size-4" />}
            {rodando ? 'Pausar' : 'Ligar robô'}
          </button>
          <button
            type="button"
            onClick={() => {
              sim.current.robo = { ...sim.current.robo, angulo: sim.current.robo.angulo + (Math.random() > 0.5 ? 0.9 : -0.9) };
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-superficie-2 px-5 text-sm font-semibold transition hover:bg-borda"
          >
            <Shuffle className="size-4" /> Empurrar
          </button>
          <button
            type="button"
            onClick={() => {
              reiniciar();
              setKp(PADRAO.kp);
              setKd(PADRAO.kd);
              setVelocidade(PADRAO.velocidade);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-superficie-2 px-5 text-sm font-semibold transition hover:bg-borda"
          >
            <RotateCcw className="size-4" /> Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
