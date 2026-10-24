// Roda depois de `astro build` e falha se o site compilado tiver placeholder visível.
// Uso: node scripts/checar-placeholders.mjs [pasta]   (padrão: dist)
//
// O que procura:
// - em qualquer arquivo de texto (HTML, XML, TXT, JSON, webmanifest): `SEU-PERFIL` e `exemplo.com`,
//   que só aparecem em link falso;
// - no HTML, fora de <script> e <style>: texto começando com colchete logo após uma tag (`>[`)
//   e colchetes de marcador como `[ex.:`, `[Troque`, `[seu`, `[sua`, `[Escreva`, `[Preencha`.
// JS e CSS não são varridos por colchetes: ali `[` é sintaxe, não texto.
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const raiz = process.argv[2] ?? 'dist';

const LITERAIS = ['SEU-PERFIL', 'exemplo.com'];
const TEXTO = new Set(['.html', '.xml', '.txt', '.json', '.webmanifest']);
const MARCADORES = [
	/>\s*\[/g, // texto visível que começa com colchete
	/\[\s*(?:ex\.?\s*:|troque|seu\b|sua\b|seus\b|suas\b|escreva|preencha|insira|adicione|coloque|nome\b|t[íi]tulo\b)/gi,
];

async function* arquivos(dir) {
	for (const item of await readdir(dir, { withFileTypes: true })) {
		const caminho = join(dir, item.name);
		if (item.isDirectory()) yield* arquivos(caminho);
		else yield caminho;
	}
}

const linhaDe = (texto, indice) => texto.slice(0, indice).split('\n').length;

/** Troca <script>, <style> e comentários por espaços do mesmo tamanho (preserva as linhas). */
const semCodigo = (html) =>
	html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, (m) =>
		m.replace(/[^\n]/g, ' '),
	);

const achados = [];
let total = 0;

try {
	for await (const arquivo of arquivos(raiz)) {
		const ext = extname(arquivo).toLowerCase();
		if (!TEXTO.has(ext)) continue;
		total++;
		const conteudo = await readFile(arquivo, 'utf8');
		const nome = relative(process.cwd(), arquivo);

		for (const literal of LITERAIS) {
			let i = conteudo.indexOf(literal);
			while (i !== -1) {
				achados.push(`${nome}:${linhaDe(conteudo, i)}  link falso "${literal}"`);
				i = conteudo.indexOf(literal, i + 1);
			}
		}

		if (ext !== '.html') continue;
		const visivel = semCodigo(conteudo);
		const vistos = new Set(); // o mesmo colchete pode casar com mais de um padrão
		for (const padrao of MARCADORES) {
			for (const m of visivel.matchAll(padrao)) {
				const colchete = visivel.indexOf('[', m.index);
				if (vistos.has(colchete)) continue;
				vistos.add(colchete);
				const trecho = visivel.slice(m.index, m.index + 60).replace(/\s+/g, ' ');
				achados.push(`${nome}:${linhaDe(visivel, m.index)}  placeholder "${trecho}"`);
			}
		}
	}
} catch (erro) {
	console.error(`checar-placeholders: não foi possível ler "${raiz}": ${erro.message}`);
	process.exit(1);
}

if (achados.length > 0) {
	console.error(`checar-placeholders: ${achados.length} placeholder(s) em dist/:\n`);
	for (const a of achados) console.error(`  ${a}`);
	console.error('\nPreencha ou remova esses trechos antes de publicar.');
	process.exit(1);
}

console.log(`checar-placeholders: ${total} arquivo(s) em ${raiz}/ sem placeholders.`);
