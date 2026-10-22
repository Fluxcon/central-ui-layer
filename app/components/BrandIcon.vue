<script setup lang="ts">
	// Unique per instance: two logos on one page would otherwise share the mask id.
	const maskId = useId();

	// `color`: a Nuxt UI colour (`primary`, `secondary`, ...), painted with `--ui-<color>`.
	// `legs`: up to three angles in degrees, clockwise from north, [a, b, c]. Missing legs repeat the last
	// one, so they overlap it in the mask: [0, 120] draws two cuts. Unset props leave
	// the CSS variables to the page, so a parent can still drive them.
	/* eslint-disable vue/require-default-prop -- undefined is the "not set" state */
	const { color, legs } = defineProps<{
		color?: string;
		legs?: number[];
	}>();
	/* eslint-enable vue/require-default-prop */

	const leg = (i: number) => (legs?.length ? `${legs[Math.min(i, legs.length - 1)]}deg` : undefined);
	const vars = computed(() => ({
		'--icon-color': color && `var(--ui-${color})`,
		'--icon-leg-a': leg(0),
		'--icon-leg-b': leg(1),
		'--icon-leg-c': leg(2),
	}));
</script>

<template>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" :style="vars">
		<defs>
			<mask :id="maskId">
				<rect width="512" height="512" fill="white" />
				<path class="cut a" d="M256 256V0" />
				<path class="cut b" d="M256 256V0" />
				<path class="cut c" d="M256 256V0" />
			</mask>
		</defs>
		<circle class="line" cx="256" cy="256" r="225" :mask="`url(#${maskId})`" />
		<circle class="solid" cx="256" cy="256" r="75" />
	</svg>
</template>

<style scoped>
	/* Paint, not `color`: setting `color` here would override a `text-*` class on the icon. */
	.solid {
		fill: var(--icon-color, currentColor);
	}

	.line {
		fill: none;
		stroke: var(--icon-color, currentColor);
		stroke-width: 50px;
	}

	.cut {
		stroke: black;
		stroke-width: 50px;
		transform-origin: 256px 256px;
	}

	.a {
		transform: rotate(var(--icon-leg-a, 0deg));
	}

	.b {
		transform: rotate(var(--icon-leg-b, 120deg));
	}

	.c {
		transform: rotate(var(--icon-leg-c, 240deg));
	}
</style>
