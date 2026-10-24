// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

// GitHub Pages
// ------------
// O endereço final depende do usuário do GitHub e do nome do repositório.
// Preencha pelas variáveis de ambiente (ex.: no workflow do GitHub Actions)
// ou troque os valores padrão abaixo quando o usuário estiver confirmado.
//
//   SITE_URL   https://viniciusbelo.github.io
//   BASE_PATH  /portfolio   (nome do repositório, com barra no início)
//
// Se o repositório se chamar viniciusbelo.github.io, use BASE_PATH=/
const site = process.env.SITE_URL ?? 'https://viniciusbelo.github.io';
const base = process.env.BASE_PATH ?? '/portfolio';

/**
 * Plugin do Sätteri (processador de Markdown padrão do Astro 7): põe a classe `zebra` em toda
 * <table> vinda do Markdown, para os artigos usarem a mesma regra de faixas de global.css
 * (primeira linha no fundo, pares na faixa).
 */
const tabelaZebra = {
	name: 'tabela-zebra',
	element: {
		filter: ['table'],
		/** @param {any} node @param {any} ctx */
		visit(node, ctx) {
			ctx.setProperty(node, 'className', ['zebra']);
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site,
	base,
	trailingSlash: 'ignore',
	markdown: {
		processor: satteri({ hastPlugins: [tabelaZebra] }),
		shikiConfig: {
			// Tema escuro. github-dark-default foi escolhido por contraste: a cor de token mais
			// fraca (comentários, #8b949e) dá 5,3:1 sobre --filme (#11212b); github-dark (3,4:1),
			// night-owl, tokyo-night e solarized-dark ficam abaixo de AA nos comentários.
			// O transformer abaixo tira o background-color que o Shiki grava no style do <pre>; o
			// fundo vem de `.texto pre` em src/pages/posts/[...slug].astro (var(--filme)),
			// sem precisar de !important.
			theme: 'github-dark-default',
			wrap: false,
			transformers: [
				{
					name: 'sem-fundo',
					pre(node) {
						const style = String(node.properties.style ?? '');
						node.properties.style = style.replace(/background-color:[^;]+;?/g, '');
					},
				},
			],
		},
	},
});
