'use client';

import { useSyncExternalStore } from 'react';

const formato = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Belem' });

const assinar = () => () => {};
const lerHoje = () => formato.format(new Date());
const noServidor = () => null;

/**
 * Data de hoje (AAAA-MM-DD) no fuso de Belém, lida no navegador.
 * Devolve `null` na renderização do servidor, evitando datas "congeladas"
 * no HTML gerado durante o build.
 */
export function useHoje(): string | null {
  return useSyncExternalStore(assinar, lerHoje, noServidor);
}
