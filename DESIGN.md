# Guia de estilo

Identidade visual do site de Vinicius Belo (portfólio e blog de análise de dados). Antes de mudar algo visual, leia este arquivo: ele registra o que foi decidido, por quê, e o que já foi tentado e deixado de lado.

## Conceito: a amostra que atravessa o site

O site é moderno e vivo, em tema escuro, com ar profissional. Toda a animação sai de **uma ideia só**: um conjunto de 96 pontos de exemplo (a "amostra"), gerado no navegador com semente fixa, que acompanha o visitante pela home e passa pelas etapas de uma análise.

1. **No topo, é um gráfico de dispersão compacto.** A legenda vem acima do gráfico, como a linha de fonte de um gráfico de jornal. O nome "Vinicius Belo" é o rótulo do eixo x: o eixo do gráfico fica logo acima do nome, e cada palavra do nome se apoia no seu próprio eixo com marcas sob as letras. A dispersão rola junto com o nome (fica num canvas no topo da página, não preso à tela). Com o mouse, os pontos perto do cursor abrem espaço, a mira mostra os valores x e y nos eixos e uma reta de mínimos quadrados é ajustada **aos pontos sob a mira**, com `n` e `r` calculados na hora.
2. **Rolando a página, os mesmos pontos mudam de forma** a cada etapa de "O caminho de uma análise": viram um ponto de interrogação (pergunta), uma tabela em que cada ponto é uma linha com duas células, x e y (dados); na limpeza as linhas fora do padrão saem inteiras, só com contorno, e as outras sobem para fechar a tabela sem buracos, voltam a ser dispersão com a reta da amostra limpa crescendo da esquerda para a direita (análise) e terminam empilhados num gráfico de barras de pontos, com a maior barra na cor de marca (comunicação).
3. **O nome é um histograma.** Com o mouse sobre o nome, cada letra cresce (até 25%) como uma barra segundo um núcleo gaussiano centrado no cursor (a ideia de uma estimativa de densidade) e muda para a cor da série.

Os números mostrados (`n`, `r`, x, y, `n = 0` no estado vazio) são sempre calculados do que está na tela. Cada etapa tem uma frase de medida (`data-medida`) preenchida pelo script com números da própria amostra: quantas linhas saíram e o `r` antes e depois da limpeza, `r` e inclinação da análise, qual barra é a maior e com quantos pontos. Sem JS, essa frase não aparece. Nenhum número fala do autor. A legenda do gráfico diz que os pontos são uma amostra de exemplo.

### Plano de tokens

**Cores** (em `src/styles/global.css`; contrastes sobre `--fundo`):

| Token | Hex | Papel | Contraste |
| --- | --- | --- | --- |
| `--fundo` | `#0f1f28` | Fundo: petróleo, com matiz declarado. Não é preto nem marinho. | |
| `--superficie` | `#162c37` | Cartões, linhas pares de tabela, código em linha, placa das etapas no celular. | |
| `--grade` | `#2c4a58` | Linhas de grade e bordas de cartão. **Nunca em texto.** | 1,8:1 |
| `--eixo` | `#5d7d8a` | Eixos do gráfico e do nome, marcas sob as letras, fio de tabela, citação e código, círculo das etapas. **Nunca em texto.** | 3,8:1 (passa 3:1 de elemento não textual) |
| `--texto` | `#e7ecea` | Todo o texto. | 14,1 fundo; 12,1 superfície |
| `--texto-suave` | `#9fb2bb` | Legenda do gráfico, datas, rodapé, contorno dos dados removidos. | 7,7 fundo; 6,6 superfície |
| `--ponto` | `var(--ponto-azul)` | Os dados: pontos, células, barras, número da etapa atual, letra sob o cursor. | |
| `--ponto-azul` | `#6cc4d4` | Série padrão. | 8,4 |
| `--ponto-lilas` | `#b3a3f5` | Série alternativa. | 7,6 |
| `--ponto-verde` | `#86d39b` | Série alternativa. | 9,5 |
| `--marca` | `#ecc76e` | O que se aciona ou se mede: links, foco, mira do cursor, reta ajustada, `n` e `r`, botão de contato, maior barra. | 10,4 |

Papéis separados: azul (ou a série escolhida) = dado; amarelo = ação ou medida; cinza-azulado = estrutura. O fundo sobre `--ponto` (número da etapa atual) passa de 7,6:1 nas três séries.

**Cor da série:** a legenda do gráfico da home é também um controle (três botões de opção: azul, lilás, verde). A escolha muda `--ponto` no site todo via `html[data-serie]` e fica no `localStorage`; um script inline no `<head>` aplica a cor antes da pintura (sem piscar). Sem JS, a legenda não aparece.

**Tipografia:**

- **Archivo Variable** (nome, títulos, navegação, rótulos do gráfico, legenda). O nome usa largura 125% e `--t-6`; títulos 112%; navegação e títulos de cartão 100%. Pesos: 500 navegação, 600 títulos de cartão e rótulos do canvas, 700 títulos e nome.
- **Literata Variable** (texto corrido, tamanho óptico automático, peso `--peso-texto: 420`, entrelinha 1.7). Mantida: a serifa de texto dá voz de relatório lido com calma e contrasta com a Archivo larga.
- **Números do gráfico** (x, y, `n`, `r`) em Archivo 600 com algarismos tabulares e vírgula decimal, contornados na cor do fundo para ficarem legíveis sobre os pontos. Mono só em código.
- Escala em quarta justa sobre 18px (`--t-0` 0.84rem, `--t-0-5` 0.975rem, `--t-1` 1.125rem, `--t-1-5` 1.3rem, `--t-2` 1.5rem, `--t-3` 2rem, `--t-4` 2.67rem) e `--t-6: clamp(2.9rem, 7.2vw, 5.4rem)` só para o nome (era até 7.1rem; encolheu para os projetos caberem na primeira tela). Em 360px o nome quebra em duas linhas, uma palavra por linha, cada uma no seu eixo.
- Preload: `Base.astro` pré-carrega `archivo-latin-wdth-normal.woff2` (o mesmo arquivo com hash que o CSS do `@fontsource` usa), para o nome não trocar de fonte depois de aparecer. Fontes self-hosted (sem requisição a terceiros, versões travadas).

**Forma:** `--raio: 6px` só em cartões, placa das etapas no celular e botão de contato. Sem sombras. Sem gradientes decorativos. `--traco: 2px` para eixos, fios e contornos.

### Layout

```
|<------------------- contêiner --pagina (72rem), centralizado ------------------->|
|                                               Projetos  Sobre  [ GitHub ]        |  cabeçalho na mesma coluna
|  Os pontos são uma amostra de exemplo...       Cor dos pontos (o) ( ) ( )        |  legenda acima do gráfico
|  |      .  .     . .  ..   .  .        .           .                            |
|  |  ..  . .  .. .  .   .       .   (dispersão, cerca de 10 a 12rem de altura)   |
|  |______________________________________________________________________        |  eixo x
|  Vinicius Belo                (h1, letras = barras)                              |
|  Estou entrando na área... Por enquanto, o contato é...                          |
|                                                                                  |
|  Projetos                                        (visível em 1280x800)           |
|  +-- destaque (3fr) ------------------+  +-- outro (2fr) -------------+          |
|  | Análise do e-commerce brasileiro...|  | Dashboard de salários...   |          |
|  | github.com/ViniciusBelo/...        |  | github.com/...             |          |
|  | (o) Concluído.                     |  | (o) Concluído.             |          |
|  | (células só se em andamento)       |  | descrição, perguntas,      |          |
|  | descrição, perguntas, ferramentas  |  | ferramentas                |          |
|  +------------------------------------+  +----------------------------+          |
|  O caminho de uma análise   (etapas à esquerda, amostra à direita)               |
|  Análises                                                                        |
```

Tudo vive numa coluna só: `--pagina` (72rem) centralizada, com `--margem` dentro, e tudo alinhado à esquerda dessa coluna (legenda, eixo y, nome, texto, títulos, cartões). Em tela larga sobra margem igual dos dois lados. O canvas ocupa a janela, mas o desenho fica preso às bordas do contêiner (`contE`/`contD` em `amostra.ts`, medidas da caixa de conteúdo de `.abertura`): o eixo y fica na margem esquerda, alinhado ao nome, e o valor de y da mira aparece logo à direita do eixo para não sair da coluna.

A abertura é compacta: legenda, `.grafico-area` (bloco vazio de `clamp(9.5rem, 24svh, 12.5rem)` que reserva a altura da dispersão; o script desenha entre o topo dele e o nome), nome e uma frase. Logo em seguida vem **Projetos**, o principal do site: em 1280x800 o título e o topo dos cartões, com a linha de progresso, aparecem na primeira tela. Depois, "O caminho de uma análise" e "Análises".

No fluxo, o gráfico fica à direita do texto, começando em `max(metade do contêiner, fim do texto + 32px)` e terminando na borda direita do contêiner, nunca mais alto que 3/4 da largura. Abaixo de 60rem (960px), o gráfico ocupa a metade de cima da tela e o texto de cada etapa passa por baixo numa placa (`--superficie`). A seção Projetos tem `data-estado="dispersao"`: rolando de volta do fluxo, os pontos voltam para a dispersão do topo.

### Projetos

- Content collection `projetos` (`src/content/projetos/*.md`, schema em `src/content.config.ts`): `title`, `description`, `repo`, `status` (`concluido` ou `em-andamento`), `ferramentas`, `ordem`, `destaque`, `date`, e os opcionais `etapas` (`{ nome, feita }`), `falta` e `draft`. O corpo do arquivo é a lista de perguntas do projeto. A `description` tem uma frase curta: o que é e com quais dados; detalhes ficam no README do repositório.
- Cartão (`src/components/ListaDeProjetos.astro`): título (link para o repositório que cobre o cartão), endereço do repositório em `--texto-suave`, status, descrição, perguntas (marcador = ponto da série, como um dado), ferramentas em frase. A grade acende sob o mouse (o mesmo cartão-plano das análises, agora em `global.css`, script em `src/scripts/grade.ts`); com teclado, o contorno amarelo vai no cartão inteiro.
- Hierarquia: o projeto com `destaque: true` fica na coluna larga (3fr contra 2fr), com título maior. Os cartões não são iguais de propósito.
- **Progresso honesto:** em andamento com `etapas`, uma linha de células, uma por etapa (no Olist, uma por notebook do repositório): cheia na cor da série = pronta, só contorno = falta. É a mesma linguagem das linhas da tabela na amostra (linha removida = contorno). Embaixo, a frase com os números ("Em andamento, 2 de 7 etapas prontas: ... Faltam ..."); as células são `aria-hidden` e a frase leva a informação. Não é ilustração: é o estado real do repositório; atualize `feita` quando cada notebook sair. Concluído: "Concluído." com um ponto cheio, sem células (testamos manter a linha toda cheia e foi descartado: com tudo pronto, as células viram uma barra de 100% que não informa nada, e o card fica mais longo).
- Hífen que não quebra (U+2011) entre letras nos títulos, para "e-commerce" não partir no celular.
- Navegação: "Projetos" (âncora `/#projetos`) aparece quando há algum projeto.

### Princípios

1. **Todo movimento é uma operação com dados.** Dispersão, ajuste de reta, núcleo gaussiano, tabela, limpeza, agregação. Se um efeito não representa algo que se faz com dados, ele não entra.
2. **Uma amostra, do começo ao fim.** Não há um efeito por seção: há os mesmos pontos mudando de forma. Isso é o que torna o site reconhecível; o resto (texto, cartões, páginas internas) é quieto.
3. **Conteúdo primeiro, efeito depois.** Sem JS ou com movimento reduzido, tudo se lê; os números na tela são calculados, nunca inventados; nada sobre o autor além do que é verdade confirmada.

## Movimento

Tokens em `global.css`: `--dur-curta` 140ms (hover e foco), `--dur-media` 320ms (barras das letras, opacidade do canvas), `--dur-entrada` 620ms (cada letra, entrada de página), `--passo-letra` 48ms, `--curva` (saída suave), `--curva-mola` (passa um pouco e volta, para barras assentando).

| O que | Duração | Gatilho |
| --- | --- | --- |
| Eixo de cada palavra do nome se desenha | 620ms | carga da home (CSS) |
| Letras do nome sobem como barras, uma depois da outra (`clip-path` de baixo para cima + 0,2em) | 620ms cada, 180ms + 48ms por letra (cerca de 1,4s no total) | carga da home (CSS, sem JS) |
| Pontos sobem do eixo x até o lugar | 820ms cada, 5ms por ponto (cerca de 1,3s) | carga da home (canvas) |
| Pontos oscilam devagar (2,5px), a 30 quadros por segundo | contínuo | só com mouse, só com a abertura na tela e a aba visível |
| Lente: pontos perto do cursor se afastam, mira com x/y nos eixos, reta, `n` e `r` | a cada quadro | mouse sobre o gráfico |
| Letras do nome crescem até 25% e mudam de cor (núcleo gaussiano) | 320ms | mouse sobre o nome |
| Amostra muda de forma (pergunta, tabela, limpeza, análise, barras) | 820ms por ponto em onda de 5ms; na limpeza as linhas removidas saem primeiro e a tabela fecha 360ms depois | etapa cruzando o meio da tela |
| Reta da amostra limpa cresce e mostra `r` | 700ms | etapa "Análise" |
| Número da etapa acende na cor da série | 320ms | etapa cruzando o meio da tela |
| Mira do cursor (cruz contornada em `--fundo`) | 140ms | mouse sobre a área do gráfico da home |
| Grade do cartão acende em volta do cursor | 320ms | mouse sobre cartão de análise ou de projeto |
| Eixo sob o título das páginas internas se desenha | 620ms | carga da página |
| Troca de página: antiga apaga, nova sobe 1rem; cabeçalho parado (`view-transition-name: topo`) | 140ms / 620ms | navegação (View Transitions entre documentos, só CSS) |

Regras:

- **`prefers-reduced-motion: reduce`:** sem entrada de letras, sem mira (cursor do sistema), sem oscilação, sem lente, sem grade acesa, sem troca animada de página. O canvas continua mostrando cada etapa, mas a forma troca de uma vez, sem transição (é um quadro parado por etapa).
- **Sem JS:** a classe `js` não entra no `<html>`, então canvas, legenda e frases que dependem do gráfico somem, as etapas viram uma lista normal e a abertura não reserva a área do gráfico (`.grafico-area` some). Tudo se lê.
- **Mira:** só na home, só sobre a área do gráfico da abertura (`.mira-no-grafico`), só com `(pointer: fine) and (hover: hover)` e só depois do primeiro `pointermove` com `pointerType: 'mouse'` (`.com-mira`). Em todo o resto (texto, links, páginas internas) fica o cursor do sistema, com o I para selecionar. Some quando o mouse sai da janela.
- **Desempenho:** sem bibliotecas de animação. O canvas tem 96 pontos, DPR limitado a 2 (1,5 no celular), e o laço `requestAnimationFrame` só roda enquanto algo se mexe: em toque ele para quando a entrada termina; com mouse, a oscilação roda a 30 quadros por segundo e para quando a abertura sai da tela. Para também fora da seção da amostra, com a aba oculta, e recomeça ao voltar pelo histórico (`pageshow`). As caixas das letras do nome são lidas uma vez ao entrar e só escritas a cada quadro. O nome é remedido (`ResizeObserver` e `loadingdone` das fontes) para o eixo acompanhar quando a Literata carrega e o texto muda de altura. Scripts: cerca de 13 KB (5 KB comprimido) só na home, com a mira; mais um pequeno script inline para a grade dos cartões.
- **Sem layout shift:** dois canvas atrás do conteúdo: um `position: absolute` no topo da página para a dispersão parada (rola com o nome) e um `position: fixed` para o fluxo e as transições (`z-index: -1` dentro do `body`, que é o contexto de empilhamento); a altura das etapas é decidida pela classe `js` posta antes da pintura.
- Hover sempre dentro de `@media (hover: hover)`.

## Conteúdo publicado (o que é verdade confirmada)

Só isto pode ser afirmado até o autor escrever mais: o nome (Vinicius Belo), que está entrando na área de análise de dados, que está aberto a vagas de entrada e que publica análises neste site. GitHub: https://github.com/ViniciusBelo.

- **O nome aparece visível uma vez por página:** h1 da abertura na home (letras em `aria-hidden`, nome inteiro em texto oculto para leitores de tela); assinatura no cabeçalho das internas. Continua no `<title>`, em `author` e no `og:site_name`.
- **"O caminho de uma análise"** descreve a estrutura de cada análise publicada (pergunta, dados, limpeza, análise, comunicação). É uma sequência real, por isso é numerada. Não cita ferramentas.
- **Projetos (confirmados nos READMEs dos repositórios):** *Análise do e-commerce brasileiro com Python* (olist-ecommerce-analysis, concluído: 7 notebooks e dashboard; os resultados citados no site são os do README do repositório e do post sobre atraso e nota) e *Dashboard de salários na área de dados* (imersao-dados-alura, Imersão de Dados da Alura, concluído).
- **Ferramentas:** só as que aparecem nos repositórios, citadas no cartão de cada projeto. A tabela do Sobre continua desligada (`MOSTRAR_FERRAMENTAS = false`): já existe uma análise publicada, mas a tabela só liga junto com o texto do Sobre, e cada ferramenta precisa apontar para a análise que prova o uso.
- **Contato:** `src/components/FraseContato.astro` se ajusta a `site.ts`. O botão "GitHub" fica sempre no canto de cima à direita. LinkedIn e e-mail só aparecem quando preenchidos.
- **Sem posts** (estado até 24/10/2026, quando saiu o primeiro post; vale de novo se todos os posts forem para rascunho): "Análises" sai da navegação; a home e /posts/ mostram o cartão vazio (um plano com eixos e `n = 0`, "Nenhuma análise publicada ainda." e o link para o GitHub). Sem promessa de que algo está sendo escrito. O rodapé mostra só os contatos.
- **Com posts:** cartões em grade (`auto-fill`, mínimo 19rem), título, resumo, data e assuntos em frase; o link do título cobre o cartão.
- **Checador:** `npm run build` roda `scripts/checar-placeholders.mjs` depois do `astro build`; falha com `SEU-PERFIL`, `exemplo.com` ou marcadores entre colchetes visíveis.

## Regras para páginas futuras

- Use só os tokens de `global.css`. Cor, fonte ou espaço novo entra primeiro aqui e no `:root`.
- Página nova: `Base.astro` + contêiner com `max-width: var(--pagina)` ou `var(--medida-texto)`, `margin-inline: auto`, `padding-inline: var(--margem)`, `margin-top: var(--vao)` (na home, a classe `.secao` já faz isso); `h1` com `.titulo-pagina` (já traz o eixo que se desenha).
- Efeito novo só se representar uma operação com dados e couber na ideia da amostra. Dentro de `prefers-reduced-motion: no-preference`, com os tokens `--dur-*` e `--curva*`.
- `--grade` e `--eixo` nunca em texto; `--marca` só no que se aciona ou se mede.
- Sem caixa alta em rótulos, sem `·` entre metadados, sem `→` em links, sem mono fora de código.
- Gráficos de posts: fundo transparente ou `#0f1f28`, texto e eixos em `#e7ecea`/`#9fb2bb`/`#5d7d8a`; série principal em `#6cc4d4`, destaque em `#ecc76e`; texto alternativo e legenda com a fonte.
- Imagem em artigo: `![alt](./arquivo.png)` com `*Fonte: ...*` logo abaixo.
- Tabelas de artigo recebem `.zebra` pelo plugin `tabelaZebra` (linhas pares em `--superficie`, fio `--eixo` sob o cabeçalho).
- Shiki: `github-dark-default` (comentário `#8b949e` passa 4,5:1 sobre o fundo); transformer `sem-fundo`.
- Texto seguido de link ou `<span>` na linha de baixo, no `.astro`: use `{' '}` (o `compressHTML` junta as palavras).

## Estrutura

- `src/styles/global.css`: tokens, base, séries de cor, `.titulo-pagina`, `.titulo-secao`, `.traco-marca`, tabela, mira, troca de página.
- `src/layouts/Base.astro`: head (preload, script inline de `js` e série), cabeçalho (assinatura nas internas, navegação, botão de contato), rodapé.
- `src/pages/index.astro`: abertura (legenda, área do gráfico, nome em letras, apresentação), "Projetos", "O caminho de uma análise", "Análises", elemento da mira.
- `src/components/ListaDeProjetos.astro` e `src/content/projetos/*.md`: cartões de projeto. `src/scripts/grade.ts`: a grade que acende nos cartões.
- `src/scripts/amostra.ts`: os dois canvas (dados com semente fixa, formas por etapa, lente, mínimos quadrados, frases de medida das etapas).
- `src/scripts/nome.ts`: o nome como histograma.
- `src/scripts/mira.ts`: o cursor sobre o gráfico (recebe de `amostra.ts` a função que diz se o ponto está na área).
- `src/components/ListaDePosts.astro`: cartões e estado vazio, com a grade que acende.
- `src/components/FraseContato.astro`, `src/lib/site.ts` (autor, links, `url()`, `getPosts()`), `scripts/checar-placeholders.mjs`, `src/content.config.ts`, `src/content/posts/modelo-de-post.md` (`draft: true`), `astro.config.mjs`.
- `public/favicon.svg`: dispersão com quatro pontos e a reta ajustada, cores fixas do tema.

## Referências e o que se tirou de cada uma

- **danielsun.space:** letras do nome que reagem ao mouse. Aqui viraram barras de histograma com núcleo gaussiano.
- **karinasirqueira.com:** formas que se transformam e conduzem ao trabalho. Aqui é a amostra mudando de forma a cada etapa.
- **bradleyziffer.com:** animação sutil com visualização de dados. Aqui é a lente com reta ajustada e `n`/`r` reais.
- **nataliealmosa.ca:** brincadeira e contato fácil no canto de cima. Aqui é o botão "GitHub" fixo no cabeçalho e a legenda que se mexe.
- **spencergabor.work:** seletor de cor que muda o tema. Aqui é a legenda do gráfico que troca a cor da série.
- **basedosdados.org:** organização clara de produto de dados (detalhe secundário: estado vazio que direciona, blocos de resultado).
- Não usados: dispositivos e linha do tempo (mikematas.com), toca-discos e colagem (blunar.cz), conversa estilo mensagem (marco.fyi). Fazem sentido com trabalho acumulado; o site ainda não tem.

## Descartado (não repetir sem motivo novo)

- **Abertura de tela cheia com o nome a 7.1rem e o gráfico de borda a borda** (v5): bonita, mas empurrava o trabalho para a segunda tela e espalhava o conteúdo até a borda da janela, com a legenda solta à direita. Agora a abertura é compacta, presa ao contêiner, e os projetos vêm de cara.
- Legenda do gráfico embaixo, no canto direito: ficava longe da margem esquerda; foi para cima do gráfico.
- Cartões de projeto iguais lado a lado, imagens de capa inventadas, mini-gráficos "de exemplo" dentro do cartão, porcentagem de progresso ("28%"): o progresso é contado em etapas reais do repositório.

- **Versão anterior "microficha"** (formulário contínuo zebrado lido em negativo, faixas de três linhas, tarja de título, marca-texto, um único momento de animação de 680ms). Correta e sóbria, mas lida como crua e parada. Ficaram a Literata, a Archivo larga, o amarelo de ação e as regras de conteúdo.
- Tema claro e alternador claro/escuro; terminal preto com verde-limão; terminal de mercado preto com âmbar; blueprint com grade; papel milimetrado com mono; preto neutro ou quase preto como fundo; fundo `#142030` (marinho institucional).
- Partículas ou pontos decorativos sem significado; gradiente ou brilho atrás do nome; spotlight radial genérico em cartões (a versão daqui acende a grade do plano); tilt 3D em cartões; parallax; fade-and-slide-up em cada seção; efeito de "digitando".
- GSAP, Motion ou outra biblioteca de animação: o que o site faz cabe em CSS e cerca de 13 KB de script.
- `<ClientRouter />`: o CSS `@view-transition` faz a troca sem roteador no cliente e sem reinicializar scripts.
- Canvas de fundo em todas as páginas: só a home tem a amostra; as internas são para ler.
- Cursor customizado em toque ou com movimento reduzido; esconder o cursor em campos de texto.
- Mira no site todo e anel em volta do que é clicável: tirava o I de seleção, sumia sobre o botão amarelo e nas internas não tinha gráfico para ler. Agora é só sobre o gráfico da home.
- Canvas da dispersão preso à tela (o nome rolava por cima dos pontos parados).
- Tabela de células soltas com as linhas removidas descendo para uma linha à parte: deixava buracos na tabela e não mostrava que cada ponto é uma linha.
- Etapas com texto só genérico, de apostila: agora cada uma traz um número verificável da amostra.
- Letra do nome crescendo 34%: encostava no eixo do gráfico.
- Números grandes com rótulo ("+10 projetos"), contadores animados sem dado real, frases de efeito sobre "dados e insights".
- Fontes vistas em todo lugar (Space Grotesk, Inter, Fraunces, IBM Plex); fonte matricial para títulos.
- Texto provisório visível, links falsos de LinkedIn/e-mail, ferramentas citadas sem análise que prove o uso, estado vazio que promete ("a primeira está sendo escrita"), nome repetido no rodapé ou no texto.
