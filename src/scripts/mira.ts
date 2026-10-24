/*
 * Mira: sobre o gráfico da home, o cursor vira a cruz de leitura do gráfico. Fora dele (texto,
 * links, páginas internas) o cursor do sistema continua, para selecionar e clicar como sempre.
 * Só liga no primeiro movimento de mouse de verdade (pointerType 'mouse'), com pointer: fine e
 * sem prefers-reduced-motion.
 */
const ACAO = 'a, button, [role="button"], label, summary, select, input, textarea, [contenteditable="true"]';

export function ligarMira(dentro: (x: number, y: number) => boolean) {
	const mira = document.querySelector<HTMLElement>('.mira');
	if (!mira) return;
	const fino = matchMedia('(pointer: fine) and (hover: hover)');
	const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
	const raiz = document.documentElement;

	const esconder = () => {
		mira.classList.remove('visivel');
		raiz.classList.remove('mira-no-grafico');
	};

	let x = -100;
	let y = -100;
	let alvo: Element | null = null;
	let pendente = false;

	const avaliar = () => {
		const sobre = dentro(x, y) && !alvo?.closest(ACAO);
		raiz.classList.toggle('mira-no-grafico', sobre);
		mira.classList.toggle('visivel', sobre);
	};

	const pintar = () => {
		pendente = false;
		mira.style.transform = `translate3d(${x}px, ${y}px, 0)`;
	};

	addEventListener(
		'pointermove',
		(e) => {
			if (e.pointerType !== 'mouse' || !fino.matches || reduzir.matches) {
				esconder();
				return;
			}
			raiz.classList.add('com-mira');
			x = e.clientX;
			y = e.clientY;
			alvo = e.target instanceof Element ? e.target : null;
			avaliar();
			if (!pendente) {
				pendente = true;
				requestAnimationFrame(pintar);
			}
		},
		{ passive: true },
	);
	// Rolando com o mouse parado, o gráfico passa por baixo do cursor.
	addEventListener('scroll', () => raiz.classList.contains('com-mira') && avaliar(), { passive: true });

	reduzir.addEventListener('change', () => {
		if (reduzir.matches) {
			esconder();
			raiz.classList.remove('com-mira');
		}
	});
	addEventListener('pointerdown', () => mira.classList.add('pressionada'));
	addEventListener('pointerup', () => mira.classList.remove('pressionada'));
	raiz.addEventListener('mouseleave', esconder);
	addEventListener('blur', esconder);
}
