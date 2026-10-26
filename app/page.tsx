import { perfil, numeros } from '@/conteudo/perfil';
import { disciplinas } from '@/conteudo/disciplinas';
import { trabalhos } from '@/conteudo/pesquisa';
import { avisos } from '@/conteudo/avisos';
import { eventos } from '@/conteudo/calendario';
import { destaques, atalhos } from '@/conteudo/destaques';
import { carregarSubapps } from '@/lib/dados';
import { imagem, video } from '@/lib/midia';
import { formatarData, ordenarAvisos } from '@/lib/regras';

import { IndicadorSecoes } from '@/componentes/layout/Progresso';
import { Abertura } from '@/componentes/secoes/Abertura';
import { Faixa } from '@/componentes/secoes/Faixa';
import { Sobre } from '@/componentes/secoes/Sobre';
import { Portais } from '@/componentes/secoes/Portais';
import { Destaques } from '@/componentes/secoes/Destaques';
import { Contato } from '@/componentes/secoes/Contato';

/** Regera a página (consulta o GitHub e as mídias de novo) no máximo uma vez por dia. */
export const revalidate = 86400;

const SECOES = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'sobre', rotulo: 'Quem sou' },
  { id: 'explore', rotulo: 'Explore' },
  { id: 'destaques', rotulo: 'Destaques' },
  { id: 'contato', rotulo: 'Contato' },
];

/**
 * Página inicial: conceitual e curta. Apresenta o professor, abre o mapa das
 * demais páginas e mostra só o que está acontecendo agora.
 */
export default async function Inicio() {
  const { subapps, totalRepositorios } = await carregarSubapps();
  const retrato = imagem('professor');
  const resumoDisciplinas = disciplinas.map(({ id, nome, tom }) => ({ id, nome, tom }));
  const ultimo = ordenarAvisos(avisos.filter((a) => !a.fixado))[0];
  const emAndamento = trabalhos.find((t) => t.emAndamento && t.categoria === 'Projeto de pesquisa') ?? trabalhos[0];

  return (
    <>
      <IndicadorSecoes secoes={SECOES} />
      <Abertura
        nome={perfil.nomeCurto}
        campus={perfil.campus}
        chamada={perfil.chamada}
        retrato={retrato}
        video={video('abertura')}
        numeros={[
          { valor: new Date().getFullYear() - numeros.desde, sufixo: '', rotulo: `anos de docência (desde ${numeros.desde})` },
          { valor: numeros.turmas, sufixo: '', rotulo: 'turmas no SIGAA' },
          { valor: totalRepositorios ?? numeros.repositoriosPadrao, sufixo: '', rotulo: 'repositórios abertos' },
          { valor: subapps.length, sufixo: '', rotulo: 'subapps educacionais' },
        ]}
      />
      <Faixa />
      <Sobre perfil={perfil} retrato={retrato} resumo numero={1} />
      <Portais
        numero={2}
        resumo={{
          disciplinas: resumoDisciplinas,
          capas: subapps.map((s) => s.capaUrl).filter((c): c is string => !!c),
          totalSubapps: subapps.length,
          pesquisaAtual: emAndamento.titulo,
          totalTrabalhos: trabalhos.length,
          retrato,
          sobre: ['Mestre em Ciência da Computação', `Professor no IFPA desde ${numeros.desde}`],
          totalMarcos: perfil.trajetoria.length,
          ultimoAviso: ultimo ? { titulo: ultimo.titulo, data: formatarData(ultimo.data) } : null,
          totalAvisos: avisos.length,
        }}
      />
      <Destaques
        numero={3}
        destaques={destaques}
        capaPrincipal={imagem('destaque-principal') ?? subapps[0]?.capaUrl ?? null}
        avisos={avisos}
        eventos={eventos}
        disciplinas={resumoDisciplinas}
        atalhos={atalhos}
      />
      <Contato email={perfil.email} ilustracao={imagem('contato')} />
    </>
  );
}
