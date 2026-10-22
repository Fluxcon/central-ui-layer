<template>
	<UDashboardPanel id="home">
		<template #header>
			<UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
				<template #right>
					<UserCard name="Jane Doe" email="jane@example.com" />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<template #left>
					<USelect v-model="days" :items="ranges" variant="ghost" icon="i-lucide-calendar" />
					<USelect
						v-model="period"
						:items="periods"
						variant="ghost"
						:ui="{ value: 'capitalize', itemLabel: 'capitalize' }"
					/>
				</template>
			</UDashboardToolbar>
		</template>

		<template #body>
			<UPageGrid class="gap-4 sm:gap-6 lg:gap-px lg:grid-cols-4">
				<UPageCard
					v-for="stat in stats"
					:key="stat.title"
					:icon="stat.icon"
					:title="stat.title"
					variant="subtle"
					:ui="{
						container: 'gap-y-1.5',
						wrapper: 'items-start',
						leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
						title: 'font-normal text-muted text-xs uppercase',
					}"
					class="hover:z-1 lg:rounded-none last:rounded-r-lg first:rounded-l-lg"
				>
					<div class="flex items-center gap-2">
						<span class="font-semibold text-highlighted text-2xl">{{ stat.value }}</span>
						<UBadge :color="stat.variation > 0 ? 'success' : 'error'" variant="subtle" class="text-xs">
							{{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
						</UBadge>
					</div>
				</UPageCard>
			</UPageGrid>

			<HomeChart :days="days" :period="period" />

			<UTable
				:data="recent"
				:columns="recentColumns"
				class="shrink-0"
				:ui="{
					base: 'table-fixed border-separate border-spacing-0',
					thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
					tbody: '[&>tr]:last:[&>td]:border-b-0',
					th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
					td: 'border-b border-default',
				}"
			/>
		</template>
	</UDashboardPanel>
</template>

<script setup lang="ts">
	const ranges = [
		{ label: 'Last 7 days', value: 7 },
		{ label: 'Last 30 days', value: 30 },
		{ label: 'Last 90 days', value: 90 },
	];
	const days = ref(30);
	const period = ref<Period>('daily');

	// Mirrors the template: short windows only make sense daily, long ones weekly/monthly.
	const periods = computed<Period[]>(() =>
		days.value <= 7 ? ['daily']
		: days.value <= 30 ? ['daily', 'weekly']
		: ['weekly', 'monthly'],
	);
	watch(periods, (p) => {
		if (!p.includes(period.value)) period.value = p[0]!;
	});

	const stats = computed(() => buildStats(days.value));
	const recent = buildRecent();
</script>
