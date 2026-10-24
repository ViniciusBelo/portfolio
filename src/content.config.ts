import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: z.coerce.date(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			// Imagem de capa opcional, relativa ao arquivo .md (ex.: ./capa.png)
			cover: image().optional(),
			coverAlt: z.string().optional(),
		}),
});

/**
 * Projetos (repositórios no GitHub). Um arquivo .md por projeto em src/content/projetos/.
 * O corpo do arquivo vira a lista de perguntas do cartão. Ver README.md.
 */
const projetos = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		repo: z.string().url(),
		status: z.enum(['concluido', 'em-andamento']),
		ferramentas: z.array(z.string()).default([]),
		/** Menor aparece primeiro. */
		ordem: z.number().default(100),
		/** Cartão largo, com o progresso desenhado. Use em um projeto só. */
		destaque: z.boolean().default(false),
		/** Data de referência (última atualização do repositório). Desempata a ordem. */
		date: z.coerce.date(),
		/** Etapas do projeto, na ordem; `feita: true` nas concluídas. Opcional. */
		etapas: z.array(z.object({ nome: z.string(), feita: z.boolean().default(false) })).optional(),
		/** Frase opcional sobre o que falta além das etapas. */
		falta: z.string().optional(),
		/** Rascunho: só aparece em `npm run dev`. */
		draft: z.boolean().default(false),
	}),
});

export const collections = { posts, projetos };
