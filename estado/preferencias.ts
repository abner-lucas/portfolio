'use client';

import { useSyncExternalStore } from 'react';

/**
 * Estado global do visitante (sem login).
 *
 * Um armazenamento mínimo baseado em `useSyncExternalStore`: cada componente
 * assina apenas o pedaço do estado que usa, então alterar as turmas
 * acompanhadas não re-renderiza o resto da página. O estado é persistido no
 * `localStorage` do navegador e sincronizado entre abas.
 */

export interface Preferencias {
  /** `id`s das disciplinas que o estudante acompanha. */
  acompanhadas: string[];
  /** `id`s dos avisos já lidos. */
  vistos: string[];
}

const CHAVE = 'portfolio-abner:preferencias';
const INICIAL: Preferencias = { acompanhadas: [], vistos: [] };

let estado: Preferencias = INICIAL;
let carregado = false;
const ouvintes = new Set<() => void>();

function ler(): Preferencias {
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return INICIAL;
    const dados = JSON.parse(bruto) as Partial<Preferencias>;
    return {
      acompanhadas: Array.isArray(dados.acompanhadas) ? dados.acompanhadas : [],
      vistos: Array.isArray(dados.vistos) ? dados.vistos : [],
    };
  } catch {
    return INICIAL;
  }
}

function garantirCarregado() {
  if (carregado || typeof window === 'undefined') return;
  carregado = true;
  estado = ler();
  window.addEventListener('storage', (e) => {
    if (e.key !== CHAVE) return;
    estado = ler();
    ouvintes.forEach((o) => o());
  });
}

function atualizar(alteracao: (atual: Preferencias) => Preferencias) {
  garantirCarregado();
  estado = alteracao(estado);
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* modo privado ou armazenamento bloqueado: segue só em memória */
  }
  ouvintes.forEach((o) => o());
}

function assinar(ouvinte: () => void) {
  garantirCarregado();
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

/** Lê um pedaço do estado. O seletor deve devolver um valor estável. */
export function usePreferencias<T>(seletor: (p: Preferencias) => T): T {
  return useSyncExternalStore(
    assinar,
    () => {
      garantirCarregado();
      return seletor(estado);
    },
    () => seletor(INICIAL),
  );
}

export const acoesPreferencias = {
  alternarTurma(id: string) {
    atualizar((p) => ({
      ...p,
      acompanhadas: p.acompanhadas.includes(id)
        ? p.acompanhadas.filter((t) => t !== id)
        : [...p.acompanhadas, id],
    }));
  },
  marcarLidos(ids: string[]) {
    atualizar((p) => ({ ...p, vistos: Array.from(new Set([...p.vistos, ...ids])) }));
  },
};
