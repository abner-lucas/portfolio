'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import type { Perfil } from '@/lib/tipos';
import { Secao } from '@/componentes/ui/Secao';
import { TituloSecao } from '@/componentes/ui/TituloSecao';
import { BotaoLink } from '@/componentes/ui/Botao';
import { Robozinho } from '@/componentes/ui/Robotica';
import { Revelar } from '@/componentes/ui/Revelar';

export function Sobre({ perfil, retrato, resumo = false, numero = 1 }: { perfil: Perfil; retrato: string | null; resumo?: boolean; numero?: number }) {
  const cartao = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: cartao, offset: ['start end', 'end start'] });
  const giro = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const sobe = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <Secao id="sobre" rotulo="Sobre">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* Cartão ilustrado */}
        <div ref={cartao} className="relative mx-auto w-full max-w-md">
          <motion.div
            style={{ rotate: giro }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-lima p-6 text-[#0c1a15] shadow-cartao"
          >
            <p className="relative z-10 -rotate-3 font-mao text-4xl font-bold leading-[0.95] sm:text-5xl">
              foco,
              <br />
              curiosidade
              <br />& código.
            </p>
            <Robozinho corpo="#ffffff" className="absolute right-5 top-6 w-20 rotate-6 text-[#0c1a15] sm:w-24" />
            <div className="absolute -bottom-6 -right-6 aspect-square w-[78%] overflow-hidden rounded-full border-[6px] border-[#0c1a15]">
              {retrato ? (
                <img src={retrato} alt="" loading="lazy" className="size-full scale-[1.13] object-cover grayscale-[15%]" />
              ) : (
                <div className="size-full bg-palco" />
              )}
            </div>
          </motion.div>
          <motion.p
            style={{ y: sobe }}
            className="absolute -left-4 bottom-16 rotate-[-8deg] rounded-2xl bg-palco px-4 py-3 font-mao text-2xl text-lima shadow-xl sm:-left-10"
          >
            professor desde 2015 ✦
          </motion.p>
        </div>

        <div>
          <TituloSecao rotulo="Sobre mim" numero={numero} titulo="Prazer, eu sou" destaque={perfil.nomeCurto + '.'} />
          <Revelar className="mt-6 space-y-4 text-lg leading-relaxed text-tinta-suave">
            {(resumo ? perfil.bio.slice(0, 2) : perfil.bio).map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </Revelar>

          {resumo ? (
            <Revelar className="mt-8 flex flex-wrap gap-3">
              <BotaoLink href="/sobre" seta>
                Minha trajetória
              </BotaoLink>
              <BotaoLink href="/pesquisa" variante="contorno">
                Pesquisa & produção
              </BotaoLink>
            </Revelar>
          ) : (
          <>
          <Revelar className="mt-8 flex flex-wrap gap-3">
            <BotaoLink href={perfil.redes.lattes} seta>
              Lattes
            </BotaoLink>
            <BotaoLink href={perfil.redes.sigaa} variante="contorno">
              Portal SIGAA
            </BotaoLink>
            <BotaoLink href={perfil.redes.linkedin} variante="contorno">
              LinkedIn
            </BotaoLink>
          </Revelar>
          </>
          )}
        </div>
      </div>
    </Secao>
  );
}
