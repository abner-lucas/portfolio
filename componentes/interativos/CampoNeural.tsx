'use client';

import { useEffect, useRef } from 'react';
import { useQuadroAnimado } from '@/hooks/useQuadroAnimado';

interface No {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Fundo da abertura: uma rede de "neurônios" que flutuam e se conectam
 * quando ficam próximos. O ponteiro atrai os nós e acende as conexões —
 * uma referência leve à pesquisa em redes neurais.
 */
export function CampoNeural({ className }: { className?: string }) {
  const nos = useRef<No[]>([]);
  const ponteiro = useRef({ x: -9999, y: -9999 });

  const { canvasRef } = useQuadroAnimado(({ ctx, largura, altura, delta }) => {
    const alvo = Math.min(80, Math.round((largura * altura) / 16000));
    while (nos.current.length < alvo) {
      nos.current.push({
        x: Math.random() * largura,
        y: Math.random() * altura,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        r: 1 + Math.random() * 1.8,
      });
    }
    nos.current.length = alvo;

    const { x: px, y: py } = ponteiro.current;
    const alcance = 130;

    for (const n of nos.current) {
      const dx = px - n.x;
      const dy = py - n.y;
      const d = Math.hypot(dx, dy);
      if (d < 220 && d > 1) {
        n.vx += (dx / d) * 30 * delta;
        n.vy += (dy / d) * 30 * delta;
      }
      n.vx *= 0.99;
      n.vy *= 0.99;
      n.x += n.vx * delta;
      n.y += n.vy * delta;
      if (n.x < 0 || n.x > largura) n.vx *= -1;
      if (n.y < 0 || n.y > altura) n.vy *= -1;
      n.x = Math.max(0, Math.min(largura, n.x));
      n.y = Math.max(0, Math.min(altura, n.y));
    }

    for (let i = 0; i < nos.current.length; i++) {
      const a = nos.current[i];
      for (let j = i + 1; j < nos.current.length; j++) {
        const b = nos.current[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > alcance) continue;
        const perto = Math.hypot((a.x + b.x) / 2 - px, (a.y + b.y) / 2 - py) < 160;
        ctx.strokeStyle = perto
          ? `rgba(200, 240, 90, ${0.55 * (1 - d / alcance)})`
          : `rgba(116, 231, 185, ${0.16 * (1 - d / alcance)})`;
        ctx.lineWidth = perto ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const n of nos.current) {
      const perto = Math.hypot(n.x - px, n.y - py) < 160;
      ctx.fillStyle = perto ? '#c8f05a' : 'rgba(164, 220, 196, 0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, perto ? n.r + 1 : n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  useEffect(() => {
    const mover = (e: PointerEvent) => {
      const caixa = canvasRef.current?.getBoundingClientRect();
      if (!caixa) return;
      ponteiro.current = { x: e.clientX - caixa.left, y: e.clientY - caixa.top };
    };
    const sair = () => (ponteiro.current = { x: -9999, y: -9999 });
    window.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('pointerleave', sair);
    return () => {
      window.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerleave', sair);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
