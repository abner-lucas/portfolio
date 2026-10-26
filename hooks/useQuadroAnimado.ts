'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export interface Quadro {
  ctx: CanvasRenderingContext2D;
  /** Largura e altura em pixels CSS. */
  largura: number;
  altura: number;
  /** Segundos desde o início da animação. */
  tempo: number;
  /** Segundos desde o quadro anterior. */
  delta: number;
}

/**
 * Laço de renderização para `<canvas>` reutilizado por todos os gráficos
 * interativos.
 *
 * - Ajusta a resolução à densidade da tela (telas retina ficam nítidas).
 * - Só anima enquanto o canvas está visível na tela, poupando bateria.
 * - Com "reduzir movimento" ativo, desenha quadros estáticos sob demanda.
 *
 * `desenhar` pode mudar a cada render; o laço sempre usa a versão mais nova.
 * Use o retorno `redesenhar` para forçar um quadro (ex.: após um clique).
 */
export function useQuadroAnimado(desenhar: (q: Quadro) => void, animar = true) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const desenharRef = useRef(desenhar);
  const redesenharRef = useRef<() => void>(() => {});
  const reduzir = useReducedMotion();

  useEffect(() => {
    desenharRef.current = desenhar;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let largura = 0;
    let altura = 0;
    let visivel = false;
    let quadro = 0;
    let inicio = performance.now();
    let anterior = inicio;

    const pintar = (agora: number) => {
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
      ctx.clearRect(0, 0, largura, altura);
      desenharRef.current({
        ctx,
        largura,
        altura,
        tempo: (agora - inicio) / 1000,
        delta: Math.min(0.05, (agora - anterior) / 1000),
      });
      anterior = agora;
    };

    const laco = (agora: number) => {
      pintar(agora);
      quadro = requestAnimationFrame(laco);
    };

    const deveAnimar = () => animar && !reduzir && visivel;

    const iniciar = () => {
      cancelAnimationFrame(quadro);
      if (deveAnimar()) {
        anterior = performance.now();
        quadro = requestAnimationFrame(laco);
      } else {
        pintar(performance.now());
      }
    };

    const redimensionar = () => {
      const dpr = window.devicePixelRatio || 1;
      const caixa = canvas.getBoundingClientRect();
      largura = caixa.width;
      altura = caixa.height;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      pintar(performance.now());
    };

    redesenharRef.current = () => {
      if (!deveAnimar()) pintar(performance.now());
    };

    const observadorTamanho = new ResizeObserver(redimensionar);
    observadorTamanho.observe(canvas);

    const observadorVisibilidade = new IntersectionObserver(([entrada]) => {
      visivel = entrada.isIntersecting;
      iniciar();
    });
    observadorVisibilidade.observe(canvas);

    inicio = performance.now();
    redimensionar();

    return () => {
      cancelAnimationFrame(quadro);
      observadorTamanho.disconnect();
      observadorVisibilidade.disconnect();
    };
  }, [animar, reduzir]);

  return { canvasRef, redesenhar: () => redesenharRef.current() };
}
