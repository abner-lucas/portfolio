import { ArrowUp, Github, GraduationCap, Linkedin, Mail, MapPin } from 'lucide-react';
import type { Perfil } from '@/lib/tipos';
import { Marca } from './Marca';
import { Robozinho } from '@/componentes/ui/Robotica';

export function Rodape({ perfil }: { perfil: Perfil }) {
  const redes = [
    { rotulo: 'GitHub', url: perfil.redes.github, Icone: Github },
    { rotulo: 'LinkedIn', url: perfil.redes.linkedin, Icone: Linkedin },
    { rotulo: 'Currículo Lattes', url: perfil.redes.lattes, Icone: GraduationCap },
  ];

  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="no-palco grao relative overflow-hidden rounded-[2rem] bg-palco px-6 py-10 text-palco-tinta sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 border-b border-palco-borda pb-8 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
            <div>
              <Marca noPalco className="text-3xl" />
              <p className="mt-2 text-sm text-palco-suave">
                {perfil.cargo} · IFPA {perfil.campus} · SIAPE {perfil.siape}
              </p>
            </div>
            <address className="space-y-2 text-sm not-italic text-palco-suave">
              <p className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-lima" /> {perfil.endereco}
              </p>
              <p className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-lima" />
                <a href={`mailto:${perfil.email}`} className="hover:text-lima">
                  {perfil.email}
                </a>
              </p>
            </address>
            <ul className="flex gap-2">
              {redes.map(({ rotulo, url, Icone }) => (
                <li key={rotulo}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${rotulo} (abre em nova aba)`}
                    className="grid size-12 place-items-center rounded-full border border-palco-borda transition hover:-translate-y-1 hover:border-lima hover:text-lima"
                  >
                    <Icone className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-palco-suave sm:flex-row">
            <p className="flex items-center gap-2">
              <Robozinho className="w-8 text-palco-tinta" />
              <span>
                © {new Date().getFullYear()} {perfil.titulo} ·{' '}
                <span className="font-mao text-base text-lima">sentir. pensar. agir.</span>
              </span>
            </p>
            <a href="#conteudo" className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 font-semibold hover:text-lima">
              Voltar ao topo <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
