import { ImageResponse } from 'next/og';
import { perfil } from '@/conteudo/perfil';

/** Imagem de compartilhamento (WhatsApp, LinkedIn…) gerada no build. */
export const alt = `${perfil.titulo} · IFPA ${perfil.campus}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
/** Gerada uma vez no build; não muda entre visitas. */
export const dynamic = 'force-static';

export default function ImagemCompartilhamento() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(circle at 85% 10%, #1e4237, #0b1f19 60%)',
          color: '#eaf3ee',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 800 }}>
          ábner<span style={{ color: '#c8f05a' }}>.</span>lucas
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1 }}>Tecnologia que</div>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1.1 }}>
            se aprende&nbsp;<span style={{ color: '#c8f05a' }}>fazendo.</span>
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 30, color: '#a4bcb1' }}>
            {`${perfil.titulo} · Professor EBTT · IFPA ${perfil.campus}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 24 }}>
          {['Disciplinas', 'Laboratórios', 'Pesquisa', 'Mural'].map((t) => (
            <div key={t} style={{ display: 'flex', padding: '10px 22px', borderRadius: 999, border: '2px solid #1e4237' }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
