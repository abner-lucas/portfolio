/**
 * Cortina de abertura: mostra a assinatura e uma barra de progresso, depois
 * se recolhe para cima revelando a página. Funciona só com CSS (veja
 * `.carregamento` em globals.css), aparece apenas na primeira visita da
 * sessão e é ignorada por leitores de tela.
 */
export function Carregamento() {
  return (
    <div
      aria-hidden
      className="carregamento no-palco grao fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-palco text-palco-tinta"
    >
      <p className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
        ábner<span className="text-lima">.</span>lucas
      </p>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-palco-suave">
        ensinar · pesquisar · criar
      </p>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-palco-borda">
        <div className="carregamento-barra h-full w-full rounded-full bg-lima" />
      </div>
    </div>
  );
}
