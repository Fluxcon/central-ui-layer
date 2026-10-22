<script setup lang="ts">
	import type { BreadcrumbItem } from '@nuxt/ui';

	/**
	 * v4's page frame: navbar (back button, title, `right` slot for UserCard) and,
	 * when there are breadcrumbs or actions, a toolbar with breadcrumbs left and
	 * the `actions` slot right. Page content goes in the default slot.
	 */
	const props = defineProps<{ id: string; title: string; breadcrumbs?: BreadcrumbItem[] }>();

	const route = useRoute();
	// Only from two levels deep (/account/30389). Goes to the parent crumb, which
	// is not always the parent path (/account/30389 goes back to /accounts).
	const back = computed(() =>
		route.path.split('/').filter(Boolean).length >= 2 ? props.breadcrumbs?.at(-2) : undefined,
	);
</script>

<template>
	<UDashboardPanel :id="id">
		<template #header>
			<UDashboardNavbar :title="title" :ui="{ right: 'gap-3' }">
				<template v-if="back?.to" #leading>
					<UButton
						:to="back.to"
						icon="carbon:chevron-left"
						color="secondary"
						variant="ghost"
						:aria-label="`Back to ${back.label?.toLowerCase()}`"
					/>
				</template>
				<template #right>
					<slot name="right" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar
				v-if="breadcrumbs?.length || $slots.actions"
				:ui="{ root: 'min-h-[49px] justify-between', left: 'flex-1', right: 'flex-1 justify-end' }"
			>
				<template #left>
					<UBreadcrumb
						v-if="breadcrumbs?.length"
						:items="breadcrumbs"
						:ui="{ linkLeadingIcon: 'size-5', separatorIcon: 'size-5 text-muted' }"
					/>
				</template>
				<template #right>
					<slot name="actions" />
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<slot />
		</template>
	</UDashboardPanel>
</template>
