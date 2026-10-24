# Portfólio de análise de dados

Site pessoal de Vinicius Belo, publicado em https://viniciusbelo.github.io/portfolio/.

## Rodar localmente

```sh
npm install
npm run dev
```

## Publicar uma análise

1. Crie um arquivo em `src/content/posts/` (use `modelo-de-post.md` como base).
2. Mude `draft` para `false`.
3. Faça commit e push na branch `main`; o GitHub Actions publica o site.

As decisões de design estão em `DESIGN.md`.

## Adicionar um projeto

Os projetos aparecem na home, logo abaixo do nome, e cada cartão abre o repositório no GitHub.

1. Crie um arquivo em `src/content/projetos/`, por exemplo `meu-projeto.md` (copie um dos que já existem).
2. Preencha o cabeçalho:

   ```yaml
   ---
   title: Nome do projeto
   description: Uma ou duas frases sobre os dados e o que o projeto faz.
   repo: https://github.com/ViniciusBelo/nome-do-repositorio
   status: concluido          # ou em-andamento
   ferramentas: [Python, Pandas]
   ordem: 3                   # menor aparece primeiro
   destaque: false            # true deixa o cartão largo; use em um projeto só
   date: 2026-10-24           # última atualização do repositório (desempata a ordem)
   # Opcional, para projetos em andamento: uma etapa por linha, na ordem.
   # etapas:
   #   - { nome: exploração inicial, feita: true }
   #   - { nome: limpeza, feita: false }
   # falta: Frase curta sobre o que vem depois.
   ---
   ```

3. No corpo do arquivo, liste as perguntas que o projeto responde (uma por linha, começando com `- `).
4. Quando uma etapa ficar pronta, mude `feita` para `true`; quando o projeto acabar, mude `status` para `concluido`.
5. `npm run build` valida o cabeçalho (campo faltando ou `status` errado faz o build falhar).
