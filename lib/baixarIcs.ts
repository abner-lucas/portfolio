import type { EventoCalendario } from './tipos';
import { gerarIcs } from './regras';

/** Gera e baixa um arquivo .ics com os eventos (somente no navegador). */
export function baixarIcs(eventos: EventoCalendario[], nomeArquivo: string) {
  const carimbo = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const blob = new Blob([gerarIcs(eventos, carimbo)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: nomeArquivo });
  link.click();
  URL.revokeObjectURL(url);
}
