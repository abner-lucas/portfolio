import type { Metadata } from 'next';
import { perfil } from '@/conteudo/perfil';
import { trabalhos } from '@/conteudo/pesquisa';
import { numeroDe } from '@/lib/paginas';
import { CabecalhoPagina } from '@/componentes/layout/CabecalhoPagina';
import { ProximaPagina } from '@/componentes/layout/ProximaPagina';
import { Pesquisa } from '@/componentes/secoes/Pesquisa';
import { BotaoLink } from '@/componentes/ui/Botao';

export const metadata: Metadata = {
  title: 'Pesquisa',
  description: 'Projetos de pesquisa, publicações, pesquisas abertas, orientações de TCC e extensão do Prof. Ábner Lucas.',
};

export default function PaginaPesquisa() {
  const andamento = trabalhos.filter((t) => t.emAndamento).length;
  return (
    <>
      <CabecalhoPagina
        rotulo="Pesquisa & produção"
        numero={numeroDe('/pesquisa')}
        titulo="Ciência feita"
        destaque="no Marajó."
        descricao="Inteligência computacional aplicada a problemas reais: robôs que sentem, pensam e agem, sinais cerebrais, visão computacional na cadeia do açaí, chatbots para a comunidade e sensores no campo."
        trilha={[{ rotulo: 'Pesquisa' }]}
        numeros={[
          { valor: trabalhos.length, rotulo: 'trabalhos' },
          { valor: andamento, rotulo: 'em andamento' },
        ]}
      />
      <section aria-label="Linhas de pesquisa" className="px-3 pt-10 sm:px-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-2">
            {perfil.areas.map((a) => (
              <li key={a} className="rounded-full border border-borda px-3 py-1 text-sm">
                {a}
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 flex-wrap gap-3">
            <BotaoLink href={perfil.redes.lattes} seta>
              Currículo Lattes
            </BotaoLink>
            <BotaoLink href={perfil.redes.orcid} variante="contorno">
              ORCID
            </BotaoLink>
          </div>
        </div>
      </section>
      <Pesquisa semCabecalho trabalhos={trabalhos} areas={perfil.areas} lattes={perfil.redes.lattes} orcid={perfil.redes.orcid} />
      <ProximaPagina atual="/pesquisa" />
    </>
  );
}
