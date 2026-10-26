'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

/** Número que conta de 0 até `valor` quando aparece na tela. */
export function Contador({ valor, sufixo = '' }: { valor: number; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const visivel = useInView(ref, { once: true, margin: '-40px' });
  const reduzir = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !visivel) return;
    if (reduzir) {
      el.textContent = `${valor}${sufixo}`;
      return;
    }
    const controle = animate(0, valor, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${sufixo}`;
      },
    });
    return () => controle.stop();
  }, [visivel, valor, sufixo, reduzir]);

  // O valor final já vem no HTML: leitores de tela e quem está sem JS veem o número certo.
  return (
    <span ref={ref} className="tabular-nums">
      {valor}
      {sufixo}
    </span>
  );
}
