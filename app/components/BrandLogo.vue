<script setup lang="ts">
	const { collapsed = false } = defineProps<{
		collapsed?: boolean;
	}>();

	const { app } = useAppConfig();
</script>

<template>
	<ULink
		:to="app.home || '/'"
		inactive-class="text-"
		class="group flex-1 justify-start items-center gap-2 transition-all"
		:class="{ 'flex': collapsed, 'grid grid-col-3': !collapsed }"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xml:space="preserve"
			viewBox="0 0 512 512"
			class="w-full max-w-11 h-full max-h-11 aspect-square text-primary transition-all"
		>
			<g class="icon">
				<path
					d="M414.185 449.54C371.081 484.822 315.994 506 256 506 118.021 506 6 393.979 6 256S118.021 6 256 6c59.994 0 115.08 21.178 158.185 56.46l-35.57 35.57C344.743 71.692 302.189 56 256 56 145.617 56 56 145.617 56 256s89.617 200 200 200c46.189 0 88.742-15.692 122.615-42.03zM449.54 97.815C484.822 140.919 506 196.006 506 256s-21.178 115.08-56.46 158.185l-35.57-35.57C440.308 344.743 456 302.189 456 256s-15.692-88.742-42.03-122.615z"
				/>
				<circle cx="256" cy="256" r="75" />
			</g>
		</svg>
		<div v-if="!collapsed" class="col-span-2 col-start-2 text-default transition-all">
			<div v-if="app.company" class="text-semibold text-sm leading-none">{{ app.company }}</div>
			<div
				class="uppercase leading-none whitespace-nowrap"
				:class="app.nameClass"
			>
				{{ app.name }}
			</div>
		</div>
	</ULink>
</template>

<style>
	.icon {
		fill: currentColor;
		fill-rule: evenodd;
		clip-rule: evenodd;
		stroke-linejoin: round;
		stroke-miterlimit: 2;
		path {
			fill-rule: nonzero;
		}
	}
</style>
