import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ordenarAvisos,
  filtrarAvisos,
  avisosNaoLidos,
  proximosEventos,
  diasAte,
  formatarData,
  gerarIcs,
  projetar,
  prisma,
  piramide,
  euler,
  amostraEeg,
  epocaPerceptron,
  preverPerceptron,
  PORTAS,
  pistaPadrao,
  poseInicial,
  lerSensores,
  erroDaLinha,
  passoSeguidor,
  pontoMaisProximo,
  type GanhosPd,
} from './regras.ts';
import type { Aviso, EventoCalendario } from './tipos.ts';

const avisos: Aviso[] = [
  { id: 'a', titulo: 'Antigo', texto: '', disciplina: 'web', data: '2026-09-01' },
  { id: 'b', titulo: 'Recente', texto: '', disciplina: 'cg', data: '2026-10-20' },
  { id: 'c', titulo: 'Fixado', texto: '', disciplina: 'geral', data: '2026-08-01', fixado: true },
];

test('avisos: fixados primeiro e depois por data decrescente', () => {
  assert.deepEqual(ordenarAvisos(avisos).map((a) => a.id), ['c', 'b', 'a']);
});

test('avisos: filtro por disciplina inclui avisos gerais', () => {
  assert.deepEqual(filtrarAvisos(avisos, 'web').map((a) => a.id), ['c', 'a']);
  assert.equal(filtrarAvisos(avisos, 'todas').length, 3);
});

test('avisos: não lidos consideram só turmas acompanhadas', () => {
  assert.deepEqual(avisosNaoLidos(avisos, [], []), []);
  assert.deepEqual(avisosNaoLidos(avisos, ['cg'], ['c']).map((a) => a.id), ['b']);
});

test('calendário: próximos eventos em ordem e com limite', () => {
  const eventos: EventoCalendario[] = [
    { id: '1', titulo: 'B', data: '2026-12-01', tipo: 'evento' },
    { id: '2', titulo: 'A', data: '2026-11-01', tipo: 'evento' },
    { id: '3', titulo: 'Passado', data: '2026-01-01', tipo: 'evento' },
  ];
  assert.deepEqual(proximosEventos(eventos, '2026-10-25').map((e) => e.id), ['2', '1']);
  assert.equal(proximosEventos(eventos, '2026-10-25', 1).length, 1);
});

test('calendário: diferença de dias e formatação', () => {
  assert.equal(diasAte('2026-10-25', '2026-11-01'), 7);
  assert.equal(diasAte('2026-10-25', '2026-10-25'), 0);
  assert.equal(formatarData('2026-11-02'), '02 nov 2026');
});

test('calendário: .ics válido com evento de dia inteiro', () => {
  const ics = gerarIcs(
    [{ id: 'x', titulo: 'Prova, final', data: '2026-12-31', tipo: 'avaliacao' }],
    '20261025T000000Z',
  );
  assert.match(ics, /^BEGIN:VCALENDAR/);
  assert.match(ics, /DTSTART;VALUE=DATE:20261231/);
  assert.match(ics, /DTEND;VALUE=DATE:20270101/);
  assert.match(ics, /SUMMARY:Prova\\, final/);
});

test('3D: projeção sem rotação mantém a origem', () => {
  const p = projetar({ x: 0, y: 0, z: 0 }, 0, 0, 1, 100, 50);
  assert.equal(p.x, 100);
  assert.equal(p.y, 50);
});

test('3D: sólidos respeitam a relação de Euler (V − A + F = 2)', () => {
  for (const s of [prisma(3), prisma(4), prisma(6), piramide(4), piramide(5)]) {
    const { v, a, f } = euler(s);
    assert.equal(v - a + f, 2);
  }
  assert.deepEqual(euler(prisma(4)), { v: 8, a: 12, f: 6 });
});

test('EEG: amostras finitas e limitadas', () => {
  for (let t = 0; t < 2; t += 0.01) {
    const v = amostraEeg(t, 'todas', 0.2);
    assert.ok(Number.isFinite(v) && Math.abs(v) < 3);
  }
});

test('perceptron: aprende a porta E e a porta OU', () => {
  for (const porta of [PORTAS.E, PORTAS.OU]) {
    let pesos = { w1: 0, w2: 0, b: 0 };
    for (let i = 0; i < 50; i++) pesos = epocaPerceptron(pesos, porta).pesos;
    for (const e of porta) assert.equal(preverPerceptron(pesos, e.x, e.y), e.alvo);
  }
});

/** Simula o seguidor de linha e devolve a maior distância até a pista e as voltas completadas. */
function simular(ganhos: GanhosPd, velocidade: number, segundos: number) {
  const pista = pistaPadrao();
  const dt = 1 / 120;
  let robo = poseInicial(pista);
  let erroAnterior = 0;
  let maior = 0;
  let avanco = 0;
  let anterior = 0;
  for (let i = 0; i < segundos / dt; i++) {
    const erro = erroDaLinha(lerSensores(robo, pista), erroAnterior);
    robo = passoSeguidor(robo, erro, erroAnterior, ganhos, velocidade, dt);
    erroAnterior = erro;
    const { distancia, indice } = pontoMaisProximo(robo, pista);
    maior = Math.max(maior, distancia);
    let passo = indice - anterior;
    if (passo < -pista.length / 2) passo += pista.length;
    if (passo > pista.length / 2) passo -= pista.length;
    avanco += passo;
    anterior = indice;
  }
  return { maior, voltas: avanco / pistaPadrao().length };
}

test('seguidor de linha: erro pondera sensores e lembra o último lado', () => {
  assert.equal(erroDaLinha([false, false, true, false, false], 0), 0);
  assert.equal(erroDaLinha([false, false, false, true, true], 0), 1.5);
  assert.equal(erroDaLinha([false, false, false, false, false], -1), -3);
});

test('seguidor de linha: com PD ajustado completa voltas sem sair da pista', () => {
  const { maior, voltas } = simular({ kp: 0.1, kd: 0.001 }, 0.3, 20);
  assert.ok(maior < 0.04, `afastou ${maior}`);
  assert.ok(voltas > 1.5, `voltas ${voltas}`);
});

test('seguidor de linha: sem controle proporcional o robô sai da pista', () => {
  const { maior } = simular({ kp: 0, kd: 0 }, 0.3, 10);
  assert.ok(maior > 0.1);
});
