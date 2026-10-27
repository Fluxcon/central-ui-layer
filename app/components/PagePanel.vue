<script setup lang="ts">
	import type { BreadcrumbItem, DashboardPanelProps } from '@nuxt/ui';

	/**
	 * v4's page frame: navbar (back button, title, `right` slot for UserCard) and,
	 * when there are breadcrumbs or slots, a toolbar with breadcrumbs and the
	 * `breadcrumbs-after` slot (status badges) left and the `actions` slot right.
	 * `:back="false"` hides the back button. Page content goes in the default
	 * slot. `ui` passes through to UDashboardPanel; its `body` adds to v4's
	 * scrollbar gutter.
	 */
	const props = withDefaults(
		defineProps<{
			id: string;
			title: string;
			breadcrumbs?: BreadcrumbItem[];
			back?: boolean;
			ui?: DashboardPanelProps['ui'];
		}>(),
		{ breadcrumbs: undefined, back: true, ui: undefined },
	);

	const route = useRoute();
	const { app } = useAppConfig();
	// Only from two levels below `app.home` (/account/30389; IWS, home /admin: /admin/calls/5). Goes to the
	// parent crumb, which is not always the parent path (/account/30389 goes back to /accounts).
	const parent = computed(() => {
		if (!props.back) return undefined;
		const home = (app.home || '/').replace(/\/$/, '');
		const path = route.path.startsWith(`${home}/`) ? route.path.slice(home.length) : route.path;
		return path.split('/').filter(Boolean).length >= 2 ? props.breadcrumbs?.at(-2) : undefined;
	});

	// v4's body gutter, which every v4 page sets. A replacer function sees it as part of the defaults.
	const gutter = 'scrollbar-gutter-stable pr-2!';
	const panelUi = computed(() => {
		const body = props.ui?.body;
		return {
			...props.ui,
			body: typeof body === 'function' ? (defaults: string) => body(`${defaults} ${gutter}`) : [gutter, body],
		};
	});
</script>

<template>
	<UDashboardPanel :id="id" :ui="panelUi">
		<template #header>
			<UDashboardNavbar :title="title" :ui="{ right: 'gap-3' }">
				<template v-if="parent?.to" #leading>
					<UButton
						:to="parent.to"
						icon="carbon:chevron-left"
						color="secondary"
						variant="ghost"
						:aria-label="`Back to ${parent.label?.toLowerCase()}`"
					/>
				</template>
				<template #right>
					<slot name="right" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar
				v-if="breadcrumbs?.length || $slots['breadcrumbs-after'] || $slots.actions"
				:ui="{ root: 'min-h-[49px] justify-between', left: 'flex-1 gap-2', right: 'flex-1 justify-end' }"
			>
				<template #left>
					<UBreadcrumb
						v-if="breadcrumbs?.length"
						:items="breadcrumbs"
						:ui="{ linkLeadingIcon: 'size-5', separatorIcon: 'size-5 text-muted' }"
					/>
					<slot name="breadcrumbs-after" />
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
