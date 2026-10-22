<script setup lang="ts">
	const { collapsed = false } = defineProps<{
		collapsed?: boolean;
	}>();

	const { app } = useAppConfig();
</script>

<template>
	<ULink
		:to="app.home || '/'"
		class="group flex-1 justify-start items-center gap-2 transition-all"
		:class="{ 'flex': collapsed, 'grid grid-cols-[auto_1fr]': !collapsed }"
	>
		<BrandIcon :color="app.icon.color" :legs="app.icon.legs" class="w-8 h-8 aspect-square transition-all" />

		<!-- An @container has no content width, so in a shrink-to-fit parent (a centred login card) it would draw the
		     wordmark at 0. The min width is 12.5rem there (12cqi = 24px, v4's login size) and never more than the
		     sidebar column. -->
		<div v-if="!collapsed" class="@container min-w-[min(100%,12.5rem)] text-default transition-all">
			<div v-if="app.company" class="font-semibold text-sm leading-none">{{ app.company }}</div>
			<div class="uppercase leading-none whitespace-nowrap" :class="app.nameClass">
				{{ app.name }}
			</div>
		</div>
	</ULink>
</template>
