import type { Metadata } from 'next';
import { perfil, numeros } from '@/conteudo/perfil';
import { disciplinas } from '@/conteudo/disciplinas';
import { numeroDe } from '@/lib/paginas';
import { CabecalhoPagina } from '@/componentes/layout/CabecalhoPagina';
import { ProximaPagina } from '@/componentes/layout/ProximaPagina';
import { Disciplinas } from '@/componentes/secoes/Disciplinas';

export const metadata: Metadata = {
  title: 'Disciplinas',
  description: 'Disciplinas do Prof. Ábner Lucas no IFPA Campus Breves: planos de aula, materiais e avisos de cada turma.',
};

export default function PaginaDisciplinas() {
  const comMaterial = disciplinas.filter((d) => d.materiais.length > 0).length;
  return (
    <>
      <CabecalhoPagina
        rotulo="Sala de aula"
        numero={numeroDe('/disciplinas')}
        titulo="Disciplinas que"
        destaque="estou ministrando."
        descricao="Escolha uma disciplina para abrir a página dela, com plano de aulas, materiais e os avisos da turma."
        trilha={[{ rotulo: 'Disciplinas' }]}
        numeros={[
          { valor: disciplinas.length, rotulo: 'em oferta' },
          { valor: comMaterial, rotulo: 'com materiais online' },
        ]}
      />
      <Disciplinas
        semCabecalho
        disciplinas={disciplinas}
        totalTurmas={numeros.turmas}
        linkHistorico={`https://sigaa.ifpa.edu.br/sigaa/public/docente/disciplinas.jsf?siape=${perfil.siape}`}
      />
      <ProximaPagina atual="/disciplinas" />
    </>
  );
}
