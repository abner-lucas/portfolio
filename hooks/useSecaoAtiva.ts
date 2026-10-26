'use client';

import { useEffect, useState } from 'react';

/** Devolve o `id` da seção que ocupa a faixa central da tela (ou `null` antes de rolar até alguma). */
export function useSecaoAtiva(ids: string[]) {
  const [ativa, setAtiva] = useState<string | null>(null);
  const chave = ids.join('|');

  useEffect(() => {
    const elementos = chave
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtiva(e.target.id);
      },
      // Considera "ativa" a seção que cruza uma linha a 40% da altura da tela.
      { rootMargin: '-40% 0px -59% 0px' },
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [chave]);

  return ativa;
}
