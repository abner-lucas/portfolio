/**
 * Regras puras (sem React, sem navegador) usadas pelas seções e pelos
 * componentes interativos. Por não terem efeitos colaterais, são testadas
 * em `regras.test.ts` com o executor nativo do Node (`npm test`).
 */
import type { Aviso, EventoCalendario } from './tipos.ts';

/* ------------------------------------------------------------------ */
/* Avisos                                                              */
/* ------------------------------------------------------------------ */

/** Ordena avisos: fixados primeiro, depois do mais recente ao mais antigo. */
export function ordenarAvisos(avisos: Aviso[]): Aviso[] {
  return [...avisos].sort((a, b) => {
    if (!!a.fixado !== !!b.fixado) return a.fixado ? -1 : 1;
    return b.data.localeCompare(a.data);
  });
}

/**
 * Filtra avisos por disciplina. Avisos `geral` aparecem em todos os filtros.
 * `'todas'` devolve tudo.
 */
export function filtrarAvisos(avisos: Aviso[], disciplina: string): Aviso[] {
  if (disciplina === 'todas') return ordenarAvisos(avisos);
  return ordenarAvisos(
    avisos.filter((a) => a.disciplina === disciplina || a.disciplina === 'geral'),
  );
}

/**
 * Avisos das turmas acompanhadas que ainda não foram vistos.
 * Sem turmas acompanhadas, nada é considerado "novo".
 */
export function avisosNaoLidos(
  avisos: Aviso[],
  acompanhadas: string[],
  vistos: string[],
): Aviso[] {
  if (acompanhadas.length === 0) return [];
  const lidos = new Set(vistos);
  return ordenarAvisos(
    avisos.filter(
      (a) =>
        (a.disciplina === 'geral' || acompanhadas.includes(a.disciplina)) &&
        !lidos.has(a.id),
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Calendário                                                          */
/* ------------------------------------------------------------------ */

/** Eventos a partir de `hoje` (inclusive), em ordem cronológica. */
export function proximosEventos(
  eventos: EventoCalendario[],
  hoje: string,
  limite = Infinity,
): EventoCalendario[] {
  return eventos
    .filter((e) => e.data >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, limite);
}

/** Dias inteiros entre duas datas ISO (positivo se `alvo` estiver no futuro). */
export function diasAte(hoje: string, alvo: string): number {
  const ms = Date.parse(`${alvo}T00:00:00Z`) - Date.parse(`${hoje}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "2026-11-02" → { dia: "02", mes: "nov", ano: "2026" } */
export function partesData(iso: string) {
  const [ano, mes, dia] = iso.split('-');
  return { dia, mes: MESES[Number(mes) - 1], ano };
}

/** "2026-11-02" → "02 nov 2026" */
export function formatarData(iso: string): string {
  const { dia, mes, ano } = partesData(iso);
  return `${dia} ${mes} ${ano}`;
}

function escaparIcs(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/**
 * Gera um arquivo iCalendar (.ics) com eventos de dia inteiro, aceito pelo
 * Google Agenda, Outlook e calendário do celular.
 */
export function gerarIcs(eventos: EventoCalendario[], carimbo: string): string {
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prof. Abner Lucas//Calendario IFPA//PT-BR',
    'CALSCALE:GREGORIAN',
  ];
  for (const e of eventos) {
    const inicio = e.data.replace(/-/g, '');
    const fim = new Date(Date.parse(`${e.data}T00:00:00Z`) + 86_400_000)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');
    linhas.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@abner-lucas`,
      `DTSTAMP:${carimbo}`,
      `DTSTART;VALUE=DATE:${inicio}`,
      `DTEND;VALUE=DATE:${fim}`,
      `SUMMARY:${escaparIcs(e.titulo)}`,
      ...(e.descricao ? [`DESCRIPTION:${escaparIcs(e.descricao)}`] : []),
      'END:VEVENT',
    );
  }
  linhas.push('END:VCALENDAR');
  return linhas.join('\r\n');
}

/* ------------------------------------------------------------------ */
/* Gráficos interativos                                                */
/* ------------------------------------------------------------------ */

export interface Ponto3D {
  x: number;
  y: number;
  z: number;
}

export interface Ponto2D {
  x: number;
  y: number;
  /** Profundidade após a rotação; maior = mais distante. */
  z: number;
}

/** Rotaciona em Y e depois em X (graus) e projeta em perspectiva suave. */
export function projetar(
  p: Ponto3D,
  anguloX: number,
  anguloY: number,
  escala: number,
  origemX: number,
  origemY: number,
  distancia = 600,
): Ponto2D {
  const rx = (anguloX * Math.PI) / 180;
  const ry = (anguloY * Math.PI) / 180;

  const x1 = p.x * Math.cos(ry) + p.z * Math.sin(ry);
  const z1 = -p.x * Math.sin(ry) + p.z * Math.cos(ry);
  const y2 = p.y * Math.cos(rx) - z1 * Math.sin(rx);
  const z2 = p.y * Math.sin(rx) + z1 * Math.cos(rx);

  const f = distancia / (distancia + z2);
  return { x: origemX + x1 * escala * f, y: origemY + y2 * escala * f, z: z2 };
}

export interface Solido {
  vertices: Ponto3D[];
  arestas: [number, number][];
  faces: number[][];
}

/** Prisma regular de `lados` lados (3 = triangular, 4 = cubo, 32 ≈ cilindro). */
export function prisma(lados: number, raio = 1, altura = 1.6): Solido {
  const vertices: Ponto3D[] = [];
  for (const y of [-altura / 2, altura / 2]) {
    for (let i = 0; i < lados; i++) {
      const a = (i / lados) * Math.PI * 2 + Math.PI / lados;
      vertices.push({ x: Math.cos(a) * raio, y, z: Math.sin(a) * raio });
    }
  }
  const arestas: [number, number][] = [];
  const faces: number[][] = [];
  for (let i = 0; i < lados; i++) {
    const j = (i + 1) % lados;
    arestas.push([i, j], [i + lados, j + lados], [i, i + lados]);
    faces.push([i, j, j + lados, i + lados]);
  }
  faces.push([...Array(lados).keys()], [...Array(lados).keys()].map((i) => i + lados));
  return { vertices, arestas, faces };
}

/** Pirâmide regular com base de `lados` lados (32 ≈ cone). */
export function piramide(lados: number, raio = 1, altura = 1.7): Solido {
  const vertices: Ponto3D[] = [{ x: 0, y: -altura / 2, z: 0 }];
  for (let i = 0; i < lados; i++) {
    const a = (i / lados) * Math.PI * 2 + Math.PI / lados;
    vertices.push({ x: Math.cos(a) * raio, y: altura / 2, z: Math.sin(a) * raio });
  }
  const arestas: [number, number][] = [];
  const faces: number[][] = [];
  for (let i = 1; i <= lados; i++) {
    const j = (i % lados) + 1;
    arestas.push([0, i], [i, j]);
    faces.push([0, i, j]);
  }
  faces.push([...Array(lados).keys()].map((i) => i + 1));
  return { vertices, arestas, faces };
}

/** Relação de Euler V − A + F para poliedros convexos (sempre 2). */
export function euler(s: Solido) {
  return { v: s.vertices.length, a: s.arestas.length, f: s.faces.length };
}

export type BandaEeg = 'delta' | 'teta' | 'alfa' | 'beta' | 'todas';

export const FREQUENCIAS_EEG: Record<Exclude<BandaEeg, 'todas'>, number> = {
  delta: 2.5,
  teta: 6,
  alfa: 10,
  beta: 22,
};

/** Amostra sintética e determinística de um sinal EEG em `t` segundos. */
export function amostraEeg(t: number, banda: BandaEeg, ruido = 0.1): number {
  const onda = (f: number) => Math.sin(2 * Math.PI * f * t);
  const componentes = {
    delta: onda(FREQUENCIAS_EEG.delta),
    teta: 0.8 * onda(FREQUENCIAS_EEG.teta),
    alfa: 1.2 * onda(FREQUENCIAS_EEG.alfa),
    beta: 0.5 * onda(FREQUENCIAS_EEG.beta),
  };
  const sinal =
    banda === 'todas'
      ? 0.4 * componentes.delta + 0.3 * componentes.teta + 0.8 * componentes.alfa + 0.3 * componentes.beta
      : componentes[banda];
  const pseudoRuido = (Math.sin(t * 1337.5) * 0.5 + Math.cos(t * 919.3) * 0.5) * ruido;
  return sinal + pseudoRuido;
}

/* ------------------------------------------------------------------ */
/* Perceptron                                                          */
/* ------------------------------------------------------------------ */

export interface Exemplo {
  x: number;
  y: number;
  /** Classe esperada: 0 ou 1. */
  alvo: 0 | 1;
}

export interface Pesos {
  w1: number;
  w2: number;
  b: number;
}

export function preverPerceptron(p: Pesos, x: number, y: number): 0 | 1 {
  return p.w1 * x + p.w2 * y + p.b >= 0 ? 1 : 0;
}

/** Uma época da regra de aprendizado do perceptron. Retorna pesos e erros. */
export function epocaPerceptron(
  p: Pesos,
  exemplos: Exemplo[],
  taxa = 0.1,
): { pesos: Pesos; erros: number } {
  let { w1, w2, b } = p;
  let erros = 0;
  for (const e of exemplos) {
    const erro = e.alvo - preverPerceptron({ w1, w2, b }, e.x, e.y);
    if (erro !== 0) {
      erros++;
      w1 += taxa * erro * e.x;
      w2 += taxa * erro * e.y;
      b += taxa * erro;
    }
  }
  return { pesos: { w1, w2, b }, erros };
}

/** Portas lógicas clássicas como conjuntos de treino. */
export const PORTAS: Record<'E' | 'OU' | 'NAO_E', Exemplo[]> = {
  E: [
    { x: 0, y: 0, alvo: 0 },
    { x: 0, y: 1, alvo: 0 },
    { x: 1, y: 0, alvo: 0 },
    { x: 1, y: 1, alvo: 1 },
  ],
  OU: [
    { x: 0, y: 0, alvo: 0 },
    { x: 0, y: 1, alvo: 1 },
    { x: 1, y: 0, alvo: 1 },
    { x: 1, y: 1, alvo: 1 },
  ],
  NAO_E: [
    { x: 0, y: 0, alvo: 1 },
    { x: 0, y: 1, alvo: 1 },
    { x: 1, y: 0, alvo: 1 },
    { x: 1, y: 1, alvo: 0 },
  ],
};


/* ------------------------------------------------------------------ */
/* Robô seguidor de linha (tração diferencial + controle PD)           */
/* ------------------------------------------------------------------ */

export interface Ponto {
  x: number;
  y: number;
}

/** Pose do robô no "tapete" (y cresce para baixo, como na tela). */
export interface Robo {
  x: number;
  y: number;
  /** Direção em radianos. */
  angulo: number;
}

export interface GanhosPd {
  kp: number;
  kd: number;
}

/** Tapete de 1,6 × 1,0 unidades (≈ metros). */
export const TAPETE = { largura: 1.6, altura: 1 };

/** Geometria do robô: distância entre rodas, barra de sensores e largura da faixa preta. */
export const GEOMETRIA = { eixo: 0.07, distSensores: 0.055, espacoSensores: 0.014, meiaLinha: 0.011 };

/** Posição lateral de cada sensor infravermelho (negativo = esquerda). */
export const SENSORES = [-2, -1, 0, 1, 2];

/** Pista fechada com curvas suaves e um "S", como nos tapetes de competição. */
export function pistaPadrao(pontos = 360): Ponto[] {
  const pista: Ponto[] = [];
  for (let i = 0; i < pontos; i++) {
    const t = (i / pontos) * Math.PI * 2;
    pista.push({
      x: 0.8 + 0.6 * Math.cos(t) + 0.05 * Math.cos(3 * t),
      y: 0.5 + 0.3 * Math.sin(t) + 0.09 * Math.sin(2 * t),
    });
  }
  return pista;
}

/** Distância de `p` até a pista e índice do trecho mais próximo. */
export function pontoMaisProximo(p: Ponto, pista: Ponto[]): { distancia: number; indice: number } {
  let distancia = Infinity;
  let indice = 0;
  for (let i = 0; i < pista.length; i++) {
    const a = pista[i];
    const b = pista[(i + 1) % pista.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
    const d = Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
    if (d < distancia) {
      distancia = d;
      indice = i;
    }
  }
  return { distancia, indice };
}

/** Pose inicial: sobre o começo da pista, apontando no sentido do percurso. */
export function poseInicial(pista: Ponto[]): Robo {
  const a = pista[0];
  const b = pista[3];
  return { x: a.x, y: a.y, angulo: Math.atan2(b.y - a.y, b.x - a.x) };
}

/** Onde cada sensor está no tapete, na frente do robô. */
export function posicoesSensores(r: Robo): Ponto[] {
  const fx = Math.cos(r.angulo);
  const fy = Math.sin(r.angulo);
  // Vetor "direita" do robô (com y para baixo, girar a frente 90° no sentido horário).
  const dx = -fy;
  const dy = fx;
  return SENSORES.map((o) => ({
    x: r.x + fx * GEOMETRIA.distSensores + dx * o * GEOMETRIA.espacoSensores,
    y: r.y + fy * GEOMETRIA.distSensores + dy * o * GEOMETRIA.espacoSensores,
  }));
}

/** `true` para cada sensor que está vendo a faixa preta. */
export function lerSensores(r: Robo, pista: Ponto[]): boolean[] {
  return posicoesSensores(r).map((s) => pontoMaisProximo(s, pista).distancia <= GEOMETRIA.meiaLinha);
}

/**
 * Erro de posição da linha: média das posições dos sensores ativos
 * (−2 = linha toda à esquerda, +2 = toda à direita). Sem nenhum sensor
 * ativo, o robô "lembra" de que lado viu a linha por último.
 */
export function erroDaLinha(leituras: boolean[], erroAnterior: number): number {
  const ativos = SENSORES.filter((_, i) => leituras[i]);
  if (ativos.length === 0) return erroAnterior >= 0 ? 3 : -3;
  return ativos.reduce((s, o) => s + o, 0) / ativos.length;
}

/**
 * Um passo de simulação: controle PD gera a diferença de velocidade entre
 * as rodas e a cinemática diferencial move o robô.
 */
export function passoSeguidor(
  r: Robo,
  erro: number,
  erroAnterior: number,
  ganhos: GanhosPd,
  velocidade: number,
  dt: number,
): Robo {
  const correcao = ganhos.kp * erro + ganhos.kd * ((erro - erroAnterior) / dt);
  const limite = velocidade * 1.6 + 0.1;
  const vEsq = Math.max(-limite, Math.min(limite, velocidade + correcao));
  const vDir = Math.max(-limite, Math.min(limite, velocidade - correcao));
  const v = (vEsq + vDir) / 2;
  const angulo = r.angulo + ((vEsq - vDir) / GEOMETRIA.eixo) * dt;
  return { x: r.x + v * Math.cos(angulo) * dt, y: r.y + v * Math.sin(angulo) * dt, angulo };
}
