'use client';

import { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { Secao } from '@/componentes/ui/Secao';
import { BotaoLink } from '@/componentes/ui/Botao';
import { Revelar } from '@/componentes/ui/Revelar';

interface ContatoProps {
  email: string;
  ilustracao: string | null;
}

/** Faixa final de chamada para contato. */
export function Contato({ email, ilustracao }: ContatoProps) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      /* sem permissão de área de transferência: o link de e-mail continua disponível */
    }
  };

  return (
    <Secao id="contato" rotulo="Contato" divisor={false} className="pb-8 sm:pb-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#dff5ea,#eefad0_55%,#e0ecff)] p-6 sm:p-10 dark:bg-[linear-gradient(120deg,#0f2a20,#1c2a10_55%,#0f1f38)]">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {ilustracao && (
            <Revelar>
              <img src={ilustracao} alt="" loading="lazy" className="mx-auto w-full max-w-md" />
            </Revelar>
          )}
          <div>
            <Revelar>
              <p className="font-mao text-2xl text-marca">tem uma ideia? 💡</p>
              <h2 className="mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                Vamos construir algo <span className="text-marca">juntos!</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-tinta-suave">
                Quer orientação de TCC, iniciação científica, montar um robô ou levar um projeto de extensão para sua escola? Escreva —
                respondo pelo e-mail institucional.
              </p>
            </Revelar>
            <Revelar atraso={0.1} className="mt-8 flex flex-wrap items-center gap-3">
              <BotaoLink href={`mailto:${email}`} icone={<Mail className="size-4" />} seta externo={false}>
                {email}
              </BotaoLink>
              <button
                type="button"
                onClick={copiar}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-borda bg-superficie px-5 text-sm font-semibold transition hover:border-tinta/40"
              >
                {copiado ? <Check className="size-4 text-marca" /> : <Copy className="size-4" />}
                <span aria-live="polite">{copiado ? 'Copiado!' : 'Copiar e-mail'}</span>
              </button>
            </Revelar>
          </div>
        </div>
      </div>
    </Secao>
  );
}
