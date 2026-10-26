import 'server-only';
import { cache } from 'react';
import { usuarioGithub } from '@/conteudo/perfil';
import { subapps as subappsBase } from '@/conteudo/subapps';
import { carregarDadosGithub } from './github';
import { imagem } from './midia';

/**
 * Subapps completos (GitHub + capa resolvida), compartilhados pelas páginas.
 * `cache` evita consultar a API duas vezes na mesma renderização.
 */
export const carregarSubapps = cache(async () => {
  const github = await carregarDadosGithub(usuarioGithub, subappsBase);
  return {
    subapps: github.subapps.map((s) => ({ ...s, capaUrl: imagem(`projetos/${s.capa}`) })),
    totalRepositorios: github.totalRepositorios,
  };
});
