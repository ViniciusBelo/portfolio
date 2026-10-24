# Guia de estilo

Identidade visual do site de Vinicius Belo (portfólio e blog de análise de dados). Antes de mudar algo visual, leia este arquivo: ele registra o que foi decidido, por quê, e o que já foi tentado e deixado de lado.

## Conceito: o formulário contínuo em microficha (tema escuro)

O site tem um tema escuro único, sem alternador, com um ar profissional e sóbrio.

A referência são os relatórios de CPD impressos em formulário contínuo zebrado. Esses relatórios também eram arquivados em microficha (COM, *Computer Output on Microfilm*) e lidos em negativo numa leitora: fundo escuro azul-ciano de filme diazo, texto claro, e as faixas do formulário ainda visíveis como linhas um pouco mais claras. É o mesmo objeto do assunto (dados em linhas) no estado escuro, então o tema não é uma simples inversão de cores.

O que fica e o que sai:

- **Fica a função das faixas:** ajudar o olho a seguir uma linha longa. Elas aparecem só onde há linhas para ler de ponta a ponta (tabelas, lista de análises, texto de apresentação da home), sempre pela mesma regra `.zebra` e no ritmo de três linhas por faixa.
- **Saem os furos de tração.** Na microficha eles não existem (o COM grava só o relatório) e eram o ornamento mais chamativo do site. Sem eles, tudo alinha numa margem esquerda só.
- **Sai o picote tracejado** (topo, pé e `<hr>`). No lugar dele, a **tarja de título**: a faixa legível a olho nu no topo de toda microficha. Ela é o fundo do cabeçalho do site, e só dele. O rodapé é separado por espaço, sem fio.
- **Tipografia contida:** o Archivo a 125% fica só no nome da home. Títulos internos e de artigo a 112%, peso máximo 700.
- **Lápis vermelho vira marca-texto.** O vermelho de revisão não funciona em fundo azul-escuro: para passar contraste ele precisa clarear até um coral alaranjado, que perde o sentido de correção. No escuro, o gesto de quem revisa é o marca-texto amarelo: links, foco, seleção de texto (selecionar é literalmente passar o marca-texto) e aviso de rascunho.

### Alinhamento

Uma margem esquerda para tudo: título, texto, lista e rodapé começam em `var(--margem)` dentro de `--pagina`. Onde há faixa (texto da home, linhas da lista de análises), **o texto fica na margem e a faixa sangra para fora**: o contêiner tem `margin-inline: calc(var(--recuo-faixa) * -1)` e `padding-inline: var(--recuo-faixa)`, com `--recuo-faixa: 1rem` em qualquer largura. Em 360px a margem é 1rem, então a faixa vai até a borda da tela. Nada centralizado, nada justificado.

### Wireframe da home

```
+==============================================================+
|################### tarja (--tarja) da home ##################|
|#                                                            #|
|#  Vinicius Belo  (h1, Archivo 125%, 700)     Análises  Sobre #|  <- mesma linha de base
|#                                                            #|
|##############################################################|
|                                                              |
| ################ faixa: 3 linhas ##########                  |
| # Estou entrando na área de análise de dados #  <- texto na  |
| ############################################     margem, a   |
|   fundo: 3 linhas                                faixa sangra|
| ################ faixa #####################      1rem       |
|                                                              |
|   Análises publicadas     (só existe se houver post)         |
|   12/03/2026   Título da análise   (1a linha: fundo)         |
| ############################################                 |
| # 05/02/2026   Título da análise   (2a linha: faixa)         |
| ############################################                 |
|                                                              |
|   GitHub [LinkedIn] [E-mail]                                 |
|   [Textos e análises podem ser citados...] (só com posts)    |
+--------------------------------------------------------------+
```

No celular (360px) o nome cabe numa linha e a navegação desce para a linha de baixo, dentro da tarja, na margem esquerda.

A faixa da home é justa ao texto: largura `--medida-texto` mais o recuo dos dois lados.

LinkedIn e e-mail só aparecem quando preenchidos em `src/lib/site.ts`.

**O nome aparece visível uma vez por página, sempre na tarja.** Na home, a tarja é o título da ficha: cresce (`.topo-home`, padding `--vao` em cima e `--vao-curto` embaixo) e contém o h1 "Vinicius Belo" (`.nome`, `--t-5`, 125%) com a navegação na mesma linha de base; a folha zebrada começa `--vao` abaixo. Nas páginas internas, a tarja é baixa e a assinatura (Archivo 112%/700) é o link para a home. O h1 da home fica no `<header>` (em `Base.astro`), não no `<main>`. O rodapé não repete o nome nem tem ano: sem posts, só os contatos; com posts, também a frase sobre citação. O nome continua no `<title>`, em `author` e no `og:site_name`.

Por que o nome dentro da tarja: a versão anterior (tarja só com "Sobre" à direita e o nome solto abaixo) parecia uma barra de aplicativo vazia. Numa microficha, o título é justamente o que vai escrito na tarja; o nome ali é o próprio objeto, não um enfeite.

**Tarja no celular:** até 24rem os vãos da tarja e da navegação caem para 1rem, para assinatura + "Análises" + "Sobre" caberem numa linha em 360px (testado com um post publicado).

### Wireframe do artigo

```
            [ coluna de leitura 38rem, ~68 caracteres ]
            Título da análise (Archivo 112%, 700)
            Resumo em itálico (--luz-suave)
            Publicado em 12 de março de 2026.
            Assuntos: SQL, Python.

            Texto em Literata 18px / 1.7, peso 420 ...
       [ tabela zebrada ou código pode abrir até 52rem       ]
            Texto ...
```

## Tokens

### Cores (em `src/styles/global.css`)

| Token         | Hex       | Papel | Contraste |
| ------------- | --------- | ----- | --------- |
| `--filme`     | `#11212b` | Fundo. Azul-ciano de filme diazo, com matiz declarado; não é preto nem o marinho de site institucional. | |
| `--faixa`     | `#1d3540` | Faixa do formulário vista no negativo. | 1,28:1 contra o fundo: visível sem competir com o texto |
| `--tarja`     | `#253e54` | Tarja de título: fundo do cabeçalho do site e do `<thead>`; `<hr>` dos artigos. Mais azul e mais clara que a faixa. | 1,49:1 contra o fundo; 1,16:1 contra a faixa |
| `--guia`      | `#5f9c87` | Estrutura: fio sob cabeçalho de tabela, borda de citação e de código. **Nunca em texto.** | 5,2 fundo; 3,5 tarja (passa 3:1 de elemento não textual) |
| `--luz`       | `#e4e9e3` | Todo o texto. Claro acinzentado-esverdeado, não branco puro (menos ofuscamento). | 13,4 fundo; 10,4 faixa; 9,0 tarja |
| `--luz-suave` | `#a9b6bf` | Datas, legendas, resumo, rodapé. | 7,9 fundo; 6,2 faixa; 5,3 tarja |
| `--marca`     | `#e3c375` | Marca-texto: links, foco, seleção (fundo, com texto `--filme`), pular para o conteúdo, rascunho. | 9,7 fundo; 7,5 faixa; 6,5 tarja |
| `--faixa-acesa` | `#244552` | Linha da lista de análises cujo link do título está sob o cursor ou com foco (a faixa "acende"). Mesmo matiz da faixa, um passo acima; não é a tarja. | 1,60:1 contra o fundo, 1,25:1 contra a faixa; `--luz` 8,3, `--luz-suave` 4,95, `--marca` 6,0 |

Tudo AA (texto normal acima de 4,5:1). Dois matizes de acento com papéis separados (verde = estrutura, amarelo = ação ou marcação), nunca um acento único fazendo tudo.

Valores anteriores, para referência: fundo `#142030`, faixa `#1a2e36` (1,16:1, fraca demais: em vários monitores a faixa sumia), tarja `#22374a`. O fundo foi puxado do azul-ardósia para um azul-ciano, mais perto do filme diazo e mais longe do marinho corporativo. A tarja subiu um pouco para continuar acima da faixa.

**Favicon** (`public/favicon.svg`, estático, fora dos tokens): um quadro de microficha. Fundo `#11212b`, tarja `#253e54` com uma linha `#e4e9e3`, faixas reforçadas `#2f4a57` (1,75:1; a `--faixa` real some em 16px), linhas de texto `#e4e9e3` e uma linha em `#e3c375` (a linha marcada). Só o favicon usa `#2f4a57`. `theme-color` = `#253e54` (a barra do navegador continua a tarja).

**Shiki:** `github-dark-default`. Medido sobre `--filme`: a cor de token mais fraca (comentário `#8b949e`) dá 5,3:1. Descartados por contraste nos comentários (abaixo de 4,5:1): `github-dark`, `night-owl`, `tokyo-night`, `solarized-dark`, `min-dark`, `material-theme-palenight`. O transformer `sem-fundo` continua; o `<pre>` usa `--filme` com borda `--guia`.

### Tipografia

- **Archivo Variable** (títulos, navegação, cabeçalhos de tabela). Fallback `Arial, Helvetica, sans-serif`. Eixo de largura: 125% só no nome da home; 112% em títulos de página, de artigo, h2 e assinatura; 100% em títulos da lista, h3 de artigo e navegação.
- **Entreletra dos títulos:** um valor só, `--aperto: -0.02em`, para h1 a h4 e para a assinatura do cabeçalho.
- **Título de página interna:** classe `.titulo-pagina` em `global.css` (`--t-4`, 112%, entrelinha 1.08, `margin-bottom: var(--vao-curto)`). Sobre, Análises, artigo e 404 usam a classe; nenhuma página redefine o h1.
- **Literata Variable** (texto, tamanho óptico automático). Mantida no escuro: em tamanho de texto o eixo óptico dá hastes e serifas mais grossas e contraste baixo, o que evita a serifa fina sumindo no fundo escuro. Reforço: peso `--peso-texto: 420` e entrelinha 1.7 no corpo inteiro. Itálico só no resumo do artigo e em citações. Sem `-webkit-font-smoothing: antialiased` (afinaria o traço no macOS).
- **Código:** pilha mono do sistema. Mono só em código, nunca em rótulos: em rótulo, mono parece tela de terminal e não combina com o tom de relatório lido com calma.
- Escala em quarta justa (1.333) sobre 18px, com dois meios passos (cerca de 1.155):

  | Token     | Valor                         | Uso                                         |
  | --------- | ----------------------------- | ------------------------------------------- |
  | `--t-0`   | 0.84rem                       | datas, legendas, rodapé                     |
  | `--t-0-5` | 0.975rem (meio passo)         | tabelas e blocos de código                  |
  | `--t-1`   | 1.125rem                      | texto (inclusive o texto da folha da home)  |
  | `--t-1-5` | 1.3rem (meio passo)           | resumo em itálico do artigo                 |
  | `--t-2`   | 1.5rem                        | h2 do Sobre, h3 de artigo, títulos na lista |
  | `--t-3`   | 2rem                          | h2 de artigo e da home                      |
  | `--t-4`   | 2.67rem                       | h1 de páginas internas e artigos            |
  | `--t-5`   | clamp(2.6rem, 8vw, 4.75rem)   | nome na home                                |

  Tamanho solto em rem não entra: ou usa um token, ou cria um passo aqui. `em` relativo só no `code` (0.86em).
- **Pesos da Archivo:** 500 (navegação), 600 (títulos na lista, cabeçalho de tabela, aviso de rascunho), 700 (todos os títulos e a assinatura). Sem 800.
- Números: `tabular-nums lining-nums` no corpo inteiro.

**Preload:** `Base.astro` importa `@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url` e põe um `<link rel="preload" as="font" crossorigin>` em todas as páginas. É o mesmo arquivo com hash que o CSS do `@fontsource` usa (conferido no `dist/`), então não baixa duas vezes; evita o nome da home aparecer na fonte de reserva e trocar depois. Só esse arquivo: a Literata e os subconjuntos latin-ext carregam normalmente.

**Por que self-host com @fontsource e não Google Fonts:** sem requisição a terceiros (LGPD), versões travadas no `package-lock.json`, funciona offline, arquivos com hash para cache longo.

### Ritmo e espaço

`--linha: 1.75rem`; uma faixa cobre exatamente três linhas (`--faixa-altura`), como no papel real. No texto da home, as margens entre parágrafos são múltiplos de `--linha` para o texto não sair da faixa. O `.formulario` não tem padding vertical: um padding inferior de uma linha abria uma faixa vazia sob o último parágrafo.

Espaços verticais derivados da linha:

| Token         | Valor                    | Uso |
| ------------- | ------------------------ | --- |
| `--vao-curto` | `var(--linha)` (1.75rem) | do título da página ao conteúdo; do título de seção à lista; metade dele sob os h2 do Sobre |
| `--vao`       | `--linha` × 2 (3.5rem)   | do cabeçalho ao início da página; entre seções; antes de h2 no Sobre. O rodapé fica a `--vao` × 1,5 |

O `<main>` não tem altura mínima: em páginas curtas, o rodapé vem logo depois do conteúdo em vez de deixar meia tela vazia.

**Traço:** um só token, `--traco` (2px). Fio sob `<thead>` (`--guia`), borda de citação e de `<pre>` (2 × `--traco`, `--guia`) e `<hr>` dos artigos (`--traco` de altura, cor `--tarja`).

### Movimento

Pouco e com função. Tokens em `global.css`:

| Token                | Valor  | Uso |
| -------------------- | ------ | --- |
| `--dur-curta`        | 140ms  | Resposta a hover e foco: cor do link, sublinhado correndo nos títulos da lista, faixa acesa. |
| `--dur-ficha`        | 180ms  | Crossfade da troca de página. |
| `--dur-varredura`    | 520ms  | Faixas da home projetadas de cima para baixo. |
| `--atraso-varredura` | 160ms  | Início da varredura, depois de a página assentar (termina em 680ms). |
| `--curva`            | `cubic-bezier(0.2, 0.6, 0.2, 1)` | Curva única: saída suave, sem quique. |

1. **Um momento só no carregamento, só na home: a varredura.** As faixas do texto de apresentação são projetadas de cima para baixo (`clip-path` numa camada `::before` atrás do texto). O nome não anima: aparece pronto na tarja. O texto nunca se move nem fica invisível; as faixas estão numa camada própria justamente para isso. Total: 680ms. Só CSS, nada depende de script para aparecer.
2. **Movimento que responde.** Navegação e títulos da lista usam `.traco-marca` (sublinhado de marca-texto feito de fundo); a página atual fica com o traço inteiro.
   - **Navegação:** cor e sublinhado trocam na hora, sem transição (`nav a { transition: none }`). Itens curtos, vistos o tempo todo: a corrida só chamaria atenção para o menu.
   - **Títulos da lista:** só aqui o traço corre da esquerda para a direita (transição de `background-size` em `ListaDePosts.astro`); em título de duas linhas, corre uma linha depois da outra.
   - **Linha da lista:** acende (`--faixa-acesa`) só quando o link do título está em hover (`.linha:has(.titulo a:hover)`) ou quando há foco dentro (`.linha:focus-within`). Escolhido em vez de tornar a linha toda clicável com `::after`: só o título é link, então a faixa só acende com ele; o resumo continua selecionável e a área clicável é exatamente o que parece clicável.
   - Links de texto mantêm o sublinhado e só engrossam no hover.
   - **Todo `:hover` fica dentro de `@media (hover: hover)`** (inclusive `.traco-marca:hover`, `a:hover`, `nav a:hover`), para o toque não deixar estado preso. Foco não depende disso.
3. **Troca de página: crossfade curto.** View Transitions entre documentos, só CSS (`@view-transition { navigation: auto; }`), sem `<ClientRouter />`: só o grupo `root`, com o fade padrão do navegador em `--dur-ficha` e `--curva`. Sem deslocamento, então ir e voltar se comportam igual. **Nenhum `view-transition-name` na tarja:** como ela entra no crossfade da página inteira, os pixels iguais ficam parados entre páginas internas, e a tarja alta da home troca com a baixa das internas por opacidade, sem esticar o texto. Navegadores sem suporte trocam de página normalmente.
4. **`prefers-reduced-motion: reduce`.** Tudo que se move está dentro de `@media (prefers-reduced-motion: no-preference)`: varredura, transições de hover, troca de página e rolagem suave. Com `reduce`, os estados continuam visíveis (cor, sublinhado inteiro, faixa acesa, foco), só que mudam na hora.

O que não entra: animação de entrada em seções, scroll-reveal, parallax, movimento contínuo ou em laço, efeito de "digitando", `steps()` imitando cintilação de leitora, desfoque ou fade de entrada em títulos.

### Zebra

Regra única em `global.css`, pela classe `.zebra`: **a primeira linha fica no fundo, as pares na faixa**.

- Lista: `.zebra` no `<ol>`/`<ul>` (filhos diretos). A lista sangra `--recuo-faixa` para fora, e cada linha tem o mesmo recuo interno, para o texto ficar na margem do título.
- Tabela: `.zebra` no `<table>`; zebra só no `<tbody>`; `<thead>` na `--tarja` com fio `--traco` em `--guia`. Células, tamanho (`--t-0-5`) e peso (600) também vêm de `table.zebra`.
- Tabelas de artigos recebem a classe por um plugin do Sätteri em `astro.config.mjs` (`tabelaZebra`). Não estilize `tr:nth-child` em páginas.
- A folha da home é outro mecanismo (gradiente de 3 linhas que começa na faixa).

## Princípios

1. **A faixa só aparece onde há linhas de dados para seguir.** Se não houver leitura em linha, não há faixa. A tarja (cabeçalho) não é faixa: é o título da ficha, num lugar só.
2. **Uma coisa marcante, o resto sóbrio.** O que marca é o nome em Archivo largo na tarja da home, com a folha zebrada logo abaixo. O resto é tipografia de leitura, uma margem esquerda, nenhum ornamento.
3. **Cor com função.** Verde = estrutura, amarelo = algo que se aciona ou se marca, claro = texto. Nenhuma cor decorativa. E texto como dado, não como venda: nada inventado, nenhum texto provisório publicado.

## Escolhas e alternativas consideradas

### Tema escuro

| Alternativa considerada | O que foi feito | Por quê |
| --- | --- | --- |
| Fundo quase preto com um único acento neon | Fundo azul-ciano de filme; amarelo de marca-texto suave (não neon) só em links, foco e seleção; verde `--guia` só para estrutura | O matiz vem da microficha. Preto com neon é o visual de qualquer "modo escuro" e não diz nada sobre o assunto. |
| Azul-marinho sóbrio | Azul-ciano (`#11212b`) | Marinho lembra site institucional de banco; o ciano lembra o filme. |
| Terminal de mercado (preto + âmbar) | Descartado | Sugere finanças, não análise escrita, e cansa em texto longo. |
| Blueprint/cianotipia com grade branca | Descartado | A grade é decoração sem função de leitura (mesmo motivo do papel milimetrado). |
| Inverter o tema claro (papel e tinta trocados) | Microficha em negativo: paleta nova, faixa recalibrada | Inversão direta deixa o verde da faixa berrante e o vermelho ilegível. |
| Manter o lápis vermelho | Marca-texto amarelo | Vermelho em azul-escuro só passa contraste clareado até coral, que perde o sentido de correção. |
| Manter furos e picote | Removidos; tarja de título no cabeçalho | Sobriedade; na microficha não há furos; o picote era o último fio puramente decorativo. |
| Cabeçalho e rodapé em barras iguais | Tarja só no cabeçalho; rodapé separado por espaço | Microficha tem uma tarja só; duas barras simétricas emolduram a página sem motivo. |
| Cartões escuros com borda clara e cantos arredondados para os posts | Lista em linhas zebradas, sem borda, raio ou sombra | As análises são linhas comparáveis de uma lista, não peças soltas; cartões quebrariam a leitura em linha. |
| Gradiente ou brilho atrás do nome | Nenhum | Enfeite sem função. |
| Trocar a serifa por sans no escuro | Literata mantida com peso 420 e tamanho óptico | A serifa de texto é parte da voz de relatório lido com calma; o problema real (hastes finas) é resolvido pelo eixo óptico e pelo peso. |

### Tema claro anterior (as razões continuam valendo)

| Alternativa considerada | O que foi feito | Por quê |
| --- | --- | --- |
| Papel milimetrado com fonte mono | Formulário contínuo zebrado; mono só em código | "Dados = grade + mono" é a associação mais óbvia e a grade não ajuda a ler. |
| Creme + serifa de alto contraste + acento terracota | Nunca | Visual de revista de estilo, sem relação com relatório de dados. |
| Layout de jornal com fios finos e colunas densas | Coluna única; separação por espaço e faixas | Colunas densas cansam em análise longa; uma coluna lê melhor. |
| Rótulo em caixa alta acima de cada seção | Títulos em frase comum, sem sobretítulo | Caixa alta atrapalha a leitura e destoa do tom; o título já diz o que é a seção. |
| Metadados em mono separados por ponto ("12 MAR 2026 · 8 MIN · SQL") | "Publicado em 12 de março de 2026. Assuntos: SQL, Python." | Frase comum se lê de primeira; a versão compacta parece painel de controle. |
| Links "Ver todos →", tags em pílulas | "Ver todas as 6 análises"; assuntos em texto corrido | O link diz o que faz; setas e pílulas só enfeitam. |
| Destaque com número grande + rótulo, ou frase de efeito sobre "dados e insights" | Nome e duas frases honestas | Iniciante não tem números para exibir; frase de efeito soa como venda. |
| Uma palavra do título em outra cor ou itálico | Títulos inteiros em um só tratamento | Destaque parcial chama atenção para a forma, não para o conteúdo. |
| Animação de entrada em cada seção | Um momento só, na home (faixas projetadas); o resto só responde ao usuário | Entradas espalhadas distraem e atrasam a leitura. O texto nunca espera a animação. |
| Numeração 01/02/03 | Só no "Método" do modelo, que é sequência | Numeração só para sequência real. |

## Conteúdo publicado (o que é verdade confirmada)

Só isto pode ser afirmado até o autor escrever mais: o nome (Vinicius Belo), que está entrando na área de análise de dados, que está aberto a vagas de entrada e que publica análises neste site. GitHub: https://github.com/ViniciusBelo.

- **Frase de método** ("a pergunta, os dados, o método, o que encontrei e até onde o resultado vale") aparece **só na home**. Sobre, /posts/ e a description do site não a repetem.
- **Description do site** (`site.ts`): factual e curta, "Portfólio de análise de dados de Vinicius Belo."
- **Ferramentas:** nenhuma ferramenta é citada no site até ser confirmada. A tabela de ferramentas do Sobre existe no código, desligada (`MOSTRAR_FERRAMENTAS = false` em `src/pages/sobre.astro`); cada linha precisa apontar para a análise publicada que prova o uso.
- **Formação:** seção removida até haver texto real.
- **Contato:** a frase vem de `src/components/FraseContato.astro` e se ajusta a `site.ts`. Sem LinkedIn e sem e-mail, a home e o Sobre dizem "Por enquanto, o contato é pelo meu perfil no GitHub", com link direto (a home não manda o leitor ao Sobre para procurar um contato que não existe). Com LinkedIn e/ou e-mail: "Escreva pelo LinkedIn ou por e-mail." (ou só um deles); no Sobre, acrescenta "Também estou no GitHub." Nunca "Também" quando o GitHub é o único canal.
- **Sem posts** (em produção, rascunhos não contam):
  - "Análises" sai da navegação; a página /posts/ continua existindo e mostra "Nenhuma análise publicada ainda." com link para o Sobre, sem faixa de fundo e sem prometer que algo "está sendo escrito".
  - A home não mostra a seção "Análises publicadas".
  - O rodapé mostra só os contatos (GitHub; LinkedIn e e-mail se preenchidos). Com posts, acrescenta "Textos e análises podem ser citados com link para a fonte.", sem "©" nem ano.
  - A 404 não menciona a lista de análises; oferece só a página inicial.
- **Checador:** `npm run build` roda `scripts/checar-placeholders.mjs` depois do `astro build`. Ele falha se `dist/` tiver `SEU-PERFIL`, `exemplo.com`, texto visível começando com `[` logo após uma tag ou marcadores como `[ex.:`, `[Troque`, `[seu`, `[Escreva`, `[Preencha`. Ignora `<script>`, `<style>` e comentários (onde `[` é sintaxe).

## Regras para páginas futuras

- Use só os tokens de `global.css`. Cor, fonte ou espaço novo entra primeiro aqui e no `:root`.
- Página nova: `Base.astro` + contêiner com `max-width: var(--pagina)` ou `var(--medida-texto)`, `padding-inline: var(--margem)` e `margin-top: var(--vao)`. `h1` com a classe `.titulo-pagina`.
- Espaço vertical entre blocos: `--vao` ou `--vao-curto`. Medidas soltas em rem só dentro do texto corrido do artigo, onde o ritmo é o do parágrafo.
- Faixas só pela classe `.zebra`, só em tabelas e listas de itens comparáveis, sangrando `--recuo-faixa` com o texto na margem. Tarja só no cabeçalho do site e no `<thead>`.
- Sem furos de tração, sem picote tracejado, sem cartões com sombra, sem `border-radius`, sem gradientes decorativos ou brilhos: tudo isso é enfeite que compete com os dados.
- Sem caixa alta em rótulos (atrapalha a leitura e destoa do tom), sem `·` entre metadados (frase comum lê melhor), sem `→` em links (o texto do link já diz para onde vai), sem mono fora de código.
- `--guia` nunca em texto; `--marca` só em algo acionável ou marcado (link, foco, seleção, rascunho), nunca em títulos ou enfeite.
- Gráficos de posts: fundo transparente ou `#11212b`, texto e eixos em `#e4e9e3`/`#a9b6bf`, cores de série distintas do verde `--guia` e do amarelo `--marca` (que significam estrutura e ação) e com pelo menos 3:1 contra o fundo; texto alternativo e legenda com a fonte.
- Imagem em artigo: sintaxe Markdown `![alt](./arquivo.png)` com `*Fonte: ...*` logo abaixo (o CSS trata `p > img + em` como legenda). `<figure>` em HTML cru só com imagem em `public/`.
- Código: o transformer `sem-fundo` tira o `background-color` do Shiki; o fundo vem de `.texto pre`. Sem `!important`.
- Texto seguido de link na linha de baixo, no `.astro`: use `{' '}` antes do link. O `compressHTML` do Astro remove a quebra de linha entre texto e tag (a home já chegou a mostrar "na páginaSobre").
- Copy: frase comum, verbo ativo, diga o que o link faz. Estados vazios dizem o que acontece e oferecem um caminho.
- Movimento novo: só com os tokens `--dur-*` e `--curva`, dentro de `@media (prefers-reduced-motion: no-preference)`, e só em resposta ao usuário. A home já tem o único momento automático; não crie outro.
- Nome do autor: visível uma vez por página, sempre na tarja (h1 na home, assinatura nas internas). Não repita no rodapé nem no texto das páginas (o Sobre não começa com "Sou Vinicius Belo").
- Hover sempre dentro de `@media (hover: hover)`. Não dê `view-transition-name` a elementos que mudam de tamanho entre páginas.
- Qualidade mínima: funciona em 360px, foco visível (`outline` 3px `--marca`), contraste AA, sem animação que ignore `prefers-reduced-motion`.

## Estrutura

- `src/styles/global.css`: tokens, base, `.zebra`, `.titulo-pagina`, `.traco-marca`, keyframe da varredura e crossfade da troca de página.
- `src/layouts/Base.astro`: head, SEO, preload da Archivo, tarja (h1 do nome na home, assinatura nas internas), navegação (sem "Análises" quando não há posts), rodapé.
- `src/components/FraseContato.astro`: frase de contato usada na home e no Sobre.
- `src/components/ListaDePosts.astro`: lista zebrada e estado vazio.
- `src/lib/site.ts`: dados do autor e links. `linkedin` (URL completa) e `email` (só o endereço; o `mailto:` é montado em `emailHref`) são opcionais: vazios, não são renderizados. Também `url()` com o `base` do GitHub Pages, `getPosts()` (rascunhos só em dev), formatação de datas pt-BR.
- `scripts/checar-placeholders.mjs`: checador rodado no fim do `npm run build`.
- `src/content.config.ts`: coleção `posts` (glob em `src/content/posts/`).
- `src/content/posts/modelo-de-post.md`: modelo de análise (`draft: true`). Publicado sem preencher, ele faz o checador falhar, de propósito.
- `astro.config.mjs`: `site` e `base` via `SITE_URL` e `BASE_PATH` (padrão `/portfolio`); processador Sätteri (padrão do Astro 7, declarado em `package.json` como `@astrojs/markdown-satteri` 0.4.5, a mesma versão que o Astro instala) com o plugin `tabelaZebra`; tema do Shiki `github-dark-default` e transformer `sem-fundo`. Plugins `rehype` não funcionam sem instalar `@astrojs/markdown-remark`: use `hastPlugins` do Sätteri.

## Descartado (não repetir sem motivo novo)

Papel milimetrado; tema "terminal" escuro (preto + verde-limão); Space Grotesk, Inter, Fraunces, IBM Plex (fontes vistas em todo lugar, sem relação com o conceito); células de planilha com letras de coluna (A, B, C) como decoração; fonte matricial/pixel para títulos (caricata e ilegível em tamanho grande).

Conteúdo e copy:

- Texto provisório visível no site (colchetes, `SEU-PERFIL`, `exemplo.com`) e links falsos de LinkedIn/e-mail.
- Citar ferramentas (SQL, Python, Power BI, Excel) sem confirmação do autor e sem análise que prove o uso.
- Frases de método repetidas em várias páginas ("Escrevo pouco e por inteiro", "Poucos textos, feitos por inteiro"); a description antiga com lista de ferramentas.
- Estado vazio que promete ("A primeira está sendo escrita") e estado vazio com faixa de fundo.
- Seção "Análises publicadas" vazia na home; "Análises" na navegação levando a uma página vazia.
- "Os contatos estão na página Sobre" na home quando o único contato é o GitHub; "Também estou no GitHub" sem outro canal antes.
- Frase sobre citação de textos no rodapé quando não há texto publicado.

Visual:

- Nome em destaque duas vezes na home (cabeçalho 800 + h1); depois, nome três vezes na home (assinatura discreta peso 400 na tarja, h1 e "Vinicius Belo, 2026." no rodapé). Agora: uma vez visível por página.
- Tarja da home só com "Sobre" à direita e o h1 solto abaixo (parecia barra de aplicativo vazia). Agora o h1 está dentro da tarja.
- "© 2026." solto no rodapé; "Sou Vinicius Belo e estou..." no Sobre (a tarja já diz o nome).
- Nome da home saindo de desfoque (opacidade 0,35 e `blur`, token `--dur-foco`): efeito genérico de entrada que dividia a atenção com a varredura.
- Troca de página com deslize lateral de 1,5rem (ignorava a direção de voltar) e `view-transition-name: tarja` (esticaria o texto entre a tarja alta da home e a baixa das internas).
- Sublinhado correndo também na navegação; faixa da lista acendendo com o cursor em qualquer ponto da linha (sugeria linha clicável); `:hover` fora de `@media (hover: hover)`.
- Movimento: `<ClientRouter />` do Astro (roteador no cliente só para animar a troca; o CSS `@view-transition` faz o mesmo sem script); fade-and-slide-up em seções; scroll-reveal; parallax; o texto de apresentação inteiro entrando por `clip-path` (deixava o texto ilegível durante a varredura).
- Furos contados a partir do topo da tira (desalinhavam das linhas conforme a altura do h1); borda `dotted` na tira, diferente do picote.
- Tamanhos soltos 1.2rem, 1.3rem, 0.95rem e peso 650 fora da escala documentada.
- Zebra com a primeira linha na faixa (`odd`) em um lugar e `even` em outro.
- Fallback `Arial Narrow`.
- `!important` no fundo do `<pre>`.
- Favicon com faixas `#e2eddb`, invisíveis em 16px.
- Tema claro e alternador de tema (o tema é só o escuro).
- Furos de tração (tira lateral da home) e picote tracejado no topo, no pé e no `<hr>`.
- Lápis vermelho `#a3261b` (ilegível no escuro; versões claras viram coral).
- Preto neutro ou quase preto como fundo; acento neon; terminal de mercado preto + âmbar; blueprint com grade.
- Fundo `#142030` (azul-ardósia, perto demais do marinho institucional) e faixa `#1a2e36` (1,16:1, quase invisível em muitas telas).
- Archivo 800 e largura 125% fora do nome da home; nome da home até 5.6rem.
- Barras de fundo no cabeçalho e no rodapé ao mesmo tempo.
- Texto da folha e das linhas recuado em relação ao h1 (faixa alinhada na margem e texto 1rem para dentro; 0,75rem no celular). Agora o texto fica na margem e a faixa sangra.
- `.formulario` com `padding-bottom` de uma linha (abria faixa vazia) e parágrafos com largura solta de 36rem.
- `main { min-height: 60vh }` (meia tela vazia antes do rodapé em páginas curtas) e espaços verticais soltos (3rem, 4rem, 5rem, 6rem) no lugar de `--vao`.
- h1 de página interna redefinido em cada página, com entreletras diferentes (-0.01em, -0.02em, -0.025em).
- Temas do Shiki com comentários abaixo de 4,5:1 (`github-dark`, `night-owl`, `tokyo-night`, `solarized-dark`).
- Trocar Literata por sans no escuro.
