/*
 * O nome como histograma: com o mouse sobre o nome, cada letra cresce como uma barra conforme
 * um núcleo gaussiano centrado no cursor (a mesma ideia de uma estimativa de densidade).
 * Só com mouse e sem prefers-reduced-motion; o resto do tempo as letras ficam na altura normal.
 * As caixas das letras são lidas uma vez ao entrar (medir) e só escritas a cada quadro (aplicar).
 */
interface Caixa {
	centro: number;
	topo: number; // coordenadas da página, sem a escala do histograma
	base: number;
}

export function ligarNome() {
	const nome = document.querySelector<HTMLElement>('.nome');
	if (!nome) return;
	const letras = [...nome.querySelectorAll<HTMLElement>('.letra')];
	const mouse = matchMedia('(pointer: fine) and (hover: hover)');
	const reduzir = matchMedia('(prefers-reduced-motion: reduce)');

	let caixas: Caixa[] = [];
	let sigma = 40;
	const medir = () => {
		const sy = scrollY;
		caixas = letras.map((l) => {
			// A escala cresce a partir da base: a base e o centro não mudam; o topo vem da altura sem escala.
			const c = l.getBoundingClientRect();
			const base = c.bottom + sy;
			return { centro: c.left + c.width / 2, base, topo: base - l.offsetHeight };
		});
		const largura = nome.querySelector('.letras')?.getBoundingClientRect().width ?? 600;
		sigma = (largura / letras.length) * 0.9;
	};

	let pedido = 0;
	let cx = 0;
	let cy = 0;
	const aplicar = () => {
		pedido = 0;
		const py = cy + scrollY;
		letras.forEach((l, i) => {
			const c = caixas[i];
			if (!c) return;
			// Só as letras da mesma linha (o nome quebra em duas no celular).
			const naLinha = py >= c.topo - 20 && py <= c.base + 20;
			const k = naLinha ? Math.exp(-((cx - c.centro) ** 2) / (2 * sigma * sigma)) : 0;
			l.style.setProperty('--k', k.toFixed(3));
		});
	};

	nome.addEventListener('pointerenter', medir);
	addEventListener('resize', () => (caixas = []), { passive: true });
	nome.addEventListener('pointermove', (e) => {
		if (e.pointerType !== 'mouse' || !mouse.matches || reduzir.matches) return;
		if (!caixas.length) medir();
		cx = e.clientX;
		cy = e.clientY;
		if (!pedido) pedido = requestAnimationFrame(aplicar);
	});
	nome.addEventListener('pointerleave', () => {
		if (pedido) cancelAnimationFrame(pedido);
		pedido = 0;
		letras.forEach((l) => l.style.setProperty('--k', '0'));
	});
}
