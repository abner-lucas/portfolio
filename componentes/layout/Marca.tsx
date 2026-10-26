import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Assinatura "ábner.lucas" com o ponto piscando como cursor. */
export function Marca({ className, noPalco = false }: { className?: string; noPalco?: boolean }) {
  return (
    <Link
      href="/"
      className={cn('font-display text-xl font-extrabold tracking-tight', className)}
      aria-label="Ábner Lucas, página inicial"
    >
      ábner
      <span className={cn('inline-block animate-pulse', noPalco ? 'text-lima' : 'text-marca')}>.</span>
      lucas
    </Link>
  );
}
