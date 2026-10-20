<template>
	<UDashboardPanel>
		<template #header>
			<UDashboardNavbar title="Table" />
		</template>

		<template #body>
			<UTable :data="rows" :columns="columns" />
		</template>
	</UDashboardPanel>
</template>

<script setup lang="ts">
	import type { TableColumn } from '@nuxt/ui';

	type Row = { id: number; name: string };

	const columns: TableColumn<Row>[] = [
		{ accessorKey: 'id', header: 'ID' },
		{ accessorKey: 'name', header: 'Name' },
	];

	const rows: Row[] = [
		{ id: 1, name: 'Alpha' },
		{ id: 2, name: 'Beta' },
		{ id: 3, name: 'Gamma' },
	];
</script>
