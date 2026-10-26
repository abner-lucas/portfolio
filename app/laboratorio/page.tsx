import type { Metadata } from 'next';
import { usuarioGithub } from '@/conteudo/perfil';
import { carregarSubapps } from '@/lib/dados';
import { numeroDe } from '@/lib/paginas';
import { CabecalhoPagina } from '@/componentes/layout/CabecalhoPagina';
import { ProximaPagina } from '@/componentes/layout/ProximaPagina';
import { Laboratorio } from '@/componentes/secoes/Laboratorio';
import { Experimente } from '@/componentes/secoes/Experimente';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Laboratório',
  description: 'Subapps educacionais e experimentos interativos: robô seguidor de linha, sólidos 3D, perceptron e ondas cerebrais.',
};

export default async function PaginaLaboratorio() {
  const { subapps, totalRepositorios } = await carregarSubapps();
  return (
    <>
      <CabecalhoPagina
        rotulo="Laboratório aberto"
        numero={numeroDe('/laboratorio')}
        titulo="Tecnologia para"
        destaque="tocar e testar."
        descricao="Plataformas que desenvolvo para as aulas, a pesquisa e a extensão, e experimentos que rodam ao vivo no seu navegador."
        trilha={[{ rotulo: 'Laboratório' }]}
        numeros={[
          { valor: subapps.length, rotulo: 'subapps' },
          { valor: 4, rotulo: 'experimentos ao vivo' },
          ...(totalRepositorios ? [{ valor: totalRepositorios, rotulo: 'repositórios abertos' }] : []),
        ]}
      />
      <Experimente numero={1} />
      <Laboratorio subapps={subapps} usuarioGithub={usuarioGithub} numero={2} />
      <ProximaPagina atual="/laboratorio" />
    </>
  );
}
