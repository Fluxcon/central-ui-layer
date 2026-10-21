<template>
	<UCard :ui="{ body: 'h-72' }">
		<template #header>
			<p class="text-xs text-muted uppercase mb-1.5">SBD activations and usage</p>
			<p class="text-3xl text-highlighted font-semibold">{{ total }}</p>
		</template>
		<canvas ref="canvas" role="img" aria-label="SBD activations and usage" />
	</UCard>
</template>

<script setup lang="ts">
	import {
		Chart,
		BarController,
		BarElement,
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Legend,
		Tooltip,
	} from 'chart.js';

	Chart.register(
		BarController,
		BarElement,
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Legend,
		Tooltip,
	);

	const { days, period } = defineProps<{ days: number; period: Period }>();

	const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
	const colorMode = useColorMode();
	let chart: Chart | undefined;

	const series = computed(() => buildSeries(days, period));
	const total = computed(() => series.value.activations.reduce((a, b) => a + b, 0).toLocaleString('en-GB') + ' activations');

	/** Theme colours come from Nuxt UI's CSS variables, so the layer's palette and dark mode drive the chart. */
	const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

	function draw() {
		if (!canvas.value) return;
		chart?.destroy();
		const { labels, activations, bytes } = series.value;
		const muted = css('--ui-text-muted');
		const border = css('--ui-border');
		chart = new Chart(canvas.value, {
			data: {
				labels,
				datasets: [
					{ type: 'bar', label: 'Activations', data: activations, backgroundColor: css('--ui-primary'), yAxisID: 'y', borderRadius: 2 },
					{ type: 'line', label: 'Usage (GB)', data: bytes.map((b) => b / 1e9), borderColor: css('--ui-secondary'), backgroundColor: css('--ui-secondary'), yAxisID: 'y1', pointRadius: 0, tension: 0.3 },
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: { mode: 'index', intersect: false },
				plugins: { legend: { labels: { color: muted } } },
				scales: {
					x: { ticks: { color: muted, maxTicksLimit: 12 }, grid: { display: false } },
					y: { ticks: { color: muted }, grid: { color: border }, beginAtZero: true },
					y1: { position: 'right', ticks: { color: muted }, grid: { display: false }, beginAtZero: true },
				},
			},
		});
	}

	onMounted(draw);
	watch([series, () => colorMode.value], () => nextTick(draw));
	onBeforeUnmount(() => chart?.destroy());
</script>
