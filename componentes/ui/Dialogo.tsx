'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogoProps {
  aberto: boolean;
  aoFechar: () => void;
  /** Título lido pelos leitores de tela. */
  titulo: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Janela modal baseada no `<dialog>` nativo: o navegador cuida do foco
 * preso dentro da janela, da tecla Esc e de devolver o foco ao botão que a
 * abriu. Clicar fora do conteúdo também fecha.
 */
export function Dialogo({ aberto, aoFechar, titulo, className, children }: DialogoProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) {
      dialogo.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (!aberto && dialogo.open) {
      dialogo.close();
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-label={titulo}
      onClose={aoFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className={cn(
        'm-auto max-h-[92dvh] w-[min(100%-1.5rem,56rem)] overflow-hidden rounded-[1.75rem] border border-borda bg-superficie p-0 text-tinta shadow-2xl',
        className,
      )}
    >
      {aberto && (
        <div className="relative max-h-[92dvh] overflow-y-auto overscroll-contain">
          <button
            type="button"
            onClick={aoFechar}
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-superficie/90 text-tinta shadow-cartao backdrop-blur transition hover:rotate-90"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
