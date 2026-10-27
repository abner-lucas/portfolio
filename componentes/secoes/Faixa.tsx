import { Cog } from 'lucide-react';

const ITENS = [
  'Robótica',
  'Three.js',
  'Sensores',
  'Deep Learning',
  'RoboCup Junior',
  'Next.js',
  'Python',
  'MNE-Python',
  'WebGL',
  'Redes Neurais',
  'IoT',
  'Tinkercad',
  'Blender',
  'Git & GitHub',
];

/** Faixa infinita de tecnologias entre a abertura e o conteúdo. */
export function Faixa() {
  const lista = (oculta: boolean) => (
    <ul aria-hidden={oculta || undefined} className="flex shrink-0 items-center">
      {ITENS.map((item, i) => (
        <li key={item} className="flex items-center">
          <span
            className={`px-6 font-display text-3xl font-bold sm:text-5xl ${
              i % 2 ? 'text-transparent [-webkit-text-stroke:1.5px_var(--tinta-suave)]' : 'text-tinta'
            }`}
          >
            {item}
          </span>
          <Cog aria-hidden className="size-7 shrink-0 animate-[spin_8s_linear_infinite] text-marca" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="faixa relative overflow-hidden py-6 sm:py-9" aria-label="Tecnologias com que trabalho">
      <div className="faixa-trilho flex w-max">
        {lista(false)}
        {lista(true)}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-fundo to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-fundo to-transparent" />
    </div>
  );
}
