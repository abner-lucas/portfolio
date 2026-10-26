# Portfólio · Prof. Me. Ábner Lucas (IFPA Campus Breves)

Landing page no estilo portfólio, que também serve de portal de conteúdos para os estudantes: disciplinas com plano de aulas e materiais, subapps do GitHub, experimentos interativos, pesquisa, mural de avisos por turma e calendário.

Não há login nem painel de administração. Todo o conteúdo fica em arquivos TypeScript na pasta [`conteudo/`](conteudo/). Para atualizar o site, edite esses arquivos e publique de novo.

---

## Sumário

1. [Como rodar](#como-rodar)
2. [Como editar o conteúdo](#como-editar-o-conteúdo)
3. [Como trocar imagens e vídeos](#como-trocar-imagens-e-vídeos)
4. [Estrutura do projeto](#estrutura-do-projeto)
5. [Arquitetura](#arquitetura)
6. [Acessibilidade e desempenho](#acessibilidade-e-desempenho)
7. [Publicação](#publicação)

---

## Como rodar

Pré-requisito: **Node.js 20 ou mais recente** (os testes usam o executor nativo do Node 22.6+ com TypeScript).

```bash
npm install
npm run dev         # desenvolvimento em http://localhost:3000
```

| Comando             | O que faz                                                 |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento com recarga automática        |
| `npm run build`     | Build de produção                                         |
| `npm start`         | Serve o build de produção (como na Hostinger)             |
| `npm test`          | Testes das regras puras (`lib/regras.test.ts`)            |
| `npm run lint`      | ESLint                                                    |
| `npm run typecheck` | Verificação de tipos do TypeScript                        |

Variáveis de ambiente são opcionais. Veja [`.env.example`](.env.example):

- `APP_URL`: endereço público do site, usado nos links de compartilhamento (padrão: `https://profabnerlucas.com`).
- `GITHUB_TOKEN`: aumenta o limite de consultas à API do GitHub. Sem ele, o site funciona normalmente.

---

## Como editar o conteúdo

Tudo o que aparece na página vem destes arquivos:

| Arquivo                                                | Controla                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| [`conteudo/perfil.ts`](conteudo/perfil.ts)             | Nome, bio, formação, e-mail, endereço, redes e números da abertura         |
| [`conteudo/destaques.ts`](conteudo/destaques.ts)       | Cartões de **Em destaque** e atalhos de acesso rápido                      |
| [`conteudo/disciplinas.ts`](conteudo/disciplinas.ts)   | Disciplinas, com plano de aulas, materiais, ícone e cor                    |
| [`conteudo/subapps.ts`](conteudo/subapps.ts)           | Subapps do GitHub exibidos no **Laboratório**                              |
| [`conteudo/pesquisa.ts`](conteudo/pesquisa.ts)         | Projetos, publicações, pesquisas abertas, orientações e extensão           |
| [`conteudo/avisos.ts`](conteudo/avisos.ts)             | Mural de avisos por turma                                                 |
| [`conteudo/calendario.ts`](conteudo/calendario.ts)     | Datas do semestre                                                         |

O TypeScript valida cada item. Se faltar um campo obrigatório, `npm run build` aponta o erro antes da publicação.

### Exemplos rápidos

**Publicar um aviso para uma turma.** Use o `id` da disciplina, definido em `disciplinas.ts`:

```ts
// conteudo/avisos.ts
{
  id: '2026-11-prova-cg',
  titulo: 'Prova prática na próxima semana',
  texto: 'Tragam o projeto do Tinkercad salvo em .glb.',
  disciplina: 'computacao-grafica',   // ou 'geral' para todas as turmas
  data: '2026-11-03',
  fixado: true,                       // opcional: topo do mural e "Em destaque"
  link: { rotulo: 'Roteiro', url: 'https://...' },
},
```

Os estudantes que acompanham a disciplina veem o aviso no sino do cabeçalho até marcá-lo como lido.

**Adicionar um material a uma disciplina:**

```ts
// conteudo/disciplinas.ts → materiais da disciplina
{ titulo: 'Slides da aula 5', tipo: 'slides', url: 'https://...', descricao: 'Iluminação em Three.js' },
```

Os tipos aceitos são `portal`, `repositorio`, `apostila`, `slides`, `video` e `exercicio`.

**Datas oficiais do calendário.** Cadastre as datas em `eventos` e mude `calendarioOficial` para `true`. Isso remove o aviso de "datas ilustrativas".

**Escolher o que fica em destaque.** Reordene ou edite o vetor `destaques`. O primeiro item ocupa o cartão grande.

### Conteúdo que precisa da sua revisão

Os dados foram levantados no SIGAA público, no GitHub, no ORCID e nos portais das disciplinas. Confira estes pontos:

- **Avisos** (`avisos.ts`) são exemplos baseados nas atividades publicadas nos portais. Troque pelos comunicados reais.
- **Calendário**: só os feriados nacionais são reais. As outras datas são ilustrativas, e o site avisa isso enquanto `calendarioOficial = false`.
- **Disciplinas sem plano de aulas**: Estrutura de Dados, Redes, Eletrônica, Manutenção, Informática Básica, Metodologias Ativas e Lives. Elas mostram um atalho para o SIGAA até você preencher o plano. Os resumos e tópicos delas são descrições gerais.
- **Orientações de TCC**: vêm da seção "Produção intelectual" do SIGAA. Confirme que você foi o orientador de cada uma.
- O campo `curso` das disciplinas DE/BREVES está como "Campus Breves", porque o SIGAA não informa o curso.

---

## Como trocar imagens e vídeos

As mídias ficam em [`public/midia/`](public/midia/). Cada uma é procurada pelo **nome-base**, em qualquer formato. Para trocar uma imagem, basta **salvar o novo arquivo com o mesmo nome na mesma pasta** e gerar o build de novo.

| Arquivo (nome-base)              | Onde aparece                                       | Sugestão de tamanho |
| -------------------------------- | -------------------------------------------------- | ------------------- |
| `professor`                      | Foto da abertura e do "Sobre"                      | 800×800, quadrada   |
| `projetos/<capa>`                | Capa de cada subapp (campo `capa` em `subapps.ts`) | 1600×1000 (16:10)   |
| `destaque-principal` (opcional)  | Fundo do cartão grande de "Em destaque"            | 1600×1600           |
| `contato`                        | Ilustração da chamada final                        | 1080×800            |
| `abertura` (vídeo, opcional)     | Fundo animado da abertura, no lugar da rede neural | 1920×1080, mudo     |

- **Formatos de imagem aceitos**, nesta ordem de prioridade: `avif`, `webp`, `jpg`, `jpeg`, `png`, `gif`, `svg`. Por exemplo, salvar `projetos/geo3d.jpg` faz a foto substituir a capa `geo3d.svg` sem apagar nada.
- **Vídeo**: salve `public/midia/abertura.mp4` ou `.webm`. Ele toca mudo e em loop, e a rede neural animada sai de cena.
- As capas atuais são ilustrações vetoriais (SVG) geradas para este projeto. Podem ser editadas em qualquer editor vetorial.

A busca pelos arquivos acontece no servidor. Depois de trocar uma mídia, publique de novo (veja [Publicação](#publicação)).

---

## Estrutura do projeto

```
app/
  layout.tsx            Fontes, tema sem "piscada", metadados, cabeçalho/rodapé comuns
  template.tsx          Cortina de transição entre páginas
  page.tsx              Início: abertura, quem sou, mapa do site, destaques e contato
  disciplinas/          Lista de disciplinas e uma página por disciplina ([id])
  laboratorio/          Experimentos ao vivo e subapps
  pesquisa/  sobre/  mural/
  globals.css           Tokens de cor (claro/escuro), tipografia e animações base
  opengraph-image.tsx   Imagem de compartilhamento gerada no build
  icon.svg              Favicon
conteudo/               ← O que você edita no dia a dia
componentes/
  ui/                   Peças reutilizáveis: Secao, TituloSecao, Revelar, Botao, Dialogo, Contador,
                        Robotica (parafuso, trilha de circuito e o robozinho mascote)…
  layout/               Cabeçalho, sino de avisos, tema, carregamento, progresso, rodapé
  secoes/               Uma seção da página por arquivo
  interativos/          Gráficos em tempo real (canvas): SeguidorLinha, CampoNeural, Solido3D, Perceptron, OndaEeg
estado/
  preferencias.ts       Estado global do visitante (turmas acompanhadas, avisos lidos)
hooks/
  useQuadroAnimado.ts   Laço de animação de canvas (DPR, visibilidade, movimento reduzido)
  useSecaoAtiva.ts      Seção visível (menu e indicador lateral)
  useHoje.ts            Data de hoje no fuso de Belém
lib/
  tipos.ts              Tipos de todo o conteúdo
  paginas.ts            Mapa do site (ordem do menu, numeração, próxima página)
  dados.ts              Carregamento dos subapps com GitHub (servidor)
  regras.ts             Regras puras: filtros, calendário/.ics, projeção 3D, EEG, perceptron, seguidor de linha
  regras.test.ts        Testes (node:test)
  github.ts             Integração com a API do GitHub (servidor, com cache diário)
  midia.ts              Resolução das mídias substituíveis (servidor)
  baixarIcs.ts          Download do calendário .ics
public/midia/           Imagens e vídeos substituíveis
```

---

## Arquitetura

- **Next.js 15 (App Router) + React 19 + TypeScript estrito + Tailwind CSS v4 + Motion.**
- **Servidor e cliente separados.** `app/page.tsx` é um componente de servidor: lê `conteudo/`, consulta o GitHub e verifica quais mídias existem. A página fica em cache e é regerada uma vez por dia. As seções interativas são componentes de cliente e recebem só os dados de que precisam.
- **Integração com API externa.** [`lib/github.ts`](lib/github.ts) busca estrelas, data da última atualização e link de demonstração de cada subapp, além do total de repositórios. O resultado fica em cache por 24h. Se a API falhar, o site usa os dados locais sem quebrar.
- **Estado global enxuto.** [`estado/preferencias.ts`](estado/preferencias.ts) usa `useSyncExternalStore`: cada componente assina só o pedaço do estado que lê. O estado persiste no `localStorage` e sincroniza entre abas, sem login.
- **Gráficos em tempo real.** Os cinco canvas compartilham o hook `useQuadroAnimado`. Ele ajusta a densidade de pixels, pausa a animação quando o canvas sai da tela e respeita "reduzir movimento". A matemática (projeção 3D, Euler, perceptron, EEG e a física do seguidor de linha) fica em `lib/regras.ts` e é testada.
- **Robô seguidor de linha.** Simula a categoria Rescue Line da RoboCup Junior: cinco sensores infravermelhos, controle PD e tração diferencial, com Kp, Kd e velocidade ajustáveis, cronômetro de volta e robô arrastável. Os testes confirmam que, com os ganhos padrão, o robô completa voltas sem sair da linha e que, sem controle proporcional, ele sai.
- **Transições entre seções.** Cada seção usa `<Secao>`. Conforme ela sobe na tela, um recorte arredondado se abre até ocupar a largura toda e o conteúdo desliza para o lugar. O efeito acompanha a rolagem nos dois sentidos. Títulos entram palavra por palavra, e os cartões aparecem em cascata. A etiqueta de cada seção imita uma placa eletrônica: uma porca sextavada numerada "aperta" girando, uma trilha de circuito se desenha até a ilha de solda e o rótulo é digitado com cursor de terminal. Há ainda uma cortina de abertura (só na primeira visita da sessão), uma barra de progresso de leitura e um indicador lateral de seções.
- **Tema claro/escuro nativo.** O site segue o sistema por padrão e tem um botão para alternar, com transição circular via View Transitions API. A escolha fica salva, e um script aplica o tema antes da primeira pintura, então a tela não "pisca".

---

## Acessibilidade e desempenho

- HTML semântico, `lang="pt-BR"` e link "Pular para o conteúdo".
- Janelas modais com `<dialog>` nativo: o foco fica preso na janela, `Esc` fecha e o foco volta ao botão de origem.
- Abas navegáveis pelas setas do teclado, botões com `aria-pressed` e regiões `aria-live` nos filtros.
- Foco visível em todos os controles e alvos de toque com pelo menos 40–44px.
- Todas as animações respeitam `prefers-reduced-motion`.
- Contraste dos tokens dentro do nível AA nos dois temas.
- Canvas com descrição (`role="img"` + `aria-label`) e animação pausada fora da tela.
- Página pré-renderizada no servidor (regerada diariamente) e fontes auto-hospedadas pelo `next/font`.

---

## Publicação

O site roda como **aplicação Node.js (Next.js)** no plano Business da Hostinger, em `profabnerlucas.com`. A Hostinger instala as dependências, roda `npm run build` e inicia o servidor (`next start`). O destino está registrado em [`.hostinger/site.json`](.hostinger/site.json).

- A página é gerada no servidor e **regerada sozinha uma vez por dia** (`revalidate` em `app/page.tsx`): estrelas e datas do GitHub, além de mídias trocadas, se atualizam sem novo envio.
- Mudanças em `conteudo/`, nos componentes ou em `public/midia/` precisam de um novo deploy.

### Como publicar uma atualização

Pelo Claude Code, com o conector da Hostinger ativo: peça "publique o site". O deploy envia o código-fonte (sem `node_modules`, `.next` e arquivos `.env`) e a Hostinger faz o build. O andamento aparece em **hPanel → Websites → profabnerlucas.com → Node.js**.

Manualmente pelo hPanel: em **Websites → profabnerlucas.com → Node.js**, envie um `.zip` do código-fonte (sem `node_modules` e `.next`) com estas configurações:

| Campo              | Valor     |
| ------------------ | --------- |
| Framework          | Next.js   |
| Versão do Node     | 22        |
| Script de build    | `build`   |
| Diretório de saída | `.next`   |
| Gerenciador        | npm       |

Variáveis de ambiente opcionais (`APP_URL`, `GITHUB_TOKEN`) ficam na mesma tela, em **Variáveis de ambiente**.

### O que não vai para o servidor

| Arquivo/pasta                          | Por quê                                     |
| -------------------------------------- | ------------------------------------------- |
| `node_modules/`, `.next/`              | Gerados pela Hostinger no build             |
| `versao-anterior-ai-studio.zip`        | Backup local da versão do AI Studio         |
| `CLAUDE.local.md`, `.env*`             | Configurações locais                        |
| `lib/*.test.ts`                        | Testes, rodados só no seu computador        |
