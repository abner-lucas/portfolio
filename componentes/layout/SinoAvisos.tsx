'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, CheckCheck } from 'lucide-react';
import type { Aviso, Disciplina } from '@/lib/tipos';
import { avisosNaoLidos, formatarData } from '@/lib/regras';
import { acoesPreferencias, usePreferencias } from '@/estado/preferencias';

interface SinoAvisosProps {
  avisos: Aviso[];
  disciplinas: Pick<Disciplina, 'id' | 'nome'>[];
}

/** Notificações das turmas acompanhadas, guardadas no próprio navegador. */
export function SinoAvisos({ avisos, disciplinas }: SinoAvisosProps) {
  const acompanhadas = usePreferencias((p) => p.acompanhadas);
  const vistos = usePreferencias((p) => p.vistos);
  const [aberto, setAberto] = useState(false);
  const painelId = useId();
  const raiz = useRef<HTMLDivElement | null>(null);

  const novos = useMemo(() => avisosNaoLidos(avisos, acompanhadas, vistos), [avisos, acompanhadas, vistos]);
  const nomeDisciplina = (id: string) =>
    id === 'geral' ? 'Todas as turmas' : (disciplinas.find((d) => d.id === id)?.nome ?? id);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('pointerdown', fora);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto]);

  return (
    <div ref={raiz} className="relative">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-controls={painelId}
        aria-label={novos.length ? `Avisos: ${novos.length} novos` : 'Avisos das turmas'}
        className="relative grid size-11 place-items-center rounded-full text-tinta transition hover:bg-superficie-2"
      >
        <Bell className="size-5" />
        {novos.length > 0 && (
          <span className="absolute right-1.5 top-1.5 grid min-w-5 place-items-center rounded-full bg-coral px-1 font-mono text-[10px] font-bold leading-5 text-white">
            {novos.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            id={painelId}
            role="region"
            aria-label="Avisos das turmas acompanhadas"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-14 w-[min(22rem,calc(100vw-1.5rem))] origin-top-right rounded-3xl border border-borda bg-superficie p-2 shadow-cartao"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-display text-base font-bold">Avisos das suas turmas</p>
              {novos.length > 0 && (
                <button
                  type="button"
                  onClick={() => acoesPreferencias.marcarLidos(novos.map((a) => a.id))}
                  className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-xs font-semibold text-marca hover:bg-superficie-2"
                >
                  <CheckCheck className="size-4" /> Marcar lidos
                </button>
              )}
            </div>

            {acompanhadas.length === 0 ? (
              <p className="px-3 pb-3 text-sm text-tinta-suave">
                Você ainda não acompanha nenhuma turma.{' '}
                <Link href="/mural" onClick={() => setAberto(false)} className="font-semibold text-marca underline underline-offset-4">
                  Escolha suas disciplinas no mural
                </Link>{' '}
                para receber avisos aqui.
              </p>
            ) : novos.length === 0 ? (
              <p className="px-3 pb-3 text-sm text-tinta-suave">Tudo em dia! Nenhum aviso novo.</p>
            ) : (
              <ul className="max-h-80 space-y-1 overflow-y-auto">
                {novos.map((a) => (
                  <li key={a.id}>
                    <Link
                      href="/mural"
                      onClick={() => {
                        acoesPreferencias.marcarLidos([a.id]);
                        setAberto(false);
                      }}
                      className="block rounded-2xl px-3 py-2.5 transition hover:bg-superficie-2"
                    >
                      <span className="block font-mono text-[11px] text-tinta-suave">
                        {nomeDisciplina(a.disciplina)} · {formatarData(a.data)}
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold leading-snug">{a.titulo}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
