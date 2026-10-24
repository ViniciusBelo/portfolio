---
title: "[Título que diz o que a análise descobriu ou pergunta]"
description: "[Uma ou duas frases: qual pergunta foi respondida, com quais dados.]"
date: 2026-10-24
tags: ["[SQL]", "[Python]"]
draft: true
# cover: ./capa.png        # opcional: imagem na mesma pasta deste arquivo
# coverAlt: "[Descrição da imagem para quem não a vê]"
---

<!--
Como usar este modelo:
1. Copie este arquivo com outro nome (o nome vira o endereço: meu-post.md -> /posts/meu-post/).
2. Troque todo texto entre colchetes.
3. Mude draft para false quando quiser publicar. Com draft: true o post só aparece em `npm run dev`.
Não invente números: se ainda não tem o resultado, deixe o marcador.
-->

[Parágrafo de abertura: em três ou quatro frases, conte por que essa pergunta importa e qual foi a resposta curta. Quem ler só este parágrafo deve sair sabendo o principal.]

## A pergunta

[Escreva a pergunta de forma que dê para responder com dados. Ex.: "[métrica] mudou depois de [evento]?" em vez de "como está [assunto]?".]

[Diga quem se importaria com a resposta e que decisão ela ajuda a tomar.]

## Os dados

[De onde vieram: fonte, link, data de coleta, licença de uso.]

| Tabela ou arquivo | Linhas | Período | O que cada linha representa |
| ----------------- | -----: | ------- | --------------------------- |
| [nome]            | [n]    | [início a fim] | [ex.: um pedido]     |
| [nome]            | [n]    | [início a fim] | [ex.: um cliente]    |

[O que foi limpo ou descartado, e por quê. Ex.: registros duplicados, valores ausentes, outliers.]

## O método

[Passo a passo do que foi feito, na ordem em que foi feito. Se for uma sequência, use lista numerada.]

1. [Passo]
2. [Passo]
3. [Passo]

Trecho da consulta principal:

```sql
-- [explique em uma linha o que esta consulta calcula]
select
  [coluna],
  count(*) as [nome]
from [tabela]
group by [coluna]
order by [nome] desc;
```

Trecho do tratamento em Python:

```python
import pandas as pd

df = pd.read_csv("[arquivo].csv")
# [explique a transformação]
```

## Os resultados

[Comece pelo achado mais importante, em uma frase. Depois mostre a evidência.]

<!--
Para incluir um gráfico, salve a imagem nesta pasta e use:
![Descrição do que o gráfico mostra](./grafico-1.png)
*Fonte: [fonte dos dados]. Elaboração própria.*
O texto em itálico logo abaixo da imagem vira a legenda.
-->

| [Grupo] | [Métrica A] | [Métrica B] |
| ------- | ----------: | ----------: |
| [grupo] | [valor]     | [valor]     |
| [grupo] | [valor]     | [valor]     |
| [grupo] | [valor]     | [valor]     |

[O que a tabela ou o gráfico mostra, em palavras. Diga o tamanho do efeito, não só a direção.]

## As limitações

[O que esta análise não consegue afirmar. Ex.: correlação sem causa, amostra pequena, período curto, dados autodeclarados.]

- [Limitação e como ela afeta a conclusão]
- [Limitação e como ela afeta a conclusão]

## Próximos passos

[O que você faria com mais tempo ou mais dados.]

[Link para o repositório com o código e os dados: [nome do repositório](https://github.com/ViniciusBelo/[repositorio]).]
