import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variante = 'marca' | 'lima' | 'contorno' | 'contorno-palco' | 'suave';

const estilos: Record<Variante, string> = {
  marca: 'bg-marca text-sobre-marca hover:bg-marca-forte',
  lima: 'bg-lima text-[#0c1a15] hover:bg-[#d8f77f]',
  contorno: 'border border-borda bg-superficie text-tinta hover:border-tinta/40',
  'contorno-palco': 'border border-palco-borda text-palco-tinta hover:border-lima/60 hover:text-lima',
  suave: 'bg-superficie-2 text-tinta hover:bg-borda',
};

interface BaseProps {
  variante?: Variante;
  /** Mostra o círculo com seta no fim (padrão dos links de ação). */
  seta?: boolean;
  icone?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const base =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full pl-5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

function Conteudo({ icone, seta, children }: Pick<BaseProps, 'icone' | 'seta' | 'children'>) {
  return (
    <>
      {icone}
      <span>{children}</span>
      {seta ? (
        <span
          aria-hidden
          className="ml-1 grid size-8 place-items-center rounded-full bg-current/10 transition-transform duration-300 group-hover:rotate-45"
        >
          <ArrowUpRight className="size-4" />
        </span>
      ) : null}
    </>
  );
}

export function BotaoLink({
  href,
  variante = 'marca',
  seta,
  icone,
  className,
  children,
  externo,
  ...resto
}: BaseProps & { href: string; externo?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>) {
  const ehExterno = externo ?? /^https?:/.test(href);
  if (!ehExterno && href.startsWith('/')) {
    return (
      <Link href={href} className={cn(base, seta ? 'pr-1.5' : 'pr-5', estilos[variante], className)} {...resto}>
        <Conteudo icone={icone} seta={seta}>
          {children}
        </Conteudo>
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...(ehExterno ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(base, seta ? 'pr-1.5' : 'pr-5', estilos[variante], className)}
      {...resto}
    >
      <Conteudo icone={icone} seta={seta}>
        {children}
      </Conteudo>
      {ehExterno && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}

export function Botao({
  variante = 'marca',
  seta,
  icone,
  className,
  children,
  type = 'button',
  ...resto
}: BaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type={type}
      className={cn(base, seta ? 'pr-1.5' : 'pr-5', estilos[variante], className)}
      {...resto}
    >
      <Conteudo icone={icone} seta={seta}>
        {children}
      </Conteudo>
    </button>
  );
}

/** Círculo com seta usado nos cartões e linhas clicáveis. */
export function SetaCirculo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-full border border-current/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-marca group-hover:text-sobre-marca',
        className,
      )}
    >
      <ArrowUpRight className="size-5" />
    </span>
  );
}
