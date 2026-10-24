/*
 * A amostra: um único conjunto de 96 pontos de exemplo, gerado aqui no navegador, que atravessa
 * a home. No topo é um gráfico de dispersão que responde ao cursor (os pontos perto dele abrem
 * espaço e recebem uma reta de mínimos quadrados calculada na hora). Descendo a página, os mesmos
 * pontos viram a pergunta, a tabela, a limpeza, a análise e o gráfico final.
 *
 * Dois canvas: um absoluto no topo da página, que rola junto com o nome (a dispersão parada), e um
 * fixo para o fluxo e para as transições. Leve de propósito: sem biblioteca; o laço só roda
 * enquanto algo se mexe e para fora da tela, com a aba oculta ou quando a entrada termina num
 * aparelho de toque. Com prefers-reduced-motion: reduce, cada etapa aparece pronta.
 */

type Estado = 'dispersao' | 'pergunta' | 'dados' | 'limpeza' | 'analise' | 'comunicacao';

/** Como um ponto é desenhado: posição, meia largura e meia altura, forma, opacidade. */
interface Forma {
	x: number;
	y: number;
	lw: number;
	lh: number;
	q: number; // 0 = círculo, 1 = linha de tabela (duas células, x e y)
	a: number;
	vazado: number; // 0 = cheio, 1 = só contorno (dado removido)
	destaque: number; // 0 = cor da série, 1 = cor de marca
	rola: number; // 1 = y em coordenadas da página (rola com o nome), 0 = da tela
}

interface Ponto {
	dx: number;
	dy: number;
	fora: boolean;
	faixa: number;
	fase: number;
	agora: Forma;
	de: Forma;
	para: Forma;
	t0: number;
}

const N = 96;
const FAIXAS = 5;
const BLOCOS = 4; // a tabela é mostrada em quatro blocos de linhas, lado a lado
const DURACAO = 820;
const PASSO = 5; // ms entre pontos: a transição corre pela amostra como uma onda
const MARGEM_MIRA = 24;
const RAIO_LENTE = 120;

/* ---------- Dados de exemplo (semente fixa: todo mundo vê a mesma amostra) ---------- */

function mulberry32(a: number) {
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const limitar = (v: number, a = 0.03, b = 0.97) => Math.min(b, Math.max(a, v));
const novaForma = (): Forma => ({ x: 0, y: 0, lw: 0, lh: 0, q: 0, a: 0, vazado: 0, destaque: 0, rola: 0 });

function gerarAmostra(): Ponto[] {
	const rnd = mulberry32(20261024);
	const normal = () => Math.sqrt(-2 * Math.log(rnd() || 1e-9)) * Math.cos(2 * Math.PI * rnd());
	const foras = new Set<number>();
	while (foras.size < 8) foras.add(Math.floor(rnd() * N));
	const pontos: Ponto[] = [];
	for (let i = 0; i < N; i++) {
		const dx = limitar(1 - Math.sqrt(rnd()));
		let dy = limitar(0.14 + 0.7 * dx + normal() * 0.075);
		const fora = foras.has(i);
		if (fora) dy = limitar(dy + (dy > 0.5 ? -1 : 1) * (0.38 + 0.2 * rnd()));
		pontos.push({
			dx,
			dy,
			fora,
			faixa: Math.min(FAIXAS - 1, Math.floor(dx * FAIXAS)),
			fase: rnd() * Math.PI * 2,
			agora: novaForma(),
			de: novaForma(),
			para: novaForma(),
			t0: 0,
		});
	}
	return pontos;
}

/** Mínimos quadrados: inclinação, intercepto e correlação de Pearson. */
function ajustar(xs: number[], ys: number[]) {
	const n = xs.length;
	let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
	for (let i = 0; i < n; i++) {
		sx += xs[i]; sy += ys[i];
		sxx += xs[i] * xs[i]; syy += ys[i] * ys[i]; sxy += xs[i] * ys[i];
	}
	const vx = sxx - (sx * sx) / n;
	const vy = syy - (sy * sy) / n;
	const cxy = sxy - (sx * sy) / n;
	const b = vx > 1e-9 ? cxy / vx : 0;
	return { b, a: (sy - b * sx) / n, r: vx > 1e-9 && vy > 1e-9 ? cxy / Math.sqrt(vx * vy) : 0 };
}

const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numero1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Pontos do caractere "?" desenhado na Archivo, normalizados em 0..1. */
function amostrarGlifo(): { x: number; y: number }[] {
	const L = 140;
	const c = document.createElement('canvas');
	c.width = c.height = L;
	const g = c.getContext('2d', { willReadFrequently: true });
	if (!g) return [];
	g.fillStyle = '#fff';
	g.font = `700 ${L * 0.95}px "Archivo Variable", Arial, sans-serif`;
	g.textAlign = 'center';
	g.textBaseline = 'middle';
	g.fillText('?', L / 2, L * 0.54);
	const dados = g.getImageData(0, 0, L, L).data;
	const lugares: { x: number; y: number }[] = [];
	for (let y = 0; y < L; y += 3) {
		for (let x = 0; x < L; x += 3) if (dados[(y * L + x) * 4 + 3] > 140) lugares.push({ x: x / L, y: y / L });
	}
	if (lugares.length < N) return lugares;
	const escolha: { x: number; y: number }[] = [];
	for (let k = 0; k < N; k++) escolha.push(lugares[Math.floor((k * lugares.length) / N)]);
	return escolha;
}

const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function ligarAmostra() {
	const fixa = document.querySelector<HTMLCanvasElement>('.amostra-fixa');
	const doTopo = document.querySelector<HTMLCanvasElement>('.amostra-abertura');
	const palco = document.querySelector<HTMLElement>('.palco');
	const abertura = document.querySelector<HTMLElement>('.abertura');
	const nome = document.querySelector<HTMLElement>('.nome');
	if (!fixa || !doTopo || !palco || !abertura || !nome) return null;
	const ctxFixa = fixa.getContext('2d');
	const ctxTopo = doTopo.getContext('2d');
	if (!ctxFixa || !ctxTopo) return null;
	let ctx = ctxFixa;

	const reduzir = matchMedia('(prefers-reduced-motion: reduce)');
	const mouse = matchMedia('(pointer: fine) and (hover: hover)');
	const empilhar = matchMedia('(max-width: 60rem)');
	const pontos = gerarAmostra();
	const limpos = pontos.filter((p) => !p.fora);
	const linhaLimpa = new Map(limpos.map((p, j) => [p, j]));
	const ajusteBruto = ajustar(pontos.map((p) => p.dx), pontos.map((p) => p.dy));
	const ajusteLimpo = ajustar(limpos.map((p) => p.dx), limpos.map((p) => p.dy));
	const contagem = Array.from({ length: FAIXAS }, (_, b) => limpos.filter((o) => o.faixa === b).length);
	const maior = Math.max(...contagem);
	let glifo: { x: number; y: number }[] = [];

	let L = 0, A = 0, dpr = 1, celular = false, empilhado = false;
	let nomeX = 0, nomeY = 0, folgaNome = 40, topoMin = 70, alturaTopo = 0, textoDireita = 0;
	// Bordas do contêiner da página (--pagina, sem a margem): o gráfico nunca passa delas.
	let contE = 0, contD = 0;
	let estado: Estado = 'dispersao';
	let inicioEstado = 0;
	let visivel = false;
	let aberturaNaTela = true;
	let rodando = false;
	let noTopo = false; // o desenho está no canvas que rola com a abertura
	let soOscilando = false;
	let ultimoDesenho = 0;
	let eixos = 0, eixosDe = 0, eixosPara = 1;
	const cursor = { x: -1e4, y: -1e4, dentro: false };
	const cor = { ponto: '', marca: '', eixo: '', suave: '', fundo: '' };

	const lerCores = () => {
		const s = getComputedStyle(document.documentElement);
		cor.ponto = s.getPropertyValue('--ponto').trim();
		cor.marca = s.getPropertyValue('--marca').trim();
		cor.eixo = s.getPropertyValue('--eixo').trim();
		cor.suave = s.getPropertyValue('--texto-suave').trim();
		cor.fundo = s.getPropertyValue('--fundo').trim();
	};

	/*
	 * Área do gráfico, sempre dentro do contêiner da página. Na dispersão, em coordenadas da
	 * página: entre o topo de .grafico-area e o nome (o nome é o rótulo do eixo x); o eixo y fica
	 * na margem esquerda do contêiner, alinhado ao nome. No fluxo, em coordenadas da tela: ao lado
	 * do texto, ou acima dele quando a tela é estreita. Nunca mais alta que 3/4 da largura.
	 */
	const regiao = (e: Estado) => {
		let x0: number, x1: number, y0: number, y1: number;
		if (e === 'dispersao') {
			x0 = Math.max(contE, nomeX) + 10;
			x1 = contD;
			y1 = nomeY - folgaNome;
			y0 = Math.min(topoMin, y1 - 90);
			return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 };
		}
		if (empilhado) [x0, x1, y0, y1] = [contE + 10, contD, A * 0.07, A * 0.46];
		else [x0, x1, y0, y1] = [Math.max(contE + (contD - contE) * 0.5, textoDireita + 32), contD, A * 0.18, A * 0.82];
		const largura = Math.min(x1 - x0, (y1 - y0) * 1.33, 620);
		x0 += (x1 - x0 - largura) / 2;
		x1 = x0 + largura;
		const altura = Math.min(y1 - y0, largura * 0.75);
		y0 += (y1 - y0 - altura) / 2;
		y1 = y0 + altura;
		return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 };
	};

	const raio = () => (celular ? 2.6 : 3.4);

	const alvo = (p: Ponto, i: number, e: Estado): Forma => {
		const R = regiao(e);
		const r = raio();
		const f: Forma = { x: 0, y: 0, lw: r, lh: r, q: 0, a: 0.85, vazado: 0, destaque: 0, rola: 0 };
		if (e === 'dispersao' || e === 'analise') {
			f.x = R.x0 + p.dx * R.w;
			f.y = R.y1 - p.dy * R.h;
			if (e === 'dispersao') f.rola = 1;
			if (e === 'analise' && p.fora) {
				f.vazado = 1;
				f.a = 0.55;
			}
			return f;
		}
		if (e === 'pergunta') {
			const lado = Math.min(R.w, R.h);
			const g = glifo[i] ?? { x: 0.5 + 0.3 * Math.cos((i / N) * 6.283), y: 0.5 + 0.3 * Math.sin((i / N) * 6.283) };
			f.x = R.x0 + (R.w - lado) / 2 + g.x * lado;
			f.y = R.y0 + (R.h - lado) / 2 + g.y * lado;
			return f;
		}
		if (e === 'dados' || e === 'limpeza') {
			// Cada ponto é uma linha da tabela (células x e y). Na limpeza, as linhas fora do padrão
			// saem inteiras e as outras sobem para fechar a tabela, sem buracos.
			const porBloco = Math.ceil(N / BLOCOS);
			const vao = celular ? 8 : 14;
			const bw = (R.w - vao * (BLOCOS - 1)) / BLOCOS;
			const lh = Math.min(R.h / porBloco, 16);
			const topo = R.y0 + (R.h - lh * porBloco) / 2;
			const j = e === 'limpeza' && !p.fora ? (linhaLimpa.get(p) ?? i) : i;
			f.q = 1;
			f.lw = bw / 2;
			f.lh = Math.max(1.5, lh * 0.32);
			f.a = 0.7;
			f.x = R.x0 + Math.floor(j / porBloco) * (bw + vao) + bw / 2;
			f.y = topo + ((j % porBloco) + 0.5) * lh;
			if (e === 'limpeza' && p.fora) {
				f.x += bw * 0.35;
				f.vazado = 1;
				f.a = 0;
			}
			return f;
		}
		// comunicacao: as linhas limpas empilhadas por faixa de x, como um gráfico de barras de pontos.
		if (p.fora) {
			f.x = R.x0 + p.dx * R.w;
			f.y = R.y1 - p.dy * R.h;
			f.a = 0;
			return f;
		}
		const k = limpos.filter((o) => o.faixa === p.faixa).indexOf(p);
		const lado = 3;
		const passo = Math.min(r * 2.6 + 5, R.h / Math.ceil(maior / lado));
		f.lw = f.lh = r * 1.3;
		const cx = R.x0 + ((p.faixa + 0.5) * R.w) / FAIXAS;
		f.x = cx + ((k % lado) - (lado - 1) / 2) * passo;
		f.y = R.y1 - passo / 2 - Math.floor(k / lado) * passo;
		f.destaque = contagem[p.faixa] === maior ? 1 : 0;
		f.a = 0.95;
		return f;
	};

	const copiar = (de: Forma, para: Forma) => Object.assign(para, de);

	const irPara = (e: Estado, instantaneo = false) => {
		estado = e;
		const t = performance.now();
		inicioEstado = t;
		eixosDe = eixos;
		eixosPara = e === 'dispersao' || e === 'analise' || e === 'comunicacao' ? 1 : 0;
		pontos.forEach((p, i) => {
			copiar(p.agora, p.de);
			p.para = alvo(p, i, e);
			// Na limpeza, as linhas removidas saem primeiro; depois a tabela fecha.
			const atraso = e === 'limpeza' && !p.fora ? 360 : 0;
			p.t0 = t + atraso + i * PASSO;
			if (instantaneo) copiar(p.para, p.agora);
		});
		if (instantaneo) eixos = eixosPara;
		pedirQuadro();
	};

	/* ---------- Medidas ---------- */

	const dimensionar = (c: HTMLCanvasElement, w: number, h: number) => {
		const cw = Math.round(w * dpr), ch = Math.round(h * dpr);
		if (c.width !== cw) c.width = cw;
		if (c.height !== ch) c.height = ch;
	};

	/** Posição do nome e altura da abertura, em coordenadas da página. Devolve true se mudou. */
	const medirAbertura = () => {
		const sy = scrollY;
		const n = nome.getBoundingClientRect();
		const fs = parseFloat(getComputedStyle(nome).fontSize) || 60;
		const area = document.querySelector('.grafico-area')?.getBoundingClientRect();
		const ab = abertura.getBoundingClientRect();
		const est = getComputedStyle(abertura);
		contE = ab.left + (parseFloat(est.paddingLeft) || 0);
		contD = ab.right - (parseFloat(est.paddingRight) || 0);
		const novo = {
			x: n.left,
			y: n.top + sy,
			// Folga entre o eixo e o nome: cobre o "i" esticado pelo histograma (até 25%).
			folga: Math.round(fs * 0.3 + 14),
			topo: area ? area.top + sy + 8 : 70,
			altura: Math.ceil(abertura.getBoundingClientRect().bottom + sy),
		};
		const mudou =
			Math.abs(novo.x - nomeX) > 1 || Math.abs(novo.y - nomeY) > 1 || novo.folga !== folgaNome ||
			Math.abs(novo.topo - topoMin) > 1 || novo.altura !== alturaTopo;
		nomeX = novo.x;
		nomeY = novo.y;
		folgaNome = novo.folga;
		topoMin = novo.topo;
		alturaTopo = novo.altura;
		doTopo.style.height = `${alturaTopo}px`;
		dimensionar(doTopo, L, alturaTopo);
		return mudou;
	};

	const medirTela = () => {
		const caixa = fixa.getBoundingClientRect();
		if (caixa.width === L && caixa.height === A) return;
		L = caixa.width;
		A = caixa.height;
		celular = L < 760;
		empilhado = empilhar.matches;
		dpr = Math.min(devicePixelRatio || 1, celular ? 1.5 : 2);
		dimensionar(fixa, L, A);
		const lista = document.querySelector('.etapas')?.getBoundingClientRect();
		textoDireita = lista ? lista.right : L * 0.45;
		medirAbertura();
		ultimoDesenho = 0;
		irPara(estado, true);
	};

	/** O nome mudou de lugar (fonte carregada, texto quebrou): o eixo da dispersão acompanha. */
	const remedirNome = () => {
		if (!L || !medirAbertura()) return;
		if (estado === 'dispersao') pontos.forEach((p, i) => (p.para = alvo(p, i, 'dispersao')));
		ultimoDesenho = 0;
		pedirQuadro();
	};

	/* ---------- Desenho ---------- */

	const desenharPonto = (f: Forma, dxv = 0, dyv = 0, realce = 0) => {
		if (f.a <= 0.01) return;
		const x = f.x + dxv;
		const y = f.y + dyv;
		const lw = f.lw + realce;
		const lh = f.lh + realce;
		ctx.globalAlpha = Math.min(1, f.a + realce * 0.1);
		ctx.beginPath();
		if (f.q > 0.5) {
			// Linha de tabela: duas células, x e y.
			const g = 3;
			const rc = Math.min(2, lh);
			ctx.roundRect(x - lw, y - lh, lw - g / 2, lh * 2, rc);
			ctx.roundRect(x + g / 2, y - lh, lw - g / 2, lh * 2, rc);
		} else ctx.roundRect(x - lw, y - lh, lw * 2, lh * 2, Math.min(lw, lh) * (1 - f.q) + 2 * f.q);
		if (f.vazado > 0.5) {
			ctx.strokeStyle = cor.suave;
			ctx.lineWidth = 1.5;
			ctx.stroke();
		} else {
			ctx.fillStyle = f.destaque > 0.5 ? cor.marca : cor.ponto;
			ctx.fill();
		}
	};

	const texto = (s: string, x: number, y: number, c: string, alinhar: CanvasTextAlign = 'left') => {
		ctx.globalAlpha = 1;
		ctx.font = `600 ${celular ? 12 : 14}px "Archivo Variable", Arial, sans-serif`;
		ctx.textAlign = alinhar;
		ctx.textBaseline = 'middle';
		// Contorno da cor do fundo: o rótulo continua legível sobre os pontos.
		ctx.lineWidth = 4;
		ctx.strokeStyle = cor.fundo;
		ctx.strokeText(s, x, y);
		ctx.fillStyle = c;
		ctx.fillText(s, x, y);
	};

	const desenharEixos = (e: Estado, deslocY: number) => {
		if (eixos <= 0.01) return;
		const R = regiao(e);
		const d = e === 'dispersao' ? deslocY : 0;
		ctx.globalAlpha = eixos;
		ctx.strokeStyle = cor.eixo;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		if (e !== 'comunicacao') {
			ctx.moveTo(R.x0 - 10, R.y0 + d);
			ctx.lineTo(R.x0 - 10, R.y1 + 10 + d);
		} else ctx.moveTo(R.x0 - 10, R.y1 + 10);
		ctx.lineTo(R.x1, R.y1 + 10 + d);
		ctx.stroke();
	};

	const quadro = (t: number) => {
		rodando = false;
		if (!visivel || document.hidden) return;
		// Só a oscilação está rodando: 30 quadros por segundo bastam.
		if (soOscilando && t - ultimoDesenho < 31) {
			pedirQuadro();
			return;
		}
		ultimoDesenho = t;
		const parado = reduzir.matches;
		const sy = scrollY;
		let transicao = false;

		// Interpolação de cada ponto até o alvo da etapa atual (em coordenadas da tela durante a viagem).
		for (const p of pontos) {
			const k = parado ? 1 : Math.min(1, Math.max(0, (t - p.t0) / DURACAO));
			const a = p.de, b = p.para, o = p.agora;
			if (k >= 1) {
				copiar(b, o);
				continue;
			}
			transicao = true;
			const e = suave(k);
			const ya = a.y - a.rola * sy;
			const yb = b.y - b.rola * sy;
			o.x = a.x + (b.x - a.x) * e;
			o.y = ya + (yb - ya) * e;
			o.rola = 0;
			o.lw = a.lw + (b.lw - a.lw) * e;
			o.lh = a.lh + (b.lh - a.lh) * e;
			o.q = a.q + (b.q - a.q) * e;
			o.a = a.a + (b.a - a.a) * e;
			o.vazado = k > 0.5 ? b.vazado : a.vazado;
			o.destaque = a.destaque + (b.destaque - a.destaque) * e;
		}
		const ke = parado ? 1 : Math.min(1, (t - inicioEstado) / DURACAO);
		eixos = eixosDe + (eixosPara - eixosDe) * suave(ke);
		if (ke < 1) transicao = true;

		// Dispersão parada: desenha no canvas que rola com o nome. Em viagem: no canvas fixo.
		const topo = estado === 'dispersao' && !transicao;
		if (topo !== noTopo) {
			const outro = topo ? ctxFixa : ctxTopo;
			outro.setTransform(1, 0, 0, 1, 0, 0);
			outro.clearRect(0, 0, outro.canvas.width, outro.canvas.height);
			noTopo = topo;
		}
		ctx = topo ? ctxTopo : ctxFixa;
		const altura = topo ? alturaTopo : A;
		const desloc = topo ? 0 : -sy; // soma ao y dos pontos que rolam com a página
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, L, altura);
		desenharEixos(estado, desloc);

		const R = regiao(estado);
		const cy = cursor.y + sy; // cursor em coordenadas da página
		const lenteLigada = topo && !parado && mouse.matches && cursor.dentro;
		const oscilar = topo && !parado && mouse.matches && aberturaNaTela;
		const naLente: Ponto[] = [];

		for (const p of pontos) {
			let ox = 0, oy = p.agora.rola * desloc, realce = 0;
			if (oscilar) {
				// Oscilação lenta: a amostra respira no lugar (só com mouse).
				ox += Math.sin(t * 0.0005 + p.fase) * 2.5;
				oy += Math.cos(t * 0.00043 + p.fase * 1.3) * 2.5;
			}
			if (lenteLigada) {
				const vx = p.agora.x - cursor.x;
				const vy = p.agora.y - cy;
				const d = Math.hypot(vx, vy);
				if (d < RAIO_LENTE) {
					const forca = (1 - d / RAIO_LENTE) ** 2 * 16;
					ox += (vx / (d || 1)) * forca;
					oy += (vy / (d || 1)) * forca;
					realce = 1.2;
					naLente.push(p);
				}
			}
			desenharPonto(p.agora, ox, oy, realce);
		}

		// Reta ajustada aos pontos que estão sob a mira, recalculada a cada quadro.
		if (lenteLigada) {
			ctx.globalAlpha = 0.9;
			ctx.setLineDash([3, 5]);
			ctx.strokeStyle = cor.eixo;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(R.x0 - 10, cy);
			ctx.lineTo(cursor.x, cy);
			ctx.moveTo(cursor.x, cy);
			ctx.lineTo(cursor.x, R.y0 - 4);
			ctx.stroke();
			ctx.setLineDash([]);
			const vx = limitar((cursor.x - R.x0) / R.w, 0, 1) * 100;
			const vy = limitar((R.y1 - cy) / R.h, 0, 1) * 100;
			texto(numero1.format(vx), cursor.x, R.y0 - 16, cor.suave, 'center');
			// Valor de y logo à direita do eixo, para não sair do contêiner.
			texto(numero1.format(vy), R.x0 - 4, cy - 12, cor.suave, 'left');

			if (naLente.length >= 3) {
				const aj = ajustar(naLente.map((p) => p.dx), naLente.map((p) => p.dy));
				const xs = naLente.map((p) => p.dx);
				const xa = Math.min(...xs), xb = Math.max(...xs);
				ctx.globalAlpha = 1;
				ctx.strokeStyle = cor.marca;
				ctx.lineWidth = 2.5;
				ctx.beginPath();
				ctx.moveTo(R.x0 + xa * R.w, R.y1 - (aj.a + aj.b * xa) * R.h);
				ctx.lineTo(R.x0 + xb * R.w, R.y1 - (aj.a + aj.b * xb) * R.h);
				ctx.stroke();
				texto(`n = ${naLente.length}`, cursor.x + 18, cy + 22, cor.marca);
				texto(`r = ${numero.format(aj.r)}`, cursor.x + 18, cy + 40, cor.marca);
			}
		}

		// Etapa "análise": a reta da amostra limpa cresce da esquerda para a direita.
		let reta = false;
		if (estado === 'analise') {
			const k = parado ? 1 : Math.min(1, Math.max(0, (t - inicioEstado - DURACAO * 0.6) / 700));
			if (k < 1) reta = true;
			if (k > 0) {
				const xb = suave(k);
				ctx.globalAlpha = 1;
				ctx.strokeStyle = cor.marca;
				ctx.lineWidth = 2.5;
				ctx.beginPath();
				ctx.moveTo(R.x0, R.y1 - ajusteLimpo.a * R.h);
				ctx.lineTo(R.x0 + xb * R.w, R.y1 - (ajusteLimpo.a + ajusteLimpo.b * xb) * R.h);
				ctx.stroke();
				if (k === 1) {
					texto(`r = ${numero.format(ajusteLimpo.r)}`, R.x1, R.y1 - (ajusteLimpo.a + ajusteLimpo.b) * R.h - 18, cor.marca, 'right');
				}
			}
		}

		soOscilando = oscilar && !transicao && !reta && !lenteLigada;
		if (transicao || reta || oscilar) pedirQuadro();
	};

	function pedirQuadro() {
		if (rodando || !visivel || document.hidden) return;
		rodando = true;
		requestAnimationFrame(quadro);
	}

	/* ---------- Números de cada etapa, calculados da própria amostra ---------- */

	const preencher = (chave: string, frase: string) => {
		const el = document.querySelector(`[data-medida="${chave}"]`);
		if (el) el.textContent = frase;
	};
	const removidas = N - limpos.length;
	const faixaMaior = contagem.indexOf(maior);
	preencher('pergunta', 'Nos pontos lá de cima, a pergunta é: quando x cresce, y cresce junto?');
	preencher('dados', `A amostra tem ${N} linhas, cada uma com um valor de x e um de y, de 0 a 100.`);
	preencher(
		'limpeza',
		`Aqui, ${removidas} das ${N} linhas fugiam do padrão e saíram. Com elas, a correlação r era ${numero.format(ajusteBruto.r)}; sem elas, ${numero.format(ajusteLimpo.r)}.`,
	);
	preencher(
		'analise',
		`Nas ${limpos.length} linhas que ficaram, r = ${numero.format(ajusteLimpo.r)} e a reta sobe ${numero.format(ajusteLimpo.b)} em y a cada 1 em x.`,
	);
	preencher(
		'comunicacao',
		`A barra em destaque é a de x entre ${faixaMaior * 20} e ${(faixaMaior + 1) * 20}: ${maior} dos ${limpos.length} pontos.`,
	);

	/* ---------- Ligações ---------- */

	lerCores();
	medirTela();

	// Entrada: os pontos sobem do eixo x até o lugar, uma vez por carregamento.
	if (!reduzir.matches) {
		const base = regiao('dispersao').y1;
		pontos.forEach((p) => {
			p.agora.y = base + 10;
			p.agora.a = 0;
			p.agora.rola = 1;
		});
		eixos = 0;
		irPara('dispersao');
	}

	// O "?" usa a Archivo; espera a fonte para amostrar o glifo certo.
	document.fonts?.ready.then(() => {
		glifo = amostrarGlifo();
		remedirNome();
		if (estado === 'pergunta') irPara('pergunta');
	});
	document.fonts?.addEventListener?.('loadingdone', remedirNome);

	new ResizeObserver(() => medirTela()).observe(fixa);
	const observarNome = new ResizeObserver(() => remedirNome());
	[abertura, nome, document.querySelector('.grafico-area')].forEach((el) => el && observarNome.observe(el));

	new IntersectionObserver(
		([e]) => {
			visivel = e.isIntersecting;
			fixa.classList.toggle('visivel', visivel);
			if (visivel) pedirQuadro();
		},
		{ rootMargin: '-55% 0px 0px 0px' },
	).observe(palco);

	new IntersectionObserver(([e]) => {
		aberturaNaTela = e.isIntersecting;
		if (aberturaNaTela) pedirQuadro();
	}).observe(abertura);

	// A etapa cujo bloco cruza o meio da tela decide a forma da amostra.
	const blocos = [...document.querySelectorAll<HTMLElement>('[data-estado]')];
	const observador = new IntersectionObserver(
		(entradas) => {
			for (const e of entradas) {
				if (!e.isIntersecting) continue;
				const novo = e.target.getAttribute('data-estado') as Estado;
				blocos.forEach((b) => b.classList.toggle('atual', b === e.target));
				if (novo !== estado) irPara(novo, reduzir.matches);
			}
		},
		{ rootMargin: '-50% 0px -50% 0px' },
	);
	blocos.forEach((b) => observador.observe(b));

	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) pedirQuadro();
	});
	// Voltando pelo histórico (bfcache): o laço recomeça.
	addEventListener('pageshow', (e) => {
		if (!e.persisted) return;
		rodando = false;
		ultimoDesenho = 0;
		pedirQuadro();
	});

	/** O ponto (em coordenadas da tela) está sobre a área do gráfico da abertura? */
	const dentro = (x: number, y: number) => {
		if (estado !== 'dispersao' || reduzir.matches) return false;
		const R = regiao('dispersao');
		const py = y + scrollY;
		return x > R.x0 - MARGEM_MIRA && x < R.x1 + MARGEM_MIRA && py > R.y0 - MARGEM_MIRA && py < R.y1 + MARGEM_MIRA;
	};

	const atualizarCursor = () => {
		const antes = cursor.dentro;
		cursor.dentro = dentro(cursor.x, cursor.y);
		if (estado === 'dispersao' && (cursor.dentro || antes)) {
			soOscilando = false;
			pedirQuadro();
		}
	};

	addEventListener(
		'pointermove',
		(e) => {
			if (e.pointerType !== 'mouse') return;
			cursor.x = e.clientX;
			cursor.y = e.clientY;
			atualizarCursor();
		},
		{ passive: true },
	);
	addEventListener('scroll', () => mouse.matches && atualizarCursor(), { passive: true });
	document.documentElement.addEventListener('mouseleave', () => {
		cursor.dentro = false;
		pedirQuadro();
	});

	// Troca da cor da série (legenda do gráfico).
	addEventListener('serie', () => {
		lerCores();
		ultimoDesenho = 0;
		pedirQuadro();
	});
	reduzir.addEventListener('change', () => irPara(estado, reduzir.matches));
	empilhar.addEventListener('change', () => {
		L = -1;
		medirTela();
	});

	return { dentro };
}
