import type { Metadata } from 'next';
import { disciplinas } from '@/conteudo/disciplinas';
import { avisos } from '@/conteudo/avisos';
import { eventos, calendarioOficial, linkCalendarioOficial } from '@/conteudo/calendario';
import { numeroDe } from '@/lib/paginas';
import { CabecalhoPagina } from '@/componentes/layout/CabecalhoPagina';
import { ProximaPagina } from '@/componentes/layout/ProximaPagina';
import { Mural } from '@/componentes/secoes/Mural';

export const metadata: Metadata = {
  title: 'Mural',
  description: 'Avisos das turmas e próximas datas do semestre, com calendário para baixar.',
};

export default function PaginaMural() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Mural da turma"
        numero={numeroDe('/mural')}
        titulo="Avisos e datas"
        destaque="do semestre."
        descricao="Filtre pela sua disciplina. Se você acompanha a turma, os avisos novos ganham um selo até serem lidos — tudo fica salvo só no seu navegador."
        trilha={[{ rotulo: 'Mural' }]}
        numeros={[
          { valor: avisos.length, rotulo: 'avisos' },
          { valor: eventos.length, rotulo: 'datas no calendário' },
        ]}
      />
      <Mural
        semCabecalho
        avisos={avisos}
        disciplinas={disciplinas.map(({ id, nome, tom }) => ({ id, nome, tom }))}
        eventos={eventos}
        calendarioOficial={calendarioOficial}
        linkCalendario={linkCalendarioOficial}
      />
      <ProximaPagina atual="/mural" />
    </>
  );
}
