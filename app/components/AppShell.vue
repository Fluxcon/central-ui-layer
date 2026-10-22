<script setup lang="ts">
	import type { NavigationMenuItem } from '@nuxt/ui';
	import type { AppNavItem } from '../types/app-config';

	/**
	 * The sidebar shell of v4's default layout. `layouts/default.vue` renders it
	 * with `app.nav`; an app whose nav is dynamic (per-user items) writes its own
	 * layout and passes `items` here. Slots: `footer-actions` (extra footer buttons,
	 * e.g. sign out) and `default` (the page).
	 */
	const props = defineProps<{ items?: AppNavItem[] }>();

	const open = ref(false);
	const route = useRoute();
	const { app } = useAppConfig();
	const year = new Date().getFullYear();

	const links = computed<NavigationMenuItem[]>(() =>
		(props.items ?? (app.nav as AppNavItem[] | undefined) ?? []).map(({ match, ...item }) => {
			if (item.type === 'label' || item.active !== undefined || !item.to) return item;
			const to = String(item.to);
			const m = match ?? (to === '/' ? 'exact' : to);
			return { ...item, active: m === 'exact' ? route.path === to : route.path.startsWith(m) };
		}),
	);
</script>

<template>
	<UDashboardGroup :storage-key="app.storageKey">
		<UDashboardSidebar
			id="default"
			v-model:open="open"
			resizable
			collapsible
			:collapsed-size="3"
			:min-size="10"
			:default-size="13"
			:max-size="16"
			:ui="{
				root: 'bg-elevated/75 border-default transition-all',
				footer: 'lg:border-t border-default  text-xs',
			}"
		>
			<template #header="{ collapsed }">
				<BrandLogo :collapsed="collapsed" />
			</template>

			<template #default="{ collapsed }">
				<UNavigationMenu
					:items="links"
					:collapsed="collapsed"
					orientation="vertical"
					variant="pill"
					:tooltip="{ arrow: true }"
					:ui="{
						label: 'uppercase font-thin font-mono',
						list: `flex flex-col gap-px ${collapsed && 'items-center '}`,
						link: 'p-2 group hover:bg-primary hover:text-inverted rounded-md ',
						linkLeadingIcon: 'group-hover:text-inverted',
					}"
				/>
			</template>

			<template #footer="{ collapsed }">
				<div class="flex flex-1 items-center">
					<div v-if="!collapsed" class="flex-1 text-muted text-sm">&copy; {{ app.company }} {{ year }}</div>
					<slot name="footer-actions" :collapsed="collapsed" />
					<UTooltip
						:text="`${collapsed ? 'Expand' : 'Collapse'} the sidebar`"
						arrow
						:content="{ side: collapsed ? 'right' : 'left' }"
					>
						<UDashboardSidebarCollapse />
					</UTooltip>
				</div>
			</template>
		</UDashboardSidebar>

		<slot />
	</UDashboardGroup>
</template>
