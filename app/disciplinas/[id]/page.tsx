import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { perfil } from '@/conteudo/perfil';
import { disciplinas } from '@/conteudo/disciplinas';
import { avisos } from '@/conteudo/avisos';
import { atalhos } from '@/conteudo/destaques';
import { DetalheDisciplina } from '@/componentes/secoes/Disciplinas';

/** Uma página por disciplina, gerada no build — o link pode ser compartilhado com a turma. */
export function generateStaticParams() {
  return disciplinas.map((d) => ({ id: d.id }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const d = disciplinas.find((x) => x.id === id);
  return d ? { title: d.nome, description: d.resumo } : {};
}

export default async function PaginaDisciplina({ params }: Props) {
  const { id } = await params;
  const i = disciplinas.findIndex((d) => d.id === id);
  if (i < 0) notFound();
  const d = disciplinas[i];
  const anterior = disciplinas[(i - 1 + disciplinas.length) % disciplinas.length];
  const proxima = disciplinas[(i + 1) % disciplinas.length];
  const linkSigaa = atalhos.find((a) => a.rotulo.includes('estudante'))?.url ?? perfil.redes.sigaa;

  return (
    <div className="px-3 pb-10 pt-24 sm:px-5 sm:pt-28">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/disciplinas"
          className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-tinta-suave transition hover:text-marca"
        >
          <ArrowLeft className="size-4" /> Todas as disciplinas
        </Link>
        <article className="overflow-hidden rounded-[2rem] border border-borda bg-superficie shadow-cartao">
          <DetalheDisciplina disciplina={d} avisos={avisos} linkSigaa={linkSigaa} />
        </article>

        <nav aria-label="Outras disciplinas" className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { d: anterior, rotulo: 'Anterior', Icone: ArrowLeft, alinhar: '' },
            { d: proxima, rotulo: 'Próxima', Icone: ArrowRight, alinhar: 'sm:text-right sm:flex-row-reverse' },
          ].map(({ d: outra, rotulo, Icone, alinhar }) => (
            <Link
              key={rotulo}
              href={`/disciplinas/${outra.id}`}
              className={`tom-${outra.tom} group flex items-center gap-4 rounded-3xl border border-borda bg-superficie p-5 transition hover:-translate-y-1 hover:border-tom/50 ${alinhar}`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-tom-suave text-tom transition group-hover:bg-tom group-hover:text-superficie">
                <Icone className="size-5" />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-tinta-suave">{rotulo}</span>
                <span className="block font-display text-lg font-bold leading-snug">{outra.nome}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
