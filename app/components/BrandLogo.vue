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

		<div v-if="!collapsed" class="@container min-w-0 text-default transition-all">
			<div v-if="app.company" class="font-semibold text-sm leading-none">{{ app.company }}</div>
			<div class="uppercase leading-none whitespace-nowrap" :class="app.nameClass">
				{{ app.name }}
			</div>
		</div>
	</ULink>
</template>
