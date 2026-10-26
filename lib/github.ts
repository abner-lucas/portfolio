import 'server-only';
import type { Subapp } from './tipos';

/**
 * Integração com a API pública do GitHub.
 *
 * Roda apenas no servidor. O resultado fica em cache por 24h e a página é
 * regerada sozinha uma vez por dia (veja `revalidate` em `app/page.tsx`). Se a
 * API falhar ou atingir o limite, o site continua com os dados de `conteudo/`.
 *
 * Opcional: defina `GITHUB_TOKEN` no ambiente para aumentar o limite.
 */

interface RepositorioApi {
  name: string;
  stargazers_count: number;
  pushed_at: string;
  homepage: string | null;
  fork: boolean;
}

async function buscarRepositorios(usuario: string): Promise<RepositorioApi[] | null> {
  try {
    const resposta = await fetch(
      `https://api.github.com/users/${usuario}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!resposta.ok) return null;
    return (await resposta.json()) as RepositorioApi[];
  } catch {
    return null;
  }
}

export interface DadosGithub {
  subapps: Subapp[];
  /** Repositórios próprios (sem forks); `null` se a API não respondeu. */
  totalRepositorios: number | null;
}

/** Completa os subapps com estrelas, última atualização e link de demonstração. */
export async function carregarDadosGithub(usuario: string, subapps: Subapp[]): Promise<DadosGithub> {
  const repositorios = await buscarRepositorios(usuario);
  if (!repositorios) return { subapps, totalRepositorios: null };

  const porNome = new Map(repositorios.map((r) => [r.name.toLowerCase(), r]));
  return {
    totalRepositorios: repositorios.filter((r) => !r.fork).length,
    subapps: subapps.map((s) => {
      const r = porNome.get(s.repositorio.toLowerCase());
      if (!r) return s;
      return {
        ...s,
        estrelas: r.stargazers_count,
        atualizadoEm: r.pushed_at.slice(0, 10),
        demo: s.demo ?? (r.homepage || undefined),
      };
    }),
  };
}
