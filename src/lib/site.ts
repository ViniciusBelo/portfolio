import { getCollection, type CollectionEntry } from 'astro:content';

type Links = {
	github: string;
	/** Endereço completo do perfil. Vazio = o link não aparece no site. */
	linkedin?: string;
	/** Só o endereço de e-mail, sem "mailto:". Vazio = o link não aparece no site. */
	email?: string;
};

const links: Links = {
	github: 'https://github.com/ViniciusBelo',
	// Preencha aqui com a URL do seu perfil (https://www.linkedin.com/in/...) quando quiser exibi-lo.
	linkedin: '',
	// Preencha aqui com seu endereço de e-mail quando quiser exibi-lo.
	email: '',
};

/** Dados do autor. */
export const SITE = {
	author: 'Vinicius Belo',
	description: 'Portfólio de análise de dados de Vinicius Belo.',
	links,
};

/** Link de e-mail pronto para `href`, ou undefined se não houver e-mail. */
export const emailHref = SITE.links.email ? `mailto:${SITE.links.email}` : undefined;

/** Prefixa um caminho interno com o `base` do GitHub Pages. */
export function url(path = '/'): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/, '');
	const clean = path.startsWith('/') ? path : `/${path}`;
	return `${base}${clean}`;
}

/** Posts publicados, do mais novo ao mais antigo. Rascunhos só aparecem em `npm run dev`. */
export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
	const posts = await getCollection('posts', ({ data }) =>
		import.meta.env.PROD ? !data.draft : true,
	);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Projetos publicados, na ordem de `ordem` (e do mais novo ao mais antigo, no empate). */
export async function getProjetos(): Promise<CollectionEntry<'projetos'>[]> {
	const projetos = await getCollection('projetos', ({ data }) =>
		import.meta.env.PROD ? !data.draft : true,
	);
	return projetos.sort(
		(a, b) => a.data.ordem - b.data.ordem || b.data.date.valueOf() - a.data.date.valueOf(),
	);
}

const longDate = new Intl.DateTimeFormat('pt-BR', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC',
});

const shortDate = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	timeZone: 'UTC',
});

export const formatDate = (d: Date) => longDate.format(d);
export const formatShortDate = (d: Date) => shortDate.format(d);
