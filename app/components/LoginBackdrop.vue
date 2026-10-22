<script setup lang="ts">
	/**
	 * The login page ground of v4, SBDA and IWS: a blurred gradient (orange, or SBDA's
	 * `color="blue"`), the default slot centred on top (the login card), and a
	 * colour-mode button bottom right. Use with `definePageMeta({ layout: false })`.
	 */
	const { color = 'orange' } = defineProps<{ color?: 'orange' | 'blue' }>();

	// Gradient stops (light, mid, deep) and page backgrounds. Blue is Tailwind's 400/500/800.
	const palettes = {
		orange: { stops: ['255, 183, 77', '255, 138, 61', '183, 77, 0'], bg: 'bg-[#faf8f2] dark:bg-[#100e0b]' },
		blue: { stops: ['96, 165, 250', '59, 130, 246', '30, 64, 175'], bg: 'bg-[#f5f8fc] dark:bg-[#0b0e14]' },
	};
	const palette = computed(() => palettes[color]);
	const layers = computed(() => {
		const [light, mid, deep] = palette.value.stops;
		return [
			{
				blur: 'blur-[125px] md:blur-[180px]',
				background: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(${light}, 0.12) 28%, rgb(255, 255, 255) 18%, rgb(${mid}) 68%, rgb(${deep}) 100%)`,
			},
			{
				blur: 'blur-[100px] md:blur-[144px]',
				background: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(${light}, 0.22) 34%, rgb(255, 255, 255) 66%, rgb(${mid}) 82%, rgb(${deep}) 100%)`,
			},
		];
	});
	// Blend modes per layer, light then dark.
	const modes = [
		{ class: 'dark:hidden', blend: ['multiply', 'multiply'] },
		{ class: 'light:hidden', blend: ['hard-light', 'soft-light'] },
	];
</script>

<template>
	<main :class="palette.bg">
		<div v-for="mode in modes" :key="mode.class" class="relative min-h-screen overflow-hidden" :class="mode.class">
			<div
				v-for="(layer, i) in layers"
				:key="i"
				class="absolute inset-0 pointer-events-none"
				:class="layer.blur"
				:style="`background: ${layer.background}; mix-blend-mode: ${mode.blend[i]}`"
				aria-hidden="true"
			/>
		</div>
		<div class="z-1 absolute inset-0 flex justify-center items-center">
			<slot />
		</div>
		<UColorModeButton variant="ghost" square class="right-2 bottom-2 z-2 absolute rounded-full" />
	</main>
</template>
