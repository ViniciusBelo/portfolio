---
title: Análise do e-commerce brasileiro com Python
description: Dataset público da Olist, no Kaggle, com cerca de 100 mil pedidos em 9 tabelas, de setembro de 2016 a outubro de 2018. O caminho vai da limpeza dos dados brutos à segmentação de clientes.
repo: https://github.com/ViniciusBelo/olist-ecommerce-analysis
status: em-andamento
ferramentas: [Python, Pandas, DuckDB, Plotly, scikit-learn, Streamlit]
ordem: 1
destaque: true
date: 2026-06-21
# Uma etapa por notebook do repositório, na ordem. Escreva como entra na frase (minúsculas).
etapas:
  - { nome: exploração inicial, feita: true }
  - { nome: limpeza com ETL, feita: true }
  - { nome: receita }
  - { nome: clientes }
  - { nome: segmentação RFM }
  - { nome: entregas }
  - { nome: vendedores }
falta: O dashboard em Streamlit vem depois.
---

- Quais clientes estão prestes a abandonar a plataforma?
- Quais categorias geram mais receita e mais satisfação?
- O atraso na entrega derruba a avaliação?
- Como segmentar os clientes para campanhas de retenção (RFM e K-Means)?
