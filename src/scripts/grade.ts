/*
 * O cartão é um plano de gráfico: sob o mouse, a grade acende em volta do cursor, como quem lê
 * um valor no gráfico. Só com mouse e sem prefers-reduced-motion; sem isso, o cartão só muda a borda.
 * Usado pelos cartões de análise e de projeto; liga cada cartão uma vez só.
 */
const ligados = new WeakSet<Element>();

export function ligarGrade() {
	const mouse = matchMedia('(pointer: fine) and (hover: hover)');
	const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
	document.querySelectorAll<HTMLElement>('.cartao').forEach((c) => {
		if (ligados.has(c)) return;
		ligados.add(c);
		c.addEventListener('pointermove', (e) => {
			if (!mouse.matches || reduzir.matches) return;
			const r = c.getBoundingClientRect();
			c.style.setProperty('--mx', `${e.clientX - r.left}px`);
			c.style.setProperty('--my', `${e.clientY - r.top}px`);
		});
	});
}
