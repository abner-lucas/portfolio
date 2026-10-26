import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Manrope, JetBrains_Mono, Caveat } from 'next/font/google';
import { Provedores } from '@/componentes/layout/Provedores';
import { Carregamento } from '@/componentes/layout/Carregamento';
import { BarraProgresso } from '@/componentes/layout/Progresso';
import { Cabecalho } from '@/componentes/layout/Cabecalho';
import { Rodape } from '@/componentes/layout/Rodape';
import { avisos } from '@/conteudo/avisos';
import { disciplinas } from '@/conteudo/disciplinas';
import { perfil } from '@/conteudo/perfil';
import './globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--fonte-display', display: 'swap' });
const texto = Manrope({ subsets: ['latin'], variable: '--fonte-texto', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--fonte-mono', display: 'swap' });
const mao = Caveat({ subsets: ['latin'], variable: '--fonte-mao', display: 'swap', weight: ['600', '700'] });

const titulo = `${perfil.titulo} · IFPA ${perfil.campus}`;
const descricao =
  'Disciplinas, materiais de aula, laboratórios interativos, pesquisas e avisos das turmas do Prof. Me. Ábner Lucas no IFPA Campus Breves.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://profabnerlucas.com'),
  title: { default: titulo, template: `%s · ${perfil.nomeCurto}` },
  description: descricao,
  authors: [{ name: perfil.nome, url: perfil.redes.github }],
  keywords: ['IFPA', 'Campus Breves', 'Computação Gráfica', 'Programação Web', 'Inteligência Computacional', 'Ábner Lucas'],
  openGraph: { title: titulo, description: descricao, type: 'website', locale: 'pt_BR' },
  twitter: { card: 'summary_large_image', title: titulo, description: descricao },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f5ef' },
    { media: '(prefers-color-scheme: dark)', color: '#070d0b' },
  ],
};

/**
 * Executado antes da primeira pintura: aplica o tema salvo (ou o do sistema)
 * e marca visitas repetidas na mesma sessão para pular a tela de carregamento.
 */
const scriptInicial = `(function(){try{var t=localStorage.getItem('tema');var e=t?t==='escuro':matchMedia('(prefers-color-scheme: dark)').matches;var h=document.documentElement;h.classList.toggle('dark',e);if(sessionStorage.getItem('visitado'))h.setAttribute('data-visitado','');sessionStorage.setItem('visitado','1')}catch(_){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${display.variable} ${texto.variable} ${mono.variable} ${mao.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptInicial }} />
      </head>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-marca focus:px-5 focus:py-3 focus:font-semibold focus:text-sobre-marca"
        >
          Pular para o conteúdo
        </a>
        <Provedores>
          <Carregamento />
          <BarraProgresso />
          <Cabecalho avisos={avisos} disciplinas={disciplinas.map(({ id, nome }) => ({ id, nome }))} />
          <main id="conteudo">{children}</main>
          <Rodape perfil={perfil} />
        </Provedores>
      </body>
    </html>
  );
}
