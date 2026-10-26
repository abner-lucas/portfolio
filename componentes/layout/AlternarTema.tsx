'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Alterna entre claro e escuro. Onde o navegador suporta a View Transitions
 * API, o novo tema se espalha num círculo a partir do botão.
 */
export function AlternarTema({ className }: { className?: string }) {
  const alternar = (e: React.MouseEvent<HTMLButtonElement>) => {
    const html = document.documentElement;
    const escuro = !html.classList.contains('dark');
    const aplicar = () => {
      html.classList.toggle('dark', escuro);
      try {
        localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
      } catch {
        /* sem armazenamento: o tema vale só para esta visita */
      }
    };

    const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduzir) return aplicar();

    const { clientX: x, clientY: y } = e;
    const raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(aplicar).ready.then(() => {
      html.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={alternar}
      className={cn(
        'relative grid size-11 place-items-center rounded-full text-tinta transition hover:bg-superficie-2',
        className,
      )}
      aria-label="Alternar tema claro ou escuro"
    >
      <Sun className="size-5 rotate-0 scale-100 transition duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-5 rotate-90 scale-0 transition duration-500 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
