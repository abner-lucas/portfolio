import type { Metadata } from 'next';
import { perfil, numeros } from '@/conteudo/perfil';
import { imagem } from '@/lib/midia';
import { numeroDe } from '@/lib/paginas';
import { CabecalhoPagina } from '@/componentes/layout/CabecalhoPagina';
import { ProximaPagina } from '@/componentes/layout/ProximaPagina';
import { Sobre } from '@/componentes/secoes/Sobre';
import { LinhaDoTempo } from '@/componentes/secoes/LinhaDoTempo';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Formação e trajetória do Prof. Me. Ábner Lucas, professor EBTT do IFPA Campus Breves.',
};

export default function PaginaSobre() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Trajetória"
        numero={numeroDe('/sobre')}
        titulo="Da sala de aula"
        destaque="ao laboratório."
        descricao={`${perfil.cargo}, ${perfil.instituicao} · ${perfil.campus}.`}
        trilha={[{ rotulo: 'Sobre' }]}
        numeros={[
          { valor: new Date().getFullYear() - numeros.desde, rotulo: 'anos de docência' },
          { valor: perfil.formacao.length, rotulo: 'formações' },
        ]}
      />
      <Sobre perfil={perfil} retrato={imagem('professor')} numero={1} />
      <LinhaDoTempo marcos={perfil.trajetoria} numero={2} />
      <ProximaPagina atual="/sobre" />
    </>
  );
}
